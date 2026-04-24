<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenjualanDetail extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'penjualan_detail';

    protected $fillable = [
        'penjualan_id',
        'obat_id',
        'nomor_batch',
        'tanggal_expired',
        'jumlah_jual',
        'harga_jual',
    ];

    protected $casts = [
        'tanggal_expired' => 'date',
        'jumlah_jual' => 'integer',
        'harga_jual' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function penjualan(): BelongsTo
    {
        return $this->belongsTo(Penjualan::class);
    }

    public function obat(): BelongsTo
    {
        return $this->belongsTo(Obat::class);
    }
}
