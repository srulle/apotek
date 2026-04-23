import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import { AutoComplete, type Option } from '@/components/input/autocomplete';
import { useState } from 'react';

export default function Dashboard() {
    const [selectedItem, setSelectedItem] = useState<Option | undefined>();

    // Contoh data untuk testing
    const options: Option[] = [
        { value: '1', label: 'Paracetamol 500mg' },
        { value: '2', label: 'Amoxicillin 250mg' },
        { value: '3', label: 'Ibuprofen 400mg' },
        { value: '4', label: 'Omeprazole 20mg' },
        { value: '5', label: 'Cetirizine 10mg' },
        { value: '6', label: 'Loratadine 10mg' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-4 md:m-4 dark:border-sidebar-border">
                <div className="mb-8 max-w-md">
                    <h2 className="mb-4 text-lg font-medium">
                        Contoh AutoComplete
                    </h2>
                    <AutoComplete
                        options={options}
                        placeholder="Cari obat..."
                        emptyMessage="Obat tidak ditemukan"
                        value={selectedItem}
                        onValueChange={(value) => setSelectedItem(value)}
                    />

                    {selectedItem && (
                        <div className="mt-4 rounded-lg bg-muted p-3">
                            <p className="text-sm">
                                Terpilih: {selectedItem.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Value: {selectedItem.value}
                            </p>
                        </div>
                    )}
                </div>

                <PlaceholderPattern />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
