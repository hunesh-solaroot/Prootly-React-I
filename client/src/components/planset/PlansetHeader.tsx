import { Search, Plus, Filter, MapPin, Building, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IPlanset, SortConfig, TableFilters } from '../../../../shared/types';
import { FilterControls } from './FilterControls';

interface PlansetHeaderProps {
    filters: TableFilters;
    onFiltersChange: (filters: TableFilters) => void;
    // These props can be used later to open a filter popover
    showFilters: boolean;
    onToggleFilters: () => void;
}

// --- SVG for Font Awesome 'filter' icon ---
export const FilterIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"  
        viewBox="0 0 512 512"
        className="w-4 h-4" // You can control size here
        fill="currentColor" // The color will be inherited from the parent's text color (white)
    >
        <path d="M3.853 54.87C10.47 40.9 24.54 32 40 32H472c15.46 0 29.53 8.901 36.15 22.87C514.8 66.71 512.7 82.37 504.3 93.1L320 320.9V448c0 12.1-6.805 23.2-17.75 28.62C291.4 481.8 278.4 482.8 268.4 477.4L196.4 437.4C186.9 432.3 181.3 422.3 181.3 411.3V320.9L7.701 93.1C-.7024 82.37-2.763 66.71 3.853 54.87z" />
    </svg>
);

export function PlansetHeader({ filters, onFiltersChange, showFilters, onToggleFilters }: PlansetHeaderProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, search: e.target.value });
    };

    const hasActiveFilters = filters.search.trim() !== '' || (filters.states && filters.states.size > 0) || (filters.portals && filters.portals.size > 0) || (filters.dateRange.from && filters.dateRange.to);

    return (
        <header className="bg-white dark:bg-[#2a2a2a] p-3 sticky top-0 z-20 rounded-2xl ml-6 mr-6 shadow-sm">
                {/* Main flex container to correctly position all items */}
                <div className="flex items-center justify-between w-full">

                    {/* Left Side: + Planset Button */}
                    <div className="flex-shrink-0">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full px-4 py-2 h-12">
                                    <div className="bg-white rounded-full p-1 mr-2">
                                        <Plus className="w-4 h-4 text-yellow-500" />
                                    </div>
                                    Planset
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-36 p-1 rounded-md">
                                <Button variant="ghost" className="w-full justify-start font-normal hover:rounded-2xl hover:text-white hover:bg-[linear-gradient(135deg,#10b981,#059669)]"> <span>📝</span> Create</Button>
                                <Button variant="ghost" className="w-full justify-start font-normal hover:rounded-2xl hover:text-white hover:bg-[linear-gradient(135deg,#10b981,#059669)]">  <span>📤</span> Upload</Button>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Center: Conditionally render the FilterControls component */}
                    <div className="flex-grow flex justify-center">
                        {showFilters && (
                            <FilterControls filters={filters} onFiltersChange={onFiltersChange} />
                        )}
                    </div>

                    {/* Right Side: Search and Filter Toggle */}
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
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="h-12 pl-4 pr-4 rounded-full border-2 border-green-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-green-700 w-64"
                            />
                        </div>
                    </div>
                </div>
        </header>
    );
}