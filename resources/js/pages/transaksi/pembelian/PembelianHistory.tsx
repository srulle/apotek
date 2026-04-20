import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function PembelianHistory() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Riwayat Pembelian</CardTitle>
                <CardDescription>
                    Lihat dan kelola riwayat transaksi pembelian barang.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                Menampilkan riwayat semua transaksi pembelian.
            </CardContent>
        </Card>
    );
}
