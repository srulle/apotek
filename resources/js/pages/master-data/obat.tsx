import { Head } from '@inertiajs/react';
import { ClipboardPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Modal } from '@/components/modal';
import { useForm } from '@tanstack/react-form';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';

export default function Obat() {
    const form = useForm({
        defaultValues: {
            nama_obat: '',
            kategori_obat: '',
            satuan_besar: '',
            satuan_kecil: '',
            isi_per_satuan: '',
            harga_jual: '',
        },
        onSubmit: async ({ value }) => {
            console.log(value);
            // Handle form submission here
        },
    });

    return (
        <>
            <Head title="Obat" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-2 md:m-4 md:p-4 dark:border-sidebar-border">
                <div className="space-y-2">
                    <h1 className="font-semibold">Obat</h1>
                    <Modal
                        trigger={
                            <Button className="w-fit">
                                <ClipboardPlus />
                                Tambah Obat
                            </Button>
                        }
                        size="6xl"
                        title="Tambah Data Obat"
                        persistent={true}
                        description="Isi form berikut untuk menambah data obat baru."
                        footer={
                            <>
                                <DialogClose asChild>
                                    <Button variant="outline">Batal</Button>
                                </DialogClose>
                                <form.Subscribe
                                    selector={(state) => [
                                        state.canSubmit,
                                        state.isSubmitting,
                                    ]}
                                >
                                    {([canSubmit, isSubmitting]) => (
                                        <Button
                                            type="submit"
                                            disabled={
                                                !canSubmit || isSubmitting
                                            }
                                            onClick={form.handleSubmit}
                                        >
                                            {isSubmitting
                                                ? 'Menyimpan...'
                                                : 'Simpan'}
                                        </Button>
                                    )}
                                </form.Subscribe>
                            </>
                        }
                    >
                        <div className="grid gap-4 py-4 md:grid-cols-3">
                            {[
                                {
                                    name: 'nama_obat' as const,
                                    label: 'Nama Obat',
                                    placeholder: 'Masukkan nama obat',
                                    required: true,
                                },
                                {
                                    name: 'kategori_obat' as const,
                                    label: 'Kategori Obat',
                                    placeholder: 'Masukkan kategori obat',
                                    required: true,
                                },
                                {
                                    name: 'satuan_besar' as const,
                                    label: 'Satuan Besar',
                                    placeholder: 'Contoh: Botol, Box',
                                    required: true,
                                },
                                {
                                    name: 'satuan_kecil' as const,
                                    label: 'Satuan Kecil',
                                    placeholder: 'Contoh: Tablet, Kapsul',
                                    required: true,
                                },
                                {
                                    name: 'isi_per_satuan' as const,
                                    label: 'Isi Per Satuan',
                                    placeholder: 'Contoh: 10',
                                    type: 'number',
                                    required: true,
                                    isNumber: true,
                                },
                                {
                                    name: 'harga_jual' as const,
                                    label: 'Harga Jual',
                                    placeholder: 'Contoh: 15000',
                                    type: 'number',
                                    required: true,
                                    isNumber: true,
                                },
                            ].map((fieldConfig) => (
                                <form.Field
                                    key={fieldConfig.name}
                                    name={fieldConfig.name}
                                    validators={{
                                        onChange: ({ value }) => {
                                            if (fieldConfig.required && !value)
                                                return `${fieldConfig.label} harus diisi`;
                                            if (
                                                fieldConfig.isNumber &&
                                                value &&
                                                isNaN(Number(value))
                                            )
                                                return 'Harus berupa angka';
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <InputLabelAndHelper
                                            field={field}
                                            label={fieldConfig.label}
                                            placeholder={
                                                fieldConfig.placeholder
                                            }
                                            type={fieldConfig.type}
                                        />
                                    )}
                                </form.Field>
                            ))}
                        </div>
                    </Modal>
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
