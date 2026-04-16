<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KategoriObatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategori = [
            ['nama_kategori' => 'Obat Bebas'],
            ['nama_kategori' => 'Obat Bebas Terbatas (OBT)'],
            ['nama_kategori' => 'Obat Keras (Resep)'],
            ['nama_kategori' => 'Obat Narkotika'],
            ['nama_kategori' => 'Obat Psikotropika'],
            ['nama_kategori' => 'Obat Herbal / Tradisional'],
            ['nama_kategori' => 'Suplemen & Vitamin'],
            ['nama_kategori' => 'Alat Kesehatan'],
            ['nama_kategori' => 'Produk Perawatan'],
            ['nama_kategori' => 'Obat Luar'],
            ['nama_kategori' => 'Obat Paten'],
            ['nama_kategori' => 'Obat Generik'],
        ];

        DB::table('kategori_obat')->insert($kategori);
    }
}
