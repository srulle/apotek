import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { transaksi } from '@/routes';
import { ClipboardPlus, ClipboardList } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Transaksi() {
    return (
        <>
            <Head title="Pembelian" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-4 md:min-h-min dark:border-sidebar-border">
                    <Tabs defaultValue="daftar" className="w-full">
                        <TabsList>
                            <TabsTrigger value="daftar" className="gap-2">
                                <ClipboardList className="size-4" />
                                Daftar Pembelian
                            </TabsTrigger>
                            <TabsTrigger value="tambah" className="gap-2">
                                <ClipboardPlus className="size-4" />
                                Tambah Baru
                            </TabsTrigger>
                        </TabsList>
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
                        <TabsContent value="tambah">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tambah Pembelian Baru</CardTitle>
                                    <CardDescription>
                                        Input transaksi pembelian barang baru ke
                                        sistem.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Form untuk menambahkan transaksi pembelian
                                    baru.
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
