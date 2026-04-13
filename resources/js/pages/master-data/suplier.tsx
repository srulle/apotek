import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { ClipboardPlus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { OneFieldForm } from '@/components/input/one-field-form';
import { DeleteConfirm } from '@/components/delete-confirm';
import { SimpleDatatable } from '@/components/datatable/simple-datatable';

type Suplier = {
    id: number;
    nama_supplier: string;
};

export default function Suplier() {
    const { suplier } = usePage<{ suplier: Suplier[] }>().props;

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [namaSupplier, setNamaSupplier] = useState('');
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
        item: Suplier,
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        setEditId(item.id);
        setEditValue(item.nama_supplier);
        setEditError(null);
        editAnchorRef.current = event.currentTarget;
    };

    const handleUpdate = (value: string) => {
        if (!editId) return;

        const promise = new Promise((resolve, reject) => {
            router.put(
                `/master-data/suplier/${editId}`,
                { nama_supplier: value },
                {
                    onSuccess: () => {
                        setEditId(null);
                        setEditValue('');
                        resolve(true);
                    },
                    onError: (errors) => {
                        setEditError(
                            errors.nama_supplier || 'Terjadi kesalahan',
                        );
                        reject(new Error(errors.nama_supplier));
                    },
                },
            );
        });

        toast.promise(promise, {
            loading: 'Memperbarui suplier...',
            success: 'Suplier berhasil diperbarui',
            error: (err) => err.message || 'Gagal memperbarui suplier',
        });
    };

    const columns: ColumnDef<Suplier>[] = [
        {
            accessorKey: 'nama_supplier',
            header: 'Nama Suplier',
            cell: ({ row }) => {
                const value = row.getValue<string>('nama_supplier');
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
                const item = row.original;

                return (
                    <div className="flex justify-center gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleEdit(item, e)}
                            className="h-6 w-6 cursor-pointer p-2"
                        >
                            <Pencil />
                        </Button>
                        <DeleteConfirm
                            title="Hapus Suplier"
                            description={`Apakah Anda yakin ingin menghapus suplier "${item.nama_supplier}"? Tindakan ini tidak dapat dibatalkan.`}
                            isLoading={deleteLoading === item.id}
                            onConfirm={() => {
                                setDeleteLoading(item.id);

                                const promise = new Promise(
                                    (resolve, reject) => {
                                        router.delete(
                                            `/master-data/suplier/${item.id}`,
                                            {
                                                onSuccess: () => {
                                                    setDeleteLoading(null);
                                                    resolve(true);
                                                },
                                                onError: () => {
                                                    setDeleteLoading(null);
                                                    reject(
                                                        new Error(
                                                            'Gagal menghapus suplier',
                                                        ),
                                                    );
                                                },
                                            },
                                        );
                                    },
                                );

                                toast.promise(promise, {
                                    loading: 'Menghapus suplier...',
                                    success: 'Suplier berhasil dihapus',
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
                '/master-data/suplier',
                { nama_supplier: value },
                {
                    onSuccess: () => {
                        setNamaSupplier('');
                        setIsFormOpen(false);
                        resolve(true);
                    },
                    onError: (errors) => {
                        setError(errors.nama_supplier || 'Terjadi kesalahan');
                        reject(new Error(errors.nama_supplier));
                    },
                },
            );
        });

        toast.promise(promise, {
            loading: 'Menambahkan suplier...',
            success: 'Suplier berhasil ditambahkan',
            error: (err) => err.message || 'Gagal menambahkan suplier',
        });
    };

    return (
        <>
            <Head title="Suplier" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-2 md:m-4 md:p-4 dark:border-sidebar-border">
                <div className="space-y-2">
                    <h1 className="font-semibold">Suplier</h1>

                    <OneFieldForm
                        open={isFormOpen}
                        onOpenChange={setIsFormOpen}
                        trigger={
                            <Button className="w-fit">
                                <ClipboardPlus/>
                                Tambah Suplier
                            </Button>
                        }
                        title="Tambah Suplier"
                        label="Nama Suplier"
                        placeholder="Masukkan nama suplier"
                        align="start"
                        value={namaSupplier}
                        onChange={setNamaSupplier}
                        onSubmit={handleSubmit}
                        submitLabel="Simpan"
                        cancelLabel="Batal"
                        error={!!error}
                        errorMessage={error || ''}
                        isLoading={isLoading}
                    />

                    <SimpleDatatable
                        data={suplier || []}
                        columns={columns}
                        pageSize={10}
                        emptyMessage="Belum ada suplier"
                        className="max-w-md"
                    />
                </div>
            </div>

            {/* Popover edit dipisah dari table untuk menghindari re-render */}
            <OneFieldForm
                open={editId !== null}
                onOpenChange={(open: boolean) => !open && setEditId(null)}
                title="Ubah Suplier"
                label="Nama Suplier"
                placeholder="Masukkan nama suplier"
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

Suplier.layout = {
    breadcrumbs: [
        {
            title: 'Master Data',
            href: null,
        },
        {
            title: 'Suplier',
            href: '/master-data/suplier',
        },
    ],
};
