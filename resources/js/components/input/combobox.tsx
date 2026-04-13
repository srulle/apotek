'use client';

import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useState } from 'react';


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
    onValueChange: (value: string) => void;
    onBlur?: () => void;
    initialItems?: string[];
    placeholder?: string;
    className?: string;
    creatable?: boolean;
    onCreate?: (value: string) => Promise<void> | void;
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
}: ComboboxProps) => {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(initialItems);
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (search && !items.includes(search)) {
            setIsCreating(true);

            try {
                if (onCreate) {
                    await onCreate(search);
                }

                setOpen(false);
                setSearch('');
                setItems([...items, search]);
                onValueChange(search);
            } finally {
                setIsCreating(false);
            }
        }
    };

    return (
        <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    aria-expanded={open}
                    className={cn('w-full justify-between', className)}
                    role="combobox"
                    variant="outline"
                    onBlur={onBlur}
                >
                    {value || placeholder}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-full p-0 duration-400 data-[state=open]:slide-in-from-bottom-10 data-[state=open]:zoom-in-100"
                style={{ width: 'var(--radix-popover-trigger-width)' }}
            >
                <Command>
                    <CommandInput
                        onValueChange={setSearch}
                        placeholder={
                            creatable ? 'Search or create...' : 'Search...'
                        }
                        value={search}
                    />
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
                                    key={item}
                                    onSelect={(currentValue) => {
                                        onValueChange(
                                            currentValue === value
                                                ? ''
                                                : currentValue,
                                        );
                                        setOpen(false);
                                    }}
                                    value={item}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 size-4',
                                            value === item
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {item}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {creatable &&
                            search &&
                            !items.includes(search) &&
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
            </PopoverContent>
        </Popover>
    );
};

// Props khusus untuk TanStack Form
export interface TanStackComboboxProps {
    field: any;
    label: string;
    placeholder?: string;
    initialItems?: string[];
    className?: string;
    creatable?: boolean;
    onCreate?: (value: string) => Promise<void> | void;
}

// Type guard untuk mengecek apakah props mengandung field TanStack Form
function isTanStackField(props: any): props is TanStackComboboxProps {
    return props.field && typeof props.field.handleChange === 'function';
}

const ComboboxLabelAndHelper = (props: TanStackComboboxProps) => {
    const {
        field,
        label,
        placeholder,
        initialItems,
        className,
        creatable,
        onCreate,
    } = props;
    const hasError = field.state.meta.errors.length > 0;
    const errorMessage = field.state.meta.errors.join(', ');

    return (
        <div className={`w-full space-y-2 ${className || ''}`}>
            <Label className={hasError ? 'text-destructive' : ''}>
                {label}
            </Label>
            <Combobox
                value={field.state.value}
                onValueChange={field.handleChange}
                onBlur={field.handleBlur}
                initialItems={initialItems}
                placeholder={placeholder}
                className={
                    hasError
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                }
                creatable={creatable}
                onCreate={onCreate}
            />
            {errorMessage && (
                <p className="-mt-2 text-xs text-destructive italic">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export { ComboboxLabelAndHelper };
export default Combobox;
