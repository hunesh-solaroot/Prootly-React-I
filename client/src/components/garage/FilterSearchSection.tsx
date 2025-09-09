import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GarageFiltersComponent, GarageFilters } from './GarageFilters';

// --- SVG for Font Awesome 'filter' icon ---
export const FilterIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"  
        viewBox="0 0 512 512"
        className="w-4 h-4"
        fill="currentColor"
    >
        <path d="M3.853 54.87C10.47 40.9 24.54 32 40 32H472c15.46 0 29.53 8.901 36.15 22.87C514.8 66.71 512.7 82.37 504.3 93.1L320 320.9V448c0 12.1-6.805 23.2-17.75 28.62C291.4 481.8 278.4 482.8 268.4 477.4L196.4 437.4C186.9 432.3 181.3 422.3 181.3 411.3V320.9L7.701 93.1C-.7024 82.37-2.763 66.71 3.853 54.87z" />
    </svg>
);

interface FilterSearchSectionProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showFilters: boolean;
    onToggleFilters: () => void;
    hasActiveFilters: boolean;
    filters?: GarageFilters;
    onFiltersChange?: (filters: GarageFilters) => void;
}

export const FilterSearchSection: React.FC<FilterSearchSectionProps> = ({
    searchTerm,
    onSearchChange,
    showFilters,
    onToggleFilters,
    hasActiveFilters,
    filters,
    onFiltersChange
}) => {
    return (
        <>
            {/* Search and Filter Toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                    onClick={onToggleFilters}
                    className={`${hasActiveFilters ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gradient-to-br from-emerald-500 to-green-600'} text-white border-none px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 relative hover:shadow-lg hover:shadow-emerald-500/30`}
                >
                    <FilterIcon />
                </Button>

                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search here..."
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="h-12 pl-4 pr-4 rounded-full border-2 border-green-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-green-700 w-64"
                    />
                </div>
            </div>
            
            {/* Filters - rendered separately for positioning */}
            {showFilters && filters && onFiltersChange && (
                <div className="flex items-center gap-4">
                    <GarageFiltersComponent
                        filters={filters}
                        onFiltersChange={onFiltersChange}
                    />
                </div>
            )}
        </>
    );
};