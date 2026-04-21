<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obat extends Model
{
    use HasFactory;

    protected $table = 'obat';

    protected $fillable = [
        'nama_obat',
        'kategori_id',
        'satuan_besar_id',
        'satuan_kecil_id',
        'satuan_penjualan_id',
        'jumlah_satuan_kecil_dalam_satuan_besar',
        'jumlah_satuan_kecil_dalam_satuan_penjualan',
        'harga_jual',
        'is_active',
    ];

    protected $casts = [
        'jumlah_satuan_kecil_dalam_satuan_besar' => 'integer',
        'jumlah_satuan_kecil_dalam_satuan_penjualan' => 'integer',
        'harga_jual' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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

    public function satuanPenjualan()
    {
        return $this->belongsTo(Satuan::class, 'satuan_penjualan_id');
    }

    public function stok()
    {
        return $this->hasMany(Stok::class);
    }
}
