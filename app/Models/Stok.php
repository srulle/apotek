<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stok extends Model
{
    protected $table = 'stok';

    protected $fillable = [
        'obat_id',
        'nomor_batch',
        'tanggal_expired',
        'stok',
    ];

    protected $casts = [
        'tanggal_expired' => 'date',
        'stok' => 'integer',
    ];

    public function obat(): BelongsTo
    {
        return $this->belongsTo(Obat::class);
    }
}
