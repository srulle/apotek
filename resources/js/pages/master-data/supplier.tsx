import { Head, router, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ClipboardPlus, Pencil, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { SimpleDatatable } from '@/components/datatable/datatable';
import { DeleteConfirm } from '@/components/delete-confirm';
import { OneFieldForm } from '@/components/input/one-field-form';
import { Button } from '@/components/ui/button';

type Supplier = {
    id: number;
    nama_supplier: string;
};

export default function Supplier() {
    const { suppliers } = usePage<{ suppliers: Supplier[] }>().props;

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
        item: Supplier,
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        setEditId(item.id);
        setEditValue(item.nama_supplier);
        setEditError(null);
        editAnchorRef.current = event.currentTarget;
    };

    const handleUpdate = (value: string) => {
        if (!editId) {
            return;
        }

        const promise = new Promise((resolve, reject) => {
            router.put(
                `/master-data/supplier/${editId}`,
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
            loading: 'Memperbarui supplier...',
            success: 'Supplier berhasil diperbarui',
            error: (err) => err.message || 'Gagal memperbarui supplier',
        });
    };

    const columns: ColumnDef<Supplier>[] = [
        {
            accessorKey: 'nama_supplier',
            header: 'Nama Supplier',
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
                            title="Hapus Supplier"
                            description={`Apakah Anda yakin ingin menghapus supplier "${item.nama_supplier}"? Tindakan ini tidak dapat dibatalkan.`}
                            isLoading={deleteLoading === item.id}
                            onConfirm={() => {
                                setDeleteLoading(item.id);

                                const promise = new Promise(
                                    (resolve, reject) => {
                                        router.delete(
                                            `/master-data/supplier/${item.id}`,
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
                                                                'Gagal menghapus supplier',
                                                        ),
                                                    );
                                                },
                                            },
                                        );
                                    },
                                );

                                toast.promise(promise, {
                                    loading: 'Menghapus supplier...',
                                    success: 'Supplier berhasil dihapus',
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
                '/master-data/supplier',
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
            loading: 'Menambahkan supplier...',
            success: 'Supplier berhasil ditambahkan',
            error: (err) => err.message || 'Gagal menambahkan supplier',
        });
    };

    return (
        <>
            <Head title="Supplier" />
            <div className="m-2 flex flex-1 flex-col overflow-auto rounded-xl border border-sidebar-border/70 p-2 md:m-4 md:p-4 dark:border-sidebar-border">
                <div className="space-y-2">
                    <h1 className="font-semibold">Supplier</h1>

                    <OneFieldForm
                        open={isFormOpen}
                        onOpenChange={setIsFormOpen}
                        trigger={
                            <Button className="w-fit">
                                <ClipboardPlus />
                                Tambah Supplier
                            </Button>
                        }
                        title="Tambah Supplier"
                        label="Nama Supplier"
                        placeholder="Masukkan nama supplier"
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
                        data={suppliers || []}
                        columns={columns}
                        pageSize={10}
                        emptyMessage="Belum ada supplier"
                        className="max-w-md"
                    />
                </div>
            </div>

            {/* Popover edit dipisah dari table untuk menghindari re-render */}
            <OneFieldForm
                open={editId !== null}
                onOpenChange={(open: boolean) => !open && setEditId(null)}
                title="Ubah Supplier"
                label="Nama Supplier"
                placeholder="Masukkan nama supplier"
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

Supplier.layout = {
    breadcrumbs: [
        {
            title: 'Master Data',
            href: null,
        },
        {
            title: 'Supplier',
            href: '/master-data/supplier',
        },
    ],
};
