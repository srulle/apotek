'use client';

import type {
    ColumnDef,
    PaginationState,
    SortingState,
    RowSelectionState,
    ExpandedState,
    VisibilityState,
} from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDownIcon, ChevronRightIcon, ChevronsUpDownIcon, CheckIcon, RotateCcw } from 'lucide-react';
import { useEffect, useState, useMemo, useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { cn } from '@/lib/utils';

import { DataTablePagination } from './components/pagination';
import { DataTableHeader } from './components/table-header';
import { DataTableToolbar } from './components/toolbar';

// Column visibility trigger component for bottom placement
function ColumnVisibilityTrigger({ table }: { table: any }) {
    const [columnVisibilityOpen, setColumnVisibilityOpen] = useState<boolean>(false);
    const [columnVisibilitySearch, setColumnVisibilitySearch] = useState<string>('');
    const [localColumnVisibility, setLocalColumnVisibility] = useState<Record<string, boolean>>({});

    // Update local state when table columns change
    useEffect(() => {
        const visibilityMap: Record<string, boolean> = {};
        table.getAllColumns().forEach((column: any) => {
            visibilityMap[column.id] = column.getIsVisible();
        });
        setLocalColumnVisibility(visibilityMap);
    }, [table]);

    // Sync local state when column visibility changes
    useEffect(() => {
        const visibilityMap: Record<string, boolean> = {};
        table.getAllColumns().forEach((column: any) => {
            visibilityMap[column.id] = column.getIsVisible();
        });
        setLocalColumnVisibility((prev) => {
            // Only update if there's actually a change to avoid infinite loops
            const hasChanged = Object.keys(visibilityMap).some((key) =>
                visibilityMap[key] !== prev[key]
            );

            return hasChanged ? visibilityMap : prev;
        });
    }, [table.getState().columnVisibility]);

    return (
        <Popover open={columnVisibilityOpen} onOpenChange={setColumnVisibilityOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={columnVisibilityOpen}
                    className="order-3 h-auto min-h-8 w-full min-w-[110px] justify-between hover:bg-transparent sm:w-fit lg:order-2"
                >
                    <span className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="group flex h-5 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors hover:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                table.resetColumnVisibility();
                                // Update local state for all columns
                                const visibilityMap: Record<string, boolean> = {};
                                table.getAllColumns().forEach((column: any) => {
                                    visibilityMap[column.id] = column.getIsVisible();
                                });
                                setLocalColumnVisibility(visibilityMap);
                                setColumnVisibilitySearch('');
                            }}
                            title="Reset kolom"
                        >
                            <RotateCcw className="h-3 w-3" />
                        </Badge>
                        <span>Kolom</span>
                    </span>
                    <ChevronsUpDownIcon
                        className="ml-2 shrink-0 text-muted-foreground/80"
                        aria-hidden="true"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popper-anchor-width) min-w-[340px] max-w-lg p-0" align="start">
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
                                .filter((column: any) => column.getCanHide())
                                .filter((column: any) => {
                                    if (!columnVisibilitySearch) {
return true;
}

                                    const headerText =
                                        typeof column.columnDef.header === 'string'
                                            ? column.columnDef.header
                                            : column.id;

                                    return headerText
                                        .toLowerCase()
                                        .includes(columnVisibilitySearch.toLowerCase());
                                })
                                .map((column: any) => {
                                    const headerText =
                                        typeof column.columnDef.header === 'string'
                                            ? column.columnDef.header
                                            : column.id;
                                    const isVisible = localColumnVisibility[column.id] ?? column.getIsVisible();

                                    return (
                                        <CommandItem
                                            key={column.id}
                                            onSelect={() => {
                                                const newVisibility = !isVisible;
                                                column.toggleVisibility(newVisibility);
                                                setLocalColumnVisibility((prev) => ({
                                                    ...prev,
                                                    [column.id]: newVisibility,
                                                }));
                                            }}
                                        >
                                            <span className="truncate capitalize">{headerText}</span>
                                            {isVisible && <CheckIcon size={16} className="ml-auto" />}
                                        </CommandItem>
                                    );
                                })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
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
    enableColumnVisibility = false,
    initialColumnVisibility = {},
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
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);

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

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: 0,
        }));
    }, [sorting]);

    const table = useReactTable({
        data: filteredData,
        columns: processedColumns as ColumnDef<T>[],
        ...(getRowId ? { getRowId: getRowId as any } : {}),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSorting: true,
        enableSortingRemoval: true,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        autoResetPageIndex: false,
        enableRowSelection: enableRowSelection,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        onColumnVisibilityChange: setColumnVisibility,
        meta: {
            disableActions,
        },
        state: {
            sorting,
            pagination,
            rowSelection,
            globalFilter,
            expanded,
            columnVisibility,
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

    // Clear sorting for hidden columns
    useEffect(() => {
        if (enableColumnVisibility) {
            setSorting(prevSorting => prevSorting.filter(sort =>
                table.getColumn(sort.id)?.getIsVisible() !== false
            ));
        }
    }, [columnVisibility, enableColumnVisibility, table]);

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
                enableColumnVisibility={false} // Moved to bottom
                table={table}
                rowSelection={rowSelection}
            />

            <div className="rounded-md border">
                <Table>
                    <DataTableHeader
                        table={table}
                        sorting={sorting}
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

            {/* Bottom controls with column visibility and pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {enableColumnVisibility && (
                        <ColumnVisibilityTrigger table={table} />
                    )}
                </div>
                {table.getRowCount() >= 6 && (
                    <DataTablePagination
                        table={table}
                        pageSizeOptions={pageSizeOptions}
                        pagination={pagination}
                    />
                )}
            </div>
        </div>
    );
};

export { DataTable };
export type { DataTableProps } from './types';
export { SimpleDatatable } from './simple-datatable';
export type { SimpleDatatableProps } from './types';
