'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface FacetedFilterProps {
    title: string;
    options: { label: string; value: string; count?: number }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
}

export default function FacetedFilter({
    title,
    options,
    selectedValues,
    onChange,
}: FacetedFilterProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (value: string) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        onChange(newValues);
    };

    const handleClear = () => {
        onChange([]);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-200 hover:bg-gray-50"
                >
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {title}
                    </span>
                    {selectedValues.length > 0 && (
                        <>
                            <div className="mx-1 h-4 w-[1px] bg-gray-300" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-mono text-[10px] bg-gray-100 text-gray-700"
                            >
                                {selectedValues.length}
                            </Badge>
                        </>
                    )}
                    <ChevronsUpDown className="ml-1.5 h-3 w-3 text-gray-400" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={`Search ${title.toLowerCase()}...`} className="h-8 text-sm" />
                    <CommandList>
                        <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                            No results found
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                        className="text-sm"
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300',
                                                isSelected
                                                    ? 'bg-gray-900 text-white border-gray-900'
                                                    : 'opacity-50'
                                            )}
                                        >
                                            {isSelected && <Check className="h-3 w-3" />}
                                        </div>
                                        <span className="text-gray-700">{option.label}</span>
                                        {option.count !== undefined && (
                                            <span className="ml-auto text-xs text-gray-400">
                                                {option.count}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={handleClear}
                                        className="justify-center text-center text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
