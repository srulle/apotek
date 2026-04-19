import { MinusIcon, PlusIcon } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { useId, forwardRef, useState, useEffect, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface InputLabelAndHelperProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: boolean;
    type?: 'text' | 'number' | 'currency';
}

// Props khusus untuk TanStack Form
export interface TanStackInputProps {
    field: any;
    label: string;
    placeholder?: string;
    type?: 'text' | 'number' | 'currency';
    className?: string;
    helperText?: string;
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
        const {
            field,
            label,
            placeholder,
            type = 'text',
            className,
            helperText,
        } = props;
        const id = field.name || generatedId;
        const hasError = field.state.meta.errors.length > 0;
        const errorMessage = field.state.meta.errors
            .map((e: any) => e.message || e)
            .join(', ');

        const [internalValue, setInternalValue] = useState(
            field.state.value || '',
        );

        useEffect(() => {
            if (type !== 'currency') {
                setInternalValue(field.state.value || '');
            }
        }, [field.state.value, type]);

        const handleInputChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                let newValue = e.target.value;

                if (type === 'number') {
                    newValue = newValue.replace(/[^0-9]/g, '');
                    // Hilangkan leading zeros kecuali jika hanya 0
                    newValue = newValue.replace(/^0+(?=\d)/, '');
                }

