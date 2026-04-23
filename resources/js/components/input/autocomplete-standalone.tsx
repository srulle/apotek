import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../../lib/utils';
import { CommandGroup, CommandItem, CommandList } from '../ui/command';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export type Option = Record<'value' | 'label', string> & Record<string, string>;

type AutoCompleteProps = {
    options: Option[];
    emptyMessage?: string;
    value?: Option;
    onValueChange?: (value: Option | undefined) => void;
    placeholder?: string;
    label?: string;
    helperText?: string;
    error?: boolean;
    className?: string;
};

export const AutoComplete = ({
    options,
    placeholder,
    emptyMessage,
    value,
    onValueChange,
    label,
    helperText,
    error = false,
    className,
}: AutoCompleteProps) => {
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState<Option | undefined>(value);
    const [inputValue, setInputValue] = useState<string>(value?.label || '');

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;

            if (!input) {
                return;
            }

            if (!isOpen) {
                setOpen(true);
            }

            // Prevent page scroll when navigating options
            if (
                ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(
                    event.key,
                )
            ) {
                event.preventDefault();
            }

            if (event.key === 'Enter' && input.value !== '') {
                const optionToSelect = options.find(
                    (option) => option.label === input.value,
                );

                if (optionToSelect) {
                    setSelected(optionToSelect);
                    onValueChange?.(optionToSelect);
                } else {
                    // Custom value yang user ketik sendiri
                    const customOption: Option = {
                        value: input.value,
                        label: input.value,
                    };
                    setSelected(customOption);
                    onValueChange?.(customOption);
                }
            }

            if (event.key === 'Escape') {
                input.blur();
            }
        },
        [isOpen, onValueChange, options],
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
            onValueChange?.(customOption);
        }
    }, [selected, inputValue, onValueChange]);

    const handleSelectOption = useCallback(
        (selectedOption: Option) => {
            if (selectedOption.value === selected?.value) {
                setInputValue('');
                setSelected(undefined);
                onValueChange?.(undefined);
            } else {
                setInputValue(selectedOption.label);
                setSelected(selectedOption);
                onValueChange?.(selectedOption);
            }

            setTimeout(() => {
                inputRef.current?.blur();
            }, 0);
        },
        [onValueChange, selected],
    );

    // Filter options based on input value
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );

    const showList = isOpen && (filteredOptions.length > 0 || emptyMessage);

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
            <CommandPrimitive onKeyDown={handleKeyDown}>
                <div>
                    <Input
                        id={id}
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            // Realtime update custom value ketika mengetik
                            const customOption: Option = {
                                value: e.target.value,
                                label: e.target.value,
                            };
                            setSelected(customOption);
                            onValueChange?.(customOption);
                        }}
                        onBlur={handleBlur}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        className={cn(
                            error
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
                                            selected?.value === option.value;

                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={option.label}
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                                onSelect={() =>
                                                    handleSelectOption(option)
                                                }
                                                className={cn(
                                                    'flex w-full items-center gap-2',
                                                    !isSelected ? 'pl-8' : '',
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
                                {emptyMessage}
                            </CommandPrimitive.Empty>
                        </CommandList>
                    </div>
                </div>
            </CommandPrimitive>
            {helperText && (
                <p
                    className={`-mt-1.5 text-xs italic ${error ? 'text-destructive' : 'text-muted-foreground'}`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};
