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
        Schema::create('stok', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('obat_id')->unsigned();
            $table->string('nomor_batch', 50);
            $table->date('tanggal_expired');
            $table->integer('stok')->unsigned()->default(0);
            $table->timestamps();

            $table->foreign('obat_id')->references('id')->on('obat')->onUpdate('cascade')->onDelete('restrict');
            $table->index(['obat_id', 'nomor_batch'], 'idx_obat_batch');
            $table->index('tanggal_expired', 'idx_tanggal_expired');
            $table->index('stok', 'idx_stok');
            $table->unique(['obat_id', 'nomor_batch'], 'unique_obat_batch');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stok');
    }
};
