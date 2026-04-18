// Tipe data generic untuk item combobox
export interface ComboboxItem {
    id: string | number;
    label: string;
    subtitle?: string;
    image?: string;
    [key: string]: any;
}

export interface ComboboxGroup {
    title: string;
    items: ComboboxItem[];
}

export interface ComboboxDataProps {
    items: ComboboxItem[] | ComboboxGroup[];
    value?: string | number | (string | number)[];
    onChange?: (
        value: string | number | (string | number)[] | null,
        item?: ComboboxItem | ComboboxItem[],
    ) => void;
    onItemSelect?: (item: ComboboxItem) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
    multiple?: boolean;
    renderPopoverContent?: (
        item: ComboboxItem,
        onSelectItem: (data?: any) => void,
        onClosePopover: () => void,
    ) => React.ReactNode;
}
