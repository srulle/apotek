import type { ColumnDef } from '@tanstack/react-table';
import type { FilterableColumn } from './types';

export const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
};

export const getFilterableColumns = <T,>(
    columns: ColumnDef<T>[],
    data: T[],
): FilterableColumn[] => {
    return columns
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
};

export const processColumns = <T,>(columns: ColumnDef<T>[]) => {
    return columns.map((col) => {
        if ((col.meta as any)?.filterable) {
            (col as any).filterFn = 'multiSelect';
        }

        return col;
    });
};

export const filterData = <T,>(
    data: T[],
    globalFilter: string,
    columnFilters: Record<string, string[]>,
    processedColumns: ColumnDef<T>[],
): T[] => {
    return data.filter((row) => {
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
