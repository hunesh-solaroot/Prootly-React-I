import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { DynamicProjectRow } from "./DynamicProjectRow";
import { ColumnConfig } from "@/types/planset";
import { IPlanset, SortConfig, TextMode, ColumnTextModes } from "@shared/types";
import { ApiHeaderConfig, DynamicProjectData } from "../../types/apiTypes";
import {
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  WrapText,
  Scissors,
  Home,
  Building,
  Plus,
  EyeOff,
  XCircle,
  RotateCcw,
  Eye,
  RefreshCw,
  Columns,
  Filter,
  Type,
  Move,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


// Enhanced interfaces - Updated for dynamic API-driven headers
interface PlansetDataTableProps {
  projects: DynamicProjectData[]; // Changed to dynamic data
  headers?: ApiHeaderConfig[]; // API-provided headers (optional)
  onShowActivity: (projectId: string) => void;
  loading: boolean;
  error: string | null;
  sortConfig: SortConfig;
  onSort: (key: string) => void; // Changed to string for dynamic keys
  onFilterChange: (
    filterType: "customerType",
      value: "all" | "Residential" | "Commercial"
      ) => void;
  currentFilter?: "all" | "Residential" | "Commercial";
  columnTextModes: Record<string, TextMode | null>; // Changed to dynamic keys
  onColumnTextModeChange: (
    column: string,
    mode: TextMode | null
  ) => void;
  hiddenColumns: Set<string>; // Changed to string keys
  onHideColumn: (key: string) => void;
  onShowAllColumns: () => void;
  onAddColumn: () => void;
  columnWidths: number[];
  tableRef: React.RefObject<HTMLTableElement>;
  onReset: (action: string) => void;
}

// Fixed column widths as specified
const FIXED_COLUMN_WIDTHS = ["25%", "10%", "20%", "15%", "10%", "10%", "10%"];

// Default fallback headers (used when API doesn't provide headers)
const DEFAULT_FALLBACK_HEADERS: ApiHeaderConfig[] = [
  {
    key: "customer",
    label: "Customer Details",
    width: "25%",
    minWidth: 200,
    resizable: true,
    sortable: true,
    filterable: true,
    type: "customer"
  },
  {
    key: "projectDetails",
    label: "Project Details",
    width: "20%",
    minWidth: 120,
    resizable: true,
    sortable: true,
    filterable: true,
    type: "text"
  },
  {
    key: "keyDates",
    label: "Key Dates",
    width: "20%",
    minWidth: 180,
    resizable: true,
    sortable: true,
    filterable: false,
    type: "date"
  },
  {
    key: "status",
    label: "Status",
    width: "15%",
    minWidth: 140,
    resizable: true,
    sortable: true,
    filterable: true,
    type: "status"
  },
  {
    key: "assignedTo",
    label: "Assigned To",
    width: "20%",
    minWidth: 120,
    resizable: true,
    sortable: true,
    filterable: true,
    type: "text"
  },
];

// Storage keys
const COLUMN_WIDTHS_KEY = "planset_table_column_widths";
const TEXT_MODES_KEY = "planset_table_text_modes";
const HIDDEN_COLUMNS_KEY = "planset_table_hidden_columns";

export function PlansetDataTable({
  projects,
  headers: apiHeaders = [],
  loading,
  error,
  sortConfig,
  onSort,
  onFilterChange,
  currentFilter = "all",
  columnTextModes,
  onColumnTextModeChange,
  hiddenColumns,
  onHideColumn,
  onShowAllColumns,
  onAddColumn,
  columnWidths,
  tableRef,
  onShowActivity,
  onReset,
}: PlansetDataTableProps) {
  // Enhanced state management
  const [isResizing, setIsResizing] = useState(false);
  const [resizeData, setResizeData] = useState<{
    columnIndex: number;
    startX: number;
    startWidth: number;
    tableWidth: number;
  } | null>(null);

  const [savedColumnWidths, setSavedColumnWidths] = useState<{
    [key: string]: string;
  }>({});
  const [textModes, setTextModes] = useState<{
    [key: string]: "wrap" | "clip" | null;
  }>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use API headers or fallback to default headers - with null safety
  const headers = (apiHeaders && apiHeaders.length > 0) ? apiHeaders : DEFAULT_FALLBACK_HEADERS;
  const visibleHeaders = headers.filter((h) => !hiddenColumns.has(h.key));
  
  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const savedWidths = localStorage.getItem(COLUMN_WIDTHS_KEY);
      if (savedWidths) {
        setSavedColumnWidths(JSON.parse(savedWidths));
      }

    const savedTextModes = localStorage.getItem(TEXT_MODES_KEY);
      if (savedTextModes) {
        setTextModes(JSON.parse(savedTextModes));
      }
    } catch (error) {
      console.warn("Failed to load table settings from localStorage:", error);
    }
  }, []);

  // Save settings to localStorage
  const saveToLocalStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
    }
  }, []);

  // Column width management
  const saveColumnWidth = useCallback(
    (columnIndex: number, width: string) => {
      const key = `col_${columnIndex}`;
      const newWidths = { ...savedColumnWidths, [key]: width };
      setSavedColumnWidths(newWidths);
      saveToLocalStorage(COLUMN_WIDTHS_KEY, newWidths);

      // 🚀 NEW: Immediately update both tables
      updateBothTablesColumnWidth(columnIndex, width);
    },
    [savedColumnWidths, saveToLocalStorage]
  );
  const updateBothTablesColumnWidth = useCallback(
    (columnIndex: number, width: string) => {
      // Update header table colgroup
      const headerTable = headerScrollRef.current?.querySelector("table");
      const headerColgroup = headerTable?.querySelector("colgroup");
      if (headerColgroup?.children[columnIndex]) {
        (headerColgroup.children[columnIndex] as HTMLElement).style.width =
          width;
      }

      // Update body table colgroup
    const bodyColgroup = tableRef.current?.querySelector("colgroup");
      if (bodyColgroup?.children[columnIndex]) {
        (bodyColgroup.children[columnIndex] as HTMLElement).style.width = width;
      }
    },
    []
    );

  // Column width management - use fixed widths primarily
  const getColumnWidth = useCallback(
    (index: number): string => {
      // CHANGED: Check saved widths FIRST (user customizations)
      const savedKey = `col_${index}`;
      if (savedColumnWidths[savedKey]) {
        return savedColumnWidths[savedKey];
      }

      // Then check props
      if (columnWidths[index]) {
        return `${columnWidths[index]}%`;
      }

      // THEN use fixed widths as fallback
      if (FIXED_COLUMN_WIDTHS[index]) {
        return FIXED_COLUMN_WIDTHS[index];
      }

      // Final fallback
      return visibleHeaders[index]?.width || "10%";
    },
    [savedColumnWidths, columnWidths, visibleHeaders]
    );

  // Create columns configuration for ProjectRow
  const columns: ColumnConfig[] = visibleHeaders.map((header, index) => ({
    key: header.key,
    label: header.label,
    width: parseFloat(getColumnWidth(index)),
    visible: !hiddenColumns.has(header.key),
    sortable: header.sortable || false,
    textMode: columnTextModes[header.key] || undefined
  }));

  // Resize functionality
  const handleResizeStart = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!tableRef.current) return;

      const tableRect = tableRef.current.getBoundingClientRect();
      const currentWidth = parseFloat(getColumnWidth(index));
      const currentPixelWidth = (currentWidth / 100) * tableRect.width;

      setIsResizing(true);
      setResizeData({
        columnIndex: index,
        startX: event.clientX,
        startWidth: currentPixelWidth,
        tableWidth: tableRect.width,
      });

    },
      [getColumnWidth, tableRef]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing || !resizeData || !tableRef.current) return;

      const deltaX = event.clientX - resizeData.startX;
      const newPixelWidth = Math.max(
        visibleHeaders[resizeData.columnIndex]?.minWidth || 50,
        resizeData.startWidth + deltaX
      );
      const newPercentWidth = (newPixelWidth / resizeData.tableWidth) * 100;
      const clampedWidth = Math.max(5, Math.min(50, newPercentWidth));

      const newWidth = `${clampedWidth}%`;

      // 🚀 CHANGED: Use the new sync function
      saveColumnWidth(resizeData.columnIndex, newWidth);

    },
      [isResizing, resizeData, visibleHeaders, saveColumnWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeData(null);
  }, []);
  
  // Mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Auto-fit column functionality
  const handleAutoFitColumn = useCallback(
    (index: number) => {
      if (!tableRef.current) return;

      const table = tableRef.current;

      // Get header table for measurement
      const headerTable = headerScrollRef.current?.querySelector("table");
      const headerTh = headerTable?.querySelectorAll("th")[index];

      if (headerTh) {
        // Create temporary element to measure content
        const tempDiv = document.createElement("div");
        tempDiv.style.visibility = "hidden";
        tempDiv.style.position = "absolute";
        tempDiv.style.whiteSpace = "nowrap";
        tempDiv.style.font = getComputedStyle(headerTh).font;
        tempDiv.textContent = headerTh.textContent || "";
        document.body.appendChild(tempDiv);

        const tableRect = table.getBoundingClientRect();
        const contentWidth = Math.max(
          tempDiv.offsetWidth + 40, // Add padding
          visibleHeaders[index]?.minWidth || 100
        );

        document.body.removeChild(tempDiv);

        const newPercentWidth = Math.min(
          40,
          Math.max(8, (contentWidth / tableRect.width) * 100)
        );
        const newWidth = `${newPercentWidth}%`;

        // 🚀 CHANGED: Use saveColumnWidth to sync both tables
        saveColumnWidth(index, newWidth);

        // Add visual feedback
        const headerColgroup = headerTable?.querySelector("colgroup");
        const bodyColgroup = table.querySelector("colgroup");

        if (headerColgroup?.children[index]) {
          (headerColgroup.children[index] as HTMLElement).classList.add(
            "auto-fitting"
          );
        }
        if (bodyColgroup?.children[index]) {
          (bodyColgroup.children[index] as HTMLElement).classList.add(
            "auto-fitting"
          );
        }

        setTimeout(() => {
          if (headerColgroup?.children[index]) {
            (headerColgroup.children[index] as HTMLElement).classList.remove(
              "auto-fitting"
            );
          }
          if (bodyColgroup?.children[index]) {
            (bodyColgroup.children[index] as HTMLElement).classList.remove(
              "auto-fitting"
            );
          }
        }, 300);
      }
    },
      [saveColumnWidth, visibleHeaders, tableRef]
  );
  useEffect(() => {
    // Sync both tables when saved widths change
    visibleHeaders.forEach((_, index) => {
      const width = getColumnWidth(index);
      updateBothTablesColumnWidth(index, width);
    });
  }, [
    savedColumnWidths,
    visibleHeaders,
    getColumnWidth,
    updateBothTablesColumnWidth,
    ]);

  // Auto-fit all columns
  const handleAutoFitAllColumns = useCallback(() => {
    visibleHeaders.forEach((_, index) => {
      setTimeout(() => {
        handleAutoFitColumn(index);
      }, index * 50); // Stagger the animations
    });
    showNotification(
      "Auto-fit Complete",
      "All columns adjusted to content size",
      "success"
    );
  }, [visibleHeaders, handleAutoFitColumn] );

  // Text mode management
  const handleTextModeChange = useCallback(
    (column: string, mode: "wrap" | "clip" | null) => {
      const newTextModes = { ...textModes, [column]: mode };
      setTextModes(newTextModes);
      saveToLocalStorage(TEXT_MODES_KEY, newTextModes);
      onColumnTextModeChange(column as keyof ColumnTextModes, mode);
    },
      [textModes, saveToLocalStorage, onColumnTextModeChange]
  );

  // Notification system
  const showNotification = useCallback(
    (
      title: string,
      message: string,
      type: "success" | "info" | "warning" | "error" = "info"
    ) => {
      const notification = document.createElement("div");
      notification.className = "notification-toast";
      notification.style.borderLeftColor =
        type === "success"
          ? "#10b981"
          : type === "error"
          ? "#ef4444"
          : type === "warning"
          ? "#f59e0b"
          : "#3b82f6";

      notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
      <div style="font-size: 14px; color: #6b7280;">${message}</div>
    `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = "slideIn 0.3s ease reverse";
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    },
    []
  );

  // Reset functionality
  const handleReset = useCallback(
    (action: string) => {
      switch (action) {
        case "everything":
          setSavedColumnWidths({});
          setTextModes({});
          localStorage.removeItem(COLUMN_WIDTHS_KEY);
          localStorage.removeItem(TEXT_MODES_KEY);
          localStorage.removeItem(HIDDEN_COLUMNS_KEY);

          setTimeout(() => {
            FIXED_COLUMN_WIDTHS.forEach((width, index) => {
              updateBothTablesColumnWidth(index, width);
            });
          }, 0);

          onReset("everything");
          showNotification(
            "Reset Complete",
            "All settings restored to default",
            "success"
          );
          break;

        case "columns":
          setSavedColumnWidths({});
          localStorage.removeItem(COLUMN_WIDTHS_KEY);
          
          // Reset both tables to fixed widths
          setTimeout(() => {
            FIXED_COLUMN_WIDTHS.forEach((width, index) => {
              updateBothTablesColumnWidth(index, width);
            });
          }, 0);
          
          showNotification(
            "Column Widths Reset",
            "Default column sizes restored",
            "info"
          );
          break;

        case "autofit":
          handleAutoFitAllColumns();
          break;

        case "textmode":
          setTextModes({});
          localStorage.removeItem(TEXT_MODES_KEY);
          Object.keys(columnTextModes).forEach((column) => {
            onColumnTextModeChange(column as keyof ColumnTextModes, null);
          });
          showNotification(
            "Text Mode Reset",
            "Text display restored to default",
            "info"
          );
          break;

        case "showall":
          onShowAllColumns();
          showNotification(
            "Columns Restored",
            "All hidden columns are now visible",
            "info"
          );
          break;

        case "filters":
          onReset("filters");
          showNotification(
            "Filters Cleared",
            "All filters and sorting removed",
            "info"
          );
          break;

        default:
          onReset(action);
      }
    },
    [
      columnTextModes,
      onColumnTextModeChange,
      onReset,
      onShowAllColumns,
      handleAutoFitAllColumns,
      showNotification,
      ]
  );

  // Enhanced sortable header component - Updated for dynamic headers
  const SortableHeader = ({
    label,
    field,
    className = "",
    index,
    header,
  }: {
    label: string;
    field: string; // Changed to string for dynamic fields
    className?: string;
    index: number;
    header: ApiHeaderConfig; // Changed to ApiHeaderConfig
  }) => {
    const isSorting = sortConfig.key === field;
    const Icon = isSorting
      ? sortConfig.direction === "asc"
      ? ChevronUp
      : ChevronDown
      : ArrowUpDown;
    const isFilterActive =
      (field === "customer" && currentFilter !== "all") ||
      columnTextModes[field] !== null;
    
    const currentTextMode =
      textModes[field] || columnTextModes[field];

    return (
      <TableHead
        className={`column-header ${
          header.sortable ? "sortable" : ""
          } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400 relative group ${className}`}
        style={{ width: getColumnWidth(index) }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1 group cursor-pointer"
            onClick={() => header.sortable && onSort(field)}
          >
            <span>{label}</span>
              {header.sortable && (
              <Icon
                  className={`w-4 h-4 transition-colors duration-150 sort-indicator ${
                  isSorting ? "active" : ""
                }`}
              />
            )}
          </div>

          <Popover
            open={activeDropdown === field}
            onOpenChange={(open) => setActiveDropdown(open ? field : null)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${isFilterActive ? "filter-active" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronDown
                    className={`h-4 w-4 ${
                    isFilterActive ? "text-white" : "text-gray-400"
                    }`}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              {/* Text Display Options */}
              <div className="dropdown-section">
                <div className="dropdown-section-title">Text Display</div>
                <Button
                  variant="ghost"
                  className={`w-full justify-start font-normal text-sm ${
                    currentTextMode === "wrap" ? "text-mode-active" : ""
                    }`}
                  onClick={() =>
                      handleTextModeChange(
                      field,
                      currentTextMode === "wrap" ? null : "wrap"
                    )
                  }
                >
                  <WrapText className="w-4 h-4 mr-2" />
                  Wrap Text
                  {currentTextMode === "wrap" && (
                    <span className="ml-auto">✓</span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start font-normal text-sm ${
                    currentTextMode === "clip" ? "text-mode-active" : ""
                    }`}
                  onClick={() =>
                      handleTextModeChange(
                      field,
                      currentTextMode === "clip" ? null : "clip"
                    )
                  }
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  Clip Text
                  {currentTextMode === "clip" && (
                    <span className="ml-auto">✓</span>
                  )}
                </Button>
              </div>

              {/* Filter Options */}
              {field === "customer" && header.filterable && (
                <div className="dropdown-section">
                  <div className="dropdown-section-title">Filter by Type</div>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start font-normal text-sm ${
                      currentFilter === "Residential" ? "filter-active" : ""
                      }`}
                    onClick={() =>
                        onFilterChange("customerType", "Residential")
                    }
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Residential
                    {currentFilter === "Residential" && (
                      <span className="ml-auto">✓</span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start font-normal text-sm ${
                      currentFilter === "Commercial" ? "filter-active" : ""
                      }`}
                    onClick={() => onFilterChange("customerType", "Commercial")}
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Commercial
                    {currentFilter === "Commercial" && (
                      <span className="ml-auto">✓</span>
                    )}
                  </Button>
                </div>
              )}

              {/* Column Actions */}
              <div className="dropdown-section">
                <div className="dropdown-section-title">Column Actions</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal text-sm"
                  onClick={() => {
                    onAddColumn();
                    setActiveDropdown(null);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Column
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal text-sm"
                  onClick={() => {
                    onHideColumn(field);
                    setActiveDropdown(null);
                  }}
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Column
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal text-sm"
                  onClick={() => {
                    onFilterChange("customerType", "all");
                    handleTextModeChange(field, null);
                    setActiveDropdown(null);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Enhanced Resize handle */}
        {header.resizable && (
          <div
            className={`resize-handle ${
                isResizing && resizeData?.columnIndex === index ? "resizing" : ""
            }`}
            onMouseDown={(e) => handleResizeStart(index, e)}
            onDoubleClick={() => handleAutoFitColumn(index)}
            title="Drag to resize column, double-click to auto-fit"
          />
        )}
      </TableHead>
    );
  };

  if (loading)
      return (
      <div className="p-8 text-center text-gray-500">Loading projects...</div>
      );
  if (error)
      return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  // Sync horizontal scrolling between header and body
  const syncScroll = (
    source: HTMLDivElement,
    target: React.RefObject<HTMLDivElement>
  ) => {
    if (target.current && source !== target.current) {
      target.current.scrollLeft = source.scrollLeft;
    }
  };

  // Calculate minimum table width based on fixed widths
  const calculateMinWidth = () => {
    // Use fixed widths for calculation
    const totalPercentage = FIXED_COLUMN_WIDTHS.slice(
      0,
      visibleHeaders.length
    ).reduce((sum, width) => sum + parseFloat(width), 0);

    // Minimum base width to ensure readability
    const minBaseWidth = 1200;
    return Math.max(minBaseWidth, (totalPercentage / 100) * minBaseWidth);
  };

  const minTableWidth = calculateMinWidth();

  return (
    <div
      ref={containerRef}
      className="enhanced-table-container rounded-2xl bg-white dark:bg-[#2a2a2a] shadow-sm flex flex-col flex-1 overflow-hidden relative">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-gray-100 dark:bg-[#2a2a2a] border-b border-gray-200 dark:border-gray-700">
        <div
          ref={headerScrollRef}
          className="overflow-x-auto overflow-y-hidden table-scroll"
          onScroll={(e) => syncScroll(e.currentTarget, bodyScrollRef)}
          >
          <table
            className="caption-bottom text-sm"
            style={{
              tableLayout: "fixed",
              minWidth: `${minTableWidth}px`,
              width: "100%",
            }}
          >
            <colgroup>
              {visibleHeaders.map((_, index) => (
                <col
                  key={index}
                  style={{
                    width: getColumnWidth(index),
                  }}
                />
              ))}
              <col style={{ width: "120px" }} />
            </colgroup>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {visibleHeaders.map((header, index) => (
                  <SortableHeader
                    key={header.key}
                    label={header.label}
                    field={header.key}
                    className="px-4"
                    index={index}
                    header={header}
                  />
                ))}
                <TableHead className="text-left px-4 relative">
                  <span>Actions</span>

                  {/* Enhanced Reset Options */}
                  <div className="absolute top-2 right-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-gray-100 hover:bg-[linear-gradient(135deg,#10b981,#059669)] hover:text-white rounded-full transition-all duration-300"
                          title="Table Reset Options"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[260px] p-0 rounded-2xl"
                        align="end"
                      >
                        <div>
                          {/* Header */}
                          <div className="px-6 py-4 bg-[linear-gradient(135deg,#10b981,#059669)] text-white text-xs font-bold rounded-t-2xl flex items-center">
                            <span className="flex items-center gap-3">
                              <RotateCcw className="h-4 w-4" />
                              TABLE RESET OPTIONS
                            </span>
                          </div>

                          {/* Enhanced Menu Items */}
                          <div className="py-1">
                            <Button
                              variant="ghost"
                              className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                              onClick={() => handleReset("everything")}
                            >
                              <RefreshCw className="w-4 h-4 mr-3 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">
                                  Reset Everything
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Restore all default settings
                                </div>
                              </div>
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                              onClick={() => handleReset("custom-columns")}
                            >
                              <Columns className="w-4 h-4 mr-3 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">
                                  Reset Custom Columns
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Remove all custom added columns
                                </div>
                              </div>
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                              onClick={() => handleReset("columns")}
                            >
                              <Columns className="w-4 h-4 mr-3 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">
                                  Reset Column Widths
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Restore default column sizes
                                </div>
                              </div>
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                              onClick={() => handleReset("filters")}
                            >
                              <Filter className="w-4 h-4 mr-3 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">
                                  Clear Filters & Sorting
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Remove all filters and sorts
                                </div>
                              </div>
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                              onClick={() => handleReset("autofit")}
                            >
                              <Move className="w-4 h-4 mr-3 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">
                                  Auto-fit Columns
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Adjust columns to content size
                                </div>
                              </div>
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                              onClick={() => handleReset("textmode")}
                            >
                              <Type className="w-4 h-4 mr-3 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">
                                  Reset Text Mode
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Clear wrap/clip text settings
                                </div>
                              </div>
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start font-normal text-xs px-4 py-5 rounded-none hover:bg-gray-50 transition-colors"
                              onClick={() => handleReset("showall")}
                            >
                              <Eye className="w-4 h-4 mr-3 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">
                                  Show All Columns
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Display all hidden columns
                                </div>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
          </table>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div
          ref={bodyScrollRef}
          className="overflow-x-auto table-scroll"
          onScroll={(e) => syncScroll(e.currentTarget, headerScrollRef)}
        >
          <table
            ref={tableRef}
            className="caption-bottom text-sm"
            style={{
              tableLayout: "fixed",
              minWidth: `${minTableWidth}px`,
              width: "100%",
            }}
          >
            <colgroup>
              {visibleHeaders.map((_, index) => (
                <col
                  key={index}
                  style={{
                    width: getColumnWidth(index),
                  }}
                />
              ))}
              <col style={{ width: "120px" }} />
            </colgroup>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <DynamicProjectRow
                    key={project.id}
                    project={project}
                    headers={visibleHeaders}
                    columnTextModes={columnTextModes}
                    hiddenColumns={hiddenColumns}
                    onShowActivity={onShowActivity}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={visibleHeaders.length + 1}
                    className="text-center text-gray-500 h-24"
                  >
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Enhanced ProjectRow component to support text modes
interface EnhancedProjectRowProps {
  project: IPlanset;
  columnTextModes: ColumnTextModes;
  hiddenColumns: Set<keyof IPlanset | "customer">;
  textModes?: { [key: string]: "wrap" | "clip" | null };
}

export function EnhancedProjectRow({
  project,
  columnTextModes,
  hiddenColumns,
  textModes = {},
}: EnhancedProjectRowProps) {
  const getTextModeClass = (column: string) => {
    const mode =
      textModes[column] || columnTextModes[column as keyof ColumnTextModes];
    return mode === "wrap" ? "text-wrap" : mode === "clip" ? "text-clip" : "";
  };

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-[#202020] border-0 transition-colors duration-150">
      {!hiddenColumns.has("customer") && (
        <TableCell className={`border-0 pl-6 ${getTextModeClass("customer")}`}>
          <div className="flex items-center space-x-3">
            <div
              className="w-[75px] h-[75px] rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: project.customer?.color || "#6b7280" }}
            >
              {project.customer?.initials || "NA"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-gray-900 dark:text-gray-100 truncate">
                {project.customer?.name || "Unknown Customer"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {project.customer?.type || "Unknown Type"}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {project.customer?.address || "No Address"}
              </div>
            </div>
          </div>
        </TableCell>
      )}

      {!hiddenColumns.has("projectDetails") && (
        <TableCell
          className={`font-medium border-0 px-4 ${getTextModeClass(
            "projectDetails"
          )}`}
        >
          {project.projectDetails || "No Details"}
        </TableCell>
      )}

      {!hiddenColumns.has("keyDates") && (
        <TableCell className={`border-0 px-4 ${getTextModeClass("keyDates")}`}>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Created:
              </span>
              {project.keyDates?.created || "N/A"}
            </div>
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Received:
              </span>
              {project.keyDates?.received || "N/A"}
            </div>
          </div>
        </TableCell>
      )}

      {!hiddenColumns.has("status") && (
        <TableCell className="border-0 px-4">
          <div className="status-column-container">
            <span
              className={`badge badge-${
                project.status?.toLowerCase().replace(/\s+/g, "-") || "pending"
              }`}
            >
              {project.status || "Pending"}
            </span>
            {project.priority && (
              <span
                className={`badge priority-${project.priority.toLowerCase()}`}
              >
                {project.priority}
              </span>
            )}
          </div>
        </TableCell>
      )}

      {!hiddenColumns.has("assignedTo") && (
        <TableCell
          className={`text-gray-500 dark:text-gray-400 italic border-0 px-4 ${getTextModeClass(
            "assignedTo"
          )}`}
        >
          {project.assignedTo || "Not assigned"}
        </TableCell>
      )}

      {!hiddenColumns.has("countdown") && (
        <TableCell className={`border-0 px-4 ${getTextModeClass("countdown")}`}>
          <div className="countdown-container">
            <div className="font-semibold">
              {project.countdown || "00:00:00"}
            </div>
            {project.autoComplete && (
              <div className="text-xs text-gray-400">Auto-Complete</div>
            )}
          </div>
        </TableCell>
      )}

      {!hiddenColumns.has("budget") && (
        <TableCell className={`border-0 px-4 ${getTextModeClass("budget")}`}>
          {project.budget ? `${project.budget.toLocaleString()}` : "Not set"}
        </TableCell>
      )}

      {!hiddenColumns.has("estimatedHours") && (
        <TableCell
          className={`border-0 px-4 ${getTextModeClass("estimatedHours")}`}
        >
          {project.estimatedHours ? `${project.estimatedHours}h` : "Not set"}
        </TableCell>
      )}

      {!hiddenColumns.has("actualHours") && (
        <TableCell
          className={`border-0 px-4 ${getTextModeClass("actualHours")}`}
        >
          {project.actualHours ? `${project.actualHours}h` : "Not set"}
        </TableCell>
      )}

      {!hiddenColumns.has("progress") && (
        <TableCell className="border-0 px-4">
          {project.progress ? (
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
          ) : (
            <span className="text-gray-400">Not set</span>
          )}
        </TableCell>
      )}

      {!hiddenColumns.has("tags") && (
        <TableCell className="border-0 px-4">
          {project.tags && project.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">No tags</span>
          )}
        </TableCell>
      )}

      {!hiddenColumns.has("notes") && (
        <TableCell
          className={`border-0 px-4 text-gray-500 dark:text-gray-400 italic ${getTextModeClass(
            "notes"
          )}`}
        >
          {project.notes || "No notes"}
        </TableCell>
      )}

      {/* Enhanced Actions Column */}
      <TableCell className="text-right border-0 px-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 rounded-lg transition-all duration-200"
            title="Edit Project"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>

          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white h-8 px-3 rounded-lg transition-all duration-200"
            title="View Activity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50 transition-all duration-200"
                title="More Actions"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Details
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                Archive
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </TableCell>
    </TableRow>
  );
}
