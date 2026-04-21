<?php

namespace App\Http\Controllers;

use App\Models\Pembelian;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::orderBy('nama_supplier', 'asc')->get();

        return inertia('master-data/supplier', compact('suppliers'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_supplier' => 'required|string|max:150|unique:supplier,nama_supplier',
        ]);

        Supplier::create($validated);

        return redirect()->back()->with('success', 'Supplier berhasil ditambahkan');
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'nama_supplier' => 'required|string|max:150|unique:supplier,nama_supplier,'.$supplier->id,
        ]);

        $supplier->update($validated);

        return redirect()->back()->with('success', 'Supplier berhasil diupdate');
    }

    public function destroy(Supplier $supplier)
    {
        try {
            $pembelian = Pembelian::where('supplier_id', $supplier->id)->first();

            if ($pembelian) {
                return redirect()->back()
                    ->withErrors(['error' => 'Supplier tidak bisa dihapus karena masih digunakan di pembelian dengan nomor faktur"'.$pembelian->nomor_faktur.'"']);
            }

            $supplier->delete();

            return redirect()->back()
                ->with('success', 'Supplier berhasil dihapus');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat menghapus supplier']);
        }
    }
}
