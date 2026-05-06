'use client';

import type { Table } from '@tanstack/react-table';
import { Trash2, X, ChevronsUpDownIcon, CheckIcon, SearchIcon, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

import { DeleteConfirm } from '@/components/confirm-action';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import type { FilterableColumn } from '../types';
import { FilterPopover } from './filter-popover';

interface ToolbarProps<T = any> {
    enableGlobalFilter: boolean;
    searchPlaceholder: string;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    filterableColumns: FilterableColumn[];
    columnFilters: Record<string, string[]>;
    setColumnFilters: React.Dispatch<
        React.SetStateAction<Record<string, string[]>>
    >;
    enableRowSelection: boolean;
    enableBulkDelete: boolean;
    onBulkDelete?: () => void | Promise<void>;
    enableColumnVisibility: boolean;
    table: Table<T>;
    rowSelection: Record<string, boolean>;
}

export function DataTableToolbar({
    enableGlobalFilter,
    searchPlaceholder,
    globalFilter,
    setGlobalFilter,
    filterableColumns,
    columnFilters,
    setColumnFilters,
    enableRowSelection,
    enableBulkDelete,
    onBulkDelete,
    enableColumnVisibility,
    table,
    rowSelection,
}: ToolbarProps) {
    const [popoverOpens, setPopoverOpens] = useState<Record<string, boolean>>(
        {},
    );
    const [columnVisibilityOpen, setColumnVisibilityOpen] = useState<boolean>(false);
    const [columnVisibilitySearch, setColumnVisibilitySearch] = useState<string>('');
    const [localColumnVisibility, setLocalColumnVisibility] = useState<Record<string, boolean>>({});

    // Update local state when table columns change
    useEffect(() => {
        const visibilityMap: Record<string, boolean> = {};
        table.getAllColumns().forEach(column => {
            visibilityMap[column.id] = column.getIsVisible();
        });
        setLocalColumnVisibility(visibilityMap);
    }, [table]);

    // Sync local state when column visibility changes
    useEffect(() => {
        const visibilityMap: Record<string, boolean> = {};
        table.getAllColumns().forEach(column => {
            visibilityMap[column.id] = column.getIsVisible();
        });
        setLocalColumnVisibility(prev => {
            // Only update if there's actually a change to avoid infinite loops
            const hasChanged = Object.keys(visibilityMap).some(key =>
                visibilityMap[key] !== prev[key]
            );

            return hasChanged ? visibilityMap : prev;
        });
    }, [table.getState().columnVisibility]);

    const selectedCount = Object.keys(rowSelection).length;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
            <div className="order-2 flex w-full flex-wrap items-center gap-3 md:min-w-3xl lg:order-1">
                {enableGlobalFilter && (
                    <div className="relative w-full sm:max-w-sm">
                        <SearchIcon className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            value={globalFilter ?? ''}
                            onChange={(e) =>
                                setGlobalFilter(String(e.target.value))
                            }
                            className="pr-10 pl-10"
                            placeholder={searchPlaceholder}
                        />
                        {(globalFilter ?? '') && (
                            <button
                                onClick={() => setGlobalFilter('')}
                                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                type="button"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}

                {filterableColumns.map((column: FilterableColumn) => {
                    const selectedValues = columnFilters[column.id] || [];
                    const isOpen = popoverOpens[column.id] || false;
                    const setIsOpen = (open: boolean) =>
                        setPopoverOpens((prev: Record<string, boolean>) => ({
                            ...prev,
                            [column.id]: open,
                        }));

                    return (
                        <FilterPopover
                            key={column.id}
                            column={column}
                            selectedValues={selectedValues}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            setColumnFilters={setColumnFilters}
                        />
                    );
                })}

                {enableColumnVisibility && (
                    <Popover open={columnVisibilityOpen} onOpenChange={setColumnVisibilityOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={columnVisibilityOpen}
                                className="order-3 h-auto min-h-8 w-full min-w-[110px] justify-between hover:bg-transparent sm:w-fit lg:order-2"
                            >
                                <span className="flex items-center gap-2">
                                    <div
                                        className="group flex h-5 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-input bg-background text-sm font-medium transition-colors hover:text-destructive hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            table.resetColumnVisibility();
                                            // Update local state for all columns
                                            const visibilityMap: Record<string, boolean> = {};
                                            table.getAllColumns().forEach(column => {
                                                visibilityMap[column.id] = column.getIsVisible();
                                            });
                                            setLocalColumnVisibility(visibilityMap);
                                            setColumnVisibilitySearch('');
                                        }}
                                        title="Reset kolom"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                table.resetColumnVisibility();
                                                const visibilityMap: Record<string, boolean> = {};
                                                table.getAllColumns().forEach(column => {
                                                    visibilityMap[column.id] = column.getIsVisible();
                                                });
                                                setLocalColumnVisibility(visibilityMap);
                                                setColumnVisibilitySearch('');
                                            }
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                    </div>
                                    <span>Kolom</span>
                                </span>
                                <ChevronsUpDownIcon
                                    className="ml-2 shrink-0 text-muted-foreground/80"
                                    aria-hidden="true"
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-(--radix-popper-anchor-width) min-w-62.5 max-w-lg p-0" align="start">
                            <Command>
                                <CommandInput
                                    placeholder="Cari kolom..."
                                    value={columnVisibilitySearch}
                                    onValueChange={setColumnVisibilitySearch}
                                />
                                <CommandList>
                                    <CommandEmpty>Tidak ada kolom.</CommandEmpty>
                                    <CommandGroup>
                                        {table
                                            .getAllColumns()
                                            .filter(column => column.getCanHide())
                                            .filter(column => {
                                                if (!columnVisibilitySearch) {
return true;
}

                                                const headerText = typeof column.columnDef.header === 'string'
                                                    ? column.columnDef.header
                                                    : column.id;

                                                return headerText.toLowerCase().includes(columnVisibilitySearch.toLowerCase());
                                            })
                                            .map(column => {
                                                const headerText = typeof column.columnDef.header === 'string'
                                                    ? column.columnDef.header
                                                    : column.id;
                                                const isVisible = localColumnVisibility[column.id] ?? column.getIsVisible();

                                                return (
                                                    <CommandItem
                                                        key={column.id}
                                                        onSelect={() => {
                                                            const newVisibility = !isVisible;
                                                            column.toggleVisibility(newVisibility);
                                                            setLocalColumnVisibility(prev => ({
                                                                ...prev,
                                                                [column.id]: newVisibility
                                                            }));
                                                        }}
                                                    >
                                                        <span className="truncate capitalize">{headerText}</span>
                                                        {isVisible && (
                                                            <CheckIcon
                                                                size={16}
                                                                className="ml-auto"
                                                            />
                                                        )}
                                                    </CommandItem>
                                                );
                                            })}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}
            </div>

            {enableRowSelection && selectedCount > 0 && (
                <div className="order-1 flex items-center gap-2 lg:order-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer px-3 py-1"
                        onClick={() => table.setRowSelection({})}
                    >
                        <X className="mr-1 h-4 w-4" />
                        {selectedCount} data dipilih
                    </Button>
                    {enableBulkDelete && onBulkDelete && (
                        <DeleteConfirm
                            title="Konfirmasi Hapus Terpilih"
                            description={`Apakah Anda yakin ingin menghapus ${selectedCount} item terpilih? Tindakan ini tidak dapat dibatalkan.`}
                            onConfirm={onBulkDelete}
                        >
                            <Button
                                variant="outline"
                                className="border-destructive! text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                            >
                                <Trash2 className="h-6 w-6" />
                            </Button>
                        </DeleteConfirm>
                    )}
                </div>
            )}
        </div>
    );
}
