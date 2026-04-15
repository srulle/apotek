import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@tanstack/react-form';
import type { ColumnDef } from '@tanstack/react-table';
import { ClipboardPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DataTable from '@/components/datatable/datatable';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';

type Kategori = {
    id: number;
    nama_kategori: string;
};

type Satuan = {
    id: number;
    nama_satuan: string;
};

type Obat = {
    id: number;
    nama_obat: string;
    kategori_id: number;
    satuan_besar_id: number;
    satuan_kecil_id: number;
    isi_per_satuan: number;
    harga_jual: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    kategori: Kategori;
    satuan_besar: Satuan;
    satuan_kecil: Satuan;
};

interface ObatPageProps {
    obat: Obat[];
    kategoriObat: string[];
    satuan: string[];
}

export default function Obat({ kategoriObat, satuan }: ObatPageProps) {
    const pageProps = usePage().props as unknown as ObatPageProps;
    const obat = pageProps.obat;

    const columns: ColumnDef<Obat>[] = [
        {
            accessorKey: 'nama_obat',
            header: 'Nama Obat',
        },
        {
            accessorKey: 'kategori.nama_kategori',
            header: 'Kategori Obat',
            cell: ({ row }) => row.original.kategori?.nama_kategori || '-',
        },
        {
            accessorKey: 'satuan_besar.nama_satuan',
            header: 'Satuan Besar',
            cell: ({ row }) => row.original.satuan_besar?.nama_satuan || '-',
        },
        {
            accessorKey: 'satuan_kecil.nama_satuan',
            header: 'Satuan Kecil',
            cell: ({ row }) => row.original.satuan_kecil?.nama_satuan || '-',
        },
        {
            accessorKey: 'isi_per_satuan',
            header: 'Isi',
        },
        {
            accessorKey: 'harga_jual',
            header: 'Harga Jual',
            cell: ({ row }) => {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                }).format(row.original.harga_jual);
            },
        },
    ];
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedObat, setSelectedObat] = useState<Obat[]>([]);

    const createItem = async (
        url: string,
        data: Record<string, any>,
        successMessage: string,
        errorKey: string,
    ) => {
        return new Promise<void>((resolve, reject) => {
            router.post(url, data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(successMessage);
                    resolve();
                },
                onError: (errors: any) => {
                    toast.error(
                        errors[errorKey] || `Gagal menambahkan ${errorKey}`,
                    );
                    reject(new Error(errors[errorKey]));
                },
            });
        });
    };

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
            return new Promise<void>((resolve, reject) => {
                router.post('/master-data/obat', value, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Obat berhasil ditambahkan');
                        form.reset();
                        resolve();
                    },
                    onError: (errors: any) => {
                        const errorMessage =
                            Object.values(errors).join(', ') ||
                            'Gagal menambahkan obat';
                        toast.error(errorMessage);
                        reject(new Error(errorMessage));
                    },
                });
            });
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
                                        onCreate={(value) =>
                                            createItem(
                                                '/master-data/kategori-obat',
                                                { nama_kategori: value },
                                                'Kategori obat berhasil ditambahkan',
                                                'nama_kategori',
                                            )
                                        }
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

                    <div className="mt-6">
                        {selectedObat.length > 0 && (
                            <div className="mb-4 flex items-center gap-2 rounded-md bg-muted p-2">
                                <span className="text-sm text-muted-foreground">
                                    {selectedObat.length} data terpilih
                                </span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="ml-auto"
                                >
                                    Hapus Terpilih
                                </Button>
                            </div>
                        )}
                        <DataTable
                            data={obat || []}
                            columns={columns}
                            initialPagination={{ pageIndex: 0, pageSize: 10 }}
                            emptyMessage="Belum ada data obat"
                            enableRowSelection
                            onSelectionChange={setSelectedObat}
                        />
                    </div>
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
