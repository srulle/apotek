<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreObatRequest;
use App\Http\Requests\UpdateObatRequest;
use App\Models\KategoriObat;
use App\Models\Obat;
use App\Models\PembelianDetail;
use App\Models\Satuan;
use App\Models\Stok;
use Illuminate\Support\Facades\DB;

class ObatController extends Controller
{
    public function index()
    {
        return inertia('master-data/obat', [
            'obat' => Obat::with('kategori', 'satuanBesar', 'satuanKecil', 'satuanPenjualan')->orderBy('created_at', 'desc')->get(),
            'kategoriObat' => fn () => KategoriObat::orderBy('nama_kategori', 'asc')->pluck('nama_kategori'),
            'satuan' => fn () => Satuan::orderBy('nama_satuan', 'asc')->pluck('nama_satuan'),
        ]);
    }

    private function resolveRelations(array $validated): array
    {
        return [
            'kategori_id' => KategoriObat::firstOrCreate(['nama_kategori' => $validated['kategori_obat']])->id,
            'satuan_besar_id' => Satuan::firstOrCreate(['nama_satuan' => $validated['satuan_besar']])->id,
            'satuan_kecil_id' => Satuan::firstOrCreate(['nama_satuan' => $validated['satuan_kecil']])->id,
            'satuan_penjualan_id' => Satuan::firstOrCreate(['nama_satuan' => $validated['satuan_penjualan']])->id,
        ];
    }

    public function store(StoreObatRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $relations = $this->resolveRelations($validated);

            Obat::create(array_merge(
                collect($validated)->only(['nama_obat', 'jumlah_satuan_kecil_dalam_satuan_besar', 'jumlah_satuan_kecil_dalam_satuan_penjualan', 'harga_jual'])->all(),
                $relations,
                ['is_active' => true]
            ));
        });

        return inertia()->back()
            ->with('success', 'Obat berhasil ditambahkan');
    }

    public function update(UpdateObatRequest $request, Obat $obat)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $obat) {
            $relations = $this->resolveRelations($validated);

            $obat->update(array_merge(
                collect($validated)->only(['nama_obat', 'jumlah_satuan_kecil_dalam_satuan_besar', 'jumlah_satuan_kecil_dalam_satuan_penjualan', 'harga_jual'])->all(),
                $relations
            ));
        });

        return inertia()->back()
            ->with('success', 'Obat berhasil diperbarui');
    }

    public function destroy(Obat $obat)
    {
        try {
            // Check if obat is used in pembelian_detail
            $pembelianDetail = PembelianDetail::where('obat_id', $obat->id)->with('pembelian')->first();
            if ($pembelianDetail) {
                return redirect()->back()
                    ->withErrors(['error' => 'Obat tidak bisa dihapus karena masih ada sudah ada riwayat transaksi dengan nomor faktur "'.$pembelianDetail->pembelian->nomor_faktur.'"']);
            }

            // Check if obat has stock
            $stok = Stok::where('obat_id', $obat->id)->first();
            if ($stok) {
                return redirect()->back()
                    ->withErrors(['error' => 'Obat tidak bisa dihapus karena masih ada stok']);
            }

            $obat->delete();

            return inertia()->back()
                ->with('success', 'Obat berhasil dihapus');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat menghapus obat']);
        }
    }
}
