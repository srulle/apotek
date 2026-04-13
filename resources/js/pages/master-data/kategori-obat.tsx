import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { OneFieldForm } from '@/components/input/one-field-form';
import { DeleteConfirm } from '@/components/delete-confirm';
import { SimpleDatatable } from '@/components/datatable/simple-datatable';

type KategoriObat = {
    id: number;
    nama_kategori: string;
};

export default function KategoriObat() {
    const { kategoriObat } = usePage<{ kategoriObat: KategoriObat[] }>().props;

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [namaKategori, setNamaKategori] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State untuk edit
    const [editId, setEditId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const editAnchorRef = useRef<HTMLButtonElement>(null);

    // State untuk delete
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const handleEdit = (
        kategori: KategoriObat,
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        setEditId(kategori.id);
        setEditValue(kategori.nama_kategori);
        setEditError(null);
        editAnchorRef.current = event.currentTarget;
    };

    const handleUpdate = (value: string) => {
        if (!editId) return;

        const promise = new Promise((resolve, reject) => {
            router.put(
                `/master-data/kategori-obat/${editId}`,
                { nama_kategori: value },
                {
                    onSuccess: () => {
                        setEditId(null);
                        setEditValue('');
                        resolve(true);
                    },
                    onError: (errors) => {
                        setEditError(
                            errors.nama_kategori || 'Terjadi kesalahan',
                        );
                        reject(new Error(errors.nama_kategori));
                    },
                },
            );
        });

        toast.promise(promise, {
            loading: 'Memperbarui kategori obat...',
            success: 'Kategori obat berhasil diperbarui',
            error: (err) => err.message || 'Gagal memperbarui kategori obat',
        });
    };

    const columns: ColumnDef<KategoriObat>[] = [
        {
            accessorKey: 'nama_kategori',
            header: 'Nama Kategori',
            cell: ({ row }) => {
                const value = row.getValue<string>('nama_kategori');
                return (
                    <div>
                        {value.charAt(0).toUpperCase() +
                            value.slice(1).toLowerCase()}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Aksi</div>,
            cell: ({ row }) => {
                const kategori = row.original;

                return (
                    <div className="flex justify-center gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleEdit(kategori, e)}
                            className="h-6 w-6 cursor-pointer p-2"
                        >
                            <Pencil />
                        </Button>
                        <DeleteConfirm
                            title="Hapus Kategori Obat"
                            description={`Apakah Anda yakin ingin menghapus kategori "${kategori.nama_kategori}"? Tindakan ini tidak dapat dibatalkan.`}
                            isLoading={deleteLoading === kategori.id}
                            onConfirm={() => {
                                setDeleteLoading(kategori.id);

                                const promise = new Promise(
                                    (resolve, reject) => {
                                        router.delete(
                                            `/master-data/kategori-obat/${kategori.id}`,
                                            {
                                                onSuccess: () => {
                                                    setDeleteLoading(null);
                                                    resolve(true);
                                                },
                                                onError: () => {
                                                    setDeleteLoading(null);
                                                    reject(
                                                        new Error(
                                                            'Gagal menghapus kategori obat',
                                                        ),
                                                    );
                                                },
                                            },
                                        );
                                    },
                                );

                                toast.promise(promise, {
                                    loading: 'Menghapus kategori obat...',
                                    success: 'Kategori obat berhasil dihapus',
                                    error: (err) => err.message,
                                });
                            }}
                        >
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 cursor-pointer border-destructive! p-2 text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                            >
                                <Trash2 />
                            </Button>
                        </DeleteConfirm>
                    </div>
                );
            },
        },
    ];

    const handleSubmit = (value: string) => {
        const promise = new Promise((resolve, reject) => {
            router.post(
                '/master-data/kategori-obat',
                { nama_kategori: value },
                {
                    onSuccess: () => {
                        setNamaKategori('');
                        setIsFormOpen(false);
                        resolve(true);
                    },
                    onError: (errors) => {
                        setError(errors.nama_kategori || 'Terjadi kesalahan');
                        reject(new Error(errors.nama_kategori));
                    },
                },
            );
        });

        toast.promise(promise, {
            loading: 'Menambahkan kategori obat...',
            success: 'Kategori obat berhasil ditambahkan',
            error: (err) => err.message || 'Gagal menambahkan kategori obat',
        });
    };

    return (
        <>
            <Head title="Kategori Obat" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-4 md:min-h-min dark:border-sidebar-border">
                    <div className="space-y-2">
                        <h1 className="font-semibold">Kategori Obat</h1>

                        <OneFieldForm
                            open={isFormOpen}
                            onOpenChange={setIsFormOpen}
                            trigger={
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Kategori
                                </Button>
                            }
                            title="Tambah Kategori Obat"
                            label="Nama Kategori"
                            placeholder="Masukkan nama kategori obat"
                            align="start"
                            value={namaKategori}
                            onChange={setNamaKategori}
                            onSubmit={handleSubmit}
                            submitLabel="Simpan"
                            cancelLabel="Batal"
                            error={!!error}
                            errorMessage={error || ''}
                            isLoading={isLoading}
                        />

                        <SimpleDatatable
                            data={kategoriObat || []}
                            columns={columns}
                            pageSize={10}
                            emptyMessage="Belum ada kategori obat"
                            className="max-w-md"
                        />
                    </div>
                </div>
            </div>

            {/* Popover edit dipisah dari table untuk menghindari re-render */}
            <OneFieldForm
                open={editId !== null}
                onOpenChange={(open: boolean) => !open && setEditId(null)}
                title="Ubah Kategori Obat"
                label="Nama Kategori"
                placeholder="Masukkan nama kategori obat"
                value={editValue}
                onChange={setEditValue}
                onSubmit={handleUpdate}
                submitLabel="Simpan"
                cancelLabel="Batal"
                error={!!editError}
                errorMessage={editError || ''}
                isLoading={isEditLoading}
                anchorRef={editAnchorRef}
            />
        </>
    );
}

KategoriObat.layout = {
    breadcrumbs: [
        {
            title: 'Master Data',
            href: null,
        },
        {
            title: 'Kategori Obat',
            href: '/master-data/kategori-obat',
        },
    ],
};
