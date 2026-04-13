import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { DeleteConfirm } from '@/components/delete-confirm';
import { PopoverCustom } from '@/components/popover-custom';

export default function Obat() {
    return (
        <>
            <Head title="Obat" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex gap-2">
                    {/* Contoh penggunaan DeleteConfirm */}
                    <DeleteConfirm onConfirm={() => alert('Item dihapus!')}>
                        <Button variant="destructive">Hapus Obat</Button>
                    </DeleteConfirm>

                    {/* Contoh penggunaan PopoverCustom */}
                    <PopoverCustom
                        title="Detail Obat"
                        content={
                            <p className="text-sm text-muted-foreground">
                                Informasi detail mengenai obat ini termasuk
                                dosis, efek samping, dan aturan pakai.
                            </p>
                        }
                        width="w-96"
                    >
                        <Button variant="outline">Lihat Detail</Button>
                    </PopoverCustom>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-2 md:min-h-min dark:border-sidebar-border">
                    Obat
                </div>
            </div>
        </>
    );
}

Obat.layout = {
    breadcrumbs: [
        {
            title: 'Master Data',
            href: '#',
        },
        {
            title: 'Obat',
            href: '/master-data/obat',
        },
    ],
};
