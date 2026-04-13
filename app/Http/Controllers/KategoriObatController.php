<?php

namespace App\Http\Controllers;

use App\Models\KategoriObat;
use Illuminate\Http\Request;

class KategoriObatController extends Controller
{
    public function index()
    {
        $kategoriObat = KategoriObat::orderBy('id', 'desc')->get();

        return inertia('master-data/kategori-obat', compact('kategoriObat'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:100|unique:kategori_obat,nama_kategori',
        ]);

        KategoriObat::create($validated);

        return redirect()->back()->with('success', 'Kategori obat berhasil ditambahkan');
    }

    public function update(Request $request, KategoriObat $kategoriObat)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:100|unique:kategori_obat,nama_kategori,'.$kategoriObat->id,
        ]);

        $kategoriObat->update($validated);

        return redirect()->back()->with('success', 'Kategori obat berhasil diupdate');
    }

    public function destroy(KategoriObat $kategoriObat)
    {
        $kategoriObat->delete();

        return redirect()->back()->with('success', 'Kategori obat berhasil dihapus');
    }
}
