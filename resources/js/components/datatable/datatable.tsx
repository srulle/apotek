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
import {
    ChevronDownIcon,
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowDownUp,
    ArrowUpAZ,
    ArrowDownAZ,
    ArrowUp01,
    ArrowDown10,
    SearchIcon,
    CheckIcon,
    ChevronsUpDownIcon,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useId, useState, useMemo } from 'react';

import { DeleteConfirm } from '@/components/confirm-action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    initialPagination?: PaginationState;
    initialSorting?: SortingState;
    pageSizeOptions?: number[];
    emptyMessage?: string;
    className?: string;
    enableRowSelection?: boolean;
    onSelectionChange?: (selectedRows: T[]) => void;
    enableGlobalFilter?: boolean;
    searchPlaceholder?: string;
    enableRowExpansion?: boolean;
    renderExpandedRow?: (row: T) => React.ReactNode;
    enableBulkDelete?: boolean;
    onBulkDelete?: () => void | Promise<void>;
}

const DataTable = <T,>({
    data,
    columns,
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
    const id = useId();

    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);
    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [columnFilters, setColumnFilters] = useState<
        Record<string, string[]>
    >({});
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [activeRowId, setActiveRowId] = useState<string | null>(null);
    const [popoverOpens, setPopoverOpens] = useState<Record<string, boolean>>(
        {},
    );

    // Helper to get nested value
    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
    };

    // Filter columns based on selection state - MEMOIZED
    const columnsFiltered = useMemo(() => {
        return columns.filter((col) => {
            if (col.id === 'actions' && Object.keys(rowSelection).length > 0) {
                return false;
            }

            return true;
        });
    }, [columns, rowSelection]);

    // Add filterFn to filterable columns - MEMOIZED
    const processedColumns = useMemo(() => {
        return columnsFiltered.map((col) => {
            if ((col.meta as any)?.filterable) {
                return {
                    ...col,
                    filterFn: 'multiSelect',
                };
            }

            return col;
        });
    }, [columnsFiltered]);

    // Get filterable columns from column meta - MEMOIZED
    const filterableColumns = useMemo(() => {
        return processedColumns
            .filter((col) => (col.meta as any)?.filterable)
            .map((col) => ({
                id: col.id || ((col as any).accessorKey as string),
                label:
                    typeof col.header === 'string'
                        ? col.header
                        : col.id || ((col as any).accessorKey as string),
                accessorKey: (col as any).accessorKey as string,
                values: Array.from(
                    new Set(
                        data.map((row) =>
                            String(
                                getNestedValue(
                                    row,
                                    (col as any).accessorKey as string,
                                ),
                            ),
                        ),
                    ),
                ).filter(Boolean),
            }));
    }, [processedColumns, data]);

    // Manual filtering - MEMOIZED untuk menghindari infinite render
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            // Check global filter
            if (globalFilter && globalFilter.trim()) {
                const searchTerm = globalFilter.toLowerCase().trim();
                const matchesSearch = processedColumns.some((col: any) => {
                    const accessorKey = col.accessorKey;

                    if (!accessorKey) {
                        return false;
                    }

                    const value = getNestedValue(row, accessorKey);

                    return String(value).toLowerCase().includes(searchTerm);
                });

                if (!matchesSearch) {
                    return false;
                }
            }

            // Check column filters
            for (const [columnId, filterValues] of Object.entries(
                columnFilters,
            )) {
                if (filterValues.length === 0) {
                    continue;
                }

                const value = getNestedValue(row, columnId);

                if (!filterValues.includes(String(value))) {
                    return false;
                }
            }

            return true;
        });
    }, [data, globalFilter, columnFilters, processedColumns]);

    const table = useReactTable({
        data: filteredData,
        columns: processedColumns as ColumnDef<T>[],
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
                                className="pl-10"
                                placeholder={searchPlaceholder}
                            />
                        </div>
                    )}

                    {filterableColumns.map((column) => {
                        const selectedValues = columnFilters[column.id] || [];
                        const isOpen = popoverOpens[column.id] || false;
                        const setIsOpen = (open: boolean) =>
                            setPopoverOpens((prev) => ({
                                ...prev,
                                [column.id]: open,
                            }));

                        return (
                            <Popover
                                key={column.id}
                                open={isOpen}
                                onOpenChange={setIsOpen}
                            >
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
                                                    setColumnFilters(
                                                        (prev) => ({
                                                            ...prev,
                                                            [column.id]: [],
                                                        }),
                                                    );
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
                                                            {
                                                                selectedValues.length
                                                            }
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
                                            <CommandEmpty>
                                                Tidak ada data.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {column.values.map((value) => (
                                                    <CommandItem
                                                        key={value}
                                                        value={value}
                                                        onSelect={() => {
                                                            setColumnFilters(
                                                                (prev) => {
                                                                    const current =
                                                                        prev[
                                                                            column
                                                                                .id
                                                                        ] || [];
                                                                    const updated =
                                                                        current.includes(
                                                                            value,
                                                                        )
                                                                            ? current.filter(
                                                                                  (
                                                                                      v,
                                                                                  ) =>
                                                                                      v !==
                                                                                      value,
                                                                              )
                                                                            : [
                                                                                  ...current,
                                                                                  value,
                                                                              ];

                                                                    return {
                                                                        ...prev,
                                                                        [column.id]:
                                                                            updated,
                                                                    };
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        <span className="truncate">
                                                            {value}
                                                        </span>
                                                        {selectedValues.includes(
                                                            value,
                                                        ) && (
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
                    })}
                </div>

                {enableRowSelection &&
                    table.getSelectedRowModel().rows.length > 0 && (
                        <div className="order-1 flex items-center gap-2 lg:order-3">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="cursor-pointer px-3 py-1"
                                onClick={() =>
                                    table.toggleAllPageRowsSelected(false)
                                }
                            >
                                <X className="mr-1 h-4 w-4" />
                                {table.getSelectedRowModel().rows.length} data
                                dipilih
                            </Button>
                            {enableBulkDelete && onBulkDelete && (
                                <DeleteConfirm
                                    title="Konfirmasi Hapus Terpilih"
                                    description={`Apakah Anda yakin ingin menghapus ${table.getSelectedRowModel().rows.length} item terpilih? Tindakan ini tidak dapat dibatalkan.`}
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

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
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
                                            checked={
                                                table.getIsAllPageRowsSelected() ||
                                                (table.getIsSomePageRowsSelected() &&
                                                    'indeterminate')
                                            }
                                            onCheckedChange={(value) =>
                                                table.toggleAllPageRowsSelected(
                                                    !!value,
                                                )
                                            }
                                            aria-label="Pilih semua baris"
                                        />
                                    </TableHead>
                                )}
                                {headerGroup.headers.map((header) => {
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

                                                        // Deteksi otomatis tipe kolom
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
                                            activeRowId === row.id &&
                                                'bg-muted/50',
                                        )}
                                        onClick={() =>
                                            setActiveRowId(
                                                row.id === activeRowId
                                                    ? null
                                                    : row.id,
                                            )
                                        }
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
                <div className="flex flex-col items-center justify-end gap-4 sm:flex-row">
                    <div className="flex w-full justify-center sm:w-auto sm:grow-0 sm:justify-end">
                        <ButtonGroup className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="h-9 rounded-r-none px-3 disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label="Go to first page"
                            >
                                <ChevronFirstIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-9 px-3 disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label="Go to previous page"
                            >
                                <ChevronLeftIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex h-9 w-[160px] justify-center gap-2 tabular-nums"
                                    >
                                        <ChevronsUpDownIcon className="h-4 w-4 opacity-60" />
                                        <span>
                                            {table.getState().pagination
                                                .pageIndex *
                                                table.getState().pagination
                                                    .pageSize +
                                                1}
                                            -
                                            {Math.min(
                                                (table.getState().pagination
                                                    .pageIndex +
                                                    1) *
                                                    table.getState().pagination
                                                        .pageSize,
                                                table.getRowCount(),
                                            )}
                                            &nbsp;dari&nbsp;
                                            {table.getRowCount()}
                                        </span>
                                        <ChevronsUpDownIcon className="h-4 w-4 opacity-60" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="center"
                                    className="w-40"
                                >
                                    <DropdownMenuGroup>
                                        {pageSizeOptions.map((size) => (
                                            <DropdownMenuItem
                                                key={size}
                                                onClick={() =>
                                                    table.setPageSize(size)
                                                }
                                                className="justify-between"
                                            >
                                                {size} baris
                                                {table.getState().pagination
                                                    .pageSize === size && (
                                                    <CheckIcon className="h-4 w-4" />
                                                )}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                variant="outline"
                                className="h-9 px-3 disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label="Go to next page"
                            >
                                <ChevronRightIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-9 rounded-l-none px-3 disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label="Go to last page"
                            >
                                <ChevronLastIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            )}
        </div>
    );
};

export interface SimpleDatatableProps<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    pageSize?: number;
    showPagination?: boolean;
    emptyMessage?: string;
    className?: string;
}

export function SimpleDatatable<TData, TValue>({
    data,
    columns,
    pageSize = 5,
    showPagination = true,
    emptyMessage = 'No results.',
    className = '',
}: SimpleDatatableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize,
            },
        },
    });

    return (
        <div className={`w-full ${className}`}>
            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="h-10">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-3 py-2"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="h-8">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-3 py-1"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    className="h-16 py-2 text-center"
                                    colSpan={columns.length}
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showPagination && (
                <div className="flex items-center justify-between py-2">
                    <div className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={!table.getCanPreviousPage()}
                            onClick={() => table.previousPage()}
                            size="sm"
                            variant="outline"
                        >
                            Previous
                        </Button>
                        <Button
                            disabled={!table.getCanNextPage()}
                            onClick={() => table.nextPage()}
                            size="sm"
                            variant="outline"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
