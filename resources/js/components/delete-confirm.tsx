import type { ReactNode} from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface DeleteConfirmProps {
    children: ReactNode;
    title?: string;
    description?: string;
    onConfirm: () => void | Promise<void>;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export function DeleteConfirm({
    children,
    title = 'Konfirmasi Hapus',
    description = 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.',
    onConfirm,
    confirmText = 'Hapus',
    cancelText = 'Batal',
    isLoading = false,
}: DeleteConfirmProps) {
    const [open, setOpen] = useState(false);

    const handleConfirm = async () => {
        await onConfirm();
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className="w-80 p-3 duration-400 data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-100 data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="space-y-4">
                    <h4 className="font-semibold">{title}</h4>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Memproses...' : confirmText}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
