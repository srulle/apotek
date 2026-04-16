import { Head, router } from '@inertiajs/react';
import { ClipboardPlus, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ComboboxData from '@/components/combobox-data';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import DatePicker from '@/components/input/datepicker';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transaksi } from '@/routes';

interface PembelianPageProps {
    suplier: string[];
    obat: Array<{
        id: number;
        label: string;
        subtitle: string;
    }>;
}

export default function Transaksi({ suplier, obat }: PembelianPageProps) {
    const [tanggalTransaksi, setTanggalTransaksi] = useState<Date | undefined>(
        new Date(),
    );
    const [supplier, setSupplier] = useState<string>('');
    const [selectedObat, setSelectedObat] = useState<(string | number)[]>([]);

    const createSupplier = async (value: string) => {
        const promise = new Promise<void>((resolve, reject) => {
            router.post(
                '/master-data/suplier',
                {
                    nama_supplier: value,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => resolve(),
                    onError: (errors: any) => {
                        reject(
                            new Error(
                                errors.nama_supplier ||
                                    'Gagal menambahkan supplier',
                            ),
                        );
                    },
                },
            );
        });

        toast.promise(promise, {
            loading: 'Menambahkan supplier...',
            success: 'Supplier berhasil ditambahkan',
            error: (err) => err.message,
        });

        return promise;
    };

    const handleSubmit = () => {
        console.log('=== Nilai Form Pembelian ===');
        console.log('Tanggal Transaksi:', tanggalTransaksi);
        console.log('Supplier:', supplier);
        console.log('Obat Dipilih:', selectedObat);
        console.log('=========================');
    };

    return (
        <>
            <Head title="Pembelian" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-2 md:m-4 md:p-4 dark:border-sidebar-border">
                <div className="max-w-4xl space-y-2">
                    <Tabs defaultValue="tambah" className="w-full">
                        <TabsList>
                            <TabsTrigger value="tambah" className="gap-2">
                                <ClipboardPlus className="size-4" />
                                Tambah Baru
                            </TabsTrigger>
                            <TabsTrigger value="daftar" className="gap-2">
                                <ClipboardList className="size-4" />
                                Daftar Pembelian
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tambah">
                            <Card className="gap-4">
                                <CardHeader className="gap-0">
                                    <CardTitle>Tambah Pembelian Baru</CardTitle>
                                    <CardDescription className="text-sm italic">
                                        Input transaksi pembelian barang baru ke
                                        sistem.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
                                        <div>
                                            <label className="mb-1.5 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Tanggal Transaksi
                                            </label>
                                            <DatePicker
                                                value={tanggalTransaksi}
                                                onChange={setTanggalTransaksi}
                                                placeholder="Pilih tanggal transaksi"
                                            />
                                        </div>

                                        <ComboboxLabelAndHelper
                                            label="Supplier"
                                            placeholder="Pilih supplier"
                                            initialItems={suplier}
                                            value={supplier}
                                            onValueChange={setSupplier}
                                            creatable={true}
                                            onCreate={createSupplier}
                                        />

                                        <Button
                                            className="w-full"
                                            onClick={handleSubmit}
                                        >
                                            Tampilkan Nilai
                                        </Button>
                                    </div>

                                    <div className="mt-4">
                                        <ComboboxData
                                            label="Pilih Obat"
                                            items={obat}
                                            value={selectedObat}
                                            onChange={(value) =>
                                                setSelectedObat(
                                                    Array.isArray(value)
                                                        ? value
                                                        : [],
                                                )
                                            }
                                            placeholder="Pilih obat yang akan dibeli"
                                            searchPlaceholder="Cari nama obat..."
                                            className="w-full"
                                            multiple={true}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="daftar">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Daftar Pembelian</CardTitle>
                                    <CardDescription>
                                        Lihat dan kelola semua transaksi
                                        pembelian barang.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Menampilkan daftar semua transaksi
                                    pembelian.
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}

Transaksi.layout = {
    breadcrumbs: [
        {
            title: 'Transaksi',
            href: transaksi().url,
        },
        {
            title: 'Pembelian',
        },
    ],
};
