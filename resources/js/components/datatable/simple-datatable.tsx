'use client';

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type PaginationState,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface SimpleDatatableProps<TData, TValue> {
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
