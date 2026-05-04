'use client';

import { Trash2 } from 'lucide-react';
import ComboboxData from '@/components/combobox-data';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import DatePicker from '@/components/input/datepicker';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';
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
import PurchaseItemDetailForm from './components/PurchaseItemDetailForm';
import { usePembelianForm } from './usePembelianForm';

const fetchSuppliers = async (): Promise<string[]> => {
    const response = await fetch('/api/master-data/supplier');

    if (!response.ok) {
throw new Error('Failed to fetch suppliers');
}

    return response.json();
};

interface PembelianFormProps {
    suppliers: Array<{ id: number; nama_supplier: string }>;
    obat: Array<{
        title: string;
        items: Array<{
            id: number;
            label: string;
            subtitle: string;
            satuan_besar?: string;
            satuan_kecil?: string;
            jumlah_satuan_kecil_dalam_satuan_besar?: number;
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

export default function PembelianForm({
    suppliers,
    obat,
    satuan = [],
}: PembelianFormProps) {
    const {
        form,
        selectedObat,
        setSelectedObat,
        obatFormData,
        setObatFormData,
        createSupplier,
        handleSubmit,
        showItemForm,
        setShowItemForm,
        handleSavePembelian,
    } = usePembelianForm();

    return (
        <Card className="gap-4">
            <CardHeader className="gap-0">
                <CardTitle>Tambah Pembelian Baru</CardTitle>
                <CardDescription className="text-sm italic">
                    Input transaksi pembelian barang baru ke sistem.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-4 md:gap-4">
                    <form.Field name="tanggalTransaksi">
                        {(field) => (
                            <DatePicker
                                className="md:min-h-[90px]"
                                field={field}
                                value={new Date()}
                                label="Tanggal Transaksi"
                                placeholder="Pilih tanggal transaksi"
                            />
                        )}
                    </form.Field>

                    <form.Field name="supplier">
                        {(field) => (
                            <ComboboxLabelAndHelper
                                className="md:min-h-[90px]"
                                label="Supplier"
                                placeholder="Pilih supplier"
                                initialItems={suppliers.map((s) => ({
                                    value: s.id,
                                    label: s.nama_supplier,
                                }))}
                                field={field}
                                creatable={true}
                                fetchItems={fetchSuppliers}
                                onCreate={createSupplier}
                            />
                        )}
                    </form.Field>

                    <form.Field name="nomorFaktur">
                        {(field) => (
                            <InputLabelAndHelper
                                className="md:min-h-[90px]"
                                label="Nomor Faktur"
                                placeholder="Masukkan nomor faktur"
                                field={field}
                            />
                        )}
                    </form.Field>

                    <Button
                        className="mt-2 w-full md:mt-7"
                        onClick={handleSubmit}
                    >
                        Pilih Item
                    </Button>
                </div>

                {showItemForm && (
                    <div className="mt-6">
                        {selectedObat.length > 0 && (
                            <div className="mb-6">
                                <hr className="mb-5 border-muted-foreground/20" />
                                <h4 className="mb-2 text-sm font-medium">
                                    Daftar Obat Yang Dipilih
                                </h4>
                                <Table className="[&_th]:py-1s [&_td]:py-0.5">
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-10">
                                                No
                                            </TableHead>
                                            <TableHead>Nama Obat</TableHead>
                                            <TableHead className="w-32">
                                                Nomor Batch
                                            </TableHead>
                                            <TableHead className="w-32">
                                                Tanggal Expired
                                            </TableHead>
                                            <TableHead className="w-32 text-center">
                                                Jumlah Beli
                                            </TableHead>
                                            <TableHead className="w-32 text-right">
                                                Total Harga
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
                                                obatFormData[entry.uniqueId] ||
                                                {};

                                            return (
                                                <TableRow key={entry.uniqueId}>
                                                    <TableCell>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {
                                                            selectedObatItem?.label
                                                        }
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
                                                    <TableCell className="text-center">
                                                        {formData.jumlahBeli
                                                            ? `${formData.jumlahBeli} ${formData.satuan || 'satuan'}`
                                                            : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formData.totalHarga
                                                            ? new Intl.NumberFormat(
                                                                  'id-ID',
                                                                  {
                                                                      style: 'currency',
                                                                      currency:
                                                                          'IDR',
                                                                      minimumFractionDigits: 2,
                                                                      maximumFractionDigits: 2,
                                                                  },
                                                              ).format(
                                                                  formData.totalHarga,
                                                              )
                                                            : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="cursor-pointer border-destructive! p-2 text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                                                            onClick={() =>
                                                                setSelectedObat(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                v,
                                                                            ) =>
                                                                                v.uniqueId !==
                                                                                entry.uniqueId,
                                                                        ),
                                                                )
                                                            }
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
                                                colSpan={5}
                                                className="text-right font-medium"
                                            >
                                                Total Pembelian
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
                                                                formData.totalHarga,
                                                            ) || 0)
                                                        );
                                                    },
                                                    0,
                                                ) > 0
                                                    ? new Intl.NumberFormat(
                                                          'id-ID',
                                                          {
                                                              style: 'currency',
                                                              currency: 'IDR',
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                          },
                                                      ).format(
                                                          selectedObat.reduce<number>(
                                                              (
                                                                  total,
                                                                  entry,
                                                              ) => {
                                                                  const formData =
                                                                      obatFormData[
                                                                          entry
                                                                              .uniqueId
                                                                      ] || {};

                                                                  return (
                                                                      total +
                                                                      (Number(
                                                                          formData.totalHarga,
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
                                        // Reset form and clear selections
                                        setSelectedObat([]);
                                        setObatFormData({});
                                        setShowItemForm(false);
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button onClick={handleSavePembelian}>
                                    Simpan
                                </Button>
                            </div>
                        )}

                        <hr className="my-6 border-muted-foreground/20" />

                        <ComboboxData
                            label="Pilih Obat"
                            items={obat.map((group) => ({
                                ...group,
                                items: group.items.map((item) => {
                                    const totalStok =
                                        item.stok?.reduce(
                                            (total: number, s: { stok: number }) =>
                                                total + s.stok,
                                            0,
                                        ) ?? 0;

                                    return {
                                        ...item,
                                        subtitle:
                                            totalStok > 0
                                                ? `Stok: ${totalStok} ${item.satuan_kecil || ''}`
                                                : `Stok: ${totalStok}`,
                                        stok: item.stok || [],
                                    };
                                }),
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
                            placeholder="Pilih item"
                            searchPlaceholder="Cari nama obat..."
                            className="w-full"
                            multiple={true}
                            renderPopoverContent={(item, onSelect, onClose) => (
                                <PurchaseItemDetailForm
                                    item={item}
                                    onSelectItem={onSelect}
                                    onClosePopover={onClose}
                                    satuan={satuan}
                                />
                            )}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
