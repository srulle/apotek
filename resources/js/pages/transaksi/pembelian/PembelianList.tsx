import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function PembelianList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Daftar Pembelian</CardTitle>
                <CardDescription>
                    Lihat dan kelola semua transaksi pembelian barang.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                Menampilkan daftar semua transaksi pembelian.
            </CardContent>
        </Card>
    );
}
