<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriObat extends Model
{
    protected $table = 'kategori_obat';

    protected $fillable = [
        'nama_kategori',
    ];

    public $timestamps = false;
}
