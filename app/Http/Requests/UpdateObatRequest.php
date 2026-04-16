<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateObatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_obat' => 'required|string|max:150',
            'kategori_obat' => 'required|string',
            'satuan_besar' => 'required|string',
            'satuan_kecil' => 'required|string',
            'isi_per_satuan' => 'required|integer|min:1',
            'harga_jual' => 'required|numeric|min:0',
        ];
    }
}
