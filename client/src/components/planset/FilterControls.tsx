import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar as CalendarIcon,
  MapPin,
  Building,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { TableFilters } from "../../../../shared/types";

interface FilterControlsProps {
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters) => void;
}

// Mock data for dropdowns - replace with data from your API
const states = [
  { code: "AZ", name: "Arizona", count: 1 },
  { code: "CJ", name: "Colorado", count: 1 },
  { code: "DR", name: "Delaware", count: 11 },
  { code: "KS", name: "Kansas", count: 1 },
  { code: "CA", name: "California", count: 15 },
];

const portals = [
  { id: "portal", name: "Portal", count: 13 },
  { id: "portal-gamma", name: "Portal Gamma", count: 10 },
  { id: "portal-delta", name: "Portal Delta", count: 16 },
  { id: "portal-beta", name: "Portal Beta", count: 2 },
];

export function FilterControls({
  filters,
  onFiltersChange,
}: FilterControlsProps) {
  // Temporary state for date selection before applying
  const [tempDateRange, setTempDateRange] = useState<{
    from: Date | null;
    to: Date | null;
    preset: "today" | "week" | "month" | "quarter" | "year" | "custom" | null;
  }>({
    from: null,
    to: null,
    preset: null,
  });

  // State for custom date range picker
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const clearAllFilters = () => {
    onFiltersChange({
      ...filters,
      states: new Set(),
      portals: new Set(),
      dateRange: { from: null, to: null, preset: null },
    });
    setTempDateRange({ from: null, to: null, preset: null });
  };

  const selectAllStates = () => {
    const allStates = new Set(states.map((state) => state.code));
    onFiltersChange({ ...filters, states: allStates });
  };

  const clearStates = () => {
    onFiltersChange({ ...filters, states: new Set() });
  };

  const selectAllPortals = () => {
    const allPortals = new Set(portals.map((portal) => portal.id));
    onFiltersChange({ ...filters, portals: allPortals });
  };

  const clearPortals = () => {
    onFiltersChange({ ...filters, portals: new Set() });
  };

  const handleDatePreset = (
    preset: "today" | "week" | "month" | "quarter" | "year"
  ) => {
    const now = new Date();
    let from: Date, to: Date;

    switch (preset) {
      case "today":
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        to = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59
        );
        break;
      case "week":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        from = new Date(
          startOfWeek.getFullYear(),
          startOfWeek.getMonth(),
          startOfWeek.getDate()
        );
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

    // Only set temporary state, don't apply yet
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
      return presetLabels[
        filters.dateRange.preset as keyof typeof presetLabels
      ];
    }

    return `${filters.dateRange.from.toLocaleDateString()} - ${filters.dateRange.to.toLocaleDateString()}`;
  };

  return (
    <div className="flex items-center gap-4 pl-5 ml-5">
      {/* Date Range Filter Popover */}
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
              variant={
                tempDateRange.preset === "quarter" ? "default" : "outline"
              }
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

      {/* Custom Date Range Picker Modal - Rendered as Portal */}
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

      {/* States Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`rounded-full font-normal ${
              filters.states && filters.states.size > 0
                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {filters.states && filters.states.size > 0
              ? `States (${filters.states.size})`
              : "Select States"}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[11rem] p-0">
          <div className="p-3 border-b">
            <p className="font-semibold">Filter by State</p>
          </div>

          <div className="p-3 max-h-60 overflow-y-auto">
            {states.map((state) => (
              <div
                key={state.code}
                className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const newStates = new Set(filters.states || new Set());
                  const isCurrentlySelected = filters.states
                    ? filters.states.has(state.code)
                    : false;

                  if (isCurrentlySelected) {
                    newStates.delete(state.code);
                  } else {
                    newStates.add(state.code);
                  }

                  onFiltersChange({ ...filters, states: newStates });
                }}
              >
                <div className="flex items-center gap-2 text-sm font-normal flex-1">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <Checkbox
                      id={`state-${state.code}`}
                      checked={
                        filters.states ? filters.states.has(state.code) : false
                      }
                      onCheckedChange={() => {}} // Disable direct checkbox interaction
                      className="pointer-events-none" // Prevent direct checkbox clicks
                    />
                  </div>
                  <span className="select-none">{state.name}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-full pointer-events-none select-none"
                >
                  {state.count}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 bg-gray-100 border rounded dark:text-gray-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearStates();
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                selectAllStates();
              }}
            >
              All
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Portals & Clients Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`rounded-full font-normal ${
              filters.portals && filters.portals.size > 0
                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <Building className="w-4 h-4 mr-2" />
            {filters.portals && filters.portals.size > 0
              ? `Portals (${filters.portals.size})`
              : "Select Portals & Clients"}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[15rem] p-0">
          <div className="p-3 border-b">
            <p className="font-semibold">Filter by Portal</p>
          </div>
          <div className="p-3 max-h-60 overflow-y-auto">
            {portals.map((portal) => (
              <div
                key={portal.id}
                className="flex items-center justify-between py-1"
              >
                <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                  <Checkbox
                    id={`portal-${portal.id}`}
                    checked={
                      filters.portals ? filters.portals.has(portal.id) : false
                    }
                    onCheckedChange={(checked) => {
                      const newPortals = new Set(filters.portals || new Set());
                      if (checked) {
                        newPortals.add(portal.id);
                      } else {
                        newPortals.delete(portal.id);
                      }
                      onFiltersChange({ ...filters, portals: newPortals });
                    }}
                  />
                  {portal.name}
                </label>
                <Badge variant="secondary" className="rounded-full">
                  {portal.count}
                </Badge>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 bg-gray-100 border rounded dark:text-gray-300"
              onClick={clearPortals}
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={selectAllPortals}
            >
              All
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        onClick={clearAllFilters}
        className="text-gray-600 bg-gray-100 border rounded-3xl dark:text-gray-300"
      >
        Clear All
      </Button>
    </div>
  );
}
