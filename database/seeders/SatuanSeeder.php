<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SatuanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $satuan = [
            ['nama_satuan' => 'Tablet'],
            ['nama_satuan' => 'Kapsul'],
            ['nama_satuan' => 'Pcs'],
            ['nama_satuan' => 'Strip'],
            ['nama_satuan' => 'Box/Dus'],
            ['nama_satuan' => 'Botol'],
            ['nama_satuan' => 'Tube'],
            ['nama_satuan' => 'Pot'],
            ['nama_satuan' => 'Ampul'],
        ];

        DB::table('satuan')->insert($satuan);
    }
}
