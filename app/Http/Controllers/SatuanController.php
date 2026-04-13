<?php

namespace App\Http\Controllers;

use App\Models\Satuan;
use Illuminate\Http\Request;

class SatuanController extends Controller
{
    public function index()
    {
        $satuan = Satuan::orderBy('id', 'desc')->get();

        return inertia('master-data/satuan', compact('satuan'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_satuan' => 'required|string|max:100|unique:satuan,nama_satuan',
        ]);

        Satuan::create($validated);

        return redirect()->back()->with('success', 'Satuan berhasil ditambahkan');
    }

    public function update(Request $request, Satuan $satuan)
    {
        $validated = $request->validate([
            'nama_satuan' => 'required|string|max:100|unique:satuan,nama_satuan,'.$satuan->id,
        ]);

        $satuan->update($validated);

        return redirect()->back()->with('success', 'Satuan berhasil diupdate');
    }

    public function destroy(Satuan $satuan)
    {
        $satuan->delete();

        return redirect()->back()->with('success', 'Satuan berhasil dihapus');
    }
}
