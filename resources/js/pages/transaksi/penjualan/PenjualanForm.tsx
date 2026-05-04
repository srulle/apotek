'use client';

import { router, usePage } from '@inertiajs/react';
import { useForm } from '@tanstack/react-form';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
    userId: number;
}

const penjualanFormSchema = z.object({
    tanggalPenjualan: z.date({
        required_error: 'Tanggal transaksi wajib dipilih',
    }),
});

export default function PenjualanForm({
    obat,
    satuan,
    userId,
}: PenjualanFormProps) {
    const { props } = usePage<{ nomor_faktur?: string }>();
    const form = useForm({
        validators: {
            onChange: penjualanFormSchema,
        },
        defaultValues: {
            tanggalPenjualan: new Date(),
        },
    });

    const [selectedObat, setSelectedObat] = useState<
        Array<{ id: number; uniqueId: string }>
    >([]);
    const [obatFormData, setObatFormData] = useState<Record<string, any>>({});
    const [lastNomorFaktur, setLastNomorFaktur] = useState<string | null>(null);
    const [nextNomorFaktur, setNextNomorFaktur] = useState<string>('');

    // Fetch next invoice number
    const fetchNextNomorFaktur = async (tanggal: Date) => {
        try {
            const response = await fetch(
                `/api/transaksi/penjualan/next-nomor-faktur?tanggal=${tanggal.toISOString().split('T')[0]}`,
            );
            const data = await response.json();

            if (data.nomor_faktur) {
                setNextNomorFaktur(data.nomor_faktur);
            }
        } catch (error) {
            console.error('Error fetching next nomor faktur:', error);
        }
    };

    // Fetch next nomor faktur on mount and when date changes
    useEffect(() => {
        if (form.state.values.tanggalPenjualan) {
            fetchNextNomorFaktur(form.state.values.tanggalPenjualan);
        }
    }, [form.state.values.tanggalPenjualan]);

    // Update lastNomorFaktur when props.nomor_faktur changes
    useEffect(() => {
        if (props.nomor_faktur) {
            setLastNomorFaktur(props.nomor_faktur);
        }
    }, [props.nomor_faktur]);

    const handleSavePenjualan = () => {
        const items = selectedObat.map((entry) => {
            const formData = obatFormData[entry.uniqueId] || {};

            return {
                obat_id: entry.id,
                nomor_batch: formData.batch || '',
                tanggal_expired: formData.expiredDate || '',
                jumlah_jual:
                    (Number(formData.jumlahJual) || 0) *
                    (Number(formData.isiSatuan) || 1),
                harga_jual:
                    Number(
                        (formData.hargaJual?.toString() || '').replace(
                            /\./g,
                            '',
                        ) || 0,
                    ) /
                    ((formData.isiSatuan || 1) * (formData.jumlahJual || 1)),
            };
        });

        const dataToSend = {
            header: {
                tanggal_penjualan: form.state.values.tanggalPenjualan,
                user_id: userId,
            },
            items: items,
        };

        router.post('/transaksi/penjualan', dataToSend, {
            onSuccess: (page) => {
                const nomorFaktur = page.props.nomor_faktur as string;

                if (nomorFaktur) {
                    setLastNomorFaktur(nomorFaktur);
                    toast.success(
                        `Penjualan berhasil disimpan. Nomor: ${nomorFaktur}`,
                    );
                } else {
                    toast.success('Penjualan berhasil disimpan');
                }

                setSelectedObat([]);
                setObatFormData({});
                form.reset();
            },
            onError: (errors) => {
                toast.error('Gagal menyimpan penjualan');
                console.error('Error saat menyimpan:', errors);
            },
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
                    <form.Field name="tanggalPenjualan">
                        {(field) => (
                            <DatePicker
                                className="md:min-h-[90px]"
                                field={field}
                                label="Tanggal Penjualan"
                                placeholder="Pilih tanggal penjualan"
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
                    <div>
                        <div className="mb-2 border-b border-t bg-muted/40 p-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                Nomor Faktur:{' '}
                                {nextNomorFaktur || 'Sedang memuat...'}
                            </p>
                        </div>
                        {/* <hr className="mb-5 border-muted-foreground/20" /> */}
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
                                                              minimumFractionDigits: 0,
                                                              maximumFractionDigits: 0,
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
                                                    Number(
                                                        (
                                                            formData.hargaJual?.toString() ||
                                                            ''
                                                        ).replace(/\./g, '') ||
                                                            0,
                                                    )
                                                );
                                            },
                                            0,
                                        ) > 0
                                            ? new Intl.NumberFormat('id-ID', {
                                                  style: 'currency',
                                                  currency: 'IDR',
                                                  minimumFractionDigits: 0,
                                                  maximumFractionDigits: 0,
                                              }).format(
                                                  selectedObat.reduce<number>(
                                                      (total, entry) => {
                                                          const formData =
                                                              obatFormData[
                                                                  entry.uniqueId
                                                              ] || {};

                                                          return (
                                                              total +
                                                              Number(
                                                                  (
                                                                      formData.hargaJual?.toString() ||
                                                                      ''
                                                                  ).replace(
                                                                      /\./g,
                                                                      '',
                                                                  ) || 0,
                                                              )
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
