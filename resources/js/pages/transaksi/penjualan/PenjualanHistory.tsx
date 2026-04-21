'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function PenjualanHistory() {
    return (
        <Card className="gap-4">
            <CardHeader className="gap-0">
                <CardTitle>Riwayat Penjualan</CardTitle>
                <CardDescription className="text-sm italic">
                    Daftar semua transaksi penjualan yang telah dilakukan.
                </CardDescription>
            </CardHeader>
            <CardContent className="rounded-xl border border-dashed p-4 text-center text-muted-foreground">
                Riwayat Penjualan (Placeholder)
            </CardContent>
        </Card>
    );
}
