<?php

namespace App\Http\Controllers;

use App\Models\KategoriObat;
use App\Models\Obat;
use Illuminate\Http\Request;

class KategoriObatController extends Controller
{
    public function index()
    {
        $kategoriObat = KategoriObat::orderBy('nama_kategori', 'asc')->get();

        return inertia('master-data/kategori-obat', compact('kategoriObat'));
    }

    public function list()
    {
        $kategoriObat = KategoriObat::orderBy('nama_kategori', 'asc')->pluck('nama_kategori');

        return response()->json($kategoriObat);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:100|unique:kategori_obat,nama_kategori',
        ]);

        KategoriObat::create($validated);

        return redirect()->back()
            ->with('success', 'Kategori obat berhasil ditambahkan')
            ->with('invalidate.cache', ['kategoriObat']);
    }

    public function update(Request $request, KategoriObat $kategoriObat)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:100|unique:kategori_obat,nama_kategori,'.$kategoriObat->id,
        ]);

        $kategoriObat->update($validated);

        return redirect()->back()
            ->with('success', 'Kategori obat berhasil diupdate')
            ->with('invalidate.cache', ['kategoriObat']);
    }

    public function destroy(KategoriObat $kategoriObat)
    {
        try {
            $obat = Obat::where('kategori_id', $kategoriObat->id)->first();

            if ($obat) {
                return redirect()->back()
                    ->withErrors(['error' => 'Kategori obat tidak bisa dihapus karena masih digunakan oleh obat "'.$obat->nama_obat.'"']);
            }

            $kategoriObat->delete();

            return redirect()->back()
                ->with('success', 'Kategori obat berhasil dihapus')
                ->with('invalidate.cache', ['kategoriObat']);
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat menghapus kategori obat']);
        }
    }
}
