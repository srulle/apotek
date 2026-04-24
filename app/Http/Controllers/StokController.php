<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Inertia\Inertia;

class StokController extends Controller
{
    public function index()
    {
        $obat = Obat::with('kategori', 'satuanBesar', 'satuanKecil', 'stok')
            ->leftJoin('stok', 'obat.id', '=', 'stok.obat_id')
            ->select('obat.*')
            ->selectRaw('COALESCE(SUM(stok.stok), 0) as total_stok')
            ->groupBy('obat.id')
            ->orderBy('obat.nama_obat', 'asc')
            ->get()
            ->map(function ($obat) {
                // Load stok data untuk setiap obat
                $obat->stok = $obat->stok()->orderBy('tanggal_expired', 'asc')->get();

                return $obat;
            });

        return Inertia::render('stok', [
            'obat' => $obat,
        ]);
    }
}
