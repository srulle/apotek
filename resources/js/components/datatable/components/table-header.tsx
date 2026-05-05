'use client';

import { flexRender } from '@tanstack/react-table';
import {
    ArrowDownUp,
    ArrowUpAZ,
    ArrowDownAZ,
    ArrowUp01,
    ArrowDown10,
} from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import {
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

interface TableHeaderProps {
    table: any;
    enableRowExpansion: boolean;
    enableRowSelection: boolean;
}

export function DataTableHeader({
    table,
    enableRowExpansion,
    enableRowSelection,
}: TableHeaderProps) {
    const pageRows = table.getRowModel().rows;
    const selectedCount = pageRows.filter((row: any) => row.getIsSelected()).length;
    const allSelected = pageRows.length > 0 && selectedCount === pageRows.length;
    const someSelected = selectedCount > 0 && !allSelected;
    const headerChecked = allSelected ? true : someSelected ? 'indeterminate' : false;

    return (
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
                <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                >
                    {enableRowExpansion && (
                        <TableHead className="h-11 w-12"></TableHead>
                    )}
                    {enableRowSelection && (
                        <TableHead className="h-11 w-12">
                            <Checkbox
                                checked={headerChecked}
                                onCheckedChange={(value) =>
                                    table.toggleAllPageRowsSelected(
                                        !!value,
                                    )
                                }
                                aria-label="Pilih semua di halaman ini"
                            />
                        </TableHead>
                    )}
                    {headerGroup.headers.map((header: any) => {
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
                                                (e.key ===
                                                    'Enter' ||
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
                                        {(() => {
                                            const sortState =
                                                header.column.getIsSorted();
                                            const metaType = (
                                                header.column
                                                    .columnDef
                                                    .meta as any
                                            )?.sortIconType;

                                            if (!sortState) {
                                                return (
                                                    <ArrowDownUp
                                                        className="shrink-0 opacity-30"
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                );
                                            }

                                            let isNumeric =
                                                metaType ===
                                                'numeric';

                                            if (
                                                !metaType &&
                                                table.getCoreRowModel()
                                                    .rows.length > 0
                                            ) {
                                                const firstRowValue =
                                                    table
                                                        .getCoreRowModel()
                                                        .rows[0].getValue(
                                                            header
                                                                .column
                                                                .id,
                                                        );
                                                isNumeric =
                                                    typeof firstRowValue ===
                                                        'number' &&
                                                    !isNaN(
                                                        firstRowValue,
                                                    );
                                            }

                                            if (isNumeric) {
                                                return sortState ===
                                                    'asc' ? (
                                                    <ArrowUp01
                                                        className="shrink-0 opacity-70"
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <ArrowDown10
                                                        className="shrink-0 opacity-67"
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                );
                                            }

                                            return sortState ===
                                                'asc' ? (
                                                <ArrowUpAZ
                                                    className="shrink-0 opacity-70"
                                                    size={16}
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <ArrowDownAZ
                                                    className="shrink-0 opacity-70"
                                                    size={16}
                                                    aria-hidden="true"
                                                />
                                            );
                                        })()}
                                        {flexRender(
                                            header.column.columnDef
                                                .header,
                                            header.getContext(),
                                        )}
                                    </div>
                                ) : (
                                    flexRender(
                                        header.column.columnDef
                                            .header,
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
