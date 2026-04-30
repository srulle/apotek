'use client';

import { useForm } from '@tanstack/react-form';
import { useEffect } from 'react';
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
        satuan_penjualan?: string;
        jumlah_satuan_kecil_dalam_satuan_penjualan?: number;
        harga_jual?: number;
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
        isiSatuan: z.coerce.number().min(0, 'Isi satuan minimal 0'),
        jumlahJual: z.coerce.number().int().min(1, 'Jumlah minimal 1'),
        hargaJual: z.coerce.number().min(1, 'Harga jual wajib diisi'),
    });

    const form = useForm({
        defaultValues: {
            batch: '',
            expiredDate: new Date(),
            satuan: item.satuan_penjualan || '',
            isiSatuan: item.jumlah_satuan_kecil_dalam_satuan_penjualan || 0,
            jumlahJual: 1,
            hargaJual:
                (item.harga_jual || 0) *
                (item.jumlah_satuan_kecil_dalam_satuan_penjualan || 1),
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
        label: batchItem.nomor_batch,
        subtitle: `Stok: ${batchItem.stok}`,
    }));

    // Auto-fill batch with nearest expiry date (FEFO - First Expired, First Out)
    // Also set isiSatuan and hargaJual based on item data
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

        // Set isiSatuan to jumlah_satuan_kecil_dalam_satuan_penjualan
        form.setFieldValue(
            'isiSatuan',
            item.jumlah_satuan_kecil_dalam_satuan_penjualan || 0,
        );

        // Set hargaJual to (harga_jual * jumlah_satuan_kecil_dalam_satuan_penjualan) * jumlahJual
        const currentJumlahJual = form.getFieldValue('jumlahJual') || 1;
        form.setFieldValue(
            'hargaJual',
            (item.harga_jual || 0) *
                (item.jumlah_satuan_kecil_dalam_satuan_penjualan || 1) *
                currentJumlahJual,
        );
    }, [item.id]); // Re-run when item changes

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="grid gap-0"
        >
            <div className="space-y-0">
                {/* <h4 className="leading-none font-medium">{item.label}</h4> */}
                <p className="text-xs text-muted-foreground italic">
                    Masukkan detail penjualan
                </p>
            </div>

            <div className="space-y-1">
                <form.Field
                    name="batch"
                    validators={{
                        onChange: z.string().min(1, 'Nomor batch wajib diisi'),
                    }}
                >
                    {(field) => {
                        // Get stock for selected batch
                        const selectedBatch = item.stok?.find(
                            (b) => b.nomor_batch === field.state.value,
                        );
                        const helperText = selectedBatch
                            ? `Stok tersedia: ${selectedBatch.stok} ${item.satuan_kecil}`
                            : undefined;

                        return (
                            <ComboboxLabelAndHelper
                                label="Nomor Batch"
                                placeholder="Pilih nomor batch"
                                field={field}
                                initialItems={batchOptions}
                                searchable={false}
                                helperText={helperText}
                                onValueChange={(selectedValue) => {
                                    field.handleChange(selectedValue);
                                    // Update expiredDate when batch is selected
                                    const selectedBatch = item.stok?.find(
                                        (b) => b.nomor_batch === selectedValue,
                                    );

                                    if (selectedBatch) {
                                        form.setFieldValue(
                                            'expiredDate',
                                            new Date(
                                                selectedBatch.tanggal_expired,
                                            ),
                                        );
                                    }
                                }}
                            />
                        );
                    }}
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
                            <DatePicker
                                label="Tanggal Kadaluarsa"
                                field={field}
                                disabled={true}
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
                    {(satuanValue) => (
                        <form.Field
                            name="isiSatuan"
                            validators={{
                                onChange: z.coerce
                                    .number()
                                    .min(0, 'Isi satuan minimal 0'),
                            }}
                        >
                            {(field) => (
                                <InputLabelAndHelper
                                    label={`Berapa jumlah '${item.satuan_kecil || 'satuan kecil'}' dalam 1 '${satuanValue || 'satuan'}'`}
                                    type="number"
                                    min={0}
                                    field={field}
                                />
                            )}
                        </form.Field>
                    )}
                </form.Subscribe>

                {/* Reset isiSatuan when satuan changes */}
                <form.Subscribe
                    selector={(state) => state.values.satuan}
                    children={(satuanValue) => {
                        useEffect(() => {
                            // If satuan is changed back to default (satuan_penjualan), restore isiSatuan
                            if (satuanValue === item.satuan_penjualan) {
                                form.setFieldValue(
                                    'isiSatuan',
                                    item.jumlah_satuan_kecil_dalam_satuan_penjualan ||
                                        0,
                                );
                            } else {
                                form.setFieldValue('isiSatuan', 0);
                            }
                        }, [satuanValue]);

                        return null;
                    }}
                />

                {/* Update hargaJual when isiSatuan or jumlahJual changes */}
                <form.Subscribe
                    selector={(state) => [
                        state.values.isiSatuan,
                        state.values.jumlahJual,
                    ]}
                >
                    {([isiSatuanValue, jumlahJualValue]) => {
                        useEffect(() => {
                            form.setFieldValue(
                                'hargaJual',
                                (item.harga_jual || 0) *
                                    (isiSatuanValue || 0) *
                                    (jumlahJualValue || 1),
                            );
                        }, [isiSatuanValue, jumlahJualValue]);

                        return null;
                    }}
                </form.Subscribe>

                <form.Subscribe
                    selector={(state) => [
                        state.values.satuan,
                        state.values.batch,
                        state.values.isiSatuan,
                    ]}
                >
                    {([satuanValue, batchValue, isiSatuanValue]) => {
                        // Get selected batch stock
                        const selectedBatch = item.stok?.find(
                            (b) => b.nomor_batch === batchValue,
                        );
                        const maxJumlahJual =
                            selectedBatch && isiSatuanValue
                                ? Math.floor(
                                      selectedBatch.stok /
                                          (isiSatuanValue as number),
                                  )
                                : undefined;

                        return (
                            <form.Field
                                name="jumlahJual"
                                validators={{
                                    onChange: z.coerce
                                        .number()
                                        .int()
                                        .min(1, 'Jumlah minimal 1')
                                        .refine(
                                            (value) => {
                                                if (
                                                    !selectedBatch ||
                                                    !isiSatuanValue
                                                )
                                                    return true;
                                                return (
                                                    value *
                                                        (isiSatuanValue as number) <=
                                                    selectedBatch.stok
                                                );
                                            },
                                            {
                                                message: `Stok tersedia: ${maxJumlahJual || 0} ${satuanValue || 'satuan'} (${selectedBatch?.stok || 0} ${item.satuan_kecil}) untuk Batch ini`,
                                            },
                                        ),
                                }}
                            >
                                {(field) => (
                                    <InputLabelAndHelper
                                        label={`Jumlah Jual (${satuanValue || 'satuan'})`}
                                        type="number"
                                        min={1}
                                        max={maxJumlahJual}
                                        field={field}
                                    />
                                )}
                            </form.Field>
                        );
                    }}
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
