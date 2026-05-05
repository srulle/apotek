import { usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/datatable/datatable';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type User = {
    id: number;
    name: string;
};

type Satuan = {
    id: number;
    nama_satuan: string;
};

type Obat = {
    id: string;
    nama_obat: string;
    satuan_kecil?: Satuan;
};

type PenjualanDetail = {
    id: string;
    nomor_batch: string;
    tanggal_expired: string;
    jumlah_jual: number;
    harga_jual: number;
    obat: Obat;
};

type Penjualan = {
    id: string;
    nomor_faktur: string;
    tanggal_penjualan: string;
    user: User;
    penjualan_detail: PenjualanDetail[];
    created_at: string;
};

interface PenjualanHistoryProps {
    penjualan?: Penjualan[];
}

export default function PenjualanHistory({
    penjualan: initialPenjualan,
}: PenjualanHistoryProps = {}) {
    const pageProps = usePage().props as any;
    const [penjualan, setPenjualan] = useState<Penjualan[]>(
        initialPenjualan || pageProps?.penjualan || [],
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!penjualan.length && !initialPenjualan) {
            const fetchData = async () => {
                setLoading(true);

                try {
                    const response = await fetch(
                        '/api/transaksi/penjualan/history',
                        {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                Accept: 'application/json',
                            },
                        },
                    );

                    if (response.ok) {
                        const data = await response.json();
                        setPenjualan(data.penjualan || []);
                    } else {
                        console.error('Failed to fetch penjualan data');
                        setPenjualan([]);
                    }
                } catch (error) {
                    console.error('Error fetching penjualan data:', error);
                    setPenjualan([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [penjualan.length, initialPenjualan]);

    const columns: ColumnDef<Penjualan>[] = [
        {
            accessorKey: 'nomor_faktur',
            header: 'No. Faktur',
        },
        {
            accessorKey: 'tanggal_penjualan',
            header: 'Tanggal Penjualan',
            cell: ({ row }) => {
                return new Date(row.original.tanggal_penjualan)
                    .toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })
                    .replace(/(\w+) (\w+) (\d+)/, '$1 $2, $3');
            },
        },
        {
            accessorKey: 'user.name',
            header: 'User',
            cell: ({ row }) => row.original.user?.name || '-',
        },
    ];

    const renderExpandedRow = (penjualanData: Penjualan) => {
        if (
            !penjualanData.penjualan_detail ||
            penjualanData.penjualan_detail.length === 0
        ) {
            return (
                <div className="p-4 text-center text-muted-foreground">
                    Tidak ada detail penjualan untuk faktur ini
                </div>
            );
        }

        const totalPenjualan = penjualanData.penjualan_detail.reduce(
            (sum, detail) => sum + detail.jumlah_jual * detail.harga_jual,
            0,
        );

        return (
            <div className="p-4">
                <Table>
                    <TableHeader className="border-b">
                        <TableRow>
                            <TableHead className="w-12">No.</TableHead>
                            <TableHead>Nama Obat</TableHead>
                            <TableHead>No. Batch</TableHead>
                            <TableHead>Tanggal Expired</TableHead>
                            <TableHead className="text-center">
                                Jumlah Jual
                            </TableHead>
                            <TableHead className="text-center">
                                Harga Jual
                            </TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {penjualanData.penjualan_detail.map((detail, index) => (
                            <TableRow key={detail.id}>
                                <TableCell className="text-center">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {detail.obat?.nama_obat || '-'}
                                </TableCell>
                                <TableCell>{detail.nomor_batch}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        {new Date(detail.tanggal_expired)
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
                                    {detail.jumlah_jual.toLocaleString('id-ID')}{' '}
                                    {detail.obat?.satuan_kecil?.nama_satuan ||
                                        ''}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(detail.harga_jual)}{' '}
                                    <Badge className="rounded-sm px-1.5 py-px text-[10px]">
                                        per{' '}
                                        {detail.obat?.satuan_kecil
                                            ?.nama_satuan || ''}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(
                                        detail.jumlah_jual * detail.harga_jual,
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                Total
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(totalPenjualan)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Memuat data...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="gap-0">
                <CardTitle>Riwayat Penjualan</CardTitle>
                <CardDescription>
                    Riwayat transaksi penjualan yang telah dilakukan.
                </CardDescription>
            </CardHeader>
            <CardContent className="-mt-4">
                <DataTable
                    data={penjualan}
                    columns={columns}
                    initialPagination={{ pageIndex: 0, pageSize: 10 }}
                    emptyMessage="Belum ada data penjualan"
                    enableRowExpansion
                    renderExpandedRow={renderExpandedRow}
                />
            </CardContent>
        </Card>
    );
}
