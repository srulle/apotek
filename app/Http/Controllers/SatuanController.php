<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use App\Models\Satuan;
use Illuminate\Http\Request;

class SatuanController extends Controller
{
    public function index()
    {
        $satuan = Satuan::orderBy('nama_satuan', 'asc')->get();

        return inertia('master-data/satuan', compact('satuan'));
    }

    public function list()
    {
        $satuan = Satuan::orderBy('nama_satuan', 'asc')->pluck('nama_satuan');

        return response()->json($satuan);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_satuan' => 'required|string|max:100|unique:satuan,nama_satuan',
        ]);

        Satuan::create($validated);

        return redirect()->back()
            ->with('success', 'Satuan berhasil ditambahkan')
            ->with('invalidate.cache', ['satuan']);
    }

    public function update(Request $request, Satuan $satuan)
    {
        $validated = $request->validate([
            'nama_satuan' => 'required|string|max:100|unique:satuan,nama_satuan,'.$satuan->id,
        ]);

        $satuan->update($validated);

        return redirect()->back()
            ->with('success', 'Satuan berhasil diupdate')
            ->with('invalidate.cache', ['satuan']);
    }

    public function destroy(Satuan $satuan)
    {
        try {
            $obat = Obat::where('satuan_kecil_id', $satuan->id)
                ->orWhere('satuan_besar_id', $satuan->id)
                ->orWhere('satuan_penjualan_id', $satuan->id)
                ->first();

            if ($obat) {
                return redirect()->back()
                    ->withErrors(['error' => 'Satuan tidak bisa dihapus karena masih digunakan oleh obat "'.$obat->nama_obat.'"']);
            }

            $satuan->delete();

            return redirect()->back()
                ->with('success', 'Satuan berhasil dihapus')
                ->with('invalidate.cache', ['satuan']);
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat menghapus satuan']);
        }
    }
}
