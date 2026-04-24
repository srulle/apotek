'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import type { ComboboxItem } from '@/components/combobox-data/types';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import DatePicker from '@/components/input/datepicker';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';
import { Button } from '@/components/ui/button';

interface SalesItemDetailFormProps {
    item: ComboboxItem & {
        satuan_besar?: string;
        satuan_kecil?: string;
        isi_per_satuan?: number;
        stok?: Array<{
            id: number;
            nomor_batch: string;
            tanggal_expired: string;
            stok: number;
        }>;
    };
    onSelectItem: (data: any) => void;
    onClosePopover: () => void;
    satuan?: string[];
}

const SalesItemDetailForm = ({
    item,
    onSelectItem,
    onClosePopover,
    satuan = [],
}: SalesItemDetailFormProps) => {
    const penjualanDetailSchema = z.object({
        batch: z.string().min(1, 'Nomor batch wajib diisi'),
        expiredDate: z.date({
            required_error: 'Tanggal kadaluarsa wajib dipilih',
        }),
        satuan: z.string().min(1, 'Satuan wajib dipilih'),
        isiSatuan: z.coerce.number().min(1, 'Isi satuan minimal 1'),
        jumlahJual: z.coerce.number().int().min(1, 'Jumlah minimal 1'),
        hargaJual: z.coerce.number().min(1, 'Harga jual wajib diisi'),
    });

    const form = useForm({
        defaultValues: {
            batch: '',
            expiredDate: new Date(),
            satuan: item.satuan_besar || '',
            isiSatuan: item.isi_per_satuan || 1,
            jumlahJual: 1,
            hargaJual: 0,
        },
        onSubmit: async ({ value }) => {
            onSelectItem({
                id: item.id,
                ...value,
            });
        },
    });

    // Create batch options from item.stok
    const batchOptions = (item.stok || []).map((batchItem) => ({
        value: batchItem.nomor_batch,
        label: `${batchItem.nomor_batch} (Stok: ${batchItem.stok} - Exp: ${new Date(batchItem.tanggal_expired).toLocaleDateString('id-ID')})`,
    }));

    // Auto-fill batch with nearest expiry date (FEFO - First Expired, First Out)
    useEffect(() => {
        if (item.stok && item.stok.length > 0) {
            // Find batch with nearest expiry date (FEFO)
            const nearestExpiryBatch = item.stok.reduce((nearest, current) => {
                const currentExp = new Date(current.tanggal_expired);
                const nearestExp = new Date(nearest.tanggal_expired);
                return currentExp < nearestExp ? current : nearest;
            });

            // Set batch and expiry date
            form.setFieldValue('batch', nearestExpiryBatch.nomor_batch);
            form.setFieldValue(
                'expiredDate',
                new Date(nearestExpiryBatch.tanggal_expired),
            );
        }
    }, [item.id]); // Re-run when item changes

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="grid gap-3"
        >
            <div className="space-y-1">
                {/* <h4 className="leading-none font-medium">{item.label}</h4> */}
                <p className="text-xs text-muted-foreground italic">
                    Masukkan detail penjualan
                </p>
            </div>

            <div className="space-y-3">
                <form.Field
                    name="batch"
                    validators={{
                        onChange: z.string().min(1, 'Nomor batch wajib diisi'),
                    }}
                >
                    {(field) => (
                        <ComboboxLabelAndHelper
                            label="Nomor Batch"
                            placeholder="Pilih nomor batch"
                            field={field}
                            initialItems={batchOptions}
                            searchable={false}
                            onValueChange={(selectedValue) => {
                                field.handleChange(selectedValue);
                                // Update expiredDate when batch is selected
                                const selectedBatch = item.stok?.find(
                                    (b) => b.nomor_batch === selectedValue,
                                );
                                if (selectedBatch) {
                                    form.setFieldValue(
                                        'expiredDate',
                                        new Date(selectedBatch.tanggal_expired),
                                    );
                                }
                            }}
                        />
                    )}
                </form.Field>

                <form.Field
                    name="expiredDate"
                    validators={{
                        onChange: z.date({
                            required_error: 'Tanggal kadaluarsa wajib dipilih',
                        }),
                    }}
                >
                    {(field) => (
                        <>
                            <label className="mb-1.5 block text-sm leading-none font-medium">
                                Tanggal Kadaluarsa
                            </label>
                            <DatePicker
                                field={field}
                                placeholder="Pilih tanggal kadaluarsa"
                                toYear={new Date().getFullYear() + 15}
                            />
                        </>
                    )}
                </form.Field>

                <form.Field
                    name="satuan"
                    validators={{
                        onChange: z.string().min(1, 'Satuan wajib dipilih'),
                    }}
                >
                    {(field) => (
                        <ComboboxLabelAndHelper
                            label="Satuan Jual"
                            placeholder="Pilih satuan"
                            initialItems={satuan}
                            field={field}
                        />
                    )}
                </form.Field>

                <form.Subscribe selector={(state) => state.values.satuan}>
                    {(satuanValue) =>
                        satuanValue &&
                        item.satuan_kecil &&
                        satuanValue !== (item.satuan_besar || '') && (
                            <form.Field
                                name="isiSatuan"
                                validators={{
                                    onChange: z.coerce
                                        .number()
                                        .min(1, 'Isi satuan minimal 1'),
                                }}
                            >
                                {(field) => (
                                    <InputLabelAndHelper
                                        label={`Berapa jumlah '${item.satuan_kecil}' dalam 1 '${satuanValue}'`}
                                        type="number"
                                        min={1}
                                        field={field}
                                    />
                                )}
                            </form.Field>
                        )
                    }
                </form.Subscribe>

                <form.Subscribe selector={(state) => state.values.satuan}>
                    {(satuanValue) => (
                        <form.Field
                            name="jumlahJual"
                            validators={{
                                onChange: z.coerce
                                    .number()
                                    .int()
                                    .min(1, 'Jumlah minimal 1'),
                            }}
                        >
                            {(field) => (
                                <InputLabelAndHelper
                                    label={`Jumlah Jual (${satuanValue || 'satuan'})`}
                                    type="number"
                                    min={1}
                                    field={field}
                                />
                            )}
                        </form.Field>
                    )}
                </form.Subscribe>

                <form.Field
                    name="hargaJual"
                    validators={{
                        onChange: z.coerce
                            .number()
                            .min(1, 'Harga jual wajib diisi'),
                    }}
                >
                    {(field) => (
                        <InputLabelAndHelper
                            label="Harga Jual"
                            type="currency"
                            placeholder="Masukkan harga jual"
                            field={field}
                        />
                    )}
                </form.Field>
            </div>

            <div className="flex justify-end gap-2 pt-2 pb-6">
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={onClosePopover}
                >
                    Batal
                </Button>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Tambahkan'}
                        </Button>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
};

export default SalesItemDetailForm;
