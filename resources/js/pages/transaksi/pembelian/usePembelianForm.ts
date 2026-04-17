import { useState } from 'react';
import { toast } from 'sonner';
import { createSupplier as createSupplierService } from './services/supplierService';

export const usePembelianForm = () => {
    const [tanggalTransaksi, setTanggalTransaksi] = useState<Date | undefined>(
        new Date(),
    );
    const [supplier, setSupplier] = useState<string>('');
    const [selectedObat, setSelectedObat] = useState<(string | number)[]>([]);

    const createSupplier = async (value: string) => {
        const promise = createSupplierService(value);

        toast.promise(promise, {
            loading: 'Menambahkan supplier...',
            success: 'Supplier berhasil ditambahkan',
            error: (err) => err.message,
        });

        return promise;
    };

    const handleSubmit = () => {
        console.log('=== Nilai Form Pembelian ===');
        console.log('Tanggal Transaksi:', tanggalTransaksi);
        console.log('Supplier:', supplier);
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
        tanggalTransaksi,
        setTanggalTransaksi,
        supplier,
        setSupplier,
        selectedObat,
        setSelectedObat,
        createSupplier,
        handleSubmit,
    };
};
