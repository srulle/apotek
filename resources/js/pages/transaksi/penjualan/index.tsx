import { Head } from '@inertiajs/react';
import { ClipboardPlus, ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transaksi } from '@/routes';
import PenjualanForm from './PenjualanForm';
import PenjualanHistory from './PenjualanHistory';

interface PenjualanPageProps {
    obat: Array<{
        title: string;
        items: Array<{
            id: number;
            label: string;
            subtitle: string;
            satuan_besar?: string;
            satuan_kecil?: string;
        }>;
    }>;
    satuan: string[];
}

export default function Transaksi({ obat, satuan }: PenjualanPageProps) {
    return (
        <>
            <Head title="Penjualan" />
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
                                Riwayat Penjualan
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tambah">
                            <PenjualanForm obat={obat} satuan={satuan} />
                        </TabsContent>
                        <TabsContent value="daftar">
                            <PenjualanHistory />
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
            title: 'Penjualan',
        },
    ],
};
