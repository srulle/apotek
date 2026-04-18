import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { createSupplier as createSupplierService } from './services/supplierService';

const pembelianFormSchema = z.object({
    tanggalTransaksi: z.date({
        required_error: 'Tanggal transaksi wajib dipilih',
    }),
    nomorFaktur: z.string().min(3, 'Nomor faktur minimal 3 karakter'),
    supplier: z.string().min(1, 'Supplier wajib dipilih'),
});

export const usePembelianForm = () => {
    const [selectedObat, setSelectedObat] = useState<(string | number)[]>([]);
    const [obatFormData, setObatFormData] = useState<
        Record<string | number, any>
    >({});

    const form = useForm({
        validatorAdapter: zodValidator(),
        validators: {
            onChange: pembelianFormSchema,
        },
        defaultValues: {
            tanggalTransaksi: new Date(),
            nomorFaktur: '',
            supplier: '',
        },
    });

    const obatDetailForm = useForm({
        defaultValues: {
            batch: '',
            expiredDate: undefined,
            satuan: '',
            jumlah: 1,
            hargaBeli: 0,
            konversi: 0,
        },
    });

    const createSupplier = async (value: string) => {
        const promise = createSupplierService(value);

        toast.promise(promise, {
            loading: 'Menambahkan supplier...',
            success: 'Supplier berhasil ditambahkan',
            error: (err) => err.message,
        });

        return promise;
    };

    const handleSubmit = async () => {
        await form.handleSubmit();
        console.log('=== Nilai Form Pembelian ===');
        console.log('Tanggal Transaksi:', form.state.values.tanggalTransaksi);
        console.log('Nomor Faktur:', form.state.values.nomorFaktur);
        console.log('Supplier:', form.state.values.supplier);
        console.log(
            'Obat Dipilih:',
            selectedObat.map((id) => ({
                id: id as number,
                jumlah: 1, // default
                hargaBeli: 0, // default
                batch: '', // default
                expiredDate: undefined, // default
                satuan: '', // default
            })),
        );
        console.log('=========================');
    };

    return {
        form,
        selectedObat,
        setSelectedObat,
        obatFormData,
        setObatFormData,
        obatDetailForm,
        createSupplier,
        handleSubmit,
    };
};
