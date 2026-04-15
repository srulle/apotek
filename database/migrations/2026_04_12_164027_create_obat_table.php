<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('obat', function (Blueprint $table) {
            $table->id();
            $table->string('nama_obat', 150);
            $table->foreignId('kategori_id')->constrained('kategori_obat');
            $table->foreignId('satuan_besar_id')->constrained('satuan');
            $table->foreignId('satuan_kecil_id')->constrained('satuan');
            $table->integer('isi_per_satuan');
            $table->decimal('harga_jual', 12, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obat');
    }
};
