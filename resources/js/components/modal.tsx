import type { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogOverlay,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type ModalSize =
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | 'full';

type BackdropBlur = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ModalProps {
    children: ReactNode;
    trigger: ReactNode;
    title?: string;
    description?: string;
    footer?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    size?: ModalSize;
    blur?: BackdropBlur;
    persistent?: boolean;
    className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
    xs: '!max-w-xs',
    sm: '!max-w-sm',
    md: '!max-w-md',
    lg: '!max-w-lg',
    xl: '!max-w-xl',
    '2xl': '!max-w-2xl',
    '3xl': '!max-w-3xl',
    '4xl': '!max-w-4xl',
    '5xl': '!max-w-5xl',
    '6xl': '!max-w-6xl',
    '7xl': '!max-w-7xl',
    full: '!max-w-full',
};

const backdropBlurClasses: Record<BackdropBlur, string> = {
    none: '',
    xs: 'backdrop-blur-xs',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl',
};

export function Modal({
    children,
    trigger,
    title,
    description,
    footer,
    open,
    onOpenChange,
    onClose,
    size = 'md',
    blur = 'none',
    persistent = false,
    className = '',
}: ModalProps) {
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && onClose) {
            onClose();
        }

        onOpenChange?.(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogOverlay className={backdropBlurClasses[blur]} />
            <DialogContent
                className={`top-0 mt-6 flex max-h-[min(700px,94vh)] translate-y-0 flex-col gap-0 p-0 ${sizeClasses[size]} ${className}`}
                onInteractOutside={(e) => {
                    if (persistent) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (persistent) {
                        e.preventDefault();
                    }
                }}
            >
                <ScrollArea className="flex max-h-full flex-col overflow-hidden">
                    {(title || description) && (
                        <DialogHeader className="contents space-y-0 text-left">
                            {title && (
                                <DialogTitle className="px-6 pt-6">
                                    {title}
                                </DialogTitle>
                            )}
                            {description && (
                                <DialogDescription className="px-6">
                                    {description}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                    )}
                    <div className="px-4 md:px-6">{children}</div>
                    {footer && (
                        <DialogFooter className="px-4 pb-6 sm:justify-end md:px-6">
                            {footer}
                        </DialogFooter>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
