'use client';

import { ChevronsUpDownIcon } from 'lucide-react';
import { useId, useState, forwardRef, useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import ComboboxItemRenderer from './ComboboxItemRenderer';
import type { ComboboxDataProps, ComboboxItem, ComboboxGroup } from './types';

const ComboboxData = forwardRef<HTMLButtonElement, ComboboxDataProps>(
    (
        {
            items,
            value,
            onChange,
            onItemSelect,
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
                if (Array.isArray(value)) {
                    return value.map((v: any) => v.id ?? v);
                }

                return [];
            }

            return Array.isArray(value)
                ? (value as any[]).slice(0, 1)
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
            (item: ComboboxItem & Record<string, any>) => {
                if (multiple) {
                    // Selalu tambahkan item dengan uniqueId, bahkan jika sudah selected (untuk duplikat)
                    const uniqueId = `item-${item.id}-${Date.now()}-${Math.random()}`;
                    const newEntry = { id: item.id, uniqueId };
                    const newValues = [...value, newEntry];

                    const newItems = newValues
                        .map((v) => allItems.find((i) => i.id === v.id))
                        .filter(Boolean) as ComboboxItem[];

                    onChange?.(newValues, newItems);
                    onItemSelect?.({ uniqueId, ...item });
                } else {
                    const newValue = value === item.id ? null : item.id;
                    onChange?.(newValue, item);
                    setOpen(false);
                }
            },
            [multiple, value, allItems, onChange, onItemSelect],
        );

        return (
            <div className={`p-1 space-y-2 ${className}`}>
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
                                                    {group.items.map((item) => (
                                                        <ComboboxItemRenderer
                                                            key={item.id}
                                                            item={item}
                                                            groupTitle={
                                                                group.title
                                                            }
                                                            selectedValues={
                                                                selectedValues
                                                            }
                                                            popoverOpen={
                                                                popoverOpen
                                                            }
                                                            setPopoverOpen={
                                                                setPopoverOpen
                                                            }
                                                            handleSelectItem={
                                                                handleSelectItem
                                                            }
                                                            renderPopoverContent={
                                                                renderPopoverContent
                                                            }
                                                            closeCombobox={() =>
                                                                setOpen(false)
                                                            }
                                                        />
                                                    ))}
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
                                        {(items as ComboboxItem[]).map(
                                            (item) => (
                                                <ComboboxItemRenderer
                                                    key={item.id}
                                                    item={item}
                                                    selectedValues={
                                                        selectedValues
                                                    }
                                                    popoverOpen={popoverOpen}
                                                    setPopoverOpen={
                                                        setPopoverOpen
                                                    }
                                                    handleSelectItem={
                                                        handleSelectItem
                                                    }
                                                    renderPopoverContent={
                                                        renderPopoverContent
                                                    }
                                                    closeCombobox={() =>
                                                        setOpen(false)
                                                    }
                                                />
                                            ),
                                        )}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>

                    {/* ✅ Modal dirender LUAR Popover agar tidak ikut tertutup ketika Combobox ditutup */}
                    {isGrouped &&
                        (items as ComboboxGroup[]).flatMap((group) =>
                            group.items.map((item) => (
                                <ComboboxItemRenderer
                                    key={`modal-${group.title}-${item.id}`}
                                    item={item}
                                    groupTitle={group.title}
                                    selectedValues={selectedValues}
                                    popoverOpen={popoverOpen}
                                    setPopoverOpen={setPopoverOpen}
                                    handleSelectItem={handleSelectItem}
                                    renderPopoverContent={renderPopoverContent}
                                    closeCombobox={() => setOpen(false)}
                                    renderOnlyModal={true}
                                />
                            )),
                        )}

                    {!isGrouped &&
                        (items as ComboboxItem[]).map((item) => (
                            <ComboboxItemRenderer
                                key={`modal-${item.id}`}
                                item={item}
                                selectedValues={selectedValues}
                                popoverOpen={popoverOpen}
                                setPopoverOpen={setPopoverOpen}
                                handleSelectItem={handleSelectItem}
                                renderPopoverContent={renderPopoverContent}
                                closeCombobox={() => setOpen(false)}
                                renderOnlyModal={true}
                            />
                        ))}
                </Popover>
            </div>
        );
    },
);

ComboboxData.displayName = 'ComboboxData';

export default ComboboxData;
