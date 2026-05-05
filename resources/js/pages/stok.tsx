import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { DataTable } from '@/components/datatable/datatable';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { stok } from '@/routes';

type Kategori = {
    id: number;
    nama_kategori: string;
};

type Satuan = {
    id: number;
    nama_satuan: string;
};

type Stok = {
    id: number;
    obat_id: number;
    nomor_batch: string;
    tanggal_expired: string;
    stok: number;
};

type Obat = {
    id: number;
    nama_obat: string;
    kategori_id: number;
    satuan_besar_id: number;
    satuan_kecil_id: number;
    isi_per_satuan: number;
    harga_jual: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    kategori: Kategori;
    satuan_besar: Satuan;
    satuan_kecil: Satuan;
    stok: Stok[];
    total_stok: number;
};

interface StokPageProps {
    obat: Obat[];
}

export default function Stok() {
    const pageProps = usePage().props as unknown as StokPageProps;
    const obat = pageProps.obat;

    const columns: ColumnDef<Obat>[] = [
        {
            accessorKey: 'nama_obat',
            header: 'Nama Obat',
        },
        {
            accessorKey: 'kategori.nama_kategori',
            header: 'Kategori Obat',
            cell: ({ row }) => row.original.kategori?.nama_kategori || '-',
            meta: {
                filterable: true,
            },
        },

        {
            accessorKey: 'harga_jual',
            header: 'Harga Jual',
            meta: {
                sortIconType: 'numeric',
            },
            cell: ({ row }) => {
                const harga = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(row.original.harga_jual);
                const satuanKecil =
                    row.original.satuan_kecil?.nama_satuan || '';

                return (
                    <div className="flex items-center gap-1">
                        {harga}
                        <Badge className="rounded-sm px-1.5 py-px text-[10px]">
                            per {satuanKecil}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: 'total_stok',
            header: 'Total Stok',
            meta: {
                sortIconType: 'numeric',
            },
            cell: ({ row }) => {
                const totalStok = row.original.total_stok || 0;
                const satuanKecil =
                    row.original.satuan_kecil?.nama_satuan || '';

                return (
                    <div className="flex items-center gap-1">
                        {totalStok.toLocaleString('id-ID')}
                        <Badge className="rounded-sm px-1.5 py-px text-[10px]">
                            per {satuanKecil}
                        </Badge>
                    </div>
                );
            },
        },
    ];

    const renderExpandedRow = (obat: Obat) => {
        if (!obat.stok || obat.stok.length === 0) {
            return (
                <div className="p-4 text-center text-muted-foreground">
                    Tidak ada data batch untuk obat ini
                </div>
            );
        }

        const totalStok = obat.stok.reduce((sum, batch) => sum + batch.stok, 0);

        return (
            <Table>
                <TableHeader className="border-b">
                    <TableRow>
                        <TableHead className="w-12">No.</TableHead>
                        <TableHead>No. Batch</TableHead>
                        <TableHead>Tanggal Expired</TableHead>
                        <TableHead className="text-center">Stok</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {obat.stok.map((batch, index) => (
                        <TableRow key={batch.id}>
                            <TableCell className="text-center">
                                {index + 1}
                            </TableCell>
                            <TableCell>{batch.nomor_batch}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    {new Date(batch.tanggal_expired)
                                        .toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                        .replace(
                                            /(\w+) (\w+) (\d+)/,
                                            '$1 $2, $3',
                                        )}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {batch.stok.toLocaleString('id-ID')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter className="bg-transparent">
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">
                            Total
                        </TableCell>
                        <TableCell className="text-center">
                            {totalStok.toLocaleString('id-ID')}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        );
    };

    return (
        <>
            <Head title="Stok" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-2 md:m-4 md:p-4 dark:border-sidebar-border">
                <div className="space-y-4">
                    <h1 className="text-xl font-semibold">Stok Obat</h1>
                    <DataTable
                        data={obat || []}
                        columns={columns}
                        initialPagination={{ pageIndex: 0, pageSize: 10 }}
                        emptyMessage="Belum ada data obat"
                        enableGlobalFilter
                        enableRowExpansion
                        renderExpandedRow={renderExpandedRow}
                        searchPlaceholder="Cari nama obat, kategori, satuan..."
                    />
                </div>
            </div>
        </>
    );
}

Stok.layout = {
    breadcrumbs: [
        {
            title: 'Stok',
            href: stok(),
        },
    ],
};
