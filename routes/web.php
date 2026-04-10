<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('transaksi', 'transaksi')->name('transaksi');
    Route::inertia('laporan', 'laporan')->name('laporan');
});

require __DIR__.'/settings.php';
