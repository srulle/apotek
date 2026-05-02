import { router } from '@inertiajs/react';

export const createSupplier = async (namaSupplier: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        router.post(
            '/master-data/supplier',
            {
                nama_supplier: namaSupplier,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: (errors: any) => {
                    reject(
                        new Error(
                            errors.nama_supplier ||
                                'Gagal menambahkan supplier',
                        ),
                    );
                },
            },
        );
    });
};
