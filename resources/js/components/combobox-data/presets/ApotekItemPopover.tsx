'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import DatePicker from '@/components/input/datepicker';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';
import { Button } from '@/components/ui/button';
import type { ComboboxItem } from '../types';

interface ApotekItemPopoverProps {
    item: ComboboxItem;
    onSelectItem: (data: any) => void;
    onClosePopover: () => void;
    satuan?: string[];
}

const ApotekItemPopover = ({
    item,
    onSelectItem,
    onClosePopover,
    satuan = [],
}: ApotekItemPopoverProps) => {
    const obatDetailSchema = z.object({
        batch: z.string().min(1, 'Nomor batch wajib diisi'),
        expiredDate: z.date({
            required_error: 'Tanggal kadaluarsa wajib dipilih',
        }),
        satuan: z.string().min(1, 'Satuan wajib dipilih'),
        jumlah: z.coerce.number().int().min(1, 'Jumlah minimal 1'),
        hargaBeli: z.coerce.number().min(1, 'Harga beli wajib diisi'),
        konversi: z.coerce.number().optional(),
    });

    const form = useForm({
        validatorAdapter: zodValidator(),
        validators: {
            onChange: obatDetailSchema,
        },
        defaultValues: {
            batch: '',
            expiredDate: undefined,
            satuan: item.satuan_besar || '',
            jumlah: 1,
            hargaBeli: 0,
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
                <form.Field name="batch">
                    {(field) => (
                        <InputLabelAndHelper
                            label="Nomor Batch"
                            placeholder="Masukkan nomor batch"
                            field={field}
                        />
                    )}
                </form.Field>

                <form.Field name="expiredDate">
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

                <form.Field name="satuan">
                    {(field) => (
                        <ComboboxLabelAndHelper
                            label="Satuan Besar Saat Pembelian"
                            placeholder="Pilih satuan"
                            initialItems={satuan}
                            field={field}
                        />
                    )}
                </form.Field>

                <form.Field name="jumlah">
                    {(field) => (
                        <InputLabelAndHelper
                            label="Jumlah Beli"
                            type="number"
                            min={1}
                            field={field}
                        />
                    )}
                </form.Field>

                <form.Field name="hargaBeli">
                    {(field) => (
                        <InputLabelAndHelper
                            label="Harga Beli"
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

export default ApotekItemPopover;
