import { useId, forwardRef, InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface InputLabelAndHelperProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: boolean;
}

// Props khusus untuk TanStack Form
export interface TanStackInputProps {
    field: any;
    label: string;
    placeholder?: string;
    type?: string;
    className?: string;
}

// Overload untuk backward compatibility

// Type guard untuk mengecek apakah props mengandung field TanStack Form
function isTanStackField(props: any): props is TanStackInputProps {
    return props.field && typeof props.field.handleChange === 'function';
}

const InputLabelAndHelper = forwardRef<
    HTMLInputElement,
    InputLabelAndHelperProps | TanStackInputProps
>((props, ref) => {
    const generatedId = useId();

    // Jika menggunakan TanStack Form field
    if (isTanStackField(props)) {
        const { field, label, placeholder, type, className } = props;
        const id = field.name || generatedId;
        const hasError = field.state.meta.errors.length > 0;
        const errorMessage = field.state.meta.errors.join(', ');

        return (
            <div className={`w-full space-y-2 ${className || ''}`}>
                <Label
                    htmlFor={id}
                    className={hasError ? 'text-destructive' : ''}
                >
                    {label}
                </Label>
                <Input
                    ref={ref}
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={
                        hasError
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                    }
                />
                {errorMessage && (
                    <p className="-mt-2 text-xs text-destructive italic">
                        {errorMessage}
                    </p>
                )}
            </div>
        );
    }

    // Jika menggunakan props biasa (backward compatibility)
    const {
        label,
        helperText,
        error = false,
        className,
        id: providedId,
        ...inputProps
    } = props as InputLabelAndHelperProps;
    const id = providedId || generatedId;

    return (
        <div className={`w-full space-y-2 ${className || ''}`}>
            {label && (
                <Label htmlFor={id} className={error ? 'text-destructive' : ''}>
                    {label}
                </Label>
            )}
            <Input
                ref={ref}
                id={id}
                {...inputProps}
                className={
                    error
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                }
            />
            {helperText && (
                <p
                    className={`-mt-2 text-xs italic ${error ? 'text-destructive' : 'text-muted-foreground'}`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
});

InputLabelAndHelper.displayName = 'InputLabelAndHelper';

export { InputLabelAndHelper };
