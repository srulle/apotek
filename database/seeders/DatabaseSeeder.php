<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate([
            'email' => 'srulle94@gmail.com',
        ], [
            'name' => 'Asrul Azhar',
            'password' => Hash::make('00000000'),
        ]);

        $this->call(KategoriObatSeeder::class);
        $this->call(SatuanSeeder::class);
        $this->call(ObatSeeder::class);
    }
}
