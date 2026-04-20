import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import DataTable from '@/components/datatable/datatable';
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
            accessorKey: 'satuan_besar.nama_satuan',
            header: 'Satuan Besar',
            cell: ({ row }) => row.original.satuan_besar?.nama_satuan || '-',
        },
        {
            accessorKey: 'satuan_kecil.nama_satuan',
            header: 'Satuan Kecil',
            cell: ({ row }) => row.original.satuan_kecil?.nama_satuan || '-',
        },
        {
            accessorKey: 'isi_per_satuan',
            header: 'Isi',
        },
        {
            accessorKey: 'harga_jual',
            header: 'Harga Jual',
            meta: {
                sortIconType: 'numeric',
            },
            cell: ({ row }) => {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(row.original.harga_jual);
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

                return totalStok.toLocaleString('id-ID');
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

        return (
            <div className="p-4">
                <h4 className="mb-3 font-medium">Detail Batch Stok</h4>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-3 py-2 text-left">
                                    No. Batch
                                </th>
                                <th className="border border-gray-200 px-3 py-2 text-left">
                                    Tanggal Expired
                                </th>
                                <th className="border border-gray-200 px-3 py-2 text-right">
                                    Stok
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {obat.stok.map((batch) => (
                                <tr key={batch.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-200 px-3 py-2">
                                        {batch.nomor_batch}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            {new Date(
                                                batch.tanggal_expired,
                                            ).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2 text-right">
                                        {batch.stok.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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
