import ComboboxData from '@/components/combobox-data';
import PurchaseItemDetailForm from './components/PurchaseItemDetailForm';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import DatePicker from '@/components/input/datepicker';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
} from '@/components/ui/table';
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
                <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                    <form.Field name="tanggalTransaksi">
                        {(field) => (
                            <div>
                                <label className="mb-1.5 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tanggal Transaksi
                                </label>
                                <DatePicker
                                    field={field}
                                    placeholder="Pilih tanggal transaksi"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="supplier">
                        {(field) => (
                            <ComboboxLabelAndHelper
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
                                label="Nomor Faktur"
                                placeholder="Masukkan nomor faktur"
                                field={field}
                            />
                        )}
                    </form.Field>

                    <Button size="sm" className="w-full" onClick={handleSubmit}>
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
                                    <TableRow>
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
                                                        ? `Rp ${formData.totalHarga.toLocaleString('id-ID')}`
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
                            </Table>
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
