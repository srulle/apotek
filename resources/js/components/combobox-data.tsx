'use client';

import { SquareCheckBig, ChevronsUpDownIcon } from 'lucide-react';
import { useId, useState, forwardRef, useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

// Tipe data generic untuk item combobox
export interface ComboboxItem {
    id: string | number;
    label: string;
    subtitle?: string;
    image?: string;
    [key: string]: any;
}

export interface ComboboxGroup {
    title: string;
    items: ComboboxItem[];
}

interface ComboboxDataProps {
    items: ComboboxItem[] | ComboboxGroup[];
    value?: string | number | (string | number)[];
    onChange?: (
        value: string | number | (string | number)[] | null,
        item?: ComboboxItem | ComboboxItem[],
    ) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
    multiple?: boolean;
    renderPopoverContent?: (
        item: ComboboxItem,
        onSelectItem: () => void,
        onClosePopover: () => void,
    ) => React.ReactNode;
}

const ComboboxData = forwardRef<HTMLButtonElement, ComboboxDataProps>(
    (
        {
            items,
            value,
            onChange,
            placeholder = 'Pilih data',
            searchPlaceholder = 'Cari data...',
            emptyMessage = 'Data tidak ditemukan.',
            label,
            className = '',
            disabled = false,
            id: customId,
            multiple = false,
            renderPopoverContent,
        },
        ref,
    ) => {
        const generatedId = useId();
        const componentId = customId || generatedId;
        const [open, setOpen] = useState(false);
        const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

        // Handle both flat array and grouped array structures
        const isGrouped = useMemo(
            () => items.length > 0 && 'title' in items[0],
            [items],
        );

        const allItems = useMemo(
            () =>
                isGrouped
                    ? (items as ComboboxGroup[]).flatMap((group) => group.items)
                    : (items as ComboboxItem[]),
            [items, isGrouped],
        );

        // Handle multi-select vs single-select
        const selectedValues = useMemo(() => {
            if (multiple) {
                return Array.isArray(value) ? value : value ? [value] : [];
            }

            return Array.isArray(value)
                ? value.slice(0, 1)
                : value
                  ? [value]
                  : [];
        }, [value, multiple]);

        const selectedItems = useMemo(
            () => allItems.filter((item) => selectedValues.includes(item.id)),
            [allItems, selectedValues],
        );

        // Handler select item yang bisa dipakai dimanapun
        const handleSelectItem = useCallback(
            (item: ComboboxItem) => {
                if (multiple) {
                    const isSelected = selectedValues.includes(item.id);
                    const newValues = isSelected
                        ? selectedValues.filter((v) => v !== item.id)
                        : [...selectedValues, item.id];

                    const newItems = newValues
                        .map((id) => allItems.find((i) => i.id === id))
                        .filter(Boolean) as ComboboxItem[];

                    onChange?.(newValues, newItems);
                } else {
                    const newValue = value === item.id ? null : item.id;
                    onChange?.(newValue, newValue ? item : undefined);
                    setOpen(false);
                }
            },
            [multiple, selectedValues, allItems, onChange, value],
        );

        // Handler untuk render item yang sama untuk grouped maupun non grouped
        const renderCommandItem = useCallback(
            (item: ComboboxItem, groupTitle?: string) => {
                const popoverKey = groupTitle
                    ? `${groupTitle}-${item.id}`
                    : `no-group-${item.id}`;

                return (
                    <Popover
                        key={item.id}
                        open={popoverOpen === popoverKey}
                        onOpenChange={(open) =>
                            setPopoverOpen(open ? popoverKey : null)
                        }
                    >
                        <PopoverTrigger asChild>
                            <CommandItem
                                className="flex cursor-pointer items-start justify-between gap-2 py-1.5"
                                value={item.label}
                                onSelect={() => {
                                    // Buka popover ketika item di klik
                                    setPopoverOpen(
                                        popoverOpen === popoverKey
                                            ? null
                                            : popoverKey,
                                    );
                                }}
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
                                        <span className="truncate font-medium">
                                            {item.label}
                                        </span>
                                        {item.subtitle && (
                                            <span className="-mt-1 truncate text-xs text-muted-foreground italic">
                                                {item.subtitle}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CommandItem>
                        </PopoverTrigger>

                        <PopoverContent className="w-90 p-3">
                            {renderPopoverContent ? (
                                renderPopoverContent(
                                    item,
                                    () => {
                                        handleSelectItem(item);
                                        setPopoverOpen(null);
                                    },
                                    () => setPopoverOpen(null),
                                )
                            ) : (
                                <div className="grid gap-3">
                                    <div className="space-y-1">
                                        <h4 className="leading-none font-medium">
                                            {item.label}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Masukkan jumlah pembelian
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium">
                                                Jumlah Beli
                                            </Label>
                                            <input
                                                type="number"
                                                className="mt-1 w-full rounded-md border p-2"
                                                defaultValue="1"
                                                min="1"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">
                                                Harga Beli
                                            </Label>
                                            <input
                                                type="number"
                                                className="mt-1 w-full rounded-md border p-2"
                                                placeholder="Masukkan harga beli"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setPopoverOpen(null)}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                handleSelectItem(item);
                                                setPopoverOpen(null);
                                            }}
                                        >
                                            Tambahkan
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>
                );
            },
            [
                selectedValues,
                handleSelectItem,
                popoverOpen,
                renderPopoverContent,
            ],
        );

        return (
            <div className={`w-full space-y-2 ${className}`}>
                {label && <Label htmlFor={componentId}>{label}</Label>}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={ref}
                            id={componentId}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                            disabled={disabled}
                        >
                            {selectedItems.length > 0 ? (
                                multiple ? (
                                    <span className="truncate font-medium">
                                        {selectedItems.length} item
                                        {selectedItems.length > 1
                                            ? 's'
                                            : ''}{' '}
                                        selected
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 overflow-hidden">
                                        {selectedItems[0].image && (
                                            <img
                                                src={selectedItems[0].image}
                                                alt={selectedItems[0].label}
                                                className="size-6 rounded-full object-cover"
                                            />
                                        )}
                                        <span className="truncate font-medium">
                                            {selectedItems[0].label}
                                        </span>
                                    </span>
                                )
                            ) : (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            )}
                            <ChevronsUpDownIcon
                                className="ml-2 shrink-0 text-muted-foreground/80"
                                aria-hidden="true"
                            />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-(--radix-popover-trigger-width) p-0"
                        align="start"
                    >
                        <Command>
                            <CommandInput placeholder={searchPlaceholder} />
                            <CommandList onScroll={() => setPopoverOpen(null)}>
                                <CommandEmpty>{emptyMessage}</CommandEmpty>

                                {isGrouped ? (
                                    (items as ComboboxGroup[]).map(
                                        (group, index) => (
                                            <div key={group.title}>
                                                <CommandGroup
                                                    heading={group.title}
                                                >
                                                    {group.items.map((item) =>
                                                        renderCommandItem(
                                                            item,
                                                            group.title,
                                                        ),
                                                    )}
                                                </CommandGroup>
                                                {index <
                                                    (items as ComboboxGroup[])
                                                        .length -
                                                        1 && (
                                                    <div className="px-4">
                                                        <CommandSeparator />
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <CommandGroup>
                                        {(items as ComboboxItem[]).map((item) =>
                                            renderCommandItem(item),
                                        )}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        );
    },
);

ComboboxData.displayName = 'ComboboxData';

export default ComboboxData;
