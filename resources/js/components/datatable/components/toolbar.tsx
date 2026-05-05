'use client';

import { SearchIcon, Trash2, X } from 'lucide-react';

import { DeleteConfirm } from '@/components/confirm-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { FilterableColumn } from '../types';
import { FilterPopover } from './filter-popover';

interface ToolbarProps {
    enableGlobalFilter: boolean;
    searchPlaceholder: string;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    filterableColumns: FilterableColumn[];
    columnFilters: Record<string, string[]>;
    setColumnFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
    popoverOpens: Record<string, boolean>;
    setPopoverOpens: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    enableRowSelection: boolean;
    enableBulkDelete: boolean;
    onBulkDelete?: () => void | Promise<void>;
    table: any;
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
    popoverOpens,
    setPopoverOpens,
    enableRowSelection,
    enableBulkDelete,
    onBulkDelete,
    table,
    rowSelection,
}: ToolbarProps) {
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
                            className="pl-10 pr-10"
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
            </div>

            {enableRowSelection &&
                selectedCount > 0 && (
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
