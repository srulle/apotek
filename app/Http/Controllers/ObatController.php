<?php

namespace App\Http\Controllers;

use App\Models\KategoriObat;
use App\Models\Obat;
use App\Models\Satuan;
use Illuminate\Http\Request;

class ObatController extends Controller
{
    public function index()
    {
        return inertia('master-data/obat', [
            'kategoriObat' => fn () => KategoriObat::orderBy('nama_kategori', 'asc')->pluck('nama_kategori'),
            'satuan' => fn () => Satuan::orderBy('nama_satuan', 'asc')->pluck('nama_satuan'),
        ]);
    }

    public function store(Request $request)
    {
        // Clean harga_jual: remove thousand separators (dots) and convert to integer in cents
        $data = $request->all();
        $data['harga_jual'] = (int) str_replace('.', '', $data['harga_jual']) * 100;

        $validated = $request->validate([
            'nama_obat' => 'required|string|max:150',
            'kategori_obat' => 'required|string',
            'satuan_besar' => 'required|string',
            'satuan_kecil' => 'required|string',
            'isi_per_satuan' => 'required|integer|min:1',
            'harga_jual' => 'required|integer|min:0',
        ]);

        // Use cleaned data
        $validated['harga_jual'] = $data['harga_jual'];

        // Find or create kategori
        $kategori = KategoriObat::firstOrCreate(['nama_kategori' => $validated['kategori_obat']]);

        // Find or create satuan besar
        $satuanBesar = Satuan::firstOrCreate(['nama_satuan' => $validated['satuan_besar']]);

        // Find or create satuan kecil
        $satuanKecil = Satuan::firstOrCreate(['nama_satuan' => $validated['satuan_kecil']]);

        // Create obat
        Obat::create([
            'nama_obat' => $validated['nama_obat'],
            'kategori_id' => $kategori->id,
            'satuan_besar_id' => $satuanBesar->id,
            'satuan_kecil_id' => $satuanKecil->id,
            'isi_per_satuan' => $validated['isi_per_satuan'],
            'harga_jual' => $validated['harga_jual'],
            'is_active' => true,
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Obat berhasil ditambahkan');
    }
}
