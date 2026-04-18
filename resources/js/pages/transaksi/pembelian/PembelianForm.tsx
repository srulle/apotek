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

interface PembelianFormProps {
    suplier: string[];
    obat: Array<{
        title: string;
        items: Array<{
            id: number;
            label: string;
            subtitle: string;
            satuan_besar?: string;
            satuan_kecil?: string;
        }>;
    }>;
    satuan: string[];
}

export default function PembelianForm({
    suplier,
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
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
                    <form.Field name="tanggalTransaksi">
                        {(field) => (
                            <DatePicker
                                className="min-h-22.5 md:min-h-0"
                                field={field}
                                label="Tanggal Transaksi"
                                placeholder="Pilih tanggal transaksi"
                            />
                        )}
                    </form.Field>

                    <form.Field name="supplier">
                        {(field) => (
                            <ComboboxLabelAndHelper
                                className="min-h-22.5"
                                label="Supplier"
                                placeholder="Pilih supplier"
                                initialItems={suplier}
                                field={field}
                                creatable={true}
                                onCreate={createSupplier}
                            />
                        )}
                    </form.Field>

                    <form.Field name="nomorFaktur">
                        {(field) => (
                            <InputLabelAndHelper
                                className="min-h-22.5"
                                label="Nomor Faktur"
                                placeholder="Masukkan nomor faktur"
                                field={field}
                            />
                        )}
                    </form.Field>

                    <Button className="mt-6 w-full" onClick={handleSubmit}>
                        Tampilkan Nilai
                    </Button>
                </div>

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
                                    {selectedObat.map((id, index) => {
                                        const selectedObatItem = obat
                                            .flatMap((g) => g.items)
                                            .find((i) => i.id === id);
                                        const formData = obatFormData[id] || {};

                                        return (
                                            <TableRow key={id}>
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>
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
                                                                        (v) =>
                                                                            v !==
                                                                            id,
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
                                            className="text-center font-medium"
                                        >
                                            Total Pembelian
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            {selectedObat.reduce<number>(
                                                (total, id) => {
                                                    const formData =
                                                        obatFormData[id] || {};

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
                                                          (total, id) => {
                                                              const formData =
                                                                  obatFormData[
                                                                      id
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
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={() => {
                                    // Data header pembelian
                                    const headerData = {
                                        nomor_faktur:
                                            form.getFieldValue('nomorFaktur'),
                                        tanggal_transaksi:
                                            form.getFieldValue(
                                                'tanggalTransaksi',
                                            ),
                                        suplier_id:
                                            form.getFieldValue('supplier'),
                                        user_id: 1, // Placeholder, sesuaikan dengan user login
                                    };

                                    // Data detail obat
                                    const itemsData = selectedObat.map((id) => {
                                        const selectedObatItem = obat
                                            .flatMap((g) => g.items)
                                            .find((i) => i.id === id);
                                        const formData = obatFormData[id] || {};

                                        return {
                                            obat_id: selectedObatItem?.id,
                                            nomor_batch: formData.batch,
                                            tanggal_expired:
                                                formData.expiredDate,
                                            satuan: formData.satuan,
                                            jumlah_beli: formData.jumlahBeli,
                                            harga_beli: formData.totalHarga,
                                        };
                                    });

                                    console.log('=== DATA PEMBELIAN ===');
                                    console.log(
                                        'Header:',
                                        JSON.stringify(headerData, null, 2),
                                    );
                                    console.log(
                                        'Items:',
                                        JSON.stringify(itemsData, null, 2),
                                    );
                                }}
                            >
                                Simpan
                            </Button>
                        </div>
                    )}

                    <hr className="my-6 border-muted-foreground/20" />

                    <ComboboxData
                        label="Pilih Obat"
                        items={obat.map((group) => ({
                            ...group,
                            items: group.items.map((item) => ({
                                ...item,
                                subtitle: item.satuan_besar || item.subtitle,
                            })),
                        }))}
                        value={selectedObat}
                        onChange={(value) =>
                            setSelectedObat(Array.isArray(value) ? value : [])
                        }
                        onItemSelect={(item) => {
                            setObatFormData((prev) => ({
                                ...prev,
                                [item.id]: item,
                            }));
                        }}
                        placeholder="Pilih obat yang akan dibeli"
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
            </CardContent>
        </Card>
    );
}
