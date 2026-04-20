'use client';

import React, { Fragment, ReactNode, useEffect, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon, Loader2 } from 'lucide-react';

import type {
    ColumnDef,
    ExpandedState,
    Row,
    RowSelectionState,
    Updater,
} from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export interface ExpandableDataTableProps<TData, TSubData> {
    // Static data (optional if using fetchData)
    data?: TData[];

    // Server-side data fetching
    fetchData?: () => Promise<TData[]>;
    onFetchData?: (params?: {
        page?: number;
        pageSize?: number;
        search?: string;
    }) => Promise<{ data: TData[]; total?: number }>;

    columns: ColumnDef<TData>[];
    getRowCanExpand?: (row: Row<TData>) => boolean;

    // Static sub-row rendering (optional if using fetchSubRowData)
    renderSubRow?: (row: TData) => {
        columns: {
            header: string;
            accessorKey: keyof TSubData;
            cell?: (item: TSubData) => ReactNode;
            className?: string;
        }[];
        data: TSubData[];
    };

    // Server-side sub-row fetching
    fetchSubRowData?: (row: TData) => Promise<TSubData[]>;

    onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;
    rowSelection?: RowSelectionState;
    className?: string;
    emptyMessage?: string;
    loading?: boolean;
    enableRowSelection?: boolean;

    // Row expansion callback (for database fetching)
    onRowExpand?: (row: Row<TData>) => void;

    // Pagination support
    pagination?: {
        pageSize?: number;
        currentPage?: number;
        total?: number;
        onPageChange?: (page: number) => void;
    };
}

