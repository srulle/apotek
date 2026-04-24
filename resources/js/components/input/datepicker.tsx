'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import type { ChangeEvent, ChangeEventHandler } from 'react';
import { useState, useMemo, forwardRef, useId } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    formatString?: string;
    minDate?: Date;
    maxDate?: Date;
    fromYear?: number;
    toYear?: number;
    field?: any;
    label?: string;
    helperText?: string;
}

// Type guard untuk mengecek apakah props mengandung field TanStack Form
function isTanStackField(props: any): boolean {
    return (
        props.field &&
        typeof props.field.handleChange === 'function' &&
        props.field.state
    );
}

const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
    (
        {
            value,
            onChange,
            placeholder = 'Pilih tanggal',
            className,
            disabled = false,
            formatString = 'd MMMM, yyyy',
            minDate,
            maxDate,
            fromYear = new Date().getFullYear() - 10,
            toYear = new Date().getFullYear() + 10,
            field,
            label,
            helperText,
        },
        ref,
    ) => {
        // Adjust fromYear and toYear based on minDate and maxDate
        const effectiveFromYear = minDate
            ? Math.max(fromYear, minDate.getFullYear())
            : fromYear;
        const effectiveToYear = maxDate
            ? Math.min(toYear, maxDate.getFullYear())
            : toYear;

        // Create disabled dates matcher based on minDate and maxDate
        const disabledDates = useMemo(() => {
            const matchers: any[] = [];
            if (minDate) {
                // Disable all dates before minDate (normalized to start of day)
                const normalizedMinDate = new Date(minDate);
                normalizedMinDate.setHours(0, 0, 0, 0);
                matchers.push({ before: normalizedMinDate });
            }
            if (maxDate) {
                // Disable all dates after maxDate (normalized to end of day)
                const normalizedMaxDate = new Date(maxDate);
                normalizedMaxDate.setHours(23, 59, 59, 999);
                matchers.push({ after: normalizedMaxDate });
            }
            return matchers.length > 0 ? matchers : undefined;
        }, [minDate, maxDate]);

        // Normalize minDate and maxDate for fromDate/toDate
        const normalizedMinDate = useMemo(() => {
            if (!minDate) return undefined;
            const d = new Date(minDate);
            d.setHours(0, 0, 0, 0);
            return d;
        }, [minDate]);

        const normalizedMaxDate = useMemo(() => {
            if (!maxDate) return undefined;
            const d = new Date(maxDate);
            d.setHours(23, 59, 59, 999);
            return d;
        }, [maxDate]);

        const generatedId = useId();

        // Support TanStack Form field
        if (field) {
            value = field.state.value;
            onChange = field.handleChange;
        }

        const hasError = field && field.state?.meta?.errors?.length > 0;
        const errorMessage =
            field && field.state?.meta?.errors
                ? field.state.meta.errors
                      .map((e: any) => e.message || e)
                      .join(', ')
                : '';

        const [month, setMonth] = useState<Date | undefined>(value);
        const [open, setOpen] = useState(false);

        const handleCalendarChange = (
            value: string | number,
            event: ChangeEventHandler<HTMLSelectElement>,
        ) => {
            const newEvent = {
                target: {
                    value: String(value),
                },
            } as ChangeEvent<HTMLSelectElement>;
            event(newEvent);
        };

        const handleSelect = (selectedDate: Date | undefined) => {
            if (onChange) {
                onChange(selectedDate);
            }

            if (selectedDate) {
                setMonth(selectedDate);
            }

            setOpen(false);
        };

        return (
            <div className={`w-full space-y-2 ${className || ''}`}>
                {label && (
                    <Label
                        className={cn(
                            'truncate',
                            hasError ? 'text-destructive' : '',
                        )}
                    >
                        {label}
                    </Label>
                )}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={ref}
                            className={cn(
                                'w-full justify-start text-left font-normal',
                                !value && 'text-muted-foreground',
                                hasError
                                    ? 'border-destructive focus-visible:ring-destructive'
                                    : '',
                            )}
                            variant="outline"
                            disabled={disabled}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? (
                                format(value, formatString, { locale: id })
                            ) : (
                                <span>{placeholder}</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                            captionLayout="dropdown"
                            components={{
                                MonthCaption: (props) => <>{props.children}</>,
                                DropdownNav: (props) => (
                                    <div className="flex w-full items-center gap-2 px-2">
                                        {props.children}
                                    </div>
                                ),
                                Dropdown: (props) => (
                                    <Select
                                        onValueChange={(value) => {
                                            if (props.onChange) {
                                                handleCalendarChange(
                                                    value,
                                                    props.onChange,
                                                );
                                            }
                                        }}
                                        value={String(props.value)}
                                    >
                                        <SelectTrigger className="h-8 first:flex-1 last:shrink-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            {props.options?.map((option) => (
                                                <SelectItem
                                                    disabled={option.disabled}
                                                    key={option.value}
                                                    value={String(option.value)}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ),
                            }}
                            hideNavigation
                            mode="single"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={handleSelect}
                            selected={value}
                            disabled={disabled ? true : disabledDates}
                            fromDate={normalizedMinDate}
                            toDate={normalizedMaxDate}
                            fromYear={effectiveFromYear}
                            toYear={effectiveToYear}
                        />
                    </PopoverContent>
                </Popover>
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
    },
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
