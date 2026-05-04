<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Penjualan extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'penjualan';

    protected $fillable = [
        'nomor_faktur',
        'tanggal_penjualan',
        'user_id',
    ];

    protected $casts = [
        'tanggal_penjualan' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function penjualanDetail(): HasMany
    {
        return $this->hasMany(PenjualanDetail::class, 'penjualan_id');
    }
}
