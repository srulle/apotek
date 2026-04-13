import { Head, router } from '@inertiajs/react';
import { useForm } from '@tanstack/react-form';
import { ClipboardPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';

interface ObatPageProps {
    kategoriObat: string[];
    satuan: string[];
}

export default function Obat({ kategoriObat, satuan }: ObatPageProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);

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
                            <Button
                                className="w-fit"
                                disabled={isRefreshing}
                                onClick={async () => {
                                    setIsRefreshing(true);

                                    try {
                                        await router.reload({
                                            only: ['kategoriObat', 'satuan'],
                                        });
                                    } finally {
                                        setIsRefreshing(false);
                                    }
                                }}
                            >
                                <ClipboardPlus />
                                {isRefreshing ? 'Memuat...' : 'Tambah Obat'}
                            </Button>
                        }
                        size="6xl"
                        title="Tambah Data Obat"
                        persistent={true}
                        description="Isi form berikut untuk menambah data obat baru."
                        onClose={() => form.reset()}
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
                            <form.Field
                                name="nama_obat"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) {
return 'Nama Obat harus diisi';
}
                                    },
                                }}
                            >
                                {(field) => (
                                    <InputLabelAndHelper
                                        field={field}
                                        label="Nama Obat"
                                        placeholder="Masukkan nama obat"
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="kategori_obat"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) {
return 'Kategori Obat harus diisi';
}
                                    },
                                }}
                            >
                                {(field) => (
                                    <ComboboxLabelAndHelper
                                        field={field}
                                        label="Kategori Obat"
                                        placeholder="Pilih atau buat kategori obat"
                                        initialItems={kategoriObat}
                                        creatable={true}
                                        onCreate={async (value) => {
                                            return new Promise(
                                                (resolve, reject) => {
                                                    router.post(
                                                        '/master-data/kategori-obat',
                                                        {
                                                            nama_kategori:
                                                                value,
                                                        },
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                            onSuccess: () => {
                                                                toast.success(
                                                                    'Kategori obat berhasil ditambahkan',
                                                                );
                                                                resolve();
                                                            },
                                                            onError: (
                                                                errors,
                                                            ) => {
                                                                toast.error(
                                                                    errors.nama_kategori ||
                                                                        'Gagal menambahkan kategori obat',
                                                                );
                                                                reject(
                                                                    new Error(
                                                                        errors.nama_kategori,
                                                                    ),
                                                                );
                                                            },
                                                        },
                                                    );
                                                },
                                            );
                                        }}
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="satuan_besar"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) {
return 'Satuan Besar harus diisi';
}
                                    },
                                }}
                            >
                                {(field) => (
                                    <ComboboxLabelAndHelper
                                        field={field}
                                        label="Satuan Besar"
                                        placeholder="Pilih satuan besar"
                                        initialItems={satuan}
                                        creatable={true}
                                        onCreate={async (value) => {
                                            return new Promise(
                                                (resolve, reject) => {
                                                    router.post(
                                                        '/master-data/satuan',
                                                        {
                                                            nama_satuan: value,
                                                        },
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                            onSuccess: () => {
                                                                toast.success(
                                                                    'Satuan berhasil ditambahkan',
                                                                );
                                                                resolve();
                                                            },
                                                            onError: (
                                                                errors,
                                                            ) => {
                                                                toast.error(
                                                                    errors.nama_satuan ||
                                                                        'Gagal menambahkan satuan',
                                                                );
                                                                reject(
                                                                    new Error(
                                                                        errors.nama_satuan,
                                                                    ),
                                                                );
                                                            },
                                                        },
                                                    );
                                                },
                                            );
                                        }}
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="satuan_kecil"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) {
return 'Satuan Kecil harus diisi';
}
                                    },
                                }}
                            >
                                {(field) => (
                                    <ComboboxLabelAndHelper
                                        field={field}
                                        label="Satuan Kecil"
                                        placeholder="Pilih satuan kecil"
                                        initialItems={satuan}
                                        creatable={true}
                                        onCreate={async (value) => {
                                            return new Promise(
                                                (resolve, reject) => {
                                                    router.post(
                                                        '/master-data/satuan',
                                                        {
                                                            nama_satuan: value,
                                                        },
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                            onSuccess: () => {
                                                                toast.success(
                                                                    'Satuan berhasil ditambahkan',
                                                                );
                                                                resolve();
                                                            },
                                                            onError: (
                                                                errors,
                                                            ) => {
                                                                toast.error(
                                                                    errors.nama_satuan ||
                                                                        'Gagal menambahkan satuan',
                                                                );
                                                                reject(
                                                                    new Error(
                                                                        errors.nama_satuan,
                                                                    ),
                                                                );
                                                            },
                                                        },
                                                    );
                                                },
                                            );
                                        }}
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="isi_per_satuan"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) {
return 'Isi Per Satuan harus diisi';
}

                                        if (isNaN(Number(value))) {
return 'Harus berupa angka';
}
                                    },
                                }}
                            >
                                {(field) => (
                                    <InputLabelAndHelper
                                        field={field}
                                        label="Isi Per Satuan"
                                        placeholder="Contoh: 10"
                                        type="number"
                                        helperText="Jumlah satuan kecil yang terdapat dalam 1 satuan besar"
                                    />
                                )}
                            </form.Field>

                            <form.Field
                                name="harga_jual"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) {
return 'Harga Jual harus diisi';
}

                                        if (isNaN(Number(value))) {
return 'Harus berupa angka';
}
                                    },
                                }}
                            >
                                {(field) => (
                                    <InputLabelAndHelper
                                        field={field}
                                        label="Harga Jual"
                                        placeholder="Contoh: 15000"
                                        type="currency"
                                    />
                                )}
                            </form.Field>
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
