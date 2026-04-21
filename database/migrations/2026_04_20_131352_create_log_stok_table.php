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
        Schema::create('log_stok', function (Blueprint $table) {
            $table->id();
            $table->foreignId('obat_id')
                ->constrained('obat')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->string('nomor_batch', 50);
            $table->date('tanggal_expired');
            $table->enum('jenis_transaksi', ['pembelian', 'penjualan']);
            $table->integer('jumlah_masuk')->unsigned()->nullable();
            $table->integer('jumlah_keluar')->unsigned()->nullable();
            $table->integer('stok_sebelum')->unsigned();
            $table->integer('stok_sesudah')->unsigned();
            $table->ulid('referensi_id');
            $table->string('keterangan', 255)->nullable();
            $table->timestamp('created_at');

            $table->index(['obat_id', 'nomor_batch']);
            $table->index('jenis_transaksi');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_stok');
    }
};
