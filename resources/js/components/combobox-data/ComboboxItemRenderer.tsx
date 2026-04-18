'use client';

import { SquareCheckBig } from 'lucide-react';
import { useCallback } from 'react';

import { Modal } from '@/components/modal';
import { CommandItem } from '@/components/ui/command';

import ApotekItemPopover from './presets/ApotekItemPopover';
import type { ComboboxItem } from './types';

interface ComboboxItemRendererProps {
    item: ComboboxItem;
    groupTitle?: string;
    selectedValues: (string | number)[];
    popoverOpen: string | null;
    setPopoverOpen: (key: string | null) => void;
    handleSelectItem: (item: ComboboxItem) => void;
    renderPopoverContent?: (
        item: ComboboxItem,
        onSelectItem: () => void,
        onClosePopover: () => void,
    ) => React.ReactNode;
}

const ComboboxItemRenderer = ({
    item,
    groupTitle,
    selectedValues,
    popoverOpen,
    setPopoverOpen,
    handleSelectItem,
    renderPopoverContent,
}: ComboboxItemRendererProps) => {
    const popoverKey = groupTitle
        ? `${groupTitle}-${item.id}`
        : `no-group-${item.id}`;

    const onSelect = useCallback(() => {
        setPopoverOpen(popoverOpen === popoverKey ? null : popoverKey);
    }, [popoverOpen, popoverKey, setPopoverOpen]);

    const onSelectItem = useCallback(
        (formData: any = {}) => {
            handleSelectItem({ ...item, ...formData });
            setPopoverOpen(null);
        },
        [item, handleSelectItem, setPopoverOpen],
    );

    const onClose = useCallback(() => {
        setPopoverOpen(null);
    }, [setPopoverOpen]);

    return (
        <Modal
            key={item.id}
            open={popoverOpen === popoverKey}
            onOpenChange={(open) => setPopoverOpen(open ? popoverKey : null)}
            title={item.label}
            size="md"
            trigger={
                <CommandItem
                    className="flex cursor-pointer items-start justify-between gap-2 py-1.5"
                    value={item.label}
                    onSelect={onSelect}
                >
                    <div className="flex items-center gap-2">
                        <SquareCheckBig
                            className={`size-5 shrink-0 ${
                                selectedValues.includes(item.id)
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            }`}
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-4">
                            <span className="truncate font-medium">
                                {item.label}
                            </span>
                            {item.subtitle && (
                                <span className="-mt-1 truncate text-xs text-muted-foreground italic">
                                    {item.subtitle}
                                </span>
                            )}
                        </div>
                    </div>
                </CommandItem>
            }
        >
            {renderPopoverContent ? (
                renderPopoverContent(item, onSelectItem, onClose)
            ) : (
                <ApotekItemPopover
                    item={item}
                    onSelectItem={onSelectItem}
                    onClosePopover={onClose}
                />
            )}
        </Modal>
    );
};

export default ComboboxItemRenderer;
