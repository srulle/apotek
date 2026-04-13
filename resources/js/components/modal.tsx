import { ReactNode } from 'react';
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

interface ModalProps {
    children: ReactNode;
    trigger: ReactNode;
    title?: string;
    description?: string;
    footer?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    size?: ModalSize;
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

export function Modal({
    children,
    trigger,
    title,
    description,
    footer,
    open,
    onOpenChange,
    size = 'md',
    persistent = false,
    className = '',
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogOverlay className="backdrop-blur-xs" />
            <DialogContent
                className={`top-0 mx-auto mt-6 translate-y-0 ${sizeClasses[size]} ${className}`}
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
                {(title || description) && (
                    <DialogHeader>
                        {title && <DialogTitle>{title}</DialogTitle>}
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>
                )}
                {children}
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}
