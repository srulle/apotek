<?php

use App\Http\Controllers\KategoriObatController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\ReAuthenticateController;
use App\Http\Controllers\SatuanController;
use App\Http\Controllers\StokController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('transaksi', 'transaksi')->name('transaksi');
    Route::get('transaksi/penjualan', [PenjualanController::class, 'index'])->name('transaksi.penjualan');
    Route::post('transaksi/penjualan', [PenjualanController::class, 'store'])->name('transaksi.penjualan.store');
    Route::get('api/transaksi/penjualan/history', [PenjualanController::class, 'history']);
    Route::get('api/transaksi/penjualan/next-nomor-faktur', [PenjualanController::class, 'getNextNomorFaktur'])->name('transaksi.penjualan.next-nomor-faktur');
    Route::get('transaksi/pembelian', [PembelianController::class, 'index'])->name('transaksi.pembelian');
    Route::get('api/transaksi/pembelian/history', [PembelianController::class, 'history']);
    Route::post('transaksi/pembelian', [PembelianController::class, 'store'])->name('transaksi.pembelian.store');
    Route::get('stok', [StokController::class, 'index'])->name('stok');
    Route::inertia('laporan', 'laporan')->name('laporan');

    // Master Data
    Route::get('master-data/obat', [ObatController::class, 'index'])->name('obat');
    Route::post('master-data/obat', [ObatController::class, 'store'])->name('obat.store');
    Route::put('master-data/obat/{obat}', [ObatController::class, 'update'])->name('obat.update');
    Route::delete('master-data/obat/{obat}', [ObatController::class, 'destroy'])->name('obat.destroy');
    Route::get('master-data/kategori-obat', [KategoriObatController::class, 'index'])->name('kategori-obat');
    Route::get('api/master-data/kategori-obat', [KategoriObatController::class, 'list'])->name('api.kategori-obat.list');
    Route::post('master-data/kategori-obat', [KategoriObatController::class, 'store'])->name('kategori-obat.store');
    Route::put('master-data/kategori-obat/{kategori_obat}', [KategoriObatController::class, 'update'])->name('kategori-obat.update');
    Route::delete('master-data/kategori-obat/{kategori_obat}', [KategoriObatController::class, 'destroy'])->name('kategori-obat.destroy');
    Route::get('master-data/satuan', [SatuanController::class, 'index'])->name('satuan');
    Route::get('api/master-data/satuan', [SatuanController::class, 'list'])->name('api.satuan.list');
    Route::post('master-data/satuan', [SatuanController::class, 'store'])->name('satuan.store');
    Route::put('master-data/satuan/{satuan}', [SatuanController::class, 'update'])->name('satuan.update');
    Route::delete('master-data/satuan/{satuan}', [SatuanController::class, 'destroy'])->name('satuan.destroy');
    Route::get('master-data/supplier', [SupplierController::class, 'index'])->name('supplier');
    Route::get('api/master-data/supplier', [SupplierController::class, 'list'])->name('api.supplier.list');
    Route::post('master-data/supplier', [SupplierController::class, 'store'])->name('supplier.store');
    Route::put('master-data/supplier/{supplier}', [SupplierController::class, 'update'])->name('supplier.update');
    Route::delete('master-data/supplier/{supplier}', [SupplierController::class, 'destroy'])->name('supplier.destroy');

    // Pengguna (hanya Super Admin)
    Route::get('pengguna', [UserController::class, 'index'])->name('pengguna')->middleware('role:super_admin');
    Route::post('pengguna/{user}/verify', [UserController::class, 'verify'])->name('pengguna.verify')->middleware('role:super_admin');
    Route::post('pengguna/{user}/unverify', [UserController::class, 'unverify'])->name('pengguna.unverify')->middleware('role:super_admin');

    // Session re-authentication
    Route::post('api/re-authenticate', [ReAuthenticateController::class, 'reAuthenticate'])->name('api.re-authenticate');
});

require __DIR__.'/settings.php';
