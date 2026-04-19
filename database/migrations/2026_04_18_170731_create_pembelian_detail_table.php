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
        Schema::create('pembelian_detail', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('pembelian_id')
                ->constrained('pembelian')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('obat_id')
                ->constrained('obat')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('nomor_batch', 50);
            $table->date('tanggal_expired');
            $table->integer('jumlah_beli')->unsigned();
            $table->decimal('harga_beli', 13, 2);
            $table->timestamps();

            $table->index('pembelian_id');
            $table->index('obat_id');
            $table->index('tanggal_expired');
            $table->unique(['pembelian_id', 'obat_id', 'nomor_batch']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembelian_detail');
    }
};
