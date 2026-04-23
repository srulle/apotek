import { router } from '@inertiajs/react';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { ulid } from 'ulid';
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
    const [selectedObat, setSelectedObat] = useState<
        Array<{ id: number; uniqueId: string }>
    >([]);
    const [obatFormData, setObatFormData] = useState<Record<string, any>>({});
    const [showItemForm, setShowItemForm] = useState(false);

    const form = useForm({
        validators: {
            onSubmit: pembelianFormSchema,
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
            totalHarga: 0,
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

        if (form.state.isValid) {
            setShowItemForm(true);
            console.log('=== Nilai Form Pembelian ===');
            console.log(
                'Form values:',
                JSON.stringify(form.state.values, null, 2),
            );
            console.log(
                'Obat Dipilih:',
                JSON.stringify(
                    selectedObat.map((entry) => ({
                        id: entry.id,
                        uniqueId: entry.uniqueId,
                        jumlah: 1, // default
                        totalHarga: 0, // default
                        batch: '', // default
                        expiredDate: undefined, // default
                        satuan: '', // default
                    })),
                    null,
                    2,
                ),
            );
            console.log('=========================');
        }
    };

    const handleSavePembelian = async () => {
        // Generate ULID UNTUK PK PEMBELIAN HANYA SEKALI DISINI
        const pembelianId = ulid();

        // Prepare HEADER PEMBELIAN - SESUAI FILLABLE Model Pembelian.php
        const header = {
            nomor_faktur: form.getFieldValue('nomorFaktur'),
            supplier_id: form.getFieldValue('supplier'),
            tanggal_pembelian: form.getFieldValue('tanggalTransaksi'),
            user_id: 1,
        };

        // Prepare DETAIL PEMBELIAN - SESUAI FILLABLE Model PembelianDetail.php
        const items = selectedObat.map((entry) => {
            const formData = obatFormData[entry.uniqueId] || {};

            // ✅ Pilih nilai pengali: gunakan konversi jika ada, jika tidak gunakan jumlah_satuan_kecil_dalam_satuan_besar
            const pengali =
                formData.konversi && Number(formData.konversi) > 0
                    ? Number(formData.konversi)
                    : Number(formData.jumlah_satuan_kecil_dalam_satuan_besar) ||
                      1;

            // ✅ Hitung total jumlah beli
            const jumlahTotal = Number(formData.jumlahBeli) * pengali;
            // ✅ Hitung harga per satuan terkecil
            const hargaPerSatuan =
                jumlahTotal > 0 ? Number(formData.totalHarga) / jumlahTotal : 0;

            return {
                pembelian_id: pembelianId,
                obat_id: entry.id,
                nomor_batch: formData.batch,
                tanggal_expired: formData.expiredDate,
                jumlah_beli: jumlahTotal,
                harga_beli: hargaPerSatuan,
            };
        });

        // Data lengkap siap disimpan, PK dan FK 100% sama
        const dataPembelian = {
            header,
            items,
        };

        console.log('✅ Data siap disimpan ke database:');
        console.log('Header Pembelian:');
        console.log(JSON.stringify(header, null, 2));
        console.log('Detail Pembelian:');
        console.log(JSON.stringify(items, null, 2));

        // Kirim data ke backend menggunakan Inertia router
        return new Promise<void>((resolve, reject) => {
            router.post('/transaksi/pembelian', dataPembelian, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Pembelian berhasil disimpan');
                    // Reset form setelah sukses
                    setSelectedObat([]);
                    setObatFormData({});
                    setShowItemForm(false);
                    form.reset();
                    resolve();
                },
                onError: (errors: any) => {
                    console.error('Error saving pembelian:', errors);
                    const errorMessage =
                        errors?.error ||
                        errors?.message ||
                        'Terjadi kesalahan saat menyimpan pembelian';
                    toast.error(errorMessage);
                    reject(new Error(errorMessage));
                },
            });
        });
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
        showItemForm,
        setShowItemForm,
        handleSavePembelian,
    };
};
