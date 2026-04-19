'use client';

import { SquareCheckBig } from 'lucide-react';
import { useCallback } from 'react';

import { Modal } from '@/components/modal';
import { CommandItem } from '@/components/ui/command';

import PurchaseItemDetailForm from '@/pages/transaksi/pembelian/components/PurchaseItemDetailForm';
import type { ComboboxItem } from './types';

interface ComboboxItemRendererProps {
    item: ComboboxItem;
    groupTitle?: string;
    selectedValues: (string | number)[];
    popoverOpen: string | null;
    setPopoverOpen: (key: string | null) => void;
    handleSelectItem: (item: ComboboxItem) => void;
    renderPopoverContent?: (
        item: ComboboxItem,
        onSelectItem: () => void,
        onClosePopover: () => void,
    ) => React.ReactNode;
    closeCombobox: () => void;
    renderOnlyModal?: boolean;
}

const ComboboxItemRenderer = ({
    item,
    groupTitle,
    selectedValues,
    popoverOpen,
    setPopoverOpen,
    handleSelectItem,
    renderPopoverContent,
    closeCombobox,
    renderOnlyModal = false,
}: ComboboxItemRendererProps) => {
    const popoverKey = groupTitle
        ? `${groupTitle}-${item.id}`
        : `no-group-${item.id}`;

    const onSelect = useCallback(() => {
        // ✅ Log data item obat yang dipilih ke console
        console.log('✅ Item combobox dipilih:');
        console.table({
            id: item.id,
            label: item.label,
            subtitle: item.subtitle,
            satuan_besar: item.satuan_besar,
            satuan_kecil: item.satuan_kecil,
            isi_per_satuan: item.isi_per_satuan,
        });
        console.log('   Full object:', item);

        // ✅ HANYA tutup combobox dan buka modal saja
        // ❌ TIDAK menambahkan item ke selected / table dulu
        closeCombobox();
        // ✅ Buka modal untuk isi detail
        setTimeout(() => {
            setPopoverOpen(popoverOpen === popoverKey ? null : popoverKey);
        }, 50);
    }, [popoverOpen, popoverKey, setPopoverOpen, item, closeCombobox]);

    const onSelectItem = useCallback(
        (formData: any = {}) => {
            handleSelectItem({ ...item, ...formData });
            setPopoverOpen(null);
        },
        [item, handleSelectItem, setPopoverOpen],
    );

    const onClose = useCallback(() => {
        setPopoverOpen(null);
    }, [setPopoverOpen]);

    const handleModalKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Hentikan propagasi Enter dan Escape agar tidak mencapai parent Command component
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.stopPropagation();
        }
    }, []);

    if (renderOnlyModal) {
        // ✅ Hanya render Modal saja (tanpa CommandItem trigger) - dipanggil dari luar Popover
        return popoverOpen === popoverKey ? (
            <Modal
                key={`modal-${popoverKey}`}
                open={true}
                onOpenChange={(open) =>
                    setPopoverOpen(open ? popoverKey : null)
                }
                title={item.label}
                size="md"
                persistent={true}
                trigger={null}
            >
                <div onKeyDown={handleModalKeyDown}>
                    {renderPopoverContent ? (
                        renderPopoverContent(item, onSelectItem, onClose)
                    ) : (
                        <PurchaseItemDetailForm
                            item={item}
                            onSelectItem={onSelectItem}
                            onClosePopover={onClose}
                        />
                    )}
                </div>
            </Modal>
        ) : null;
    }

    // ✅ Render hanya CommandItem trigger saja di dalam Popover
    return (
        <CommandItem
            className="flex cursor-pointer items-start justify-between gap-2 py-1.5"
            value={item.label}
            onSelect={onSelect}
        >
            <div className="flex items-center gap-2">
                <SquareCheckBig
                    className={`size-5 shrink-0 ${
                        selectedValues.includes(item.id)
                            ? 'opacity-100'
                            : 'opacity-0'
                    }`}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-4">
                    <span className="truncate font-medium">{item.label}</span>
                    {item.subtitle && (
                        <span className="-mt-1 truncate text-xs text-muted-foreground italic">
                            {item.subtitle}
                        </span>
                    )}
                </div>
            </div>
        </CommandItem>
    );
};

export default ComboboxItemRenderer;
