<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obat extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_obat',
        'kategori_id',
        'satuan_besar_id',
        'satuan_kecil_id',
        'isi_per_satuan',
        'harga_jual',
        'is_active',
    ];

    protected $casts = [
        'isi_per_satuan' => 'integer',
        'harga_jual' => 'integer',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function kategori()
    {
        return $this->belongsTo(KategoriObat::class, 'kategori_id');
    }

    public function satuanBesar()
    {
        return $this->belongsTo(Satuan::class, 'satuan_besar_id');
    }

    public function satuanKecil()
    {
        return $this->belongsTo(Satuan::class, 'satuan_kecil_id');
    }
}
