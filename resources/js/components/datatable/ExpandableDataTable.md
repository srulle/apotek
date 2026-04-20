# Komponen ExpandableDataTable

Komponen React yang sangat dapat digunakan kembali dan fleksibel untuk menampilkan tabel data yang dapat diperluas dengan dukungan untuk data statis dan pengambilan data sisi server.

## Fitur

- ✅ **Baris yang Dapat Diperluas**: Klik untuk memperluas baris dan menampilkan sub-data
- ✅ **Pemilihan Baris**: Multi-select baris dengan checkbox
- ✅ **Integrasi Database**: Ambil data dari API dengan status loading
- ✅ **Lazy Loading**: Sub-baris hanya diambil saat diperluas
- ✅ **Dukungan Pagination**: Pagination sisi server
- ✅ **TypeScript**: Keselamatan tipe penuh
- ✅ **Dapat Disesuaikan**: Definisi kolom dan styling yang fleksibel
- ✅ **Aksesibel**: Label ARIA yang tepat dan navigasi keyboard

## Instalasi

Komponen terletak di `resources/js/components/datatable/ExpandableDataTable.tsx` dan menggunakan dependensi berikut:

- `@tanstack/react-table`
- `@tanstack/react-table` (untuk fungsionalitas tabel)
- `lucide-react` (untuk ikon)
- `@/components/ui/button`, `@/components/ui/checkbox`, `@/components/ui/table` (komponen shadcn/ui)

## Penggunaan Dasar

### Data Statis

```tsx
import {
    ExpandableDataTable,
    createExpanderColumn,
    createSelectColumn,
} from '@/components/datatable/ExpandableDataTable';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';

type Team = {
    teamName: string;
    department: string;
    location: string;
    members: Member[];
};

type Member = {
    name: string;
    role: string;
    email: string;
};

function TeamsTable() {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const data: Team[] = [
        {
            teamName: 'Digital Marketing',
            department: 'Marketing',
            location: 'London',
            members: [
                { name: 'Alice', role: 'Lead', email: 'alice@example.com' },
                { name: 'Bob', role: 'Creator', email: 'bob@example.com' },
            ],
        },
    ];

    const columns: ColumnDef<Team>[] = [
        createExpanderColumn(),
        createSelectColumn(),
        {
            header: 'Nama Tim',
            accessorKey: 'teamName',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('teamName')}</div>
            ),
        },
        {
            header: 'Departemen',
            accessorKey: 'department',
        },
    ];

    return (
        <ExpandableDataTable
            data={data}
            columns={columns}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getRowCanExpand={(row) => row.original.members.length > 0}
            renderSubRow={(team) => ({
                columns: [
                    { header: 'Nama Anggota', accessorKey: 'name' },
                    { header: 'Peran', accessorKey: 'role' },
                    { header: 'Email', accessorKey: 'email' },
                ],
                data: team.members,
            })}
        />
    );
}
```

## Integrasi Database

### Mengambil Data Utama

```tsx
const fetchTeams = async (): Promise<Team[]> => {
    const response = await fetch('/api/teams');
    return response.json();
};

<ExpandableDataTable
    fetchData={fetchTeams}
    columns={columns}
    // ... props lainnya
/>;
```

### Mengambil Sub-Data Saat Diperluas

```tsx
const fetchTeamMembers = async (team: Team): Promise<Member[]> => {
    const response = await fetch(`/api/teams/${team.id}/members`);
    return response.json();
};

<ExpandableDataTable
    fetchData={fetchTeams}
    fetchSubRowData={fetchTeamMembers}
    columns={columns}
    getRowCanExpand={() => true}
/>;
```

### Pagination Lanjutan

```tsx
const [currentPage, setCurrentPage] = useState(1);

const fetchTeamsPaginated = async (params?: {
    page?: number;
    pageSize?: number;
}) => {
    const page = params?.page || currentPage;
    const size = params?.pageSize || 10;
    const response = await fetch(`/api/teams?page=${page}&per_page=${size}`);
    const result = await response.json();
    return {
        data: result.data, // Team[]
        total: result.total, // number
    };
};

<ExpandableDataTable
    onFetchData={fetchTeamsPaginated}
    pagination={{
        currentPage,
        pageSize: 10,
        onPageChange: setCurrentPage,
    }}
    columns={columns}
/>;
```

