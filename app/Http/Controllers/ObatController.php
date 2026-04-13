<?php

namespace App\Http\Controllers;

use App\Models\KategoriObat;
use App\Models\Satuan;

class ObatController extends Controller
{
    public function index()
    {
        return inertia('master-data/obat', [
            'kategoriObat' => fn () => KategoriObat::orderBy('nama_kategori', 'asc')->pluck('nama_kategori'),
            'satuan' => fn () => Satuan::orderBy('nama_satuan', 'asc')->pluck('nama_satuan'),
        ]);
    }
}
