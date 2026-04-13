import { ReactNode } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverContentProps,
} from '@/components/ui/popover';

interface PopoverCustomProps {
    children: ReactNode;
    content: ReactNode;
    title?: string;
    width?: string;
    side?: PopoverContentProps['side'];
    sideOffset?: number;
    align?: PopoverContentProps['align'];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function PopoverCustom({
    children,
    content,
    title,
    width = 'w-80',
    side = 'bottom',
    sideOffset = 4,
    align = 'center',
    open,
    onOpenChange,
}: PopoverCustomProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className={width}
                side={side}
                sideOffset={sideOffset}
                align={align}
            >
                {title && <h4 className="mb-2 font-semibold">{title}</h4>}
                {content}
            </PopoverContent>
        </Popover>
    );
}
