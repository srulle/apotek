'use client';

import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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
import { cn } from '@/lib/utils';

export const title = 'Create New Option Inline';

interface ComboboxProps {
    value: string;
    onValueChange?: (value: string) => void;
    onBlur?: () => void;
    initialItems?:
        | string[]
        | Array<{ value: string | number; label: string; subtitle?: string }>;
    placeholder?: string;
    className?: string;
    creatable?: boolean;
    onCreate?: (value: string) => Promise<void> | void;
    searchable?: boolean;
    fetchItems?: () => Promise<
        | string[]
        | Array<{ value: string | number; label: string; subtitle?: string }>
    >;
}

const Combobox = ({
    value,
    onValueChange,
    onBlur,
    initialItems = ['Tag 1', 'Tag 2', 'Tag 3'],
    placeholder = 'Select...',
    className,
    creatable = false,
    onCreate,
    searchable = true,
    fetchItems,
}: ComboboxProps) => {
    const [open, setOpen] = useState(false);

    const formatItem = (item: any) => {
        return typeof item === 'object' && 'label' in item
            ? {
                  label: item.label,
                  subtitle: item.subtitle,
                  value: item.value,
              }
            : { label: item, subtitle: undefined, value: item };
    };

    const [items, setItems] = useState(
        initialItems?.map(formatItem) ?? [],
    );
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && !isFetching && searchable) {
            // Use requestAnimationFrame to ensure DOM is ready
            const raf = requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
            
            return () => cancelAnimationFrame(raf);
        }
    }, [open, isFetching, searchable]);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);

        if (isOpen && fetchItems) {
            setIsFetching(true);

            try {
                const freshItems = await fetchItems();
                setItems(freshItems.map(formatItem));
            } catch (error) {
                console.error('Failed to fetch items:', error);
            } finally {
                setIsFetching(false);
            }
        }
    };

    const handleCreate = async () => {
        if (search && !items.some((item) => item.label === search)) {
            setIsCreating(true);

            try {
                if (onCreate) {
                    await onCreate(search);
                }

                setOpen(false);
                setSearch('');
                setItems([
                    ...items,
                    { label: search, subtitle: undefined, value: search },
                ]);
                onValueChange?.(search);
            } finally {
                setIsCreating(false);
            }
        }
    };

    return (
        <Popover onOpenChange={handleOpenChange} open={open}>
            <PopoverTrigger asChild>
                <Button
                    aria-expanded={open}
                    className={cn(
                        'w-full cursor-pointer justify-between gap-2',
                        className,
                    )}
                    role="combobox"
                    variant="outline"
                    onBlur={onBlur}
                >
                    <span className="min-w-0 flex-1 truncate text-left">
                        {value || placeholder}
                    </span>
                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-full p-0 duration-400 data-[state=open]:slide-in-from-bottom-10 data-[state=open]:zoom-in-100"
                style={{ width: 'var(--radix-popover-trigger-width)' }}
                onWheel={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
            >
                {isFetching ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        Loading...
                    </div>
                ) : (
                    <Command>
                        {searchable && (
                            <CommandInput
                                ref={inputRef}
                                onValueChange={setSearch}
                                placeholder={
                                    creatable ? 'Search or create...' : 'Search...'
                                }
                                value={search}
                            />
                        )}
                        <CommandList>
                            <CommandEmpty>
                                {creatable && search ? (
                                    <Button
                                        className="w-full justify-start"
                                        onClick={handleCreate}
                                        variant="ghost"
                                        disabled={isCreating}
                                    >
                                        <Plus className="mr-2 size-4" />
                                        {isCreating
                                            ? 'Menyimpan...'
                                            : `Create "${search}"`}
                                    </Button>
                                ) : (
                                    <p className="p-2 text-sm text-muted-foreground">
                                        No results found.
                                    </p>
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.label}
                                        onSelect={(currentValue) => {
                                            onValueChange?.(
                                                currentValue === value
                                                    ? ''
                                                    : currentValue,
                                            );
                                            setOpen(false);
                                        }}
                                        value={item.label}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 size-4',
                                                value === item.label
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        <div className="flex flex-1 items-center justify-between">
                                            <span>{item.label}</span>
                                            {item.subtitle && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    {item.subtitle}
                                                </span>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            {creatable &&
                                search &&
                                !items.some((item) => item.label === search) &&
                                items.length > 0 && (
                                    <>
                                        <CommandSeparator />
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={handleCreate}
                                                disabled={isCreating}
                                            >
                                                <Plus className="mr-2 size-4" />
                                                {isCreating
                                                    ? 'Menyimpan...'
                                                    : `Create "${search}"`}
                                            </CommandItem>
                                        </CommandGroup>
                                    </>
                                )}
                        </CommandList>
                    </Command>
                )}
            </PopoverContent>
        </Popover>
    );
};

// Props khusus untuk TanStack Form
export interface TanStackComboboxProps {
    field?: any;
    label: string;
    placeholder?: string;
    initialItems?:
        | string[]
        | Array<{ value: string | number; label: string; subtitle?: string }>;
    className?: string;
    creatable?: boolean;
    onCreate?: (value: string) => Promise<void> | void;
    searchable?: boolean;
    fetchItems?: () => Promise<
        | string[]
        | Array<{ value: string | number; label: string; subtitle?: string }>
    >;
}

interface ComboboxLabelAndHelperProps extends TanStackComboboxProps {
    value?: string;
    onValueChange?: (value: string) => void;
    helperText?: string;
}

const ComboboxLabelAndHelper = (props: ComboboxLabelAndHelperProps) => {
    const {
        field,
        label,
        placeholder,
        initialItems,
        className,
        creatable,
        onCreate,
        searchable,
        fetchItems,
        value,
        onValueChange,
        helperText,
    } = props;

    const isFieldMode =
        field && typeof field.handleChange === 'function' && field.state;
    const currentValue = isFieldMode ? field.state.value : value || '';
    const hasError = isFieldMode && field.state.meta.errors.length > 0;
    const errorMessage = isFieldMode
        ? field.state.meta.errors.map((e: any) => e.message || e).join(', ')
        : '';

    // Handle object initialItems {value, label, subtitle?}
    const isObjectItems =
        initialItems &&
        initialItems.length > 0 &&
        typeof initialItems[0] === 'object';
    const itemsAsObjects = isObjectItems
        ? (
              initialItems as Array<{
                  value: string | number;
                  label: string;
                  subtitle?: string;
              }>
          ).map((item) => ({
              label: item.label,
              subtitle: item.subtitle,
              value: item.value,
          }))
        : (initialItems as string[]).map((item) => ({
              label: item,
              subtitle: undefined,
              value: item,
          }));

    // Find label for current value if using object items
    let displayValue = currentValue;

    if (isObjectItems && currentValue) {
        const foundItem = (
            initialItems as Array<{ value: string | number; label: string }>
        ).find((item) => item.value.toString() === currentValue.toString());

        if (foundItem) {
            displayValue = foundItem.label;
        }
    }

    const handleValueChange = (selectedLabel: string) => {
        let valueToSend: string;

        if (isObjectItems) {
            // Find the corresponding value for the selected label
            const foundItem = (
                initialItems as Array<{ value: string | number; label: string }>
            ).find((item) => item.label === selectedLabel);

            valueToSend = foundItem
                ? foundItem.value.toString()
                : selectedLabel;
        } else {
            valueToSend = selectedLabel;
        }

        // If in field mode, update the field value
        if (isFieldMode) {
            field.handleChange(valueToSend);
        }

        // Always call the onValueChange callback if provided (works for both field and non-field mode)
        if (onValueChange) {
            onValueChange(valueToSend);
        }
    };

    return (
        <div className={`w-full space-y-2 p-1 ${className || ''}`}>
            <Label className={hasError ? 'text-destructive' : ''}>
                {label}
            </Label>
            <Combobox
                value={displayValue}
                onValueChange={handleValueChange}
                onBlur={isFieldMode ? field.handleBlur : undefined}
                initialItems={itemsAsObjects}
                placeholder={placeholder}
                className={
                    hasError
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                }
                creatable={creatable}
                onCreate={onCreate}
                searchable={searchable}
                fetchItems={fetchItems}
            />
            {errorMessage && (
                <p className="-mt-2 text-xs text-destructive italic">
                    {errorMessage}
                </p>
            )}
            {helperText && !errorMessage && (
                <p className="-mt-2 text-xs text-muted-foreground italic">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export { Combobox, ComboboxLabelAndHelper };
export default Combobox;
