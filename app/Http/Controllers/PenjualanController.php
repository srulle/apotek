<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use App\Models\Satuan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PenjualanController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('transaksi/penjualan/index', [
            'obat' => Cache::remember('obat.active.grouped.v2', 3600, function () {
                return Obat::with(['satuanBesar', 'satuanKecil', 'kategori', 'stok'])
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
                            'stok_total' => $obat->stok->sum('stok'),
                            'stok' => $obat->stok->map(fn ($stok) => [
                                'id' => $stok->id,
                                'nomor_batch' => $stok->nomor_batch,
                                'tanggal_expired' => $stok->tanggal_expired,
                                'stok' => $stok->stok,
                            ])->toArray(),
                        ])->toArray(),
                    ])
                    ->values()
                    ->toArray();
            }),
            'satuan' => fn () => Satuan::orderBy('nama_satuan', 'asc')->pluck('nama_satuan'),
        ]);
    }

    /**
     * Method untuk menyimpan penjualan (akan diisi nanti)
     */
    public function store(Request $request)
    {
        // Logic penyimpanan penjualan akan ditambahkan disini
        // Sama seperti PembelianController::store tapi untuk transaksi penjualan
    }
}
