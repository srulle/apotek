# DataTable Component

Komponen DataTable yang powerful, fleksibel, dan terintegrasi penuh dengan TanStack Table v8.

## 🚀 Fitur Lengkap

✅ **Row Selection** - Pilih baris tunggal / multiple dengan checkbox
✅ **Global Search** - Pencarian semua kolom secara realtime
✅ **Advanced Column Filter** - Combobox multi select dengan badge count
✅ **Pagination** - Kontrol halaman dengan ukuran halaman dapat disesuaikan
✅ **Sorting** - Sorting otomatis dengan deteksi tipe data (teks/numerik)
✅ **Row Expansion** - Tampilkan detail baris dengan expand/collapse
✅ **SimpleDatatable** - Versi ringkas untuk kasus sederhana
✅ **Backward Compatible** - Semua fitur opsional, tidak merusak kode lama
✅ **UI Konsisten** - Menggunakan shadcn/ui system design
✅ **Type Safe** - Fully typed dengan TypeScript
✅ **Performance Optimized** - Semua operasi berat di-memoize

---

## 📦 Penggunaan Dasar

```tsx
import DataTable from '@/components/datatable/datatable';
import { ColumnDef } from '@tanstack/react-table';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Nama Lengkap',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
];

// Di dalam komponen
<DataTable data={users} columns={columns} />;
```

---

## ⚙️ Props Lengkap

| Prop                 | Tipe                          | Default                         | Keterangan                         |
| -------------------- | ----------------------------- | ------------------------------- | ---------------------------------- |
| `data`               | `T[]`                         | **Required**                    | Array data yang akan ditampilkan   |
| `columns`            | `ColumnDef<T>[]`              | **Required**                    | Definisi kolom tabel               |
| `initialPagination`  | `PaginationState`             | `{ pageIndex: 0, pageSize: 5 }` | State awal pagination              |
| `initialSorting`     | `SortingState`                | `[]`                            | State awal sorting                 |
| `pageSizeOptions`    | `number[]`                    | `[5, 10, 25, 50]`               | Pilihan ukuran halaman             |
| `emptyMessage`       | `string`                      | `'Tidak ada data'`              | Pesan ketika data kosong           |
| `className`          | `string`                      | `''`                            | Custom class untuk container tabel |
| `enableRowSelection` | `boolean`                     | `false`                         | Aktifkan fitur pilih baris         |
| `enableGlobalFilter` | `boolean`                     | `false`                         | Aktifkan fitur pencarian global    |
| `searchPlaceholder`  | `string`                      | `'Cari...'`                     | Placeholder untuk input pencarian  |
| `onSelectionChange`  | `(selectedRows: T[]) => void` | `undefined`                     | Callback ketika baris dipilih      |
| `enableRowExpansion` | `boolean`                     | `false`                         | Aktifkan fitur expand baris        |
| `renderExpandedRow`  | `(row: T) => React.ReactNode` | `undefined`                     | Render konten baris yang diexpand  |

---

## 🎯 Fitur Per Fitur

### 1. Row Selection

Aktifkan checkbox untuk memilih baris:

```tsx
const [selectedRows, setSelectedRows] = useState<User[]>([]);

<DataTable
    data={users}
    columns={columns}
    enableRowSelection
    onSelectionChange={setSelectedRows}
/>;
```

- Checkbox "Select All" di header
- Badge counter jumlah baris terpilih
- Callback mengembalikan array data original
- Bisa digabung dengan filter dan search

---

### 2. Global Search

Form pencarian otomatis mencari semua kolom:

```tsx
<DataTable
    data={users}
    columns={columns}
    enableGlobalFilter
    searchPlaceholder="Cari nama atau email..."
/>
```

- Pencarian case-insensitive
- Realtime saat mengetik
- Posisikan di kiri atas tabel
- Max width `2xl` secara default

---

### 3. Advanced Column Filter

Filter per kolom dengan combobox multi select:

```tsx
const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'role',
        header: 'Role',
        meta: {
            filterable: true, // ✅ Aktifkan advanced filter
        },
    },
];

<DataTable data={users} columns={columns} />;
```

#### Fitur Filter:

✅ Auto extract unique values dari kolom
✅ Support nested properties (`kategori.nama_kategori`)
✅ Search di dalam daftar nilai filter
✅ Multi select dengan check icon
✅ Badge count jumlah nilai yang dipilih
✅ Posisi di sebelah kanan form cari
✅ Bisa aktif untuk banyak kolom sekaligus

---

### 4. Sorting

Sorting bekerja otomatis untuk semua kolom:

```tsx
const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Nama',
    },
    {
        accessorKey: 'age',
        header: 'Umur',
        meta: {
            sortIconType: 'numeric', // Opsional: paksa icon numeric
        },
    },
];
```

- Otomatis deteksi tipe data (teks/numerik)
- Icon sorting berbeda untuk teks dan angka
- Toggle asc/desc ketika klik header

---

### 5. Pagination

Kustomisasi pagination:

```tsx
<DataTable
    data={users}
    columns={columns}
    initialPagination={{ pageIndex: 0, pageSize: 10 }}
    pageSizeOptions={[10, 25, 50, 100]}
/>
```

---

### 6. Row Expansion

Fitur untuk menampilkan konten detail tambahan ketika baris di expand:

```tsx
<DataTable
    data={users}
    columns={columns}
    enableRowExpansion
    renderExpandedRow={(row) => (
        <div className="p-4">
            <p>Detail lengkap untuk user: {row.name}</p>
            <p>Email: {row.email}</p>
        </div>
    )}
/>
```

- Tombol expand otomatis di awal baris
- Mendukung nesting konten apapun
- Expand/Collapse dengan animasi smooth
- Bisa digunakan bersamaan dengan row selection

---

## 📋 ColumnDef Meta Options

Opsi tambahan untuk setiap kolom:

```tsx
{
  accessorKey: 'harga',
  header: 'Harga',
  meta: {
    filterable: true,       // Aktifkan advanced filter
    sortIconType: 'numeric',// Gunakan icon sorting numeric
  }
}
```

| Opsi           | Tipe                  | Keterangan                        |
| -------------- | --------------------- | --------------------------------- |
| `filterable`   | `boolean`             | Aktifkan advanced combobox filter |
| `sortIconType` | `'text' \| 'numeric'` | Tipe icon sorting                 |

---

## 💡 Contoh Implementasi Lengkap

```tsx
'use client';

import { useState } from 'react';
import DataTable from '@/components/datatable/datatable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

type Produk = {
    id: number;
    nama_produk: string;
    kategori: { nama_kategori: string };
    harga: number;
    stok: number;
};

export default function ProdukPage() {
    const [produk, setProduk] = useState<Produk[]>([]);
    const [selectedProduk, setSelectedProduk] = useState<Produk[]>([]);

    const columns: ColumnDef<Produk>[] = [
        {
            accessorKey: 'nama_produk',
            header: 'Nama Produk',
        },
        {
            accessorKey: 'kategori.nama_kategori',
            header: 'Kategori',
            meta: { filterable: true },
        },
        {
            accessorKey: 'harga',
            header: 'Harga',
            meta: { sortIconType: 'numeric' },
            cell: ({ row }) =>
                new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                }).format(row.original.harga),
        },
        {
            accessorKey: 'stok',
            header: 'Stok',
            meta: { sortIconType: 'numeric', filterable: true },
        },
    ];

    return (
        <div className="space-y-4">
            <h1>Data Produk</h1>

            {selectedProduk.length > 0 && (
                <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                    <span>{selectedProduk.length} produk terpilih</span>
                    <Button variant="destructive" size="sm" className="ml-auto">
                        Hapus Terpilih
                    </Button>
                </div>
            )}

            <DataTable
                data={produk}
                columns={columns}
                enableRowSelection
                enableGlobalFilter
                enableRowExpansion
                initialPagination={{ pageIndex: 0, pageSize: 10 }}
                searchPlaceholder="Cari nama produk, kategori..."
                onSelectionChange={setSelectedProduk}
                renderExpandedRow={(produk) => (
                    <div className="p-3">
                        Detail produk: {produk.nama_produk}
                    </div>
                )}
            />
        </div>
    );
}
```

---

## ✨ SimpleDatatable Komponen

Untuk kasus sederhana tanpa fitur lanjutan, tersedia `SimpleDatatable` yang ringan dan minimal:

```tsx
import { SimpleDatatable } from '@/components/datatable/datatable';

<SimpleDatatable
    data={users}
    columns={columns}
    pageSize={10}
    showPagination={true}
    emptyMessage="Data tidak ditemukan"
/>;
```

### Props SimpleDatatable:

| Prop             | Tipe                 | Default         | Keterangan                   |
| ---------------- | -------------------- | --------------- | ---------------------------- |
| `data`           | `TData[]`            | **Required**    | Array data                   |
| `columns`        | `ColumnDef<TData>[]` | **Required**    | Definisi kolom               |
| `pageSize`       | `number`             | `5`             | Jumlah baris per halaman     |
| `showPagination` | `boolean`            | `true`          | Tampilkan kontrol pagination |
| `emptyMessage`   | `string`             | `'No results.'` | Pesan ketika data kosong     |
| `className`      | `string`             | `''`            | Custom class container       |

---

## 🐛 Troubleshooting

### Halaman Freeze / Infinite Re-render

- Pastikan tidak ada state yang diupdate di dalam render loop
- Semua operasi berat sudah di-`useMemo`
- Jangan masukkan `table` instance ke dalam dependency array `useEffect`

### Filter Tidak Berfungsi

- Pastikan `meta.filterable: true` ada di ColumnDef
- Untuk nested properties, pastikan `accessorKey` benar
- Cek apakah ada nilai `null/undefined` di data

### TypeScript Error Highlight Merah

- Error di IDE tapi build berhasil = normal, karena generic type inference terbatas
- Sudah ada type assertion `as ColumnDef<T>[]` untuk mengatasinya
- Tidak mempengaruhi fungsionalitas

---

## ⚡ Performance Tips

1.  **Gunakan `enableGlobalFilter` hanya jika perlu** - Untuk dataset > 1000 baris, pencarian global cukup berat
2.  **Batasi jumlah kolom filterable** - Setiap kolom filter menambah overhead
3.  **Gunakan server-side pagination** untuk dataset > 2000 baris
4.  **Hindari operasi berat di `cell` render**

---

## 📌 Catatan Versi

- Versi: 2.0
- Dibangun dengan: TanStack Table v8, React 18+, shadcn/ui
- Kompatibel dengan: Laravel + Inertia.js, Next.js, Remix, dan framework React lainnya