                setInternalValue(newValue);
                field.handleChange(newValue);
            },
            [type, field],
        );

        const handleIncrement = () => {
            const current = Number(internalValue) || 0;
            const newValue = (current + 1).toString().replace(/^0+(?=\d)/, '');
            setInternalValue(newValue);
            field.handleChange(newValue);
        };

        const handleDecrement = () => {
            const current = Number(internalValue) || 0;
            const newValue = Math.max(0, current - 1)
                .toString()
                .replace(/^0+(?=\d)/, '');
            setInternalValue(newValue);
            field.handleChange(newValue);
        };

        return (
            <div className={`w-full space-y-2 ${className || ''}`}>
                <Label
                    htmlFor={id}
                    className={cn(
                        'truncate',
                        hasError ? 'text-destructive' : '',
                    )}
                >
                    {label}
                </Label>
                {type === 'number' ? (
                    <div
                        className={`relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 md:text-sm dark:bg-input/30 ${hasError ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40' : ''}`}
                    >
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={handleDecrement}
                            className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <MinusIcon size={16} />
                            <span className="sr-only">Decrement</span>
                        </button>
                        <Input
                            ref={ref}
                            id={id}
                            type="text"
                            placeholder={placeholder}
                            value={internalValue}
                            onChange={handleInputChange}
                            onBlur={field.handleBlur}
                            className="w-full grow border-0 px-3 py-2 text-center tabular-nums shadow-none outline-none selection:bg-primary selection:text-primary-foreground focus-visible:ring-0"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={handleIncrement}
                            className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <PlusIcon size={16} />
                            <span className="sr-only">Increment</span>
                        </button>
                    </div>
                ) : type === 'currency' ? (
                    <div
                        className={`relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 md:text-sm dark:bg-input/30 ${hasError ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40' : ''}`}
                    >
                        <span className="flex items-center justify-center border-r border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                            Rp.
                        </span>
                        <NumericFormat
                            id={id}
                            placeholder={placeholder}
                            value={field.state.value || ''}
                            onValueChange={(values) => {
                                field.handleChange(values.floatValue || 0);
                            }}
                            onBlur={field.handleBlur}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            allowNegative={false}
                            customInput={Input}
                            className="w-full grow border-0 px-3 py-2 tabular-nums shadow-none outline-none selection:bg-primary selection:text-primary-foreground focus-visible:ring-0"
                        />
                    </div>
                ) : (
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
                )}
                {errorMessage && (
                    <p className="-mt-1.5 text-xs text-destructive italic">
                        {errorMessage}
                    </p>
                )}
                {helperText && !errorMessage && (
                    <p className="-mt-1.5 text-xs text-muted-foreground italic">
                        {helperText}
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
        type = 'text',
        value: propValue,
        onChange: propOnChange,
        ...inputProps
    } = props as InputLabelAndHelperProps;
    const id = providedId || generatedId;

    const [internalValue, setInternalValue] = useState(propValue || '');

    useEffect(() => {
        if (type !== 'currency') {
            setInternalValue(propValue || '');
        }
    }, [propValue, type]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            let newValue = e.target.value;

            if (type === 'number') {
                newValue = newValue.replace(/[^0-9]/g, '');
                // Hilangkan leading zeros kecuali jika hanya 0
                newValue = newValue.replace(/^0+(?=\d)/, '');
            }

            setInternalValue(newValue);

            if (propOnChange) {
                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: newValue,
                    },
                } as React.ChangeEvent<HTMLInputElement>;
                propOnChange(syntheticEvent);
            }
        },
        [type, propOnChange],
    );

    const handleIncrement = () => {
        const current = Number(internalValue) || 0;
        const newValue = (current + 1).toString().replace(/^0+(?=\d)/, '');
        setInternalValue(newValue);

        if (propOnChange) {
            const syntheticEvent = {
                target: { value: newValue },
            } as React.ChangeEvent<HTMLInputElement>;
            propOnChange(syntheticEvent);
        }
    };

    const handleDecrement = () => {
        const current = Number(internalValue) || 0;
        const newValue = Math.max(0, current - 1)
            .toString()
            .replace(/^0+(?=\d)/, '');
        setInternalValue(newValue);

        if (propOnChange) {
            const syntheticEvent = {
                target: { value: newValue },
            } as React.ChangeEvent<HTMLInputElement>;
            propOnChange(syntheticEvent);
        }
    };

    return (
        <div className={`w-full space-y-2 ${className || ''}`}>
            {label && (
                <Label
                    htmlFor={id}
                    className={cn('truncate', error ? 'text-destructive' : '')}
                >
                    {label}
                </Label>
            )}
            {type === 'number' ? (
                <div
                    className={`relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 md:text-sm dark:bg-input/30 ${error ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40' : ''}`}
                >
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={handleDecrement}
                        className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <MinusIcon size={16} />
                        <span className="sr-only">Decrement</span>
                    </button>
                    <Input
                        ref={ref}
                        id={id}
                        type="text"
                        value={internalValue}
                        onChange={handleInputChange}
                        className="w-full grow border-0 px-3 py-2 text-center tabular-nums shadow-none outline-none selection:bg-primary selection:text-primary-foreground focus-visible:ring-0"
                        {...inputProps}
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={handleIncrement}
                        className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <PlusIcon size={16} />
                        <span className="sr-only">Increment</span>
                    </button>
                </div>
            ) : type === 'currency' ? (
                <div
                    className={`relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 md:text-sm dark:bg-input/30 ${error ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40' : ''}`}
                >
                    <span className="flex items-center justify-center border-r border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                        Rp.
                    </span>
                    <NumericFormat
                        id={id}
                        value={
                            typeof propValue === 'string' ||
                            typeof propValue === 'number'
                                ? propValue
                                : ''
                        }
                        onValueChange={(values) => {
                            if (propOnChange) {
                                const syntheticEvent = {
                                    target: { value: values.floatValue || 0 },
                                } as unknown as React.ChangeEvent<HTMLInputElement>;
                                propOnChange(syntheticEvent);
                            }
                        }}
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        allowNegative={false}
                        customInput={Input}
                        className="w-full grow border-0 px-3 py-2 tabular-nums shadow-none outline-none selection:bg-primary selection:text-primary-foreground focus-visible:ring-0"
                        placeholder={inputProps.placeholder}
                        disabled={inputProps.disabled}
                        readOnly={inputProps.readOnly}
                    />
                </div>
            ) : (
                <Input
                    ref={ref}
                    id={id}
                    type={type}
                    value={propValue}
                    onChange={propOnChange}
                    {...inputProps}
                    className={
                        error
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                    }
                />
            )}
            {helperText && (
                <p
                    className={`-mt-1.5 text-xs italic ${error ? 'text-destructive' : 'text-muted-foreground'}`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
});

InputLabelAndHelper.displayName = 'InputLabelAndHelper';

export { InputLabelAndHelper };
