'use client';

import type {
    ColumnDef,
    PaginationState,
    SortingState,
    RowSelectionState,
    ExpandedState,
} from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState, useMemo, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { cn } from '@/lib/utils';

import { DataTablePagination } from './components/pagination';
import { DataTableHeader } from './components/table-header';
import { DataTableToolbar } from './components/toolbar';
import type { DataTableProps } from './types';
import { getFilterableColumns, processColumns, filterData } from './utils';

const DataTable = <T,>({
    data,
    columns,
    getRowId,
    initialPagination = { pageIndex: 0, pageSize: 5 },
    initialSorting = [],
    pageSizeOptions = [5, 10, 25, 50],
    emptyMessage = 'Tidak ada data',
    className = '',
    enableRowSelection = false,
    onSelectionChange,
    enableGlobalFilter = false,
    searchPlaceholder = 'Cari...',
    enableRowExpansion = false,
    renderExpandedRow,
    enableBulkDelete = false,
    onBulkDelete,
}: DataTableProps<T>) => {
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);
    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [columnFilters, setColumnFilters] = useState<
        Record<string, string[]>
    >({});
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const prevDataLengthRef = useRef(data.length);

    useEffect(() => {
        if (data.length < prevDataLengthRef.current) {
            setRowSelection({});
        }

        prevDataLengthRef.current = data.length;
    }, [data.length, setRowSelection]);

    const processedColumns = useMemo(() => {
        return processColumns(columns);
    }, [columns]);

    const filterableColumns = useMemo(() => {
        return getFilterableColumns(processedColumns, data);
    }, [processedColumns, data]);

    const filteredData = useMemo(() => {
        return filterData(data, globalFilter, columnFilters, processedColumns);
    }, [data, globalFilter, columnFilters, processedColumns]);

    const disableActions = Object.keys(rowSelection).length > 1;

    useEffect(() => {
        const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

        if (pagination.pageIndex >= totalPages && totalPages > 0) {
            setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(0, totalPages - 1),
            }));
        }
    }, [filteredData.length, pagination.pageIndex, pagination.pageSize]);

    const table = useReactTable({
        data: filteredData,
        columns: processedColumns as ColumnDef<T>[],
        ...(getRowId ? { getRowId: getRowId as any } : {}),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: true,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        autoResetPageIndex: false,
        enableRowSelection: enableRowSelection,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        meta: {
            disableActions,
        },
        state: {
            sorting,
            pagination,
            rowSelection,
            globalFilter,
            expanded,
        },
    });

    useEffect(() => {
        if (onSelectionChange) {
            const selectedRows = table
                .getSelectedRowModel()
                .rows.map((row) => row.original);
            onSelectionChange(selectedRows);
        }
    }, [rowSelection, onSelectionChange, table]);

    return (
        <div className={`space-y-4 md:w-full ${className}`}>
            <DataTableToolbar
                enableGlobalFilter={enableGlobalFilter}
                searchPlaceholder={searchPlaceholder}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                filterableColumns={filterableColumns}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                enableRowSelection={enableRowSelection}
                enableBulkDelete={enableBulkDelete}
                onBulkDelete={onBulkDelete}
                table={table}
                rowSelection={rowSelection}
            />

            <div className="rounded-md border">
                <Table>
                    <DataTableHeader
                        table={table}
                        enableRowExpansion={enableRowExpansion}
                        enableRowSelection={enableRowSelection}
                    />
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.flatMap((row) => {
                                const rows = [
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                        className={cn(
                                            row.getIsExpanded()
                                                ? 'font-semibold'
                                                : '',
                                        )}
                                    >
                                        {enableRowExpansion && (
                                            <TableCell className="w-12">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        row.toggleExpanded()
                                                    }
                                                    className="h-6 w-6 p-0"
                                                >
                                                    {row.getIsExpanded() ? (
                                                        <ChevronDownIcon className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRightIcon className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        )}
                                        {enableRowSelection && (
                                            <TableCell className="w-12">
                                                <Checkbox
                                                    checked={row.getIsSelected()}
                                                    onCheckedChange={(value) =>
                                                        row.toggleSelected(
                                                            !!value,
                                                        )
                                                    }
                                                    aria-label="Pilih baris"
                                                />
                                            </TableCell>
                                        )}
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>,
                                ];

                                if (row.getIsExpanded() && renderExpandedRow) {
                                    rows.push(
                                        <TableRow key={`${row.id}-expanded`}>
                                            <TableCell
                                                colSpan={
                                                    (enableRowExpansion
                                                        ? 1
                                                        : 0) +
                                                    (enableRowSelection
                                                        ? 1
                                                        : 0) +
                                                    columns.length
                                                }
                                                className="bg-muted/40"
                                            >
                                                {renderExpandedRow(
                                                    row.original,
                                                )}
                                            </TableCell>
                                        </TableRow>,
                                    );
                                }

                                return rows;
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        (enableRowExpansion ? 1 : 0) +
                                        (enableRowSelection ? 1 : 0) +
                                        columns.length
                                    }
                                    className="h-24 text-center"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {table.getRowCount() >= 6 && (
                <DataTablePagination
                    table={table}
                    pageSizeOptions={pageSizeOptions}
                    pagination={pagination}
                />
            )}
        </div>
    );
};

export { DataTable };
export type { DataTableProps } from './types';
export { SimpleDatatable } from './simple-datatable';
export type { SimpleDatatableProps } from './types';
