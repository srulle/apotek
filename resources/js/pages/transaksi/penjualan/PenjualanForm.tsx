'use client';

import { useForm } from '@tanstack/react-form';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ulid } from 'ulid';
import { z } from 'zod';
import ComboboxData from '@/components/combobox-data';
import DatePicker from '@/components/input/datepicker';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from '@/components/ui/table';
import SalesItemDetailForm from './components/SalesItemDetailForm';

interface PenjualanFormProps {
    obat: Array<{
        title: string;
        items: Array<{
            id: number;
            label: string;
            subtitle: string;
            satuan_besar?: string;
            satuan_kecil?: string;
            stok_total?: number;
            stok?: Array<{
                id: number;
                nomor_batch: string;
                tanggal_expired: string;
                stok: number;
            }>;
        }>;
    }>;
    satuan: string[];
}

const penjualanFormSchema = z.object({
    tanggalTransaksi: z.date({
        required_error: 'Tanggal transaksi wajib dipilih',
    }),
});

export default function PenjualanForm({ obat, satuan }: PenjualanFormProps) {
    const form = useForm({
        validators: {
            onChange: penjualanFormSchema,
        },
        defaultValues: {
            tanggalTransaksi: new Date(),
        },
    });

    const [selectedObat, setSelectedObat] = useState<
        Array<{ id: number; uniqueId: string }>
    >([]);
    const [obatFormData, setObatFormData] = useState<Record<string, any>>({});

    const generateInvoiceNumber = () => {
        return `JGF${ulid()}`;
    };

    const [invoiceNumber] = useState(generateInvoiceNumber);

    const handleSavePenjualan = () => {
        const totalHarga = selectedObat.reduce((total, entry) => {
            const formData = obatFormData[entry.uniqueId] || {};
            const jumlahJual = Number(formData.jumlahJual) || 0;
            const hargaJual = Number(formData.hargaJual) || 0;

            return total + jumlahJual * hargaJual;
        }, 0);

        const detailPembelian = selectedObat.map((entry) => {
            const formData = obatFormData[entry.uniqueId] || {};

            return {
                obat_id: entry.id,
                nomor_batch: formData.batch || '',
                tanggal_expired: formData.expiredDate || '',
                jumlah_jual:
                    (Number(formData.jumlahJual) || 0) *
                    (Number(formData.isiSatuan) || 1),
                harga_jual: formData.hargaJual || '',
            };
        });

        console.log('✅ Data siap disimpan ke database');

        console.table([
            { field: 'nomor_faktur', value: invoiceNumber },
            {
                field: 'tanggal_transaksi',
                value: form.state.values.tanggalTransaksi,
            },
            { field: 'user_id', value: null },
            { field: 'total_harga', value: totalHarga },
        ]);

        detailPembelian.forEach((detail, index) => {
            console.log(`Detail Penjualan ${index + 1}:`);
            console.table([
                { field: 'obat_id', value: detail.obat_id },
                { field: 'nomor_batch', value: detail.nomor_batch },
                { field: 'tanggal_expired', value: detail.tanggal_expired },
                { field: 'jumlah_jual', value: detail.jumlah_jual },
                { field: 'harga_jual', value: detail.harga_jual },
            ]);
        });
    };

    return (
        <Card className="gap-4">
            <CardHeader className="gap-0">
                <CardTitle>Tambah Penjualan Baru</CardTitle>
                <CardDescription className="text-sm italic">
                    Input transaksi penjualan barang baru ke sistem.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                    <form.Field name="tanggalTransaksi">
                        {(field) => (
                            <DatePicker
                                className="md:min-h-[90px]"
                                field={field}
                                label="Tanggal Transaksi"
                                placeholder="Pilih tanggal transaksi"
                            />
                        )}
                    </form.Field>

                    <ComboboxData
                        label="Pilih Obat"
                        items={obat.map((group) => ({
                            ...group,
                            items: group.items.map((item) => ({
                                ...item,
                                subtitle: item.subtitle, // Subtitle sudah include satuan penjualan dan stok dari backend
                            })),
                        }))}
                        value={selectedObat}
                        onChange={(value) =>
                            setSelectedObat(
                                value as Array<{
                                    id: number;
                                    uniqueId: string;
                                }>,
                            )
                        }
                        onItemSelect={(item: any) => {
                            setObatFormData((prev) => ({
                                ...prev,
                                [item.uniqueId]: item,
                            }));
                        }}
                        placeholder="Pilih obat yang akan dijual"
                        searchPlaceholder="Cari nama obat..."
                        className="w-full"
                        multiple={true}
                        renderPopoverContent={(item, onSelect, onClose) => (
                            <SalesItemDetailForm
                                item={item}
                                onSelectItem={onSelect}
                                onClosePopover={onClose}
                                satuan={satuan}
                            />
                        )}
                    />
                </div>

                {selectedObat.length > 0 && (
                    <div className="mt-6">
                        <hr className="mb-5 border-muted-foreground/20" />
                        <h4 className="mb-2 text-sm font-medium">
                            Nomor Faktur: {invoiceNumber}
                        </h4>
                        <Table className="[&_td]:py-0.5 [&_th]:py-1">
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-10">No</TableHead>
                                    <TableHead>Nama Obat</TableHead>
                                    <TableHead className="w-32">
                                        Nomor Batch
                                    </TableHead>
                                    <TableHead className="w-32">
                                        Tanggal Expired
                                    </TableHead>
                                    <TableHead className="w-32">
                                        Satuan
                                    </TableHead>
                                    <TableHead className="w-32 text-center">
                                        Isi Satuan
                                    </TableHead>
                                    <TableHead className="w-32 text-center">
                                        Jumlah Jual
                                    </TableHead>
                                    <TableHead className="w-32 text-right">
                                        Harga Jual
                                    </TableHead>

                                    <TableHead className="w-24 text-center">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedObat.map((entry, index) => {
                                    const selectedObatItem = obat
                                        .flatMap((g) => g.items)
                                        .find((i) => i.id === entry.id);
                                    const formData =
                                        obatFormData[entry.uniqueId] || {};

                                    return (
                                        <TableRow key={entry.uniqueId}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {selectedObatItem?.label}
                                            </TableCell>
                                            <TableCell>
                                                {formData.batch || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {formData.expiredDate
                                                    ? new Date(
                                                          formData.expiredDate,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              day: 'numeric',
                                                              month: 'long',
                                                              year: 'numeric',
                                                          },
                                                      )
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {formData.satuan || '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {formData.isiSatuan
                                                    ? formData.isiSatuan
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {formData.jumlahJual
                                                    ? formData.jumlahJual
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formData.hargaJual
                                                    ? new Intl.NumberFormat(
                                                          'id-ID',
                                                          {
                                                              style: 'currency',
                                                              currency: 'IDR',
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                          },
                                                      ).format(
                                                          formData.hargaJual,
                                                      )
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="cursor-pointer border-destructive! p-2 text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                                                    onClick={() => {
                                                        setSelectedObat(
                                                            (prev) =>
                                                                prev.filter(
                                                                    (v) =>
                                                                        v.uniqueId !==
                                                                        entry.uniqueId,
                                                                ),
                                                        );
                                                        setObatFormData(
                                                            (prev) => {
                                                                const newData =
                                                                    { ...prev };
                                                                delete newData[
                                                                    entry
                                                                        .uniqueId
                                                                ];

                                                                return newData;
                                                            },
                                                        );
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center font-medium"
                                    >
                                        Total Penjualan
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {selectedObat.reduce<number>(
                                            (total, entry) => {
                                                const formData =
                                                    obatFormData[
                                                        entry.uniqueId
                                                    ] || {};

                                                return (
                                                    total +
                                                    (Number(
                                                        formData.jumlahJual,
                                                    ) *
                                                        Number(
                                                            formData.hargaJual,
                                                        ) || 0)
                                                );
                                            },
                                            0,
                                        ) > 0
                                            ? new Intl.NumberFormat('id-ID', {
                                                  style: 'currency',
                                                  currency: 'IDR',
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              }).format(
                                                  selectedObat.reduce<number>(
                                                      (total, entry) => {
                                                          const formData =
                                                              obatFormData[
                                                                  entry.uniqueId
                                                              ] || {};

                                                          return (
                                                              total +
                                                              (Number(
                                                                  formData.jumlahJual,
                                                              ) *
                                                                  Number(
                                                                      formData.hargaJual,
                                                                  ) || 0)
                                                          );
                                                      },
                                                      0,
                                                  ),
                                              )
                                            : '-'}
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                )}

                {selectedObat.length > 0 && (
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedObat([]);
                                setObatFormData({});
                            }}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleSavePenjualan}>Simpan</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
