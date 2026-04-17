import { useState } from 'react';

import ComboboxData from '@/components/combobox-data';
import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import DatePicker from '@/components/input/datepicker';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    const [selectedSatuan, setSelectedSatuan] = useState<
        Record<string, string>
    >({});

    const {
        tanggalTransaksi,
        setTanggalTransaksi,
        supplier,
        setSupplier,
        selectedObat,
        setSelectedObat,
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
                <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Tanggal Transaksi
                        </label>
                        <DatePicker
                            value={tanggalTransaksi}
                            onChange={setTanggalTransaksi}
                            placeholder="Pilih tanggal transaksi"
                        />
                    </div>

                    <ComboboxLabelAndHelper
                        label="Supplier"
                        placeholder="Pilih supplier"
                        initialItems={suplier}
                        value={supplier}
                        onValueChange={setSupplier}
                        creatable={true}
                        onCreate={createSupplier}
                    />

                    <Button className="w-full" onClick={handleSubmit}>
                        Tampilkan Nilai
                    </Button>
                </div>

                <div className="mt-4">
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
                        placeholder="Pilih obat yang akan dibeli"
                        searchPlaceholder="Cari nama obat..."
                        className="w-full"
                        multiple={true}
                        renderPopoverContent={(item, onSelect, onClose) => (
                            <div className="grid gap-2">
                                <div className="space-y-1">
                                    <h4 className="leading-none font-medium">
                                        {item.label}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Masukkan jumlah pembelian
                                    </p>
                                </div>

                                <div className="space-y-0">
                                    <div>
                                        <Label className="text-xs font-medium italic">
                                            Nomor Batch
                                        </Label>
                                        <Input
                                            type="text"
                                            className="-mt-0.5"
                                            placeholder="Masukkan nomor batch"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs font-medium italic">
                                            Tanggal Kadaluarsa
                                        </Label>
                                        <DatePicker
                                            className="-mt-0.5"
                                            value={undefined}
                                            onChange={() => {}}
                                            placeholder="Pilih tanggal kadaluarsa"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs font-medium italic">
                                            Satuan besar saat pembelian
                                        </Label>
                                        <Select
                                            value={
                                                selectedSatuan[
                                                    item.id.toString()
                                                ] ||
                                                item.satuan_besar ||
                                                ''
                                            }
                                            onValueChange={(value) =>
                                                setSelectedSatuan((prev) => ({
                                                    ...prev,
                                                    [item.id.toString()]: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="-mt-0.5 w-full">
                                                <SelectValue placeholder="Pilih satuan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {satuan.map((unit) => (
                                                    <SelectItem
                                                        key={unit}
                                                        value={unit}
                                                    >
                                                        {unit}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedSatuan[item.id.toString()] &&
                                        selectedSatuan[item.id.toString()] !==
                                            item.satuan_besar && (
                                            <div>
                                                <Label className="text-xs font-medium italic">
                                                    Berapa {item.satuan_kecil}{' '}
                                                    dalam 1{' '}
                                                    {
                                                        selectedSatuan[
                                                            item.id.toString()
                                                        ]
                                                    }
                                                    ?
                                                </Label>
                                                <Input
                                                    type="number"
                                                    className="-mt-0.5"
                                                    placeholder={`Masukkan jumlah ${item.satuan_kecil} per ${selectedSatuan[item.id]}`}
                                                />
                                            </div>
                                        )}

                                    <div>
                                        <Label className="text-xs font-medium italic">
                                            Jumlah Beli
                                        </Label>
                                        <Input
                                            type="number"
                                            className="-mt-0.5"
                                            defaultValue="1"
                                            min="1"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs font-medium italic">
                                            Harga Beli
                                        </Label>
                                        <Input
                                            type="number"
                                            className="-mt-0.5"
                                            placeholder="Masukkan harga beli"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={onClose}
                                    >
                                        Batal
                                    </Button>
                                    <Button size="sm" onClick={onSelect}>
                                        Tambahkan
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
