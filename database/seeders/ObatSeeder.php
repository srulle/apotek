<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ObatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $obat = [
            // Satuan IDs: 1=Tablet, 2=Kapsul, 3=Pcs, 4=Strip, 5=Box/Dus, 6=Botol, 7=Tube, 8=Pot, 9=Ampul, 10=Gram, 11=Lembar, 12=Pak, 13=Kaleng
            // Kategori IDs: 1=Obat Bebas, 2=Obat Bebas Terbatas, 3=Antibiotik, 4=Psikotropik, 5=Obat Darah Tinggi, 6=Jamu, 7=Vitamin, 8=Alat Kesehatan, 9=Minyak, 10=Salep, 11=Analgesik, 12=Lainnya
            // HARGA PER SATUAN TERKECIL (tablet/kapsul/pcs) SESUAI PASARAN INDONESIA 2026

            // 1 - 10
            ['nama_obat' => 'Paracetamol 500 mg', 'kategori_id' => 1, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 100, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Amoxicillin 500 mg', 'kategori_id' => 3, 'satuan_kecil_id' => 2, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 1500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Bodrex', 'kategori_id' => 1, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 240, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 4, 'harga_jual' => 800, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'CTM', 'kategori_id' => 2, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 1000, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 150, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'OBH Combi', 'kategori_id' => 2, 'satuan_kecil_id' => 3, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 3, 'jumlah_satuan_kecil_dalam_satuan_besar' => 24, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 15000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Antangin JRG', 'kategori_id' => 6, 'satuan_kecil_id' => 3, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 3, 'jumlah_satuan_kecil_dalam_satuan_besar' => 24, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 3500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Vitamin C IPI', 'kategori_id' => 7, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 1, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 200, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Neurobion Forte', 'kategori_id' => 7, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 3500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Omeprazole 20 mg', 'kategori_id' => 12, 'satuan_kecil_id' => 2, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 2000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Sanmol Sirup', 'kategori_id' => 1, 'satuan_kecil_id' => 7, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 7, 'jumlah_satuan_kecil_dalam_satuan_besar' => 24, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 18000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],

            // 11 - 20
            ['nama_obat' => 'Betadine Solution', 'kategori_id' => 10, 'satuan_kecil_id' => 7, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 7, 'jumlah_satuan_kecil_dalam_satuan_besar' => 24, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 22000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Ambeven', 'kategori_id' => 11, 'satuan_kecil_id' => 2, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 2500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Salep 24', 'kategori_id' => 10, 'satuan_kecil_id' => 8, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 8, 'jumlah_satuan_kecil_dalam_satuan_besar' => 24, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 15000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Mefenamic Acid 500 mg', 'kategori_id' => 11, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Alprazolam', 'kategori_id' => 4, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 8000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Codeine', 'kategori_id' => 4, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 15000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Masker Medis', 'kategori_id' => 8, 'satuan_kecil_id' => 3, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 3, 'jumlah_satuan_kecil_dalam_satuan_besar' => 50, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 2000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Termometer Digital', 'kategori_id' => 8, 'satuan_kecil_id' => 3, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 3, 'jumlah_satuan_kecil_dalam_satuan_besar' => 10, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 45000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Minyak Kayu Putih', 'kategori_id' => 9, 'satuan_kecil_id' => 7, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 7, 'jumlah_satuan_kecil_dalam_satuan_besar' => 24, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 20000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Insto Tetes Mata', 'kategori_id' => 1, 'satuan_kecil_id' => 3, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 3, 'jumlah_satuan_kecil_dalam_satuan_besar' => 24, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 18000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],

            // 21 - 30
            ['nama_obat' => 'Ibuprofen 400 mg', 'kategori_id' => 11, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 800, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Asam Mefenamat 500 mg (Generik)', 'kategori_id' => 11, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Dexamethasone 0.5 mg', 'kategori_id' => 12, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Cetirizine 10 mg', 'kategori_id' => 2, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 600, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Ranitidine 150 mg', 'kategori_id' => 12, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 1000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Domperidone 10 mg', 'kategori_id' => 12, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 1000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Loperamide 2 mg', 'kategori_id' => 12, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 800, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Oralit Sachet', 'kategori_id' => 1, 'satuan_kecil_id' => 3, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 3, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 2500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Enervon-C', 'kategori_id' => 7, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Sangobion', 'kategori_id' => 7, 'satuan_kecil_id' => 2, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 1200, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],

            // 31 - 35
            ['nama_obat' => 'Diapet', 'kategori_id' => 6, 'satuan_kecil_id' => 2, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 100, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 1500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Promag Tablet', 'kategori_id' => 1, 'satuan_kecil_id' => 1, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 4, 'jumlah_satuan_kecil_dalam_satuan_besar' => 240, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 10, 'harga_jual' => 500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Promag Suspensi', 'kategori_id' => 1, 'satuan_kecil_id' => 7, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 7, 'jumlah_satuan_kecil_dalam_satuan_besar' => 24, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 15000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Kalpanax Krim', 'kategori_id' => 10, 'satuan_kecil_id' => 8, 'satuan_besar_id' => 6, 'satuan_penjualan_id' => 8, 'jumlah_satuan_kecil_dalam_satuan_besar' => 24, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 12000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Hansaplast Roll', 'kategori_id' => 8, 'satuan_kecil_id' => 3, 'satuan_besar_id' => 5, 'satuan_penjualan_id' => 3, 'jumlah_satuan_kecil_dalam_satuan_besar' => 12, 'jumlah_satuan_kecil_dalam_satuan_penjualan' => 1, 'harga_jual' => 20000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('obat')->insert($obat);
    }
}
