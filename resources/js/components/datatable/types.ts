import type {
    ColumnDef,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    getRowId?: (row: T, index: number) => string;
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

export interface SimpleDatatableProps<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    pageSize?: number;
    showPagination?: boolean;
    emptyMessage?: string;
    className?: string;
}

export interface FilterableColumn {
    id: string;
    label: string;
    accessorKey: string;
    values: string[];
}
