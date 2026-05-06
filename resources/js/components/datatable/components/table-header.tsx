'use client';

import { flexRender } from '@tanstack/react-table';
import type { Table, HeaderGroup, Header, SortingState } from '@tanstack/react-table';
import { ArrowDownUp, ArrowDownZA, ArrowUpAZ, ArrowDown10, ArrowUp01 } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { cn } from '@/lib/utils';

interface TableHeaderProps<T = any> {
    table: Table<T>;
    sorting: SortingState;
    enableRowExpansion: boolean;
    enableRowSelection: boolean;
}

export function DataTableHeader<T = any>({
    table,
    sorting,
    enableRowExpansion,
    enableRowSelection,
}: TableHeaderProps<T>) {
    const pageRows = table.getRowModel().rows;
    const selectedCount = pageRows.filter((row) => row.getIsSelected()).length;
    const allSelected =
        pageRows.length > 0 && selectedCount === pageRows.length;
    const someSelected = selectedCount > 0 && !allSelected;
    const headerChecked = allSelected
        ? true
        : someSelected
          ? 'indeterminate'
          : false;

    return (
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {enableRowExpansion && (
                        <TableHead className="h-11 w-12"></TableHead>
                    )}
                    {enableRowSelection && (
                        <TableHead className="h-11 w-12">
                            <Checkbox
                                checked={headerChecked}
                                onCheckedChange={(value) =>
                                    table.toggleAllPageRowsSelected(!!value)
                                }
                                aria-label="Pilih semua di halaman ini"
                            />
                        </TableHead>
                    )}
                    {headerGroup.headers.filter((header: Header<T, unknown>) => header.column.getIsVisible()).map((header: Header<T, unknown>) => {
                        const sortEntry = sorting.find(s => s.id === header.column.id);
                        const isSorted = Boolean(sortEntry);
                        const sortDirection = sortEntry?.desc ? 'desc' : (sortEntry ? 'asc' : null);
                        
                        // Determine if column is numeric
                        const meta = header.column.columnDef.meta as any;
                        const isNumeric = meta?.sortIconType === 'numeric';
                        
                        return (
                            <TableHead
                                key={header.id}
                                style={{
                                    width: `${header.getSize()}px`,
                                }}
                                className="h-11"
                            >
                                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                    <div
                                        className={cn(
                                            header.column.getCanSort() &&
                                                'flex h-full cursor-pointer items-center gap-2 select-none',
                                        )}
                                        onClick={header.column.getToggleSortingHandler()}
                                        onKeyDown={(e) => {
                                            if (
                                                header.column.getCanSort() &&
                                                (e.key === 'Enter' ||
                                                    e.key === ' ')
                                            ) {
                                                e.preventDefault();
                                                header.column.getToggleSortingHandler()?.(
                                                    e,
                                                );
                                            }
                                        }}
                                        tabIndex={
                                            header.column.getCanSort()
                                                ? 0
                                                : undefined
                                        }
                                    >
                                        {sortDirection === 'asc' ? (
                                            isNumeric ? (
                                                <ArrowUp01
                                                    className={`shrink-0 ${isSorted ? 'opacity-70' : 'opacity-30'}`}
                                                    style={{ opacity: isSorted ? 0.7 : 0.3 }}
                                                    size={16}
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <ArrowUpAZ
                                                    className={`shrink-0 ${isSorted ? 'opacity-70' : 'opacity-30'}`}
                                                    style={{ opacity: isSorted ? 0.7 : 0.3 }}
                                                    size={16}
                                                    aria-hidden="true"
                                                />
                                            )
                                        ) : sortDirection === 'desc' ? (
                                            isNumeric ? (
                                                <ArrowDown10
                                                    className={`shrink-0 ${isSorted ? 'opacity-70' : 'opacity-30'}`}
                                                    style={{ opacity: isSorted ? 0.7 : 0.3 }}
                                                    size={16}
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <ArrowDownZA
                                                    className={`shrink-0 ${isSorted ? 'opacity-70' : 'opacity-30'}`}
                                                    style={{ opacity: isSorted ? 0.7 : 0.3 }}
                                                    size={16}
                                                    aria-hidden="true"
                                                />
                                            )
                                        ) : (
                                            <ArrowDownUp
                                                className={`shrink-0 ${isSorted ? 'opacity-70' : 'opacity-30'}`}
                                                style={{ opacity: isSorted ? 0.7 : 0.3 }}
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        )}
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </div>
                                ) : (
                                    flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )
                                )}
                            </TableHead>
                        );
                    })}
                </TableRow>
            ))}
        </TableHeader>
    );
}
