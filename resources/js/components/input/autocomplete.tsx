import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../../lib/utils';
import {
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command';

export type Option = Record<'value' | 'label', string> & Record<string, string>;

type AutoCompleteProps = {
    options: Option[];
    emptyMessage: string;
    value?: Option;
    onValueChange?: (value: Option) => void;
    placeholder?: string;
};

export const AutoComplete = ({
    options,
    placeholder,
    emptyMessage,
    value,
    onValueChange,
}: AutoCompleteProps) => {
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
        setInputValue(selected?.label ?? '');
    }, [selected]);

    const handleSelectOption = useCallback(
        (selectedOption: Option) => {
            setInputValue(selectedOption.label);
            setSelected(selectedOption);
            onValueChange?.(selectedOption);

            setTimeout(() => {
                inputRef.current?.blur();
            }, 0);
        },
        [onValueChange],
    );

    // Filter options based on input value
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );

    return (
        <CommandPrimitive onKeyDown={handleKeyDown}>
            <div>
                <CommandInput
                    ref={inputRef}
                    value={inputValue}
                    onValueChange={setInputValue}
                    onBlur={handleBlur}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    className="text-base"
                />
            </div>
            <div className="relative mt-1">
                <div
                    className={cn(
                        'absolute top-0 z-10 w-full rounded-xl bg-stone-50 outline-none',
                        isOpen ? 'block' : 'hidden',
                    )}
                >
                    <CommandList className="rounded-lg ring-1 ring-slate-200">
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
                        <CommandPrimitive.Empty className="rounded-sm px-2 py-3 text-center text-sm select-none">
                            {emptyMessage}
                        </CommandPrimitive.Empty>
                    </CommandList>
                </div>
            </div>
        </CommandPrimitive>
    );
};
