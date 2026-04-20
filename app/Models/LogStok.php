<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogStok extends Model
{
    protected $table = 'log_stok';

    public $timestamps = false;

    protected $fillable = [
        'obat_id',
        'nomor_batch',
        'tanggal_expired',
        'jenis_transaksi',
        'jumlah_masuk',
        'jumlah_keluar',
        'stok_sebelum',
        'stok_sesudah',
        'referensi_id',
        'keterangan',
        'created_at',
    ];

    protected $casts = [
        'tanggal_expired' => 'date',
        'jumlah_masuk' => 'integer',
        'jumlah_keluar' => 'integer',
        'stok_sebelum' => 'integer',
        'stok_sesudah' => 'integer',
        'created_at' => 'datetime',
    ];

    public function obat(): BelongsTo
    {
        return $this->belongsTo(Obat::class);
    }
}
