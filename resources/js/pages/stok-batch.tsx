import { Head } from '@inertiajs/react';
import { stokBatch } from '@/routes';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

export default function StokBatch() {
    return (
        <>
            <Head title="Stok Batch" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-2 md:min-h-min dark:border-sidebar-border">
                    Stok Batch
                </div>
            </div>
        </>
    );
}

StokBatch.layout = {
    breadcrumbs: [
        {
            title: 'Stok Batch',
            href: stokBatch(),
        },
    ],
};
