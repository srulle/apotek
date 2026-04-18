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
            // id:1=Tablet,2=Kapsul,3=Pcs,4=Strip,5=Box/Dus,6=Botol,7=Tube,8=Pot,9=Ampul,10=Gram,11=Lembar,12=Pak,13=Kaleng
            // SEMUA HARGA ADALAH HARGA PER SATUAN KECIL SESUAI HARGA PASARAN INDONESIA SAAT INI

            // Obat Bebas
            ['nama_obat' => 'Paracetamol 500mg', 'kategori_id' => 1, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 10, 'harga_jual' => 1500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Ibuprofen 400mg', 'kategori_id' => 1, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 10, 'harga_jual' => 1850, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Amoxicillin 500mg', 'kategori_id' => 3, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 10, 'harga_jual' => 3200, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Cefixime 200mg', 'kategori_id' => 3, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 6, 'harga_jual' => 8000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Omeprazole 20mg', 'kategori_id' => 2, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 2, 'isi_per_satuan' => 14, 'harga_jual' => 1950, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Lansoprazole 30mg', 'kategori_id' => 2, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 2, 'isi_per_satuan' => 10, 'harga_jual' => 3500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Metformin 500mg', 'kategori_id' => 3, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 30, 'harga_jual' => 750, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Glibenclamide 5mg', 'kategori_id' => 3, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 125, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Amlodipine 5mg', 'kategori_id' => 3, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 30, 'harga_jual' => 800, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Losartan 50mg', 'kategori_id' => 3, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 30, 'harga_jual' => 1250, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Simvastatin 20mg', 'kategori_id' => 3, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 30, 'harga_jual' => 950, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Salbutamol 4mg', 'kategori_id' => 2, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 140, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Diphenhydramine 25mg', 'kategori_id' => 1, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 110, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Cetirizine 10mg', 'kategori_id' => 1, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 175, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Loratadine 10mg', 'kategori_id' => 1, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 210, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Domperidone 10mg', 'kategori_id' => 2, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 195, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Metoclopramide 10mg', 'kategori_id' => 2, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 85, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'B Complex', 'kategori_id' => 7, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 160, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Vitamin C 500mg', 'kategori_id' => 7, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 130, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Calcium D3', 'kategori_id' => 7, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 2, 'isi_per_satuan' => 30, 'harga_jual' => 1500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Ferrous Sulfate 200mg', 'kategori_id' => 7, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 100, 'harga_jual' => 105, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Paracetamol Syrup 120mg/5ml', 'kategori_id' => 1, 'satuan_besar_id' => 6, 'satuan_kecil_id' => 10, 'isi_per_satuan' => 60, 'harga_jual' => 350, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Ambroxol Syrup 30mg/5ml', 'kategori_id' => 2, 'satuan_besar_id' => 6, 'satuan_kecil_id' => 10, 'isi_per_satuan' => 100, 'harga_jual' => 310, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Betadine Ointment', 'kategori_id' => 10, 'satuan_besar_id' => 6, 'satuan_kecil_id' => 10, 'isi_per_satuan' => 20, 'harga_jual' => 850, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Hydrocortisone Cream 2.5%', 'kategori_id' => 10, 'satuan_besar_id' => 6, 'satuan_kecil_id' => 10, 'isi_per_satuan' => 15, 'harga_jual' => 1600, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Tolak Angin Cair', 'kategori_id' => 6, 'satuan_besar_id' => 5, 'satuan_kecil_id' => 3, 'isi_per_satuan' => 12, 'harga_jual' => 1600, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Antangin JRG', 'kategori_id' => 6, 'satuan_besar_id' => 5, 'satuan_kecil_id' => 3, 'isi_per_satuan' => 12, 'harga_jual' => 1800, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Panadol Extra', 'kategori_id' => 11, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 10, 'harga_jual' => 2800, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Neuralgin', 'kategori_id' => 12, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 10, 'harga_jual' => 1450, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_obat' => 'Promag Tablet', 'kategori_id' => 1, 'satuan_besar_id' => 4, 'satuan_kecil_id' => 1, 'isi_per_satuan' => 48, 'harga_jual' => 500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('obat')->insert($obat);
    }
}
