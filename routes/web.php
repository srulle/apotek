<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('transaksi', 'transaksi')->name('transaksi');
    Route::inertia('transaksi/penjualan', 'transaksi/penjualan')->name('transaksi.penjualan');
    Route::inertia('transaksi/pembelian', 'transaksi/pembelian')->name('transaksi.pembelian');
    Route::inertia('laporan', 'laporan')->name('laporan');
});

require __DIR__.'/settings.php';
