import { ComboboxLabelAndHelper } from '@/components/input/combobox';
import { InputLabelAndHelper } from '@/components/input/input-label-and-helper';

interface TambahObatFormProps {
    form: any;
    kategoriObat: string[];
    satuan: string[];
    createItem: (
        url: string,
        data: Record<string, any>,
        successMessage: string,
        loadingMessage: string,
        errorKey: string,
    ) => Promise<void>;
}

export default function TambahObatForm({
    form,
    kategoriObat,
    satuan,
    createItem,
}: TambahObatFormProps) {
    return (
        <div className="grid gap-2 py-4 lg:grid-cols-3">
            {/* Row 1: Nama Obat | Kategori Obat | Satuan Kecil */}
            <form.Field
                name="nama_obat"
                validators={{
                    onChange: ({ value }: { value: string }) => {
                        if (!value) {
                            return 'Nama Obat harus diisi';
                        }
                    },
                }}
            >
                {(field: any) => (
                    <InputLabelAndHelper
                        field={field}
                        label="Nama Obat"
                        placeholder="Masukkan nama obat"
                    />
                )}
            </form.Field>

            <form.Field
                name="kategori_obat"
                validators={{
                    onChange: ({ value }: { value: string }) => {
                        if (!value) {
                            return 'Kategori Obat harus diisi';
                        }
                    },
                }}
            >
                {(field: any) => (
                    <ComboboxLabelAndHelper
                        field={field}
                        label="Kategori Obat"
                        placeholder="Pilih kategori obat"
                        initialItems={kategoriObat}
                        creatable={true}
                        onCreate={(value) =>
                            createItem(
                                '/master-data/kategori-obat',
                                { nama_kategori: value },
                                'Kategori obat berhasil ditambahkan',
                                'Menambahkan kategori obat...',
                                'nama_kategori',
                            )
                        }
                    />
                )}
            </form.Field>

            <form.Field
                name="satuan_kecil"
                validators={{
                    onChange: ({ value }: { value: string }) => {
                        if (!value) {
                            return 'Satuan Kecil harus diisi';
                        }
                    },
                }}
            >
                {(field: any) => (
                    <ComboboxLabelAndHelper
                        field={field}
                        label="Satuan Kecil"
                        placeholder="Pilih satuan kecil"
                        initialItems={satuan}
                        creatable={true}
                        onCreate={(value) =>
                            createItem(
                                '/master-data/satuan',
                                { nama_satuan: value },
                                'Satuan berhasil ditambahkan',
                                'Menambahkan satuan...',
                                'nama_satuan',
                            )
                        }
                    />
                )}
            </form.Field>

            {/* Row 2: Container col-span-12 */}
            <div className="grid w-full gap-2 lg:col-span-3 lg:grid-cols-12">
                {/* Satuan Besar + Jumlah - col-span-5 */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="grid grid-cols-5 lg:gap-2">
                        <div className="col-span-3">
                            <form.Field
                                name="satuan_besar"
                                validators={{
                                    onChange: ({
                                        value,
                                    }: {
                                        value: string;
                                    }) => {
                                        if (!value) {
                                            return 'Satuan Besar harus diisi';
                                        }
                                    },
                                }}
                            >
                                {(field: any) => (
                                    <ComboboxLabelAndHelper
                                        field={field}
                                        label="Satuan Besar"
                                        placeholder="Pilih satuan besar"
                                        initialItems={satuan}
                                        creatable={true}
                                        onCreate={(value) =>
                                            createItem(
                                                '/master-data/satuan',
                                                { nama_satuan: value },
                                                'Satuan berhasil ditambahkan',
                                                'Menambahkan satuan...',
                                                'nama_satuan',
                                            )
                                        }
                                    />
                                )}
                            </form.Field>
                        </div>
                        <div className="col-span-2">
                            <form.Subscribe
                                selector={(state: any) => ({
                                    satuanKecil: state.values.satuan_kecil,
                                    satuanBesar: state.values.satuan_besar,
                                })}
                            >
                                {(data: {
                                    satuanKecil?: string;
                                    satuanBesar?: string;
                                }) => {
                                    const label =
                                        data.satuanBesar && data.satuanKecil
                                            ? `1 ${data.satuanBesar} berapa ${data.satuanKecil}`
                                            : 'Jumlah';

                                    return (
                                        <form.Field
                                            name="jumlah_satuan_kecil_dalam_satuan_besar"
                                            validators={{
                                                onChange: ({
                                                    value,
                                                }: {
                                                    value: string;
                                                }) => {
                                                    if (!value) {
                                                        return 'Jumlah Satuan Kecil dalam Satuan Besar harus diisi';
                                                    }

                                                    if (isNaN(Number(value))) {
                                                        return 'Harus berupa angka';
                                                    }
                                                },
                                            }}
                                        >
                                            {(field: any) => (
                                                <InputLabelAndHelper
                                                    field={field}
                                                    label={label}
                                                    labelInfo="Jumlah disini adalah jumlah satuan kecil dalam satuan besar. Contoh: jika  satuan kecil adalah 'Tablet' dan satuan besar adalah 'Box/Dus', maka tulis disini 'berapa' jumlah Tablet dalam 1 Box/Dus."
                                                    placeholder="Contoh: 10"
                                                    type="number"
                                                    // helperText="Dalam 1 satuan besar"
                                                />
                                            )}
                                        </form.Field>
                                    );
                                }}
                            </form.Subscribe>
                        </div>
                    </div>
                </div>

                {/* Satuan Penjualan + Jumlah - col-span-5 */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="grid grid-cols-5 lg:gap-2">
                        <div className="col-span-3">
                            <form.Field
                                name="satuan_penjualan"
                                validators={{
                                    onChange: ({
                                        value,
                                    }: {
                                        value: string;
                                    }) => {
                                        if (!value) {
                                            return 'Satuan Penjualan harus diisi';
                                        }
                                    },
                                }}
                            >
                                {(field: any) => (
                                    <ComboboxLabelAndHelper
                                        field={field}
                                        label="Satuan Penjualan"
                                        placeholder="Pilih satuan penjualan"
                                        initialItems={satuan}
                                        creatable={true}
                                        onCreate={(value) =>
                                            createItem(
                                                '/master-data/satuan',
                                                { nama_satuan: value },
                                                'Satuan berhasil ditambahkan',
                                                'Menambahkan satuan...',
                                                'nama_satuan',
                                            )
                                        }
                                    />
                                )}
                            </form.Field>
                        </div>
                        <div className="col-span-2">
                            <form.Subscribe
                                selector={(state: any) => ({
                                    satuanKecil: state.values.satuan_kecil,
                                    satuanPenjualan:
                                        state.values.satuan_penjualan,
                                })}
                            >
                                {(data: {
                                    satuanKecil?: string;
                                    satuanPenjualan?: string;
                                }) => {
                                    const label =
                                        data.satuanPenjualan && data.satuanKecil
                                            ? `1 ${data.satuanPenjualan} berapa ${data.satuanKecil}`
                                            : 'Jumlah';

                                    return (
                                        <form.Field
                                            name="jumlah_satuan_kecil_dalam_satuan_penjualan"
                                            validators={{
                                                onChange: ({
                                                    value,
                                                }: {
                                                    value: string;
                                                }) => {
                                                    if (!value) {
                                                        return 'Jumlah Satuan Kecil dalam Satuan Penjualan harus diisi';
                                                    }

                                                    if (isNaN(Number(value))) {
                                                        return 'Harus berupa angka';
                                                    }
                                                },
                                            }}
                                        >
                                            {(field: any) => (
                                                <InputLabelAndHelper
                                                    field={field}
                                                    labelInfo="Jumlah disini adalah jumlah satuan kecil dalam satuan penjualan. Contoh: jika  satuan kecil adalah 'Tablet' dan satuan penjualan adalah 'Strip', maka tulis disini 'berapa' jumlah Tablet dalam 1 Strip."
                                                    label={label}
                                                    placeholder="Contoh: 1"
                                                    type="number"
                                                    // helperText="Dalam 1 satuan penjualan"
                                                />
                                            )}
                                        </form.Field>
                                    );
                                }}
                            </form.Subscribe>
                        </div>
                    </div>
                </div>

                {/* Harga Jual - col-span-2 */}
                <div className="col-span-12 lg:col-span-2">
                    <form.Subscribe
                        selector={(state: any) => state.values.satuan_kecil}
                    >
                        {(satuanKecil: string) => (
                            <form.Field
                                name="harga_jual"
                                validators={{
                                    onChange: ({
                                        value,
                                    }: {
                                        value: string;
                                    }) => {
                                        if (!value) {
                                            return 'Harga Jual harus diisi';
                                        }

                                        if (isNaN(Number(value))) {
                                            return 'Harus berupa angka';
                                        }
                                    },
                                }}
                            >
                                {(field: any) => (
                                    <InputLabelAndHelper
                                        field={field}
                                        label={
                                            satuanKecil
                                                ? `Harga Jual (per ${satuanKecil})`
                                                : 'Harga Jual'
                                        }
                                        labelInfo="Harga jual adalah harga jual per satuan kecil. Contoh: jika satuan kecil adalah 'Tablet' dan harga jual per tablet adalah 500, maka tulis  500."
                                        placeholder="Harga jual"
                                        type="currency"
                                        helperText="Harga jual per satuan kecil"
                                    />
                                )}
                            </form.Field>
                        )}
                    </form.Subscribe>
                </div>
            </div>
        </div>
    );
}
