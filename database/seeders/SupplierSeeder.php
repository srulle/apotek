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
            ['nama_supplier' => 'Kalbe Farma'],
            ['nama_supplier' => 'Tempo Scan Pacific'],
            ['nama_supplier' => 'Indofarma'],
            ['nama_supplier' => 'Kimia Farma'],
            ['nama_supplier' => 'Bayer Indonesia'],
            ['nama_supplier' => 'Pfizer Indonesia'],
            ['nama_supplier' => 'Novartis Indonesia'],
            ['nama_supplier' => 'Sanofi Indonesia'],
            ['nama_supplier' => 'Darya Varia Laboratoria'],
            ['nama_supplier' => 'Combiphar'],
        ];

        DB::table('supplier')->insert($supplier);
    }
}
