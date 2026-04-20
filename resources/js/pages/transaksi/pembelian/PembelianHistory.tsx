import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import DataTable from '@/components/datatable/datatable';

type User = {
    id: number;
    name: string;
};

type Supplier = {
    id: number;
    nama_supplier: string;
};

type Obat = {
    id: string;
    nama_obat: string;
};

type PembelianDetail = {
    id: string;
    nomor_batch: string;
    tanggal_expired: string;
    jumlah_beli: number;
    harga_beli: number;
    obat: Obat;
};

type Pembelian = {
    id: string;
    nomor_faktur: string;
    supplier: Supplier;
    tanggal_pembelian: string;
    user: User;
    pembelian_detail: PembelianDetail[];
    created_at: string;
};

interface PembelianHistoryProps {
    pembelian?: Pembelian[];
}

export default function PembelianHistory({
    pembelian: initialPembelian,
}: PembelianHistoryProps = {}) {
    const pageProps = usePage().props as any;
    const [pembelian, setPembelian] = useState<Pembelian[]>(
        initialPembelian || pageProps?.pembelian || [],
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If no pembelian data is available, fetch it
        if (!pembelian.length && !initialPembelian) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await fetch(
                        '/api/transaksi/pembelian/history',
                        {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                Accept: 'application/json',
                            },
                        },
                    );

                    if (response.ok) {
                        const data = await response.json();
                        setPembelian(data.pembelian || []);
                    } else {
                        console.error('Failed to fetch pembelian data');
                        setPembelian([]);
                    }
                } catch (error) {
                    console.error('Error fetching pembelian data:', error);
                    setPembelian([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [pembelian.length, initialPembelian]);

    const columns: ColumnDef<Pembelian>[] = [
        {
            accessorKey: 'nomor_faktur',
            header: 'No. Faktur',
        },
        {
            accessorKey: 'supplier.nama_supplier',
            header: 'Supplier',
            cell: ({ row }) => row.original.supplier?.nama_supplier || '-',
        },
        {
            accessorKey: 'tanggal_pembelian',
            header: 'Tanggal Pembelian',
            cell: ({ row }) => {
                return new Date(
                    row.original.tanggal_pembelian,
                ).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            },
        },
        {
            accessorKey: 'user.name',
            header: 'User',
            cell: ({ row }) => row.original.user?.name || '-',
        },
        {
            accessorKey: 'created_at',
            header: 'Waktu Dibuat',
            cell: ({ row }) => {
                return new Date(row.original.created_at).toLocaleString(
                    'id-ID',
                    {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    },
                );
            },
        },
    ];

    const renderExpandedRow = (pembelianData: Pembelian) => {
        if (
            !pembelianData.pembelian_detail ||
            pembelianData.pembelian_detail.length === 0
        ) {
            return (
                <div className="p-4 text-center text-muted-foreground">
                    Tidak ada detail pembelian untuk faktur ini
                </div>
            );
        }

        return (
            <div className="p-4">
                <h4 className="mb-3 font-medium">Detail Pembelian</h4>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-3 py-2 text-left">
                                    Nama Obat
                                </th>
                                <th className="border border-gray-200 px-3 py-2 text-left">
                                    No. Batch
                                </th>
                                <th className="border border-gray-200 px-3 py-2 text-left">
                                    Tanggal Expired
                                </th>
                                <th className="border border-gray-200 px-3 py-2 text-right">
                                    Jumlah Beli
                                </th>
                                <th className="border border-gray-200 px-3 py-2 text-right">
                                    Harga Beli
                                </th>
                                <th className="border border-gray-200 px-3 py-2 text-right">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pembelianData.pembelian_detail.map((detail) => (
                                <tr
                                    key={detail.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border border-gray-200 px-3 py-2">
                                        {detail.obat?.nama_obat || '-'}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2">
                                        {detail.nomor_batch}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            {new Date(
                                                detail.tanggal_expired,
                                            ).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2 text-right">
                                        {detail.jumlah_beli.toLocaleString(
                                            'id-ID',
                                        )}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2 text-right">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(detail.harga_beli)}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2 text-right">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(
                                            detail.jumlah_beli *
                                                detail.harga_beli,
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Memuat data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Riwayat Pembelian</h3>
            <DataTable
                data={pembelian}
                columns={columns}
                initialPagination={{ pageIndex: 0, pageSize: 10 }}
                emptyMessage="Belum ada data pembelian"
                enableRowExpansion
                renderExpandedRow={renderExpandedRow}
            />
        </div>
    );
}
