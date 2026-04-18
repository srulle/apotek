'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import DatePicker from '@/components/input/datepicker';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';
import { Button } from '@/components/ui/button';
import type { ComboboxItem } from '@/components/combobox-data/types';

interface PurchaseItemDetailFormProps {
    item: ComboboxItem;
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
            konversi: 0,
        },
        onSubmit: async ({ value }) => {
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
                <h4 className="leading-none font-medium">{item.label}</h4>
                <p className="text-sm text-muted-foreground">
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
                            placeholder="Masukkan nomor batch"
                            field={field}
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
                                minDate={new Date()}
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
                            label="Satuan Besar Saat Pembelian"
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
                                name="konversi"
                                validators={{
                                    onChange: z.coerce
                                        .number()
                                        .min(1, 'Konversi minimal 1'),
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

            <div className="flex justify-end gap-2 pt-2">
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
