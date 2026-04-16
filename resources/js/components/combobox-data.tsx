'use client';

import { CheckIcon, ChevronsUpDownIcon, InfoIcon } from 'lucide-react';
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
}

// Sub-component untuk tombol info dan popover detail item
const ItemInfoPopover = ({
    item,
    groupTitle,
    popoverKey,
    isOpen,
    onOpenChange,
    onSelectItem,
}: {
    item: ComboboxItem;
    groupTitle?: string;
    popoverKey: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectItem: () => void;
}) => {
    return (
        <Popover open={isOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    className="size-6 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                    size="icon"
                    variant="ghost"
                >
                    <InfoIcon className="size-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">
                            Informasi Obat
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Detail informasi obat
                        </p>
                    </div>
                    <div className="grid gap-3">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label className="text-sm font-medium">Nama</Label>
                            <div className="col-span-2 text-sm">
                                {item.label}
                            </div>
                        </div>
                        {groupTitle && (
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label className="text-sm font-medium">
                                    Kategori
                                </Label>
                                <div className="col-span-2 text-sm">
                                    {groupTitle}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-3 items-start gap-4">
                            <Label className="text-sm font-medium">Unit</Label>
                            <div className="col-span-2 text-sm">
                                {item.subtitle}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            onClick={() => {
                                onSelectItem();
                                onOpenChange(false);
                            }}
                        >
                            OK
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

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
                    <CommandItem
                        className="flex items-start justify-between gap-2 py-3"
                        key={item.id}
                        value={item.label}
                        onSelect={() => handleSelectItem(item)}
                    >
                        <div className="flex items-start gap-2">
                            <CheckIcon
                                className={`mt-0.5 size-4 shrink-0 ${
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
                                    <span className="truncate text-xs text-muted-foreground italic">
                                        {item.subtitle}
                                    </span>
                                )}
                            </div>
                        </div>

                        <ItemInfoPopover
                            item={item}
                            groupTitle={groupTitle}
                            popoverKey={popoverKey}
                            isOpen={popoverOpen === popoverKey}
                            onOpenChange={(open) =>
                                setPopoverOpen(open ? popoverKey : null)
                            }
                            onSelectItem={() => handleSelectItem(item)}
                        />
                    </CommandItem>
                );
            },
            [selectedValues, handleSelectItem, popoverOpen],
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
                            <CommandList>
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
