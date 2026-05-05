'use client';

import { ChevronsUpDownIcon, CheckIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import type { FilterableColumn } from '../types';

interface FilterPopoverProps {
    column: FilterableColumn;
    selectedValues: string[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    setColumnFilters: React.Dispatch<
        React.SetStateAction<Record<string, string[]>>
    >;
}

export function FilterPopover({
    column,
    selectedValues,
    isOpen,
    setIsOpen,
    setColumnFilters,
}: FilterPopoverProps) {
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className="order-3 h-auto min-h-8 w-full min-w-[110px] justify-between hover:bg-transparent sm:w-fit lg:order-2"
                >
                    <span className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="group flex h-5 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors hover:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                setColumnFilters((prev) => ({
                                    ...prev,
                                    [column.accessorKey]: [],
                                }));
                            }}
                            title={
                                selectedValues.length > 0
                                    ? 'Bersihkan filter'
                                    : ''
                            }
                        >
                            {selectedValues.length > 0 ? (
                                <>
                                    <span className="group-hover:hidden">
                                        {selectedValues.length}
                                    </span>
                                    <span className="hidden font-bold group-hover:block">
                                        ✕
                                    </span>
                                </>
                            ) : (
                                selectedValues.length
                            )}
                        </Badge>
                        <span
                            className={
                                selectedValues.length === 0
                                    ? 'text-muted-foreground'
                                    : ''
                            }
                        >
                            {column.label}
                        </span>
                    </span>
                    <ChevronsUpDownIcon
                        className="ml-2 shrink-0 text-muted-foreground/80"
                        aria-hidden="true"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popper-anchor-width) max-w-sm p-0">
                <Command>
                    <CommandInput
                        placeholder={`Cari ${column.label.toLowerCase()}...`}
                    />
                    <CommandList>
                        <CommandEmpty>Tidak ada data.</CommandEmpty>
                        <CommandGroup>
                            {column.values.map((value) => (
                                <CommandItem
                                    key={value}
                                    value={value}
                                    onSelect={() => {
                                        setColumnFilters((prev) => {
                                            const current =
                                                prev[column.accessorKey] || [];
                                            const updated = current.includes(
                                                value,
                                            )
                                                ? current.filter(
                                                      (v) => v !== value,
                                                  )
                                                : [...current, value];

                                            return {
                                                ...prev,
                                                [column.accessorKey]: updated,
                                            };
                                        });
                                    }}
                                >
                                    <span className="truncate">{value}</span>
                                    {selectedValues.includes(value) && (
                                        <CheckIcon
                                            size={16}
                                            className="ml-auto"
                                        />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
