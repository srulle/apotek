import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@tanstack/react-form';
import type { ColumnDef } from '@tanstack/react-table';
import { ClipboardPlus, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import DataTable from '@/components/datatable/datatable';
import { DeleteConfirm } from '@/components/confirm-action';
import { Modal } from '@/components/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import TambahObatForm from './tambah-obat-form';

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
    satuan_penjualan_id: number;
    jumlah_satuan_kecil_dalam_satuan_besar: number;
    jumlah_satuan_kecil_dalam_satuan_penjualan: number;
    harga_jual: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    kategori: Kategori;
    satuan_besar: Satuan;
    satuan_kecil: Satuan;
    satuan_penjualan: Satuan;
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
            meta: {
                filterable: true,
            },
        },
        {
            accessorKey: 'satuan_kecil.nama_satuan',
            header: 'Satuan Kecil',
            cell: ({ row }) => row.original.satuan_kecil?.nama_satuan || '-',
        },
        {
            accessorKey: 'satuan_besar.nama_satuan',
            header: 'Satuan Besar',
            cell: ({ row }) => {
                const satuanBesar =
                    row.original.satuan_besar?.nama_satuan || '-';
                const jumlah =
                    row.original.jumlah_satuan_kecil_dalam_satuan_besar;
                const satuanKecil =
                    row.original.satuan_kecil?.nama_satuan || '-';

                return (
                    <div className="flex items-center gap-2">
                        {satuanBesar}
                        <Badge className="rounded-sm px-1.5 py-px text-[10px]">
                            {jumlah} {satuanKecil}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: 'satuan_penjualan.nama_satuan',
            header: 'Satuan Penjualan',
            cell: ({ row }) => {
                const satuanPenjualan =
                    row.original.satuan_penjualan?.nama_satuan || '-';
                const jumlah =
                    row.original.jumlah_satuan_kecil_dalam_satuan_penjualan;
                const satuanKecil =
                    row.original.satuan_kecil?.nama_satuan || '-';

                return (
                    <div className="flex items-center gap-2">
                        {satuanPenjualan}
                        <Badge className="rounded-sm px-1.5 py-px text-[10px]">
                            {jumlah} {satuanKecil}
                        </Badge>
                    </div>
                );
            },
        },

        {
            accessorKey: 'harga_jual',
            header: 'Harga Jual',
            meta: {
                sortIconType: 'numeric',
            },
            cell: ({ row }) => {
                const harga = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(row.original.harga_jual);
                const satuanKecil =
                    row.original.satuan_kecil?.nama_satuan || '-';

                return (
                    <div className="flex items-center gap-2">
                        {harga}
                        <Badge className="rounded-sm px-1.5 py-px text-[10px]">
                            per {satuanKecil}
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Aksi</div>,
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex justify-center gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                            className="h-6 w-6 cursor-pointer p-2"
                        >
                            <Pencil size={14} />
                        </Button>
                        <DeleteConfirm
                            title="Hapus Obat"
                            description={`Apakah Anda yakin ingin menghapus obat "${item.nama_obat}"? Tindakan ini tidak dapat dibatalkan.`}
                            isLoading={deleteLoading === item.id}
                            onConfirm={() => {
                                setDeleteLoading(item.id);

                                const promise = new Promise(
                                    (resolve, reject) => {
                                        router.delete(
                                            `/master-data/obat/${item.id}`,
                                            {
                                                onSuccess: () => {
                                                    setDeleteLoading(null);
                                                    resolve(true);
                                                },
                                                onError: (errors) => {
                                                    setDeleteLoading(null);
                                                    reject(
                                                        new Error(
                                                            errors.error ||
                                                                'Gagal menghapus obat',
                                                        ),
                                                    );
                                                },
                                            },
                                        );
                                    },
                                );

                                toast.promise(promise, {
                                    loading: 'Menghapus obat...',
                                    success: 'Obat berhasil dihapus',
                                    error: (err) => err.message,
                                });
                            }}
                        >
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 cursor-pointer border-destructive! p-2 text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                            >
                                <Trash2 size={14} />
                            </Button>
                        </DeleteConfirm>
                    </div>
                );
            },
        },
    ];
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedObat, setSelectedObat] = useState<Obat[]>([]);
    const [editObat, setEditObat] = useState<Obat | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State untuk delete
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

    const createItem = async (
        url: string,
        data: Record<string, any>,
        successMessage: string,
        loadingMessage: string,
        errorKey: string,
    ) => {
        const promise = new Promise<void>((resolve, reject) => {
            router.post(url, data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: (errors: any) => {
                    reject(
                        new Error(
                            errors[errorKey] || `Gagal menambahkan ${errorKey}`,
                        ),
                    );
                },
            });
        });

        toast.promise(promise, {
            loading: loadingMessage,
            success: successMessage,
            error: (err) => err.message,
        });

        return promise;
    };

    const handleEdit = (obat: Obat) => {
        setEditObat(obat);
        setIsModalOpen(true);
    };

    const handleBulkDelete = async () => {
        if (selectedObat.length === 0) {
            return;
        }

        setBulkDeleteLoading(true);

        const deletePromises = selectedObat.map(
            (obat) =>
                new Promise<void>((resolve, reject) => {
                    router.delete(`/master-data/obat/${obat.id}`, {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: () => resolve(),
                        onError: (errors) => {
                            reject(
                                new Error(
                                    errors.error ||
                                        `Gagal menghapus obat ${obat.nama_obat}`,
                                ),
                            );
                        },
                    });
                }),
        );

        const promise = Promise.all(deletePromises).then(() => {
            setSelectedObat([]);
        });

        toast.promise(promise, {
            loading: `Menghapus ${selectedObat.length} obat...`,
            success: `${selectedObat.length} obat berhasil dihapus`,
            error: (err) => err.message,
        });

        try {
            await promise;
        } finally {
            setBulkDeleteLoading(false);
        }
    };

    useEffect(() => {
        if (isModalOpen && editObat) {
            form.reset({
                nama_obat: editObat.nama_obat,
                kategori_obat: editObat.kategori.nama_kategori,
                satuan_besar: editObat.satuan_besar.nama_satuan,
                satuan_kecil: editObat.satuan_kecil.nama_satuan,
                satuan_penjualan: editObat.satuan_penjualan.nama_satuan,
                jumlah_satuan_kecil_dalam_satuan_besar:
                    editObat.jumlah_satuan_kecil_dalam_satuan_besar.toString(),
                jumlah_satuan_kecil_dalam_satuan_penjualan:
                    editObat.jumlah_satuan_kecil_dalam_satuan_penjualan.toString(),
                harga_jual: editObat.harga_jual.toString(),
            });
        }
    }, [isModalOpen, editObat]);

    const form = useForm({
        defaultValues: {
            nama_obat: '',
            kategori_obat: '',
            satuan_besar: '',
            satuan_kecil: '',
            satuan_penjualan: '',
            jumlah_satuan_kecil_dalam_satuan_besar: '',
            jumlah_satuan_kecil_dalam_satuan_penjualan: '',
            harga_jual: '',
        },
        onSubmit: async ({ value }) => {
            const method = editObat ? 'put' : 'post';
            const url = editObat
                ? `/master-data/obat/${editObat.id}`
                : '/master-data/obat';

            const promise = new Promise<void>((resolve, reject) => {
                router[method](url, value, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        form.reset();
                        setEditObat(null);
                        setIsModalOpen(false);
                        resolve();
                    },
                    onError: (errors: any) => {
                        const errorMessage =
                            Object.values(errors).join(', ') ||
                            (editObat
                                ? 'Gagal memperbarui obat'
                                : 'Gagal menambahkan obat');
                        reject(new Error(errorMessage));
                    },
                });
            });

            toast.promise(promise, {
                loading: editObat
                    ? 'Memperbarui data obat...'
                    : 'Menambahkan data obat...',
                success: editObat
                    ? 'Obat berhasil diperbarui'
                    : 'Obat berhasil ditambahkan',
                error: (err) =>
                    err.message ||
                    (editObat
                        ? 'Gagal memperbarui obat'
                        : 'Gagal menambahkan obat'),
            });

            return promise;
        },
    });

    return (
        <>
            <Head title="Obat" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-2 md:m-4 md:p-4 dark:border-sidebar-border">
                <div className="space-y-2">
                    <h1 className="font-semibold">Obat</h1>
                    <Modal
                        open={isModalOpen}
                        onOpenChange={(open) => {
                            setIsModalOpen(open);

                            if (!open) {
                                setEditObat(null);
                                form.reset();
                            }
                        }}
                        trigger={
                            <Button
                                className="w-fit cursor-pointer"
                                disabled={isRefreshing}
                                onClick={async () => {
                                    setIsRefreshing(true);

                                    try {
                                        await router.reload({
                                            only: ['kategoriObat', 'satuan'],
                                        });
                                        setEditObat(null);
                                        form.reset();
                                        setIsModalOpen(true);
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
                        blur="xs"
                        title={editObat ? 'Ubah Data Obat' : 'Tambah Data Obat'}
                        persistent={true}
                        description={
                            editObat
                                ? 'Ubah data obat yang dipilih.'
                                : 'Isi form berikut untuk menambah data obat baru.'
                        }
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
                                                ? editObat
                                                    ? 'Memperbarui...'
                                                    : 'Menyimpan...'
                                                : editObat
                                                  ? 'Simpan Perubahan'
                                                  : 'Simpan'}
                                        </Button>
                                    )}
                                </form.Subscribe>
                            </>
                        }
                    >
                        <TambahObatForm
                            form={form}
                            kategoriObat={kategoriObat}
                            satuan={satuan}
                            createItem={createItem}
                        />
                    </Modal>

                    <div className="mt-4">
                        <DataTable
                            data={obat || []}
                            columns={columns}
                            initialPagination={{ pageIndex: 0, pageSize: 10 }}
                            emptyMessage="Belum ada data obat"
                            enableRowSelection
                            enableGlobalFilter
                            searchPlaceholder="Cari nama obat, kategori, satuan..."
                            onSelectionChange={setSelectedObat}
                            enableBulkDelete
                            onBulkDelete={handleBulkDelete}
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
