'use client';

import {
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsUpDownIcon,
    CheckIcon,
} from 'lucide-react';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PaginationProps {
    table: any;
    pageSizeOptions: number[];
    pagination: { pageIndex: number; pageSize: number };
}

export function DataTablePagination({
    table,
    pageSizeOptions,
    pagination,
}: PaginationProps) {
    const [mounted, setMounted] = useState(false);
    const { pageIndex, pageSize } = pagination;
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const totalRows = mounted ? table.getRowCount() : 0;
    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
    
    const canPreviousPage = mounted ? pageIndex > 0 : false;
    const canNextPage = mounted ? totalRows > 0 && (pageIndex + 1) * pageSize < totalRows : false;

    return (
        <div className="flex flex-col items-center justify-end gap-4 sm:flex-row">
            <div className="flex w-full justify-center sm:w-auto sm:grow-0 sm:justify-end">
                <ButtonGroup className="flex w-full sm:w-auto">
                    <Button
                        variant="outline"
                        className="h-9 rounded-r-none px-3 disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => table.firstPage()}
                        disabled={!canPreviousPage}
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
                        disabled={!canPreviousPage}
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
                                className="flex h-9 flex-1 justify-center gap-2 tabular-nums sm:w-[160px]"
                            >
                                <ChevronsUpDownIcon className="h-4 w-4 opacity-60" />
                                <span>
                                    {startRow}-{endRow}
                                    &nbsp;dari&nbsp;
                                    {totalRows}
                                </span>
                                <ChevronsUpDownIcon className="h-4 w-4 opacity-60" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="center"
                            className="w-40"
                        >
                            <DropdownMenuGroup>
                                {pageSizeOptions.map((size: number) => (
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
                        disabled={!canNextPage}
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
                        disabled={!canNextPage}
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
    );
}
