<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use App\Models\Satuan;
use Illuminate\Http\Request;
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

    /**
     * Method untuk menyimpan penjualan (akan diisi nanti)
     */
    public function store(Request $request)
    {
        // Logic penyimpanan penjualan akan ditambahkan disini
        // Sama seperti PembelianController::store tapi untuk transaksi penjualan
    }
}