export function ExpandableDataTable<TData, TSubData>({
    data: initialData,
    fetchData,
    onFetchData,
    columns,
    getRowCanExpand,
    renderSubRow,
    fetchSubRowData,
    onRowSelectionChange,
    rowSelection = {},
    className,
    emptyMessage = 'No results.',
    loading: externalLoading = false,
    enableRowSelection = true,
    onRowExpand,
    pagination,
}: ExpandableDataTableProps<TData, TSubData>) {
    // State for data and loading
    const [data, setData] = useState<TData[]>(initialData || []);
    const [loading, setLoading] = useState(externalLoading);
    const [error, setError] = useState<string | null>(null);

    // State for sub-row data fetching
    const [expandedRowData, setExpandedRowData] = useState<
        Record<string, { data?: TSubData[]; loading: boolean; error?: string }>
    >({});

    // Fetch main data on mount or when dependencies change
    useEffect(() => {
        const fetchMainData = async () => {
            if (initialData) {
                setData(initialData);
                return;
            }

            if (fetchData) {
                try {
                    setLoading(true);
                    setError(null);
                    const fetchedData = await fetchData();
                    setData(fetchedData);
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Failed to fetch data',
                    );
                } finally {
                    setLoading(false);
                }
            } else if (onFetchData) {
                try {
                    setLoading(true);
                    setError(null);
                    const result = await onFetchData({
                        page: pagination?.currentPage || 1,
                        pageSize: pagination?.pageSize || 10,
                    });
                    setData(result.data);
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Failed to fetch data',
                    );
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMainData();
    }, [
        initialData,
        fetchData,
        onFetchData,
        pagination?.currentPage,
        pagination?.pageSize,
    ]);

    // Handle row expansion with data fetching
    const handleRowExpansion = async (row: Row<TData>) => {
        // Call user callback if provided
        if (onRowExpand) {
            onRowExpand(row);
        }

        if (row.getIsExpanded()) {
            // Row is being collapsed, no need to fetch
            return;
        }

        if (fetchSubRowData) {
            const rowId = row.id;

            // Fetch sub-row data if not already fetched
            if (!expandedRowData[rowId]) {
                setExpandedRowData((prev) => ({
                    ...prev,
                    [rowId]: { loading: true },
                }));

                try {
                    const subData = await fetchSubRowData(row.original);
                    setExpandedRowData((prev) => ({
                        ...prev,
                        [rowId]: { data: subData, loading: false },
                    }));
                } catch (err) {
                    setExpandedRowData((prev) => ({
                        ...prev,
                        [rowId]: {
                            loading: false,
                            error:
                                err instanceof Error
                                    ? err.message
                                    : 'Failed to fetch sub-data',
                        },
                    }));
                }
            }
        }
    };

    const [expanded, setExpanded] = useState<ExpandedState>({});

    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
            expanded,
        },
        enableRowSelection: enableRowSelection && !!onRowSelectionChange,
        onRowSelectionChange: onRowSelectionChange,
        onExpandedChange: setExpanded,
        getRowCanExpand: getRowCanExpand || (() => true),
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    // Watch for expanded rows and fetch data
    useEffect(() => {
        const expandedRows = table.getExpandedRowModel().rows;
        expandedRows.forEach((row) => {
            const rowId = row.id;
            const isExpanded =
                typeof expanded === 'object' &&
                expanded !== null &&
                rowId in expanded &&
                (expanded as Record<string, boolean>)[rowId];
            if (isExpanded && fetchSubRowData && !expandedRowData[rowId]) {
                handleRowExpansion(row);
            }
        });
    }, [expanded, table, fetchSubRowData, expandedRowData]);

    if (loading) {
        return (
            <div className={`w-full ${className || ''}`}>
                <div className="rounded-md border p-8 text-center">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full ${className || ''}`}>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-transparent"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const rowId = row.id;
                                const expandedData = expandedRowData[rowId];

                                // Get sub-row data either from static renderSubRow or from fetched data
                                let subRowColumns: {
                                    header: string;
                                    accessorKey: keyof TSubData;
                                    cell?: (item: TSubData) => ReactNode;
                                    className?: string;
                                }[] = [];
                                let subRowData: TSubData[] = [];

                                if (renderSubRow) {
                                    const staticSubRow = renderSubRow(
                                        row.original,
                                    );
                                    subRowColumns = staticSubRow.columns;
                                    subRowData = staticSubRow.data;
                                } else if (expandedData?.data) {
                                    // For dynamic fetching, we need to determine columns from the data structure
                                    // This is a simplified approach - in practice, you might want to pass column definitions
                                    if (expandedData.data.length > 0) {
                                        const firstItem = expandedData.data[0];
                                        subRowColumns = Object.keys(
                                            firstItem as any,
                                        ).map((key) => ({
                                            header:
                                                key.charAt(0).toUpperCase() +
                                                key.slice(1),
                                            accessorKey: key as keyof TSubData,
                                        }));
                                        subRowData = expandedData.data;
                                    }
                                }

                                return (
                                    <Fragment key={row.id}>
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="[&:has([aria-expanded])]: [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                        {row.getIsExpanded() && (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell
                                                    colSpan={
                                                        row.getVisibleCells()
                                                            .length
                                                    }
                                                    className="p-0"
                                                >
                                                    {expandedData?.loading ? (
                                                        <div className="flex items-center justify-center p-4">
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Loading sub-data...
                                                        </div>
                                                    ) : expandedData?.error ? (
                                                        <div className="flex items-center justify-center p-4 text-red-500">
                                                            Error:{' '}
                                                            {expandedData.error}
                                                        </div>
                                                    ) : subRowColumns.length >
                                                      0 ? (
                                                        <Table>
                                                            <TableHeader className="border-b">
                                                                <TableRow className="hover:bg-muted/30!">
                                                                    <TableHead className="w-23.5"></TableHead>
                                                                    {subRowColumns.map(
                                                                        (
                                                                            col,
                                                                        ) => (
                                                                            <TableHead
                                                                                key={String(
                                                                                    col.accessorKey,
                                                                                )}
                                                                                className={
                                                                                    col.className
                                                                                }
                                                                            >
                                                                                {
                                                                                    col.header
                                                                                }
                                                                            </TableHead>
                                                                        ),
                                                                    )}
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {subRowData.map(
                                                                    (
                                                                        item,
                                                                        idx,
                                                                    ) => (
                                                                        <TableRow
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            <TableCell></TableCell>
                                                                            {subRowColumns.map(
                                                                                (
                                                                                    col,
                                                                                ) => (
                                                                                    <TableCell
                                                                                        key={String(
                                                                                            col.accessorKey,
                                                                                        )}
                                                                                        className={
                                                                                            col.className
                                                                                        }
                                                                                    >
                                                                                        {col.cell
                                                                                            ? col.cell(
                                                                                                  item,
                                                                                              )
                                                                                            : String(
                                                                                                  item[
                                                                                                      col
                                                                                                          .accessorKey
                                                                                                  ] ??
                                                                                                      '',
                                                                                              )}
                                                                                    </TableCell>
                                                                                ),
                                                                            )}
                                                                        </TableRow>
                                                                    ),
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <div className="flex items-center justify-center p-4 text-muted-foreground">
                                                            No sub-data
                                                            available
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Helper to create expander column
export function createExpanderColumn<TData>(options?: {
    size?: 'sm' | 'default' | 'lg' | 'icon';
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link';
    className?: string;
    onExpand?: (row: Row<TData>) => void;
}): ColumnDef<TData> {
    return {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
            const handleClick = () => {
                if (options?.onExpand) {
                    options.onExpand(row);
                }
                row.getToggleExpandedHandler()();
            };

            return row.getCanExpand() ? (
                <Button
                    className={`size-7 text-muted-foreground ${options?.className || ''}`}
                    onClick={handleClick}
                    aria-expanded={row.getIsExpanded()}
                    aria-label={
                        row.getIsExpanded() ? 'Collapse row' : 'Expand row'
                    }
                    size={options?.size || 'icon'}
                    variant={options?.variant || 'ghost'}
                >
                    {row.getIsExpanded() ? (
                        <ChevronUpIcon
                            className="opacity-60"
                            aria-hidden="true"
                        />
                    ) : (
                        <ChevronDownIcon
                            className="opacity-60"
                            aria-hidden="true"
                        />
                    )}
                </Button>
            ) : undefined;
        },
    };
}

// Helper to create select column
export function createSelectColumn<TData>(options?: {
    headerAriaLabel?: string;
    rowAriaLabel?: string;
}): ColumnDef<TData> {
    return {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label={options?.headerAriaLabel || 'Select all'}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label={options?.rowAriaLabel || 'Select row'}
            />
        ),
    };
}
