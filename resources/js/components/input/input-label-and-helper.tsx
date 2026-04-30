import { Command as CommandPrimitive } from 'cmdk';
import { MinusIcon, PlusIcon, Check, InfoIcon } from 'lucide-react';
import type { InputHTMLAttributes, KeyboardEvent } from 'react';
import {
    useId,
    forwardRef,
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from 'react';
import { NumericFormat } from 'react-number-format';
import { Button } from '@/components/ui/button';
import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type Option = Record<'value' | 'label', string> & Record<string, string>;

export interface InputLabelAndHelperProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelInfo?: string;
    helperText?: string;
    error?: boolean;
    type?: 'text' | 'number' | 'currency' | 'autocomplete';
    autocompleteOptions?: Option[];
    autocompleteEmptyMessage?: string;
    onAutocompleteSelect?: (value: Option | undefined) => void;
    autocompleteValue?: Option;
}

// Props khusus untuk TanStack Form
export interface TanStackInputProps {
    field: any;
    label: string;
    labelInfo?: string;
    placeholder?: string;
    type?: 'text' | 'number' | 'currency' | 'autocomplete';
    className?: string;
    helperText?: string;
    autocompleteOptions?: Option[];
    autocompleteEmptyMessage?: string;
    onAutocompleteSelect?: (value: Option | undefined) => void;
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
            labelInfo,
            placeholder,
            type = 'text',
            className,
            helperText,
            autocompleteOptions = [],
            autocompleteEmptyMessage,
            onAutocompleteSelect,
        } = props;
        const id = field.name || generatedId;
        const hasError = field.state.meta.errors.length > 0;
        const errorMessage = field.state.meta.errors
            .map((e: any) => e.message || e)
            .join(', ');
        const inputRef = useRef<HTMLInputElement>(null);

        const [internalValue, setInternalValue] = useState(
            field.state.value || '',
        );

        // AutoComplete states
        const [isOpen, setOpen] = useState(false);
        const [selected, setSelected] = useState<Option | undefined>(
            autocompleteOptions.find((opt) => opt.value === field.state.value),
        );
        const [inputValue, setInputValue] = useState<string>(
            autocompleteOptions.find((opt) => opt.value === field.state.value)
                ?.label ||
                field.state.value ||
                '',
        );

        // AutoComplete handlers
        const handleKeyDown = useCallback(
            (event: KeyboardEvent<HTMLDivElement>) => {
                const input = inputRef.current;

                if (!input) {
                    return;
                }

                if (!isOpen) {
                    setOpen(true);
                }

                if (
                    [
                        'ArrowDown',
                        'ArrowUp',
                        'ArrowLeft',
                        'ArrowRight',
                    ].includes(event.key)
                ) {
                    event.preventDefault();
                }

                if (event.key === 'Enter' && input.value !== '') {
                    const optionToSelect = autocompleteOptions.find(
                        (option) => option.label === input.value,
                    );

                    if (optionToSelect) {
                        setSelected(optionToSelect);
                        onAutocompleteSelect?.(optionToSelect);
                        field.handleChange(optionToSelect.value);
                    } else {
                        // Custom value yang user ketik sendiri
                        const customOption: Option = {
                            value: input.value,
                            label: input.value,
                        };
                        setSelected(customOption);
                        onAutocompleteSelect?.(customOption);
                        field.handleChange(input.value);
                    }
                }

                if (event.key === 'Escape') {
                    input.blur();
                }
            },
            [isOpen, onAutocompleteSelect, autocompleteOptions, field],
        );

        const handleBlur = useCallback(() => {
            setOpen(false);

            // Jika nilai input berbeda dengan nilai yang tersimpan, update selalu
            if (inputValue && selected?.label !== inputValue) {
                const customOption: Option = {
                    value: inputValue,
                    label: inputValue,
                };
                setSelected(customOption);
                onAutocompleteSelect?.(customOption);
                field.handleChange(inputValue);
            }
        }, [selected, inputValue, onAutocompleteSelect, field]);

        const handleSelectOption = useCallback(
            (selectedOption: Option) => {
                if (selectedOption.value === selected?.value) {
                    setInputValue('');
                    setSelected(undefined);
                    onAutocompleteSelect?.(undefined);
                    field.handleChange('');
                } else {
                    setInputValue(selectedOption.label);
                    setSelected(selectedOption);
                    onAutocompleteSelect?.(selectedOption);
                    field.handleChange(selectedOption.value);
                }

                setTimeout(() => {
                    inputRef.current?.blur();
                }, 0);
            },
            [onAutocompleteSelect, selected, field],
        );

        // Filter options based on input value
        const filteredOptions = useMemo(
            () =>
                autocompleteOptions.filter((option) =>
                    option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()),
                ),
            [autocompleteOptions, inputValue],
        );

        const showList =
            isOpen && (filteredOptions.length > 0 || autocompleteEmptyMessage);

        useEffect(() => {
            if (type !== 'currency') {
                setInternalValue(field.state.value || '');
            }

            // Sync value saat field berubah dari luar
            if (type === 'autocomplete') {
                const foundOption = autocompleteOptions.find(
                    (opt) => opt.value === field.state.value,
                );

                if (foundOption) {
                    setSelected(foundOption);
                    setInputValue(foundOption.label);
                } else {
                    setInputValue(field.state.value || '');
                }
            }
        }, [field.state.value, type, autocompleteOptions]);

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
            <div className={`w-full overflow-hidden p-1 ${className || ''}`}>
                <Label
                    htmlFor={id}
                    className={cn(
                        'inline-block w-full min-w-0 truncate overflow-hidden text-ellipsis whitespace-nowrap',
                        hasError ? 'text-destructive' : '',
                    )}
                >
                    <div className="flex items-center gap-1">
                        {labelInfo && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 shrink-0 p-0 hover:bg-transparent cursor-pointer"
                                    >
                                        <InfoIcon className="h-3 w-3" />
                                        <span className="sr-only">Info</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-3">
                                    <div className="grid gap-3">
                                        <div className="space-y-1.5 text-center">
                                            <div className="text-sm font-semibold">Informasi</div>
                                            <p className="text-muted-foreground text-xs leading-tight">
                                                {labelInfo}
                                            </p>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                        <span className="truncate">{label}</span>
                    </div>
                </Label>
                {type === 'autocomplete' ? (
                    <CommandPrimitive onKeyDown={handleKeyDown}>
                        <div>
                            <Input
                                id={id}
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    const customOption: Option = {
                                        value: e.target.value,
                                        label: e.target.value,
                                    };
                                    setSelected(customOption);
                                    onAutocompleteSelect?.(customOption);
                                    field.handleChange(e.target.value);
                                }}
                                onBlur={handleBlur}
                                onFocus={() => setOpen(true)}
                                placeholder={placeholder}
                                className={cn(
                                    hasError
                                        ? 'border-destructive focus-visible:ring-destructive'
                                        : '',
                                )}
                            />
                        </div>
                        <div className="relative mt-1">
                            <div
                                className={cn(
                                    'absolute top-0 z-10 w-full rounded-xl bg-popover outline-none',
                                    showList ? 'block' : 'hidden',
                                )}
                            >
                                <CommandList className="rounded-lg border">
                                    {filteredOptions.length > 0 ? (
                                        <CommandGroup>
                                            {filteredOptions.map((option) => {
                                                const isSelected =
                                                    selected?.value ===
                                                    option.value;

                                                return (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.label}
                                                        onMouseDown={(
                                                            event,
                                                        ) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                        }}
                                                        onSelect={() =>
                                                            handleSelectOption(
                                                                option,
                                                            )
                                                        }
                                                        className={cn(
                                                            'flex w-full items-center gap-2',
                                                            !isSelected
                                                                ? 'pl-8'
                                                                : '',
                                                        )}
                                                    >
                                                        {isSelected ? (
                                                            <Check className="w-4" />
                                                        ) : null}
                                                        {option.label}
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    ) : null}
                                    <CommandPrimitive.Empty className="rounded-sm px-2 py-3 text-center text-xs text-muted-foreground select-none">
                                        {autocompleteEmptyMessage}
                                    </CommandPrimitive.Empty>
                                </CommandList>
                            </div>
                        </div>
                    </CommandPrimitive>
                ) : type === 'number' ? (
                    <div
                        className={`relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 md:text-sm dark:bg-input/30 ${hasError ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40' : ''}`}
                    >
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={handleDecrement}
                            className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
                            className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
                                ? 'border-destructive focus-visible:ring-ring'
                                : ''
                        }
                    />
                )}
                {errorMessage && (
                    <p className="text-xs text-destructive italic">
                        {errorMessage}
                    </p>
                )}
                {helperText && !errorMessage && (
                    <div className="text-xs text-muted-foreground italic">
                        {helperText}
                    </div>
                )}
            </div>
        );
    }

    // Jika menggunakan props biasa (backward compatibility)
    const {
        label,
        labelInfo,
        helperText,
        error = false,
        className,
        id: providedId,
        type = 'text',
        value: propValue,
        onChange: propOnChange,
        autocompleteOptions = [],
        autocompleteEmptyMessage,
        onAutocompleteSelect,
        autocompleteValue,
        ...inputProps
    } = props as InputLabelAndHelperProps;
    const id = providedId || generatedId;
    const inputRef = useRef<HTMLInputElement>(null);

    const [internalValue, setInternalValue] = useState(propValue || '');

    // AutoComplete states
    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState<Option | undefined>(
        autocompleteValue,
    );
    const [inputValue, setInputValue] = useState<string>(
        autocompleteValue?.label || '',
    );

    // AutoComplete handlers
    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;

            if (!input) {
                return;
            }

            if (!isOpen) {
                setOpen(true);
            }

            if (
                ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(
                    event.key,
                )
            ) {
                event.preventDefault();
            }

            if (event.key === 'Enter' && input.value !== '') {
                const optionToSelect = autocompleteOptions.find(
                    (option) => option.label === input.value,
                );

                if (optionToSelect) {
                    setSelected(optionToSelect);
                    onAutocompleteSelect?.(optionToSelect);
                }
            }

            if (event.key === 'Escape') {
                input.blur();
            }
        },
        [isOpen, onAutocompleteSelect, autocompleteOptions],
    );

    const handleBlur = useCallback(() => {
        setOpen(false);

        // Jika nilai input berbeda dengan nilai yang tersimpan, update selalu
        if (inputValue && selected?.label !== inputValue) {
            const customOption: Option = {
                value: inputValue,
                label: inputValue,
            };
            setSelected(customOption);
            onAutocompleteSelect?.(customOption);
        }
    }, [selected, inputValue, onAutocompleteSelect]);

    const handleSelectOption = useCallback(
        (selectedOption: Option) => {
            if (selectedOption.value === selected?.value) {
                setInputValue('');
                setSelected(undefined);
                onAutocompleteSelect?.(undefined);
            } else {
                setInputValue(selectedOption.label);
                setSelected(selectedOption);
                onAutocompleteSelect?.(selectedOption);
            }

            setTimeout(() => {
                inputRef.current?.blur();
            }, 0);
        },
        [onAutocompleteSelect, selected],
    );

    // Filter options based on input value
    const filteredOptions = autocompleteOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );

    const showList =
        isOpen && (filteredOptions.length > 0 || autocompleteEmptyMessage);

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
                    className={cn(
                        'inline-block w-full min-w-0 truncate overflow-hidden text-ellipsis whitespace-nowrap',
                        error ? 'text-destructive' : '',
                    )}
                >
                    <div className="flex items-center gap-1">
                        {labelInfo && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 shrink-0 p-0 hover:bg-transparent cursor-pointer"
                                    >
                                        <InfoIcon className="h-3 w-3" />
                                        <span className="sr-only">Info</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-2">
                                    <div className="grid gap-3">
                                        <div className="space-y-1.5 text-center">
                                            <div className="text-sm font-semibold">Informasi</div>
                                            <p className="text-muted-foreground text-xs leading-tight">
                                                {labelInfo}
                                            </p>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                        <span className="truncate">{label}</span>
                    </div>
                </Label>
            )}
            {type === 'autocomplete' ? (
                <CommandPrimitive onKeyDown={handleKeyDown}>
                    <div>
                        <Input
                            id={id}
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                const customOption: Option = {
                                    value: e.target.value,
                                    label: e.target.value,
                                };
                                setSelected(customOption);
                                onAutocompleteSelect?.(customOption);
                            }}
                            onBlur={handleBlur}
                            onFocus={() => setOpen(true)}
                            placeholder={inputProps.placeholder}
                            className={cn(
                                error
                                    ? 'border-destructive focus-visible:ring-destructive'
                                    : '',
                            )}
                            {...inputProps}
                        />
                    </div>
                    <div className="relative mt-1">
                        <div
                            className={cn(
                                'absolute top-0 z-10 w-full rounded-xl bg-popover outline-none',
                                showList ? 'block' : 'hidden',
                            )}
                        >
                            <CommandList className="rounded-lg border">
                                {filteredOptions.length > 0 ? (
                                    <CommandGroup>
                                        {filteredOptions.map((option) => {
                                            const isSelected =
                                                selected?.value ===
                                                option.value;

                                            return (
                                                <CommandItem
                                                    key={option.value}
                                                    value={option.label}
                                                    onMouseDown={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                    }}
                                                    onSelect={() =>
                                                        handleSelectOption(
                                                            option,
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex w-full items-center gap-2',
                                                        !isSelected
                                                            ? 'pl-8'
                                                            : '',
                                                    )}
                                                >
                                                    {isSelected ? (
                                                        <Check className="w-4" />
                                                    ) : null}
                                                    {option.label}
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                ) : null}
                                <CommandPrimitive.Empty className="rounded-sm px-2 py-3 text-center text-xs text-muted-foreground select-none">
                                    {autocompleteEmptyMessage}
                                </CommandPrimitive.Empty>
                            </CommandList>
                        </div>
                    </div>
                </CommandPrimitive>
            ) : type === 'number' ? (
                <div
                    className={`relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 md:text-sm dark:bg-input/30 ${error ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40' : ''}`}
                >
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={handleDecrement}
                        className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
