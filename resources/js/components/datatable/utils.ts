import type { ColumnDef } from '@tanstack/react-table';
import type { FilterableColumn } from './types';

interface DataTableColumnMeta {
    filterable?: boolean;
    sortIconType?: 'text' | 'numeric';
}

export const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((prev: any, curr) => prev?.[curr], obj);
};

export const getFilterableColumns = <T>(
    columns: ColumnDef<T>[],
    data: T[],
): FilterableColumn[] => {
    return columns
        .filter((col): col is ColumnDef<T> & { accessorKey: string } => {
            const meta = col.meta as DataTableColumnMeta | undefined;
            return meta?.filterable === true;
        })
        .map((col) => {
            const accessorKey = col.accessorKey;
            return {
                id: accessorKey,
                label:
                    typeof col.header === 'string'
                        ? col.header
                        : col.id || accessorKey,
                accessorKey: accessorKey,
                values: Array.from(
                    new Set(
                        data.map((row) =>
                            String(getNestedValue(row, accessorKey)),
                        ),
                    ),
                ).filter(Boolean),
            };
        });
};

export const processColumns = <T>(columns: ColumnDef<T>[]): ColumnDef<T>[] => {
    return columns.map((col) => {
        const meta = col.meta as DataTableColumnMeta | undefined;
        if (meta?.filterable) {
            return { ...col, filterFn: 'multiSelect' as any };
        }

        return col;
    }) as ColumnDef<T>[];
};

export const filterData = <T>(
    data: T[],
    globalFilter: string,
    columnFilters: Record<string, string[]>,
    processedColumns: ColumnDef<T>[],
): T[] => {
    return data.filter((row) => {
        if (globalFilter && globalFilter.trim()) {
            const searchTerm = globalFilter.toLowerCase().trim();
            const matchesSearch = processedColumns.some((col) => {
                const colWithAccessor = col as ColumnDef<T> & {
                    accessorKey?: string;
                };
                const accessorKey = colWithAccessor.accessorKey;

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

        for (const [columnId, filterValues] of Object.entries(columnFilters)) {
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
};
