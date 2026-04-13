import type { ReactNode, FormEvent} from 'react';
import { forwardRef, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverAnchor,
} from '@/components/ui/popover';

export interface OneFieldFormProps {
    trigger?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    label?: string;
    placeholder?: string;
    helperText?: string;
    error?: boolean;
    errorMessage?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    submitLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    anchorRef?: React.RefObject<HTMLElement>;
    [key: string]: any;
}

const OneFieldForm = forwardRef<HTMLInputElement, OneFieldFormProps>(
    (
        {
            trigger,
            open,
            onOpenChange,
            title = 'Form',
            label,
            placeholder,
            helperText,
            error = false,
            errorMessage,
            value,
            onChange,
            onSubmit,
            submitLabel = 'Simpan',
            cancelLabel = 'Batal',
            isLoading = false,
            side = 'bottom',
            align = 'center',
            anchorRef,
            id: providedId,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const id = providedId || generatedId;

        const handleSubmit = (e: FormEvent) => {
            e.preventDefault();
            onSubmit?.(value || '');
        };

        return (
            <Popover open={open} onOpenChange={onOpenChange}>
                {trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
                {anchorRef && <PopoverAnchor virtualRef={anchorRef} />}
                <PopoverContent
                    side={side}
                    align={align}
                    className="w-80 p-3 duration-400 data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-100 data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="mb-2 text-sm font-medium">{title}</div>
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="w-full space-y-1">
                            {label && (
                                <Label
                                    htmlFor={id}
                                    className={error ? 'text-destructive' : ''}
                                >
                                    {label}
                                </Label>
                            )}
                            <Input
                                ref={ref}
                                id={id}
                                placeholder={placeholder}
                                value={value}
                                onChange={(e) => onChange?.(e.target.value)}
                                className={
                                    error
                                        ? 'border-destructive focus-visible:ring-destructive'
                                        : ''
                                }
                                autoFocus
                                {...props}
                            />
                            {(helperText || (error && errorMessage)) && (
                                <p
                                    className={`-mt-2 text-xs italic ${error ? 'text-destructive' : 'text-muted-foreground'}`}
                                >
                                    {error ? errorMessage : helperText}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-1.5 pt-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenChange?.(false)}
                                disabled={isLoading}
                            >
                                {cancelLabel}
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoading}
                            >
                                {submitLabel}
                            </Button>
                        </div>
                    </form>
                </PopoverContent>
            </Popover>
        );
    },
);

OneFieldForm.displayName = 'OneFieldForm';

export { OneFieldForm };
