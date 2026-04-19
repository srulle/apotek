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
    value?: any;
    onChange?: (value: any, item?: ComboboxItem | ComboboxItem[]) => void;
    onItemSelect?: (item: any) => void;
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
