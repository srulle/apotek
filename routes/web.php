<?php

use App\Http\Controllers\KategoriObatController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\SatuanController;
use App\Http\Controllers\SuplierController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('transaksi', 'transaksi')->name('transaksi');
    Route::inertia('transaksi/penjualan', 'transaksi/penjualan')->name('transaksi.penjualan');
    Route::inertia('transaksi/pembelian', 'transaksi/pembelian')->name('transaksi.pembelian');
    Route::inertia('stok-batch', 'stok-batch')->name('stok-batch');
    Route::inertia('laporan', 'laporan')->name('laporan');

    // Master Data
    Route::get('master-data/obat', [ObatController::class, 'index'])->name('obat');
    Route::post('master-data/obat', [ObatController::class, 'store'])->name('obat.store');
    Route::get('master-data/kategori-obat', [KategoriObatController::class, 'index'])->name('kategori-obat');
    Route::post('master-data/kategori-obat', [KategoriObatController::class, 'store'])->name('kategori-obat.store');
    Route::put('master-data/kategori-obat/{kategori_obat}', [KategoriObatController::class, 'update'])->name('kategori-obat.update');
    Route::delete('master-data/kategori-obat/{kategori_obat}', [KategoriObatController::class, 'destroy'])->name('kategori-obat.destroy');
    Route::get('master-data/satuan', [SatuanController::class, 'index'])->name('satuan');
    Route::post('master-data/satuan', [SatuanController::class, 'store'])->name('satuan.store');
    Route::put('master-data/satuan/{satuan}', [SatuanController::class, 'update'])->name('satuan.update');
    Route::delete('master-data/satuan/{satuan}', [SatuanController::class, 'destroy'])->name('satuan.destroy');
    Route::get('master-data/suplier', [SuplierController::class, 'index'])->name('suplier');
    Route::post('master-data/suplier', [SuplierController::class, 'store'])->name('suplier.store');
    Route::put('master-data/suplier/{suplier}', [SuplierController::class, 'update'])->name('suplier.update');
    Route::delete('master-data/suplier/{suplier}', [SuplierController::class, 'destroy'])->name('suplier.destroy');
});

require __DIR__.'/settings.php';
