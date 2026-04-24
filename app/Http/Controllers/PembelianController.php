<?php

namespace App\Http\Controllers;

use App\Models\LogStok;
use App\Models\Obat;
use App\Models\Pembelian;
use App\Models\PembelianDetail;
use App\Models\Satuan;
use App\Models\Stok;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PembelianController extends Controller
{
    public function index(Request $request)
    {
        return inertia('transaksi/pembelian', [
            'suppliers' => fn () => Supplier::orderBy('nama_supplier', 'asc')->get(['id', 'nama_supplier']),
            'satuan' => fn () => Satuan::orderBy('nama_satuan', 'asc')->pluck('nama_satuan'),
            'obat' => fn () => Obat::with(['satuanBesar', 'satuanKecil', 'kategori', 'stok'])
                ->where('is_active', true)
                ->orderBy('nama_obat', 'asc')
                ->get(['id', 'nama_obat', 'kategori_id', 'satuan_besar_id', 'satuan_kecil_id', 'jumlah_satuan_kecil_dalam_satuan_besar'])
                ->groupBy('kategori.nama_kategori')
                ->map(fn ($obatGroup, $kategoriName) => [
                    'title' => $kategoriName,
                    'items' => $obatGroup->map(fn ($obat) => [
                        'id' => $obat->id,
                        'label' => $obat->nama_obat,
                        'subtitle' => 'Jumlah kecil dalam 1 '.($obat->satuanBesar?->nama_satuan ?? 'N/A').' adalah '.$obat->jumlah_satuan_kecil_dalam_satuan_besar.' '.($obat->satuanKecil?->nama_satuan ?? 'N/A'),
                        'satuan_besar' => $obat->satuanBesar?->nama_satuan,
                        'satuan_kecil' => $obat->satuanKecil?->nama_satuan,
                        'jumlah_satuan_kecil_dalam_satuan_besar' => $obat->jumlah_satuan_kecil_dalam_satuan_besar,
                        'stok' => $obat->stok->map(fn ($stok) => [
                            'id' => $stok->id,
                            'nomor_batch' => $stok->nomor_batch,
                            'tanggal_expired' => $stok->tanggal_expired,
                            'stok' => $stok->stok,
                        ])->toArray(),
                    ])->toArray(),
                ])
                ->values()
                ->toArray(),
        ]);
    }

    public function history()
    {
        return response()->json([
            'pembelian' => Pembelian::with([
                'supplier',
                'user',
                'pembelianDetail.obat.kategori',
                'pembelianDetail.obat.satuanBesar',
                'pembelianDetail.obat.satuanKecil',
            ])
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'header.nomor_faktur' => 'required|string|max:255|unique:pembelian,nomor_faktur',
            'header.supplier_id' => 'required|exists:supplier,id',
            'header.tanggal_pembelian' => 'required|date',
            'header.user_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.pembelian_id' => 'required|string',
            'items.*.obat_id' => 'required|exists:obat,id',
            'items.*.nomor_batch' => 'required|string|max:255',
            'items.*.tanggal_expired' => 'required|date',
            'items.*.jumlah_beli' => 'required|integer|min:1',
            'items.*.harga_beli' => 'required|numeric|min:0',
        ]);

        $user = User::find($validated['header']['user_id']);

        try {
            DB::beginTransaction();

            // Simpan header pembelian
            $pembelian = Pembelian::create($validated['header']);

            // Simpan detail pembelian dan update stok
            foreach ($validated['items'] as $item) {
                // Set pembelian_id yang benar (id dari pembelian yang baru dibuat)
                $item['pembelian_id'] = $pembelian->id;

                // Simpan detail pembelian
                PembelianDetail::create($item);

                // Update atau buat stok
                $tanggalExpired = date('Y-m-d', strtotime($item['tanggal_expired']));
                $stok = Stok::where('obat_id', $item['obat_id'])
                    ->where('nomor_batch', $item['nomor_batch'])
                    ->where('tanggal_expired', $tanggalExpired)
                    ->first();

                $stokSebelum = $stok ? $stok->stok : 0;
                $stokSesudah = $stokSebelum + $item['jumlah_beli'];

                if ($stok) {
                    // Jika stok sudah ada, tambahkan jumlah
                    $stok->increment('stok', $item['jumlah_beli']);
                } else {
                    // Jika stok belum ada, buat baru
                    Stok::create([
                        'obat_id' => $item['obat_id'],
                        'nomor_batch' => $item['nomor_batch'],
                        'tanggal_expired' => $tanggalExpired,
                        'stok' => $item['jumlah_beli'],
                    ]);
                }

                // Catat log_stok
                LogStok::create([
                    'obat_id' => $item['obat_id'],
                    'nomor_batch' => $item['nomor_batch'],
                    'tanggal_expired' => $tanggalExpired,
                    'jenis_transaksi' => 'pembelian',
                    'jumlah_masuk' => $item['jumlah_beli'],
                    'jumlah_keluar' => null,
                    'stok_sebelum' => $stokSebelum,
                    'stok_sesudah' => $stokSesudah,
                    'referensi_id' => $pembelian->id,
                    'keterangan' => "Pembelian faktur {$validated['header']['nomor_faktur']} - Batch {$item['nomor_batch']}, oleh {$user->name} ({$user->email}({$user->id}))",
                    'created_at' => now(),
                ]);
            }

            DB::commit();
        } catch (QueryException $e) {
            DB::rollBack();
            // Handle database errors, especially integrity constraint violations
            if ($e->getCode() == 23000) { // Integrity constraint violation
                $errorMessage = $e->getMessage();

                // Periksa apakah constraint yang dilanggar adalah dari tabel pembelian_detail
                if (str_contains($errorMessage, 'pembelian_detail') || str_contains($errorMessage, 'unique_pembelian_detail_full')) {
                    return redirect()->back()->withErrors(['error' => 'Anda memasukan item yang sama dengan nomor batch yang sama dan tanggal expired yang sama di faktur pembelian yang sama']);
                }

                // Jika constraint dari tabel stok (unique_obat_batch)
                if (str_contains($errorMessage, 'stok') || str_contains($errorMessage, 'unique_obat_batch')) {
                    return redirect()->back()->withErrors(['error' => 'Nomor batch sudah digunakan untuk obat ini dengan tanggal expired berbeda. Gunakan nomor batch yang berbeda atau ubah tanggal expired.']);
                }

                // Fallback untuk constraint violation lainnya
                return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan data']);
            }

            // For other database errors
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan data']);
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan sistem']);
        }

        return redirect()->back()->with('success', 'Pembelian berhasil disimpan');
    }
}