## Referensi API

### Props ExpandableDataTable

```typescript
interface ExpandableDataTableProps<TData, TSubData> {
    // Sumber Data (pilih satu)
    data?: TData[]; // Data statis
    fetchData?: () => Promise<TData[]>; // Pengambilan API sederhana
    onFetchData?: (params?: {
        page?: number;
        pageSize?: number;
        search?: string;
    }) => Promise<{ data: TData[]; total?: number }>; // Pengambilan lanjutan dengan pagination

    // Wajib
    columns: ColumnDef<TData>[];

    // Konfigurasi Sub-baris
    getRowCanExpand?: (row: Row<TData>) => boolean;
    renderSubRow?: (row: TData) => {
        columns: SubColumnDef[];
        data: TSubData[];
    }; // Untuk sub-data statis
    fetchSubRowData?: (row: TData) => Promise<TSubData[]>; // Untuk sub-data dinamis

    // Pemilihan Baris
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;
    enableRowSelection?: boolean;

    // Callback
    onRowExpand?: (row: Row<TData>) => void;

    // Kustomisasi UI
    className?: string;
    emptyMessage?: string;
    loading?: boolean;

    // Pagination
    pagination?: {
        pageSize?: number;
        currentPage?: number;
        total?: number;
        onPageChange?: (page: number) => void;
    };
}
```

### Fungsi Helper

#### createExpanderColumn()

Membuat kolom yang dapat diperluas dengan tombol expand/collapse.

```typescript
createExpanderColumn(options?: {
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  className?: string
  onExpand?: (row: Row<TData>) => void
}): ColumnDef<TData>
```

#### createSelectColumn()

Membuat kolom pemilihan dengan checkbox.

```typescript
createSelectColumn(options?: {
  headerAriaLabel?: string
  rowAriaLabel?: string
}): ColumnDef<TData>
```

## Contoh Lanjutan

### Kolom Sub-baris Kustom

```tsx
renderSubRow={(team) => ({
  columns: [
    {
      header: 'Nama Anggota',
      accessorKey: 'name',
      cell: ({ item }) => <strong>{item.name}</strong>
    },
    {
      header: 'Peran',
      accessorKey: 'role'
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: ({ item }) => <a href={`mailto:${item.email}`}>{item.email}</a>
    },
    {
      header: 'Tanggal Bergabung',
      accessorKey: 'hireDate',
      cell: ({ item }) => new Date(item.hireDate).toLocaleDateString()
    }
  ],
  data: team.members
})}
```

### Penanganan Error

```tsx
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Gagal mengambil data');
        return response.json();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Error tidak diketahui');
        throw err;
    }
};

<ExpandableDataTable
    fetchData={fetchData}
    // ... props lainnya
/>;

{
    error && <div className="mt-4 text-red-500">{error}</div>;
}
```

### Status Loading

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleRefresh = async () => {
    setIsLoading(true);
    try {
        // Logika refresh
    } finally {
        setIsLoading(false);
    }
};

<ExpandableDataTable
    loading={isLoading}
    // ... props lainnya
/>;
```

## Styling

Komponen menggunakan kelas Tailwind CSS dan komponen shadcn/ui. Anda dapat menyesuaikan tampilan menggunakan:

- `className`: Tambahkan kelas kustom ke wrapper tabel
- `className` Kolom: Sesuaikan styling kolom individual
- `className` kolom sub-baris: Sesuaikan styling kolom sub-baris

## Pertimbangan Performa

- **Lazy Loading**: Sub-data hanya diambil saat baris diperluas
- **Memoization**: Pertimbangkan untuk memoize definisi kolom yang mahal
- **Pagination**: Gunakan pagination sisi server untuk dataset besar
- **Debouncing**: Debounce operasi pencarian/filter

## Aksesibilitas

- Label ARIA yang tepat untuk screen reader
- Dukungan navigasi keyboard
- Manajemen fokus untuk baris yang dapat diperluas
- Struktur HTML semantik

## Dukungan TypeScript

Komponen sepenuhnya diketik dengan generics:

```typescript
ExpandableDataTable<TipeDataUtama, TipeSubData>;
```

Ini memastikan keselamatan tipe untuk struktur data Anda dan mencegah error runtime.

## Dukungan Browser

Berfungsi di semua browser modern yang mendukung React 18+ dan fitur ES6+.
