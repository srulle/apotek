'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import type { ChangeEvent, ChangeEventHandler } from 'react';
import { useState, forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
        },
        ref,
    ) => {
        const [month, setMonth] = useState<Date>(value || new Date());

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
        };

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !value && 'text-muted-foreground',
                            className,
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
                        disabled={disabled}
                        fromDate={minDate}
                        toDate={maxDate}
                    />
                </PopoverContent>
            </Popover>
        );
    },
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
