import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { transaksi } from '@/routes';

export default function Transaksi() {
    return (
        <>
            <Head title="Transaksi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">                
                <div className="relative p-2 min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                Transaksi
                </div>
            </div>
        </>
    );
}

Transaksi.layout = {
    breadcrumbs: [
        {
            title: 'Transaksi',
            href: transaksi(),
        },
    ],
};
