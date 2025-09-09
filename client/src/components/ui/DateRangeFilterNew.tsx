import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TableFilters } from "../../../../shared/types";

interface DateRangeFilterNewProps {
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters) => void;
}

const DateRangeFilterNew: React.FC<DateRangeFilterNewProps> = ({ filters, onFiltersChange }) => {
  const [tempDateRange, setTempDateRange] = useState<{
    from: Date | null;
    to: Date | null;
    preset: "today" | "week" | "month" | "quarter" | "year" | "custom" | null;
  }>({
    from: null,
    to: null,
    preset: null,
  });

  // Missing state variables - ADD THESE:
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleDatePreset = (
    preset: "today" | "week" | "month" | "quarter" | "year"
  ) => {
    const now = new Date();
    let from: Date, to: Date;

    switch (preset) {
      case "today":
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case "week":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        from = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate());
        to = new Date(from);
        to.setDate(from.getDate() + 6);
        to.setHours(23, 59, 59);
        break;
      case "month":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case "quarter":
        const quarter = Math.floor(now.getMonth() / 3);
        from = new Date(now.getFullYear(), quarter * 3, 1);
        to = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59);
        break;
      case "year":
        from = new Date(now.getFullYear(), 0, 1);
        to = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      default:
        return;
    }

    setTempDateRange({ from, to, preset });
  };

  const applyDateRange = () => {
    if (tempDateRange.from && tempDateRange.to) {
      onFiltersChange({
        ...filters,
        dateRange: tempDateRange,
      });
    }
  };

  const selectDateRange = (
    from: Date | null,
    to: Date | null,
    preset?: "today" | "week" | "month" | "quarter" | "year" | "custom" | null
  ) => {
    onFiltersChange({
      ...filters,
      dateRange: { from, to, preset: preset || null },
    });
    setTempDateRange({ from, to, preset: preset || null });
  };

  const handleCustomRangeClick = () => {
    setShowCustomDatePicker(true);
    setTempDateRange({ from: null, to: null, preset: "custom" });
  };

  const handleCustomDateSelect = (
    range: { from: Date | undefined; to?: Date | undefined } | undefined
  ) => {
    if (range) {
      setCustomDateRange({ from: range.from, to: range.to });
      if (range.from && range.to) {
        setTempDateRange({ from: range.from, to: range.to, preset: "custom" });
      }
    }
  };

  const applyCustomDateRange = () => {
    if (customDateRange.from && customDateRange.to) {
      onFiltersChange({
        ...filters,
        dateRange: {
          from: customDateRange.from,
          to: customDateRange.to,
          preset: "custom",
        },
      });
      setShowCustomDatePicker(false);
    }
  };

  const cancelCustomDateRange = () => {
    setShowCustomDatePicker(false);
    setCustomDateRange({ from: undefined, to: undefined });
    setTempDateRange({ from: null, to: null, preset: null });
  };

  const clearDateRange = () => {
    onFiltersChange({
      ...filters,
      dateRange: { from: null, to: null, preset: null },
    });
    setTempDateRange({ from: null, to: null, preset: null });
  };

  const getDateRangeLabel = () => {
    if (!filters.dateRange.from || !filters.dateRange.to) {
      return "Select Date Range";
    }

    if (filters.dateRange.preset) {
      const presetLabels = {
        today: "Today",
        week: "This Week",
        month: "This Month",
        quarter: "This Quarter",
        year: "This Year",
        custom: "Custom Range",
      };
      return presetLabels[filters.dateRange.preset as keyof typeof presetLabels];
    }

    return `${filters.dateRange.from.toLocaleDateString()} - ${filters.dateRange.to.toLocaleDateString()}`;
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`rounded-full font-normal ${
              filters.dateRange.from && filters.dateRange.to
                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {getDateRangeLabel()}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[15rem] p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              variant={tempDateRange.preset === "today" ? "default" : "outline"}
              size="sm"
              className="font-normal"
              onClick={() => handleDatePreset("today")}
            >
              Today
            </Button>
            <Button
              variant={tempDateRange.preset === "week" ? "default" : "outline"}
              size="sm"
              className="font-normal"
              onClick={() => handleDatePreset("week")}
            >
              This Week
            </Button>
            <Button
              variant={tempDateRange.preset === "month" ? "default" : "outline"}
              size="sm"
              className="font-normal"
              onClick={() => handleDatePreset("month")}
            >
              This Month
            </Button>
            <Button
              variant={tempDateRange.preset === "quarter" ? "default" : "outline"}
              size="sm"
              className="font-normal"
              onClick={() => handleDatePreset("quarter")}
            >
              This Quarter
            </Button>
            <Button
              variant={tempDateRange.preset === "year" ? "default" : "outline"}
              size="sm"
              className="font-normal"
              onClick={() => handleDatePreset("year")}
            >
              This Year
            </Button>
            <Button
              variant={
                filters.dateRange.preset === "custom" ? "default" : "outline"
              }
              size="sm"
              className="font-normal"
              onClick={handleCustomRangeClick}
            >
              Custom Range
            </Button>
          </div>
          <div className="flex justify-end gap-2 border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 bg-gray-100 border rounded dark:text-gray-300"
              onClick={clearDateRange}
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={applyDateRange}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Custom Date Range Picker Modal - MOVED OUTSIDE POPOVER */}
      {showCustomDatePicker &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
              <h3 className="font-semibold mb-4 text-lg text-gray-900 dark:text-white">
                Select Custom Date Range
              </h3>
              <div className="flex justify-center">
                <Calendar
                  mode="range"
                  selected={{
                    from: customDateRange.from,
                    to: customDateRange.to,
                  }}
                  onSelect={handleCustomDateSelect}
                  numberOfMonths={2}
                  className="rounded-md border-0"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 bg-gray-100 border rounded-3xl dark:text-gray-300"
                  onClick={cancelCustomDateRange}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={applyCustomDateRange}
                  disabled={!customDateRange.from || !customDateRange.to}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export { DateRangeFilterNew };