import React from 'react';
import { DateRangeFilterNew } from '@/components/ui/DateRangeFilterNew';

interface GarageFilters {
  search: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
    preset: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom' | null;
  };
}

interface GarageFiltersProps {
  filters: GarageFilters;
  onFiltersChange: (filters: GarageFilters) => void;
}

export const GarageFiltersComponent: React.FC<GarageFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  return (
    <div className="flex items-center gap-4">
      <DateRangeFilterNew
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      <button
        onClick={() =>
          onFiltersChange({
            ...filters,
            dateRange: { from: null, to: null, preset: null }
          })
        }
        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
};

export type { GarageFilters };