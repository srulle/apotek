<?php

use App\Http\Controllers\KategoriObatController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\SatuanController;
use App\Http\Controllers\SupplierController;
use App\Models\Obat;
use App\Models\Satuan;
use App\Models\Supplier;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('transaksi', 'transaksi')->name('transaksi');
    Route::inertia('transaksi/penjualan', 'transaksi/penjualan')->name('transaksi.penjualan');
    Route::get('transaksi/pembelian', function () {
        return inertia('transaksi/pembelian', [
            'suppliers' => fn () => Supplier::orderBy('nama_supplier', 'asc')->get(['id', 'nama_supplier']),
            'satuan' => fn () => Satuan::orderBy('nama_satuan', 'asc')->pluck('nama_satuan'),
            'obat' => fn () => Obat::with(['satuanBesar', 'satuanKecil', 'kategori'])
                ->where('is_active', true)
                ->orderBy('nama_obat', 'asc')
                ->get(['id', 'nama_obat', 'kategori_id', 'satuan_besar_id', 'satuan_kecil_id', 'isi_per_satuan'])
                ->groupBy('kategori.nama_kategori')
                ->map(fn ($obatGroup, $kategoriName) => [
                    'title' => $kategoriName,
                    'items' => $obatGroup->map(fn ($obat) => [
                        'id' => $obat->id,
                        'label' => $obat->nama_obat,
                        'subtitle' => 'Isi dalam 1 '.($obat->satuanBesar?->nama_satuan ?? 'N/A').' adalah '.$obat->isi_per_satuan.' '.($obat->satuanKecil?->nama_satuan ?? 'N/A'),
                        'satuan_besar' => $obat->satuanBesar?->nama_satuan,
                        'satuan_kecil' => $obat->satuanKecil?->nama_satuan,
                        'isi_per_satuan' => $obat->isi_per_satuan,
                    ])->toArray(),
                ])
                ->values()
                ->toArray(),
        ]);
    })->name('transaksi.pembelian');
    Route::post('transaksi/pembelian', [PembelianController::class, 'store'])->name('transaksi.pembelian.store');
    Route::inertia('stok-batch', 'stok-batch')->name('stok-batch');
    Route::inertia('laporan', 'laporan')->name('laporan');

    // Master Data
    Route::get('master-data/obat', [ObatController::class, 'index'])->name('obat');
    Route::post('master-data/obat', [ObatController::class, 'store'])->name('obat.store');
    Route::put('master-data/obat/{obat}', [ObatController::class, 'update'])->name('obat.update');
    Route::delete('master-data/obat/{obat}', [ObatController::class, 'destroy'])->name('obat.destroy');
    Route::get('master-data/kategori-obat', [KategoriObatController::class, 'index'])->name('kategori-obat');
    Route::post('master-data/kategori-obat', [KategoriObatController::class, 'store'])->name('kategori-obat.store');
    Route::put('master-data/kategori-obat/{kategori_obat}', [KategoriObatController::class, 'update'])->name('kategori-obat.update');
    Route::delete('master-data/kategori-obat/{kategori_obat}', [KategoriObatController::class, 'destroy'])->name('kategori-obat.destroy');
    Route::get('master-data/satuan', [SatuanController::class, 'index'])->name('satuan');
    Route::post('master-data/satuan', [SatuanController::class, 'store'])->name('satuan.store');
    Route::put('master-data/satuan/{satuan}', [SatuanController::class, 'update'])->name('satuan.update');
    Route::delete('master-data/satuan/{satuan}', [SatuanController::class, 'destroy'])->name('satuan.destroy');
    Route::get('master-data/supplier', [SupplierController::class, 'index'])->name('supplier');
    Route::post('master-data/supplier', [SupplierController::class, 'store'])->name('supplier.store');
    Route::put('master-data/supplier/{supplier}', [SupplierController::class, 'update'])->name('supplier.update');
    Route::delete('master-data/supplier/{supplier}', [SupplierController::class, 'destroy'])->name('supplier.destroy');
});

require __DIR__.'/settings.php';
