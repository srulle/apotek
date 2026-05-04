import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AutoComplete } from '@/components/input/autocomplete-standalone';
import type { Option } from '@/components/input/autocomplete-standalone';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
// import { dashboard } from '@/routes';

export default function Dashboard() {
    const [selectedItem, setSelectedItem] = useState<Option | undefined>();
    const [selectedItemIntegrated, setSelectedItemIntegrated] = useState<
        Option | undefined
    >();
    const [selectedComboboxNative, setSelectedComboboxNative] = useState<
        string | undefined
    >();

    // Contoh data untuk testing
    const options: Option[] = [
        { value: '1', label: 'Paracetamol 500mg' },
        { value: '2', label: 'Amoxicillin 250mg' },
        { value: '3', label: 'Ibuprofen 400mg' },
        { value: '4', label: 'Omeprazole 20mg' },
        { value: '5', label: 'Cetirizine 10mg' },
        { value: '6', label: 'Loratadine 10mg' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Standalone Autocomplete value:', selectedItem);
        console.log('Integrated Autocomplete value:', selectedItemIntegrated);
        console.log('Combobox Native value:', selectedComboboxNative);
        alert('Nilai sudah di cetak di console browser');
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-4 md:m-4 dark:border-sidebar-border">
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 max-w-md space-y-8"
                >
                    <div>
                        <h2 className="mb-4 text-lg font-medium">
                            AutoComplete Standalone (Lama)
                        </h2>
                        <AutoComplete
                            label="Standalone Component"
                            helperText="Ini adalah komponen autocomplete terpisah"
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

                    <div>
                        <h2 className="mb-4 text-lg font-medium">
                            AutoComplete di InputLabelAndHelper (Baru)
                        </h2>
                        <InputLabelAndHelper
                            type="autocomplete"
                            label="Integrated with InputLabelAndHelper"
                            helperText="Ini adalah fitur autocomplete sebagai prop di InputLabelAndHelper"
                            placeholder="Cari obat..."
                            autocompleteOptions={options}
                            autocompleteEmptyMessage="Obat tidak ditemukan"
                            autocompleteValue={selectedItemIntegrated}
                            onAutocompleteSelect={(value) =>
                                setSelectedItemIntegrated(value)
                            }
                        />

                        {selectedItemIntegrated && (
                            <div className="mt-4 rounded-lg bg-muted p-3">
                                <p className="text-sm">
                                    Terpilih: {selectedItemIntegrated.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Value: {selectedItemIntegrated.value}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="mb-4 text-lg font-medium">
                            Combobox (searchable={false})
                        </h2>
                        <ComboboxLabelAndHelper
                            label="Combobox Native Component"
                            helperText="Ini adalah komponen combobox tanpa input dan tanpa creatable"
                            placeholder="Pilih obat..."
                            initialItems={options}
                            searchable={false}
                            value={selectedComboboxNative}
                            onValueChange={(value) =>
                                setSelectedComboboxNative(value)
                            }
                        />

                        {selectedComboboxNative && (
                            <div className="mt-4 rounded-lg bg-muted p-3">
                                <p className="text-sm">
                                    Terpilih: {selectedComboboxNative}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
                    >
                        Submit & Log Values
                    </button>
                </form>

                <PlaceholderPattern />
            </div>
        </>
    );
}

// Dashboard.layout = {
//     breadcrumbs: [
//         {
//             title: 'Dashboard',
//             href: dashboard(),
//         },
//     ],
// };
