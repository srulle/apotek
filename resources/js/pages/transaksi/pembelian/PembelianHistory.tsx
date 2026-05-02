import { usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable from '@/components/datatable/datatable';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

type User = {
    id: number;
    name: string;
};

type Supplier = {
    id: number;
    nama_supplier: string;
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
                    month: 'long',
                    year: 'numeric',
                }).replace(
                    /(\w+) (\w+) (\d+)/,
                    '$1 $2, $3',
                );
            },
        },
        {
            accessorKey: 'user.name',
            header: 'User',
            cell: ({ row }) => row.original.user?.name || '-',
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

        const totalPembelian = pembelianData.pembelian_detail.reduce(
            (sum, detail) => sum + detail.jumlah_beli * detail.harga_beli,
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
                                Jumlah Beli
                            </TableHead>
                            <TableHead className="text-center">
                                Harga Beli
                            </TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pembelianData.pembelian_detail.map((detail, index) => (
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
                                    {detail.jumlah_beli.toLocaleString('id-ID')} {detail.obat?.satuan_kecil?.nama_satuan || ''}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(detail.harga_beli)}{' '}
                                    <Badge className="rounded-sm px-1.5 py-px text-[10px]">
                                        per {detail.obat?.satuan_kecil?.nama_satuan || ''}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(
                                        detail.jumlah_beli * detail.harga_beli,
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
                                }).format(totalPembelian)}
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
                <CardTitle>Riwayat Pembelian</CardTitle>
                <CardDescription>
                    Riwayat transaksi pembelian yang telah dilakukan.
                </CardDescription>
            </CardHeader>
            <CardContent className="-mt-4">
                <DataTable
                    data={pembelian}
                    columns={columns}
                    initialPagination={{ pageIndex: 0, pageSize: 10 }}
                    emptyMessage="Belum ada data pembelian"
                    enableRowExpansion
                    renderExpandedRow={renderExpandedRow}
                />
            </CardContent>
        </Card>
    );
}
