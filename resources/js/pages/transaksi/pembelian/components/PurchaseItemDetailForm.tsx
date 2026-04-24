'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import React, { useState } from 'react';
import { z } from 'zod';
import type { ComboboxItem } from '@/components/combobox-data/types';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import DatePicker from '@/components/input/datepicker';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';
import { Button } from '@/components/ui/button';

interface PurchaseItemDetailFormProps {
    item: ComboboxItem & {
        stok?: Array<{
            id: number;
            nomor_batch: string;
            tanggal_expired: string;
            stok: number;
        }>;
        satuan_besar?: string;
        satuan_kecil?: string;
        jumlah_satuan_kecil_dalam_satuan_besar?: number;
    };
    onSelectItem: (data: any) => void;
    onClosePopover: () => void;
    satuan?: string[];
}

const PurchaseItemDetailForm = ({
    item,
    onSelectItem,
    onClosePopover,
    satuan = [],
}: PurchaseItemDetailFormProps) => {
    const [isBatchFromList, setIsBatchFromList] = useState(false);
    const [previousSatuan, setPreviousSatuan] = useState<string>('');
    const [konversiPerSatuan, setKonversiPerSatuan] = useState<
        Record<string, number>
    >(() => ({
        [String(item.satuan_besar || '')]:
            item.jumlah_satuan_kecil_dalam_satuan_besar || 0,
    }));
    const obatDetailSchema = z.object({
        batch: z.string().min(1, 'Nomor batch wajib diisi'),
        expiredDate: z.date({
            required_error: 'Tanggal kadaluarsa wajib dipilih',
        }),
        satuan: z.string().min(1, 'Satuan wajib dipilih'),
        jumlahBeli: z.coerce.number().int().min(1, 'Jumlah minimal 1'),
        totalHarga: z.coerce.number().min(1, 'Total harga wajib diisi'),
        konversi: z.coerce.number().optional(),
    });

    const form = useForm({
        defaultValues: {
            batch: '',
            expiredDate: new Date(),
            satuan: item.satuan_besar || '',
            jumlahBeli: 1,
            totalHarga: 0,
            konversi: konversiPerSatuan[String(item.satuan_besar || '')] || 0,
        },
        onSubmit: async ({ value }) => {
            // ✅ Tambahkan item ke selected list dan simpan detail
            onSelectItem({
                id: item.id,
                ...value,
            });
        },
    });

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
                    Masukkan detail pembelian
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
                        <InputLabelAndHelper
                            label="Nomor Batch"
                            placeholder="Masukkan atau pilih nomor batch"
                            field={field}
                            type="autocomplete"
                            autocompleteOptions={
                                item.stok?.map((batchItem) => ({
                                    value: batchItem.nomor_batch,
                                    label: `${batchItem.nomor_batch} (Stok: ${batchItem.stok} - Exp: ${new Date(batchItem.tanggal_expired).toLocaleDateString('id-ID')})`,
                                })) || []
                            }
                            onAutocompleteSelect={(selected) => {
                                if (selected) {
                                    const selectedBatch = item.stok?.find(
                                        (b) => b.nomor_batch === selected.value,
                                    );

                                    if (selectedBatch) {
                                        setIsBatchFromList(true);
                                        form.setFieldValue(
                                            'expiredDate',
                                            new Date(
                                                selectedBatch.tanggal_expired,
                                            ),
                                        );
                                    } else {
                                        setIsBatchFromList(false);
                                        form.setFieldValue(
                                            'expiredDate',
                                            new Date(),
                                        );
                                    }
                                } else {
                                    setIsBatchFromList(false);
                                    form.setFieldValue(
                                        'expiredDate',
                                        new Date(),
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
                            <DatePicker
                                label="Tanggal Kadaluarsa"
                                field={field}
                                placeholder="Pilih tanggal kadaluarsa"
                                minDate={new Date()}
                                toYear={new Date().getFullYear() + 30}
                                disabled={isBatchFromList}
                                helperText={
                                    isBatchFromList
                                        ? 'Tanggal kadaluarsa otomatis terisi dari batch yang dipilih'
                                        : undefined
                                }
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
                            label="Satuan Besar Saat Pembelian"
                            placeholder="Pilih satuan"
                            initialItems={satuan}
                            field={field}
                        />
                    )}
                </form.Field>

                <form.Subscribe
                    selector={(state) => [
                        state.values.satuan,
                        state.values.konversi,
                    ]}
                >
                    {([satuanValue, konversiValue]) => {
                        // Simpan nilai konversi untuk satuan sebelumnya dan set nilai untuk satuan baru
                        React.useEffect(() => {
                            if (satuanValue !== previousSatuan) {
                                // Simpan nilai konversi untuk satuan sebelumnya (jika ada)
                                if (
                                    previousSatuan &&
                                    typeof konversiValue === 'number'
                                ) {
                                    setKonversiPerSatuan((prev) => ({
                                        ...prev,
                                        [previousSatuan]: konversiValue,
                                    }));
                                }

                                // Set nilai konversi untuk satuan baru
                                const savedKonversi =
                                    konversiPerSatuan[
                                        String(satuanValue || '')
                                    ] ?? 0;
                                form.setFieldValue('konversi', savedKonversi);

                                setPreviousSatuan(String(satuanValue || ''));
                            }
                        }, [satuanValue, konversiValue, previousSatuan]);

                        return (
                            <form.Field
                                name="konversi"
                                validators={{
                                    onChange: z.coerce
                                        .number()
                                        .min(0, 'Konversi minimal 0'),
                                }}
                            >
                                {(field) => (
                                    <InputLabelAndHelper
                                        label={`Berapa jumlah '${item.satuan_kecil || 'satuan kecil'}' dalam 1 '${satuanValue || 'satuan besar'}'`}
                                        type="number"
                                        min={0}
                                        field={field}
                                    />
                                )}
                            </form.Field>
                        );
                    }}
                </form.Subscribe>

                <form.Subscribe selector={(state) => state.values.satuan}>
                    {(satuanValue) => (
                        <form.Field
                            name="jumlahBeli"
                            validators={{
                                onChange: z.coerce
                                    .number()
                                    .int()
                                    .min(1, 'Jumlah minimal 1'),
                            }}
                        >
                            {(field) => (
                                <InputLabelAndHelper
                                    label={`Jumlah Beli (${satuanValue || 'satuan'})`}
                                    type="number"
                                    min={1}
                                    field={field}
                                />
                            )}
                        </form.Field>
                    )}
                </form.Subscribe>

                <form.Field
                    name="totalHarga"
                    validators={{
                        onChange: z.coerce
                            .number()
                            .min(1, 'Harga beli wajib diisi'),
                    }}
                >
                    {(field) => (
                        <InputLabelAndHelper
                            label="Total Harga"
                            type="currency"
                            placeholder="Masukkan harga beli"
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

export default PurchaseItemDetailForm;
