<?php

namespace App\Http\Controllers;

use App\Models\LogStok;
use App\Models\Obat;
use App\Models\Penjualan;
use App\Models\PenjualanDetail;
use App\Models\Satuan;
use App\Models\Stok;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PenjualanController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('transaksi/penjualan/index', [
            'obat' => Obat::with(['satuanBesar', 'satuanKecil', 'satuanPenjualan', 'kategori', 'stok'])
                ->select('obat.*')
                ->selectRaw('(SELECT SUM(stok.stok) FROM stok WHERE stok.obat_id = obat.id) as stok_total')
                ->where('is_active', true)
                ->havingRaw('(SELECT SUM(stok.stok) FROM stok WHERE stok.obat_id = obat.id) > 0')
                ->orderBy('nama_obat', 'asc')
                ->get()
                ->groupBy('kategori.nama_kategori')
                ->map(fn ($obatGroup, $kategoriName) => [
                    'title' => $kategoriName,
                    'items' => $obatGroup->map(fn ($obat) => [
                        'id' => $obat->id,
                        'label' => $obat->nama_obat,
                        'subtitle' => 'Satuan Jual: '.($obat->satuanPenjualan?->nama_satuan ?? 'N/A').' | Stok: '.($obat->stok_total ?? 0).' '.($obat->satuanKecil?->nama_satuan ?? ''),
                        'satuan_besar' => $obat->satuanBesar?->nama_satuan,
                        'satuan_kecil' => $obat->satuanKecil?->nama_satuan,
                        'satuan_penjualan' => $obat->satuanPenjualan?->nama_satuan,
                        'jumlah_satuan_kecil_dalam_satuan_besar' => $obat->jumlah_satuan_kecil_dalam_satuan_besar,
                        'jumlah_satuan_kecil_dalam_satuan_penjualan' => $obat->jumlah_satuan_kecil_dalam_satuan_penjualan,
                        'harga_jual' => $obat->harga_jual,
                        'stok_total' => $obat->stok_total ?? 0,
                        'stok' => $obat->stok->map(fn ($s) => [
                            'id' => $s->id,
                            'nomor_batch' => $s->nomor_batch,
                            'tanggal_expired' => $s->tanggal_expired,
                            'stok' => $s->stok,
                        ]),
                    ])->toArray(),
                ])
                ->values()
                ->toArray(),
            'satuan' => fn () => Satuan::orderBy('nama_satuan', 'asc')->pluck('nama_satuan'),
        ]);
    }

    public function history()
    {
        return response()->json([
            'penjualan' => Penjualan::with([
                'user',
                'penjualanDetail.obat.kategori',
                'penjualanDetail.obat.satuanBesar',
                'penjualanDetail.obat.satuanKecil',
            ])
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function getNextNomorFaktur(Request $request)
    {
        $tanggal = $request->get('tanggal', date('Y-m-d'));
        $tanggalFormatted = date('Ymd', strtotime($tanggal));
        $prefix = 'JGF-'.$tanggalFormatted;

        $lastFaktur = DB::table('penjualan')
            ->where('nomor_faktur', 'like', $prefix.'%')
            ->orderBy('nomor_faktur', 'desc')
            ->value('nomor_faktur');

        if ($lastFaktur && preg_match('/(\d{4})$/', $lastFaktur, $matches)) {
            $counter = intval($matches[1]) + 1;
        } else {
            $counter = 1;
        }

        $nextNomor = $prefix.str_pad($counter, 4, '0', STR_PAD_LEFT);

        return response()->json(['nomor_faktur' => $nextNomor]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'header.tanggal_penjualan' => 'required|date',
            'header.user_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.obat_id' => 'required|exists:obat,id',
            'items.*.nomor_batch' => 'required|string|max:255',
            'items.*.tanggal_expired' => 'required|date',
            'items.*.jumlah_jual' => 'required|integer|min:1',
            'items.*.harga_jual' => 'required|numeric|min:0',
        ]);

        // Generate nomor faktur: JGF-YYYYMMDDXXXX
        $tanggal = date('Ymd');
        $prefix = 'JGF-'.$tanggal;

        // Cari nomor faktur terakhir untuk hari ini
        $lastFaktur = DB::table('penjualan')
            ->where('nomor_faktur', 'like', $prefix.'%')
            ->orderBy('nomor_faktur', 'desc')
            ->value('nomor_faktur');

        if ($lastFaktur && preg_match('/(\d{4})$/', $lastFaktur, $matches)) {
            $counter = intval($matches[1]) + 1;
        } else {
            $counter = 1;
        }

        $validated['header']['nomor_faktur'] = $prefix.str_pad($counter, 4, '0', STR_PAD_LEFT);

        $user = User::find($validated['header']['user_id']);

        try {
            DB::beginTransaction();

            // Simpan header penjualan
            $penjualan = Penjualan::create($validated['header']);

            // Simpan detail penjualan dan update stok
            foreach ($validated['items'] as $item) {
                $obat = Obat::find($item['obat_id']);

                // Set penjualan_id yang benar (id dari penjualan yang baru dibuat)
                $item['penjualan_id'] = $penjualan->id;

                // Cek stok tersedia untuk batch spesifik
                $tanggalExpired = date('Y-m-d', strtotime($item['tanggal_expired']));
                $stok = Stok::where('obat_id', $item['obat_id'])
                    ->where('nomor_batch', $item['nomor_batch'])
                    ->where('tanggal_expired', $tanggalExpired)
                    ->first();

                if (! $stok || $stok->stok < $item['jumlah_jual']) {
                    DB::rollBack();

                    return redirect()->back()->withErrors(['error' => "Stok tidak cukup untuk {$obat->nama_obat} batch {$item['nomor_batch']}. Stok tersedia: ".($stok ? $stok->stok : 0).", diminta: {$item['jumlah_jual']}"]);
                }

                // Simpan detail penjualan
                PenjualanDetail::create($item);

                // Update stok
                $stokSebelum = $stok->stok;
                $stokSesudah = $stokSebelum - $item['jumlah_jual'];
                $stok->decrement('stok', $item['jumlah_jual']);

                // Catat log_stok
                LogStok::create([
                    'obat_id' => $item['obat_id'],
                    'nomor_batch' => $item['nomor_batch'],
                    'tanggal_expired' => $tanggalExpired,
                    'jenis_transaksi' => 'penjualan',
                    'jumlah_masuk' => null,
                    'jumlah_keluar' => $item['jumlah_jual'],
                    'stok_sebelum' => $stokSebelum,
                    'stok_sesudah' => $stokSesudah,
                    'referensi_id' => $penjualan->id,
                    'keterangan' => "Penjualan faktur {$validated['header']['nomor_faktur']} - {$obat->nama_obat} batch {$item['nomor_batch']}, oleh {$user->name} ({$user->email}({$user->id}))",
                    'created_at' => now(),
                ]);
            }

            DB::commit();
        } catch (QueryException $e) {
            DB::rollBack();
            // Handle database errors, especially integrity constraint violations
            if ($e->getCode() == 23000) { // Integrity constraint violation
                $errorMessage = $e->getMessage();

                // Periksa apakah constraint yang dilanggar adalah dari tabel penjualan_detail
                if (str_contains($errorMessage, 'penjualan_detail') || str_contains($errorMessage, 'unique_penjualan_detail')) {
                    return redirect()->back()->withErrors(['error' => 'Anda memasukkan item yang sama dengan nomor batch yang sama di faktur penjualan yang sama']);
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

        return redirect()->back()
            ->with('success', 'Penjualan berhasil disimpan')
            ->with('nomor_faktur', $validated['header']['nomor_faktur']);
    }
}
