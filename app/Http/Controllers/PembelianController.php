<?php

namespace App\Http\Controllers;

use App\Models\Pembelian;
use App\Models\PembelianDetail;
use App\Models\Stok;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PembelianController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'header.nomor_faktur' => 'required|string|max:255|unique:pembelian,nomor_faktur',
            'header.supplier_id' => 'required|exists:supplier,id',
            'header.tanggal_pembelian' => 'required|date',
            'header.user_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.pembelian_id' => 'required|string',
            'items.*.obat_id' => 'required|exists:obat,id',
            'items.*.nomor_batch' => 'required|string|max:255',
            'items.*.tanggal_expired' => 'required|date',
            'items.*.jumlah_beli' => 'required|integer|min:1',
            'items.*.harga_beli' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            // Simpan header pembelian
            $pembelian = Pembelian::create($validated['header']);

            // Simpan detail pembelian dan update stok
            foreach ($validated['items'] as $item) {
                // Set pembelian_id yang benar (id dari pembelian yang baru dibuat)
                $item['pembelian_id'] = $pembelian->id;

                // Simpan detail pembelian
                PembelianDetail::create($item);

                // Update atau buat stok
                $tanggalExpired = date('Y-m-d', strtotime($item['tanggal_expired']));
                $stok = Stok::where('obat_id', $item['obat_id'])
                    ->where('nomor_batch', $item['nomor_batch'])
                    ->where('tanggal_expired', $tanggalExpired)
                    ->first();

                if ($stok) {
                    // Jika stok sudah ada, tambahkan jumlah
                    $stok->increment('stok', $item['jumlah_beli']);
                } else {
                    // Jika stok belum ada, buat baru
                    Stok::create([
                        'obat_id' => $item['obat_id'],
                        'nomor_batch' => $item['nomor_batch'],
                        'tanggal_expired' => $tanggalExpired,
                        'stok' => $item['jumlah_beli'],
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Pembelian berhasil disimpan');
    }
}
