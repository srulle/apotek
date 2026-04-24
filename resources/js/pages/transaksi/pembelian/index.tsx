import { Head } from '@inertiajs/react';
import { ClipboardPlus, ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transaksi } from '@/routes';
import PembelianForm from './PembelianForm';
import PembelianHistory from './PembelianHistory';

interface PembelianPageProps {
    suppliers: Array<{ id: number; nama_supplier: string }>;
    obat: Array<{
        title: string;
        items: Array<{
            id: number;
            label: string;
            subtitle: string;
            satuan_besar?: string;
            satuan_kecil?: string;
            jumlah_satuan_kecil_dalam_satuan_besar?: number;
            stok?: Array<{
                id: number;
                nomor_batch: string;
                tanggal_expired: string;
                stok: number;
            }>;
        }>;
    }>;
    satuan: string[];
}

export default function Transaksi({
    suppliers,
    obat,
    satuan,
}: PembelianPageProps) {
    return (
        <>
            <Head title="Pembelian" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-2 md:m-4 md:p-4 dark:border-sidebar-border">
                <div className="max-w-5xl space-y-2">
                    <Tabs defaultValue="tambah" className="w-full">
                        <TabsList>
                            <TabsTrigger value="tambah" className="gap-2">
                                <ClipboardPlus className="size-4" />
                                Tambah Baru
                            </TabsTrigger>
                            <TabsTrigger value="daftar" className="gap-2">
                                <ClipboardList className="size-4" />
                                Riwayat Pembelian
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tambah">
                            <PembelianForm
                                suppliers={suppliers}
                                obat={obat}
                                satuan={satuan}
                            />
                        </TabsContent>
                        <TabsContent value="daftar">
                            <PembelianHistory />
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
