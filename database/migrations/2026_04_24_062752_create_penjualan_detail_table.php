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
        Schema::create('penjualan_detail', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('penjualan_id')
                ->constrained('penjualan')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('obat_id')
                ->constrained('obat')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('nomor_batch', 50);
            $table->date('tanggal_expired');
            $table->integer('jumlah_jual')->unsigned();
            $table->decimal('harga_jual', 13, 2);
            $table->timestamps();

            $table->index('penjualan_id');
            $table->index('obat_id');
            $table->index('tanggal_expired');
            $table->unique(['penjualan_id', 'obat_id', 'nomor_batch']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penjualan_detail');
    }
};
