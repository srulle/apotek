<?php

namespace App\Http\Controllers;

use App\Models\Suplier;
use Illuminate\Http\Request;

class SuplierController extends Controller
{
    public function index()
    {
        $suplier = Suplier::orderBy('id', 'desc')->get();

        return inertia('master-data/suplier', compact('suplier'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_supplier' => 'required|string|max:150|unique:suplier,nama_supplier',
        ]);

        Suplier::create($validated);

        return redirect()->back()->with('success', 'Suplier berhasil ditambahkan');
    }

    public function update(Request $request, Suplier $suplier)
    {
        $validated = $request->validate([
            'nama_supplier' => 'required|string|max:150|unique:suplier,nama_supplier,'.$suplier->id,
        ]);

        $suplier->update($validated);

        return redirect()->back()->with('success', 'Suplier berhasil diupdate');
    }

    public function destroy(Suplier $suplier)
    {
        $suplier->delete();

        return redirect()->back()->with('success', 'Suplier berhasil dihapus');
    }
}
