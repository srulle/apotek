import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type ConfirmType = 'verify' | 'unverify' | 'delete';

interface ConfirmActionProps {
    children: ReactNode;
    type?: ConfirmType;
    title?: string;
    description?: string;
    onConfirm: () => void | Promise<void>;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const defaultConfig: Record<
    ConfirmType,
    {
        title: string;
        description: string;
        confirmText: string;
        variant: 'default' | 'destructive';
    }
> = {
    verify: {
        title: 'Konfirmasi Verifikasi',
        description: 'Apakah Anda yakin ingin memverifikasi pengguna ini?',
        confirmText: 'Verifikasi',
        variant: 'default',
    },
    unverify: {
        title: 'Konfirmasi Batal Verifikasi',
        description:
            'Apakah Anda yakin ingin membatalkan verifikasi pengguna ini?',
        confirmText: 'Batal Verifikasi',
        variant: 'destructive',
    },
    delete: {
        title: 'Konfirmasi Hapus',
        description:
            'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.',
        confirmText: 'Hapus',
        variant: 'destructive',
    },
};

export function ConfirmAction({
    children,
    type = 'delete',
    title,
    description,
    onConfirm,
    confirmText,
    cancelText = 'Batal',
    isLoading = false,
}: ConfirmActionProps) {
    const [open, setOpen] = useState(false);
    const config = defaultConfig[type];

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
                    <h4 className="font-semibold">{title ?? config.title}</h4>
                    <p className="text-sm text-muted-foreground">
                        {description ?? config.description}
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
                            variant={config.variant}
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Memproses...'
                                : (confirmText ?? config.confirmText)}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// Pre-configured exports for convenience
interface TypedConfirmProps extends Omit<
    ConfirmActionProps,
    'type' | 'title' | 'description' | 'confirmText'
> {}

export function VerifyConfirm(props: TypedConfirmProps) {
    return <ConfirmAction {...props} type="verify" />;
}

export function UnverifyConfirm(props: TypedConfirmProps) {
    return <ConfirmAction {...props} type="unverify" />;
}

export function DeleteConfirm(props: TypedConfirmProps) {
    return <ConfirmAction {...props} type="delete" />;
}
