<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $supplier = [
            ['nama_supplier' => 'PT Kalbe Farma Tbk'],
            ['nama_supplier' => 'PT Tempo Scan Pacific Tbk'],
            ['nama_supplier' => 'PT Indofarma Tbk'],
            ['nama_supplier' => 'PT Kimia Farma Tbk'],
            ['nama_supplier' => 'PT Bayer Indonesia'],
            ['nama_supplier' => 'PT Pfizer Indonesia'],
            ['nama_supplier' => 'PT Novartis Indonesia'],
            ['nama_supplier' => 'PT Sanofi Indonesia'],
            ['nama_supplier' => 'PT Darya Varia Laboratoria Tbk'],
            ['nama_supplier' => 'PT Combiphar'],
        ];

        DB::table('suplier')->insert($supplier);
    }
}
