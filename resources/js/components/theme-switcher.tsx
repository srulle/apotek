'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

const themes = [
    { name: 'Default', value: '' },
    { name: 'Clean Slate', value: 'clean-slate' },
    { name: 'Claude', value: 'claude' },
    { name: 'Catppuccin', value: 'catppuccin' },
    { name: 'Cyberpunk', value: 'cyberpunk' },
    { name: 'Nord', value: 'nord' },
    { name: 'Supabase', value: 'supabase' },
    { name: 'Sunset', value: 'sunset' },
    { name: 'Mint', value: 'mint' },
    { name: 'Rose Pine', value: 'rose-pine' },
    { name: 'Dracula', value: 'dracula' },
    { name: 'Monokai', value: 'monokai' },
    { name: 'GitHub Dark', value: 'github-dark' },
    { name: 'Tokyo Night', value: 'tokyo-night' },
    { name: 'Solid Blue', value: 'solid-blue' },
    { name: 'Solid Green', value: 'solid-green' },
    { name: 'Solid Purple', value: 'solid-purple' },
    { name: 'Solid Red', value: 'solid-red' },
    { name: 'Solid Orange', value: 'solid-orange' },
];

export function ThemeSwitcher() {
    const { appearance, updateAppearance } = useAppearance();
    const [open, setOpen] = useState(false);
    const [currentPreset, setCurrentPreset] = useState('');

    useEffect(() => {
        // Load saved preset
        const saved = localStorage.getItem('theme-preset') || '';
        setCurrentPreset(saved);

        // Apply saved preset on mount
        if (saved) {
            document.documentElement.classList.add(`theme-${saved}`);
        }
    }, []);

    const setThemePreset = (value: string) => {
        document.documentElement.classList.remove(
            ...themes.map((x) => `theme-${x.value}`),
        );
        if (value) {
            document.documentElement.classList.add(`theme-${value}`);
        }
        localStorage.setItem('theme-preset', value);
        setCurrentPreset(value);
        // Popover tetap terbuka
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
                {/* Light/Dark/System Mode Toggle */}
                <div className="border-b p-2">
                    <div className="flex gap-1">
                        <Button
                            variant={
                                appearance === 'light' ? 'default' : 'ghost'
                            }
                            size="sm"
                            className="h-7 flex-1 justify-center"
                            onClick={() => updateAppearance('light')}
                        >
                            <Sun className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={
                                appearance === 'dark' ? 'default' : 'ghost'
                            }
                            size="sm"
                            className="h-7 flex-1 justify-center"
                            onClick={() => updateAppearance('dark')}
                        >
                            <Moon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={
                                appearance === 'system' ? 'default' : 'ghost'
                            }
                            size="sm"
                            className="h-7 flex-1 justify-center"
                            onClick={() => updateAppearance('system')}
                        >
                            <Monitor className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Theme Combobox */}
                <Command>
                    <CommandInput placeholder="Search themes..." />
                    <CommandList>
                        <CommandEmpty>No theme found.</CommandEmpty>
                        <CommandGroup heading="Theme Presets">
                            {themes.map((theme) => (
                                <CommandItem
                                    key={theme.value}
                                    value={theme.name}
                                    onSelect={() => setThemePreset(theme.value)}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            currentPreset === theme.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {theme.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
