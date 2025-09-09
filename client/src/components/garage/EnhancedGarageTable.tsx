import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Eye,
  RefreshCw,
  Columns,
  Type,
  Edit,
  MoreVertical,
  MoreHorizontal,
  Archive,
  Trash2,
  EyeOff,
  ScanLine,
  Filter,
  WrapText,
  Scissors,
  Plus,
  XCircle
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddColumnModal, AvailableColumn } from "@/components/modals/AddColumnModal";

// Types
interface TableHeader {
  key: string;
  label: string;
  sortable: boolean;
}

interface TableData {
  id: number;
  [key: string]: any;
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

interface EnhancedGarageTableProps {
  headers: TableHeader[];
  data: TableData[];
  loading: boolean;
  error: string | null;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onReset: (action: string) => void;
  onHideColumn?: (field: string) => void;
  onAddColumn?: () => void;
  onShowNotification?: (title: string, message: string, type?: "success" | "info" | "warning" | "error") => void;
  availableColumns?: AvailableColumn[];
  onAddColumns?: (selectedKeys: string[]) => void;
  onResetCustomColumns?: () => void;
}

// Text mode state
interface TextModeState {
  [key: string]: 'wrap' | 'clip' | null;
}

// Table Row Actions Component
interface TableRowActionsProps {
  rowId: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
}

const TableRowActions: React.FC<TableRowActionsProps> = ({ 
  rowId, 
  onEdit, 
  onDelete, 
  activeDropdown, 
  setActiveDropdown 
}) => {
  const dropdownId = `actions-${rowId}`;
  const isOpen = activeDropdown === dropdownId;

  const createActionHandler = (action: (id: number) => void) => () => {
    action(rowId);
    setActiveDropdown(null);
  };

  return (
    <div className="flex items-center gap-2 justify-center relative">
      <Button
        size="sm"
        onClick={(e) => { 
          e.stopPropagation(); 
          onEdit?.(rowId); 
        }}
        className="bg-green-600 hover:bg-green-700 text-white h-10 w-10 rounded-lg transition-all duration-200"
        title="Edit Item"
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

      <DropdownMenu
        open={isOpen}
        onOpenChange={(open: boolean) =>
          setActiveDropdown(open ? dropdownId : null)
        }
      >
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="bg-gray-600 hover:bg-gray-700 text-white w-10 h-10 p-0 rounded-xl transition-transform duration-200"
            aria-label="More options"
          >
            <MoreHorizontal
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36">
          {/* VIEW DETAILS */}
          <DropdownMenuItem
            onClick={createActionHandler(() => console.log('View Details', rowId))}
            className="
              group cursor-pointer transition-all duration-200
              pl-3 hover:pl-4
              text-[#2563eb]
              hover:text-white
              hover:bg-gradient-to-b hover:from-[#3b82f6] hover:to-[#1d4ed8]
              data-[highlighted]:text-white
              data-[highlighted]:bg-gradient-to-b
              data-[highlighted]:from-[#3b82f6]
              data-[highlighted]:to-[#1d4ed8]
            "
          >
            <Eye
              className="
                w-4 h-6 mr-2
                text-[#2563eb]
                group-hover:text-white
                data-[highlighted]:text-white
              "
            />
            <span className="group-hover:text-white data-[highlighted]:text-white">
              View Details
            </span>
          </DropdownMenuItem>

          {/* ARCHIVE */}
          <DropdownMenuItem
            onClick={createActionHandler(() => console.log('Archive', rowId))}
            className="
              group cursor-pointer transition-all duration-200
              pl-3 hover:pl-4
              text-[#ea580c]
              hover:text-white
              hover:bg-gradient-to-b hover:from-[#f97316] hover:to-[#c2410c]
              data-[highlighted]:text-white
              data-[highlighted]:bg-gradient-to-b
              data-[highlighted]:from-[#f97316]
              data-[highlighted]:to-[#c2410c]
            "
          >
            <Archive
              className="
                w-4 h-6 mr-2
                text-[#ea580c]
                group-hover:text-white
                data-[highlighted]:text-white
              "
            />
            <span className="group-hover:text-white data-[highlighted]:text-white">
              Archive
            </span>
          </DropdownMenuItem>

          {/* DELETE */}
          <DropdownMenuItem
            onClick={createActionHandler(onDelete || (() => {}))}
            className="
              group cursor-pointer transition-all duration-200
              pl-3 hover:pl-4
              text-[#dc2626]
              hover:text-white
              hover:bg-gradient-to-b hover:from-[#ef4444] hover:to-[#b91c1c]
              data-[highlighted]:text-white
              data-[highlighted]:bg-gradient-to-b
              data-[highlighted]:from-[#ef4444]
              data-[highlighted]:to-[#b91c1c]
            "
          >
            <Trash2
              className="
                w-4 h-6 mr-2
                text-[#dc2626]
                group-hover:text-white
                data-[highlighted]:text-white
              "
            />
            <span className="group-hover:text-white data-[highlighted]:text-white">
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Sortable Header Component
interface SortableHeaderProps {
  label: string;
  field: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  sortable: boolean;
  textModeState: TextModeState;
  onTextModeChange: (field: string, mode: 'wrap' | 'clip' | null) => void;
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
  onHideColumn: (field: string) => void;
  onAddColumn: () => void;
  index: number;
  width: string;
  onResizeStart: (index: number, event: React.MouseEvent) => void;
  isResizing: boolean;
  resizeData: { columnIndex: number; startX: number; startWidth: number; tableWidth: number; } | null;
  onReset: (action: string) => void;
  onShowAllColumns: () => void;
  onResetCustomColumns?: () => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ 
  label, 
  field, 
  sortConfig, 
  onSort, 
  sortable,
  textModeState,
  onTextModeChange,
  activeDropdown,
  setActiveDropdown,
  onHideColumn,
  onAddColumn,
  index,
  width,
  onResizeStart,
  isResizing,
  resizeData,
  onReset,
  onShowAllColumns,
  onResetCustomColumns
}) => {
  const getSortIcon = () => {
    if (!sortable) return null;
    
    if (sortConfig.key === field) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUp className="w-4 h-4 text-gray-800 dark:text-gray-200" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-800 dark:text-gray-200" />
      );
    }
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  };

  const currentTextMode = textModeState[field];
  const isFilterActive = currentTextMode != null;

  return (
    <TableHead 
      className="text-left px-4 relative"
      style={{ width: width }}
    >
      <div className="flex items-center justify-between group">
        <div 
          className={`flex items-center gap-2 ${sortable ? 'cursor-pointer' : ''}`} 
          onClick={() => sortable && onSort(field)}
        >
          <span>{label}</span>
          {getSortIcon()}
        </div>

        {/* Column Header Popover - Skip for Actions column */}
        {field !== 'actions' && field !== 'id' && (
          <Popover
            open={activeDropdown === field}
            onOpenChange={(open: boolean) =>
              setActiveDropdown(open ? field : null)
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 transition-opacity ${isFilterActive ? "bg-gradient-to-br from-[#f59e0b] to-[#d97706]" : ""}`}
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
              <div className="space-y-1">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Text Display</div>
                <Button
                  variant="ghost"
                  className={`w-full justify-start font-normal text-sm ${
                    currentTextMode === "wrap" ? "bg-blue-50 bg-gradient-to-br from-emerald-400 to-emerald-600 text-gray-50" : ""
                  }`}
                  onClick={() => {
                    onTextModeChange(field, currentTextMode === "wrap" ? null : "wrap");
                    setActiveDropdown(null);
                  }}
                >
                  <WrapText className="w-4 h-4 mr-2" />
                  Wrap Text
                  {currentTextMode === "wrap" && (
                    <span className="ml-auto text-gray-50">✓</span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start font-normal text-sm ${
                    currentTextMode === "clip" ? "bg-blue-50 bg-gradient-to-br from-emerald-400 to-emerald-600 text-gray-50" : ""
                  }`}
                  onClick={() => {
                    onTextModeChange(field, currentTextMode === "clip" ? null : "clip");
                    setActiveDropdown(null);
                  }}
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  Clip Text
                  {currentTextMode === "clip" && (
                    <span className="ml-auto text-gray-50">✓</span>
                  )}
                </Button>
              </div>

              {/* Column Actions */}
              <div className="border-t pt-2 mt-2 space-y-1">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Column Actions</div>
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
                    onTextModeChange(field, null);
                    setActiveDropdown(null);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Actions Column Reset Options */}
      {field === 'actions' && (
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
                <div className="px-6 py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-xs font-bold rounded-t-2xl flex items-center">
                  <span className="flex items-center gap-3">
                    <RotateCcw className="h-4 w-4" />
                    TABLE RESET OPTIONS
                  </span>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                    onClick={() => onReset("everything")}
                  >
                    <RefreshCw className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">Reset Everything</div>
                      <div className="text-gray-500 text-xs">
                        Restore all default settings
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                    onClick={() => onReset("columns")}
                  >
                    <Columns className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">Reset Column Widths</div>
                      <div className="text-gray-500 text-xs">
                        Restore default column sizes
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                    onClick={() => onReset("auto-fit")}
                  >
                    <ScanLine className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">Auto-Fit Columns</div>
                      <div className="text-gray-500 text-xs">
                        Automatically size columns to content
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                    onClick={() => onReset("custom-columns")}
                  >
                    <Columns className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">Reset Custom Columns</div>
                      <div className="text-gray-500 text-xs">
                        Remove all custom added columns
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                    onClick={() => onReset("filters")}
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
                    onClick={() => onReset("textmode")}
                  >
                    <Type className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">Reset Text Mode</div>
                      <div className="text-gray-500 text-xs">
                        Clear wrap/clip text settings
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal text-xs px-4 py-5 rounded-none hover:bg-gray-50 transition-colors"
                    onClick={() => onShowAllColumns()}
                  >
                    <Eye className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">Show All Columns</div>
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
      )}

      {/* Resize handle - Skip for Actions column */}
      {field !== 'actions' && field !== 'id' && (
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors ${
            isResizing && resizeData?.columnIndex === index ? "bg-blue-500" : "bg-transparent"
          }`}
          onMouseDown={(e) => onResizeStart(index, e)}
          title="Drag to resize column"
        />
      )}
    </TableHead>
  );
};

export const EnhancedGarageTable: React.FC<EnhancedGarageTableProps> = ({
  headers,
  data,
  loading,
  error,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onReset,
  onHideColumn,
  onAddColumn,
  onShowNotification,
  availableColumns = [],
  onAddColumns,
  onResetCustomColumns
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [columnDropdown, setColumnDropdown] = useState<string | null>(null);
  const [textModeState, setTextModeState] = useState<TextModeState>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  
  // Column resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizeData, setResizeData] = useState<{
    columnIndex: number;
    startX: number;
    startWidth: number;
    tableWidth: number;
  } | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<number, string>>({});
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);

  // Sync scroll between header and body
  const syncScroll = useCallback((source: HTMLDivElement, target: React.RefObject<HTMLDivElement>) => {
    if (target.current) {
      target.current.scrollLeft = source.scrollLeft;
    }
  }, []);

  // Filter visible headers
  const visibleHeaders = headers.filter(header => !hiddenColumns.has(header.key));

  // Auto-fit columns functionality
  const calculateAutoFitWidths = useCallback(() => {
    if (!tableRef.current) return;

    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    // Set font to match table cells
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    
    const newWidths: Record<number, string> = {};
    const minWidth = 100; // Minimum column width in pixels
    const maxWidth = 400; // Maximum column width in pixels
    const padding = 32; // Account for cell padding
    
    visibleHeaders.forEach((header, index) => {
      let maxContentWidth = 0;
      
      // Measure header text
      const headerWidth = ctx.measureText(header.label).width + padding + 40; // Extra for icons/buttons
      maxContentWidth = Math.max(maxContentWidth, headerWidth);
      
      // Measure data cell content
      data.forEach(row => {
        if (header.key !== 'actions') {
          const cellValue = String(row[header.key] ?? '');
          const cellWidth = ctx.measureText(cellValue).width + padding;
          maxContentWidth = Math.max(maxContentWidth, cellWidth);
        }
      });
      
      // Actions column gets fixed width
      if (header.key === 'actions') {
        maxContentWidth = 150;
      }
      
      // Clamp width between min and max
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, maxContentWidth));
      
      // Convert to percentage of table width
      if (tableRef.current) {
        const tableWidth = tableRef.current.offsetWidth;
        const percentage = (clampedWidth / tableWidth) * 100;
        newWidths[index] = `${Math.max(8, Math.min(40, percentage))}%`;
      }
    });
    
    setColumnWidths(newWidths);
  }, [visibleHeaders, data]);

  const handleReset = (action: string) => {
    switch (action) {
      case 'everything':
        setTextModeState({});
        setHiddenColumns(new Set());
        setColumnWidths({});
        if (onResetCustomColumns) {
          onResetCustomColumns();
        }
        break;
      case 'columns':
        setColumnWidths({});
        if (onShowNotification) {
          onShowNotification("Column Widths Reset", "All column widths have been restored to default", "success");
        }
        break;
      case 'auto-fit':
        calculateAutoFitWidths();
        if (onShowNotification) {
          onShowNotification("Auto-Fit Applied", "Columns have been automatically sized to content", "success");
        }
        break;
      case 'custom-columns':
        if (onResetCustomColumns) {
          onResetCustomColumns();
        }
        if (onShowNotification) {
          onShowNotification("Custom Columns Reset", "All custom added columns have been removed", "success");
        }
        break;
      case 'textmode':
        setTextModeState({});
        break;
      case 'showall':
        setHiddenColumns(new Set());
        break;
    }
    onReset(action);
  };

  // Text mode handlers
  const handleTextModeChange = (field: string, mode: 'wrap' | 'clip' | null) => {
    setTextModeState(prev => ({
      ...prev,
      [field]: mode
    }));
    
    if (onShowNotification) {
      if (mode === 'wrap') {
        onShowNotification("Text Mode Changed", `Column "${field}" text will now wrap`, "success");
      } else if (mode === 'clip') {
        onShowNotification("Text Mode Changed", `Column "${field}" text will now be clipped`, "success");
      } else {
        onShowNotification("Text Mode Reset", `Column "${field}" text mode has been cleared`, "success");
      }
    }
  };

  const handleHideColumn = (field: string) => {
    setHiddenColumns(prev => new Set([...prev, field]));
    setColumnDropdown(null);
    
    if (onShowNotification) {
      onShowNotification("Column Hidden", `Column "${field}" has been hidden from view`, "success");
    }
    
    if (onHideColumn) {
      onHideColumn(field);
    }
  };

  const handleAddColumn = () => {
    setColumnDropdown(null);
    setShowAddColumnModal(true);
    
    if (onAddColumn) {
      onAddColumn();
    }
  };

  const handleAddColumns = (selectedKeys: string[]) => {
    if (onAddColumns) {
      onAddColumns(selectedKeys);
    }
    
    if (onShowNotification) {
      onShowNotification("Columns Added", `${selectedKeys.length} column(s) have been added to the table`, "success");
    }
  };

  const handleShowAllColumns = () => {
    setHiddenColumns(new Set());
    setColumnDropdown(null);
    
    if (onShowNotification) {
      onShowNotification("All Columns Shown", "All hidden columns have been restored", "success");
    }
  };

  // Column width management
  const getColumnWidth = useCallback((index: number): string => {
    return columnWidths[index] || "auto";
  }, [columnWidths]);

  const saveColumnWidth = useCallback((index: number, width: string) => {
    setColumnWidths(prev => ({
      ...prev,
      [index]: width
    }));
  }, []);

  // Resize functionality
  const handleResizeStart = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!tableRef.current) return;
      
      const tableRect = tableRef.current.getBoundingClientRect();
      const currentWidth = getColumnWidth(index);
      const currentPixelWidth = currentWidth === "auto" ? 150 : 
        (parseFloat(currentWidth) / 100) * tableRect.width;
      
      setIsResizing(true);
      setResizeData({
        columnIndex: index,
        startX: event.clientX,
        startWidth: currentPixelWidth,
        tableWidth: tableRect.width,
      });
    },
    [getColumnWidth]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing || !resizeData || !tableRef.current) return;
      
      const deltaX = event.clientX - resizeData.startX;
      const newPixelWidth = Math.max(50, resizeData.startWidth + deltaX);
      const newPercentWidth = (newPixelWidth / resizeData.tableWidth) * 100;
      const clampedWidth = Math.max(5, Math.min(50, newPercentWidth));
      const newWidth = `${clampedWidth}%`;
      
      saveColumnWidth(resizeData.columnIndex, newWidth);
    },
    [isResizing, resizeData, saveColumnWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeData(null);
  }, []);

  // Mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="enhanced-table-container rounded-2xl bg-white dark:bg-[#2a2a2a] shadow-sm flex flex-col flex-1 overflow-hidden relative"
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-gray-50 dark:bg-[#2a2a2a] border-b border-gray-200 dark:border-gray-700">
        <div
          ref={headerScrollRef}
          className="overflow-x-auto overflow-y-hidden table-scroll"
          onScroll={(e) => syncScroll(e.currentTarget, bodyScrollRef)}
        >
          <table ref={tableRef} className="caption-bottom text-sm w-full" style={{ tableLayout: "fixed" }}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {visibleHeaders.map((header, index) => (
                  <SortableHeader
                    key={header.key}
                    label={header.label}
                    field={header.key}
                    sortConfig={sortConfig}
                    onSort={onSort}
                    sortable={header.sortable}
                    textModeState={textModeState}
                    onTextModeChange={handleTextModeChange}
                    activeDropdown={columnDropdown}
                    setActiveDropdown={setColumnDropdown}
                    onHideColumn={handleHideColumn}
                    onAddColumn={handleAddColumn}
                    index={index}
                    width={getColumnWidth(index)}
                    onResizeStart={handleResizeStart}
                    isResizing={isResizing}
                    resizeData={resizeData}
                    onReset={handleReset}
                    onShowAllColumns={handleShowAllColumns}
                    onResetCustomColumns={onResetCustomColumns}
                  />
                ))}
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
          <table className="caption-bottom text-sm w-full" style={{ tableLayout: "fixed" }}>
            {/* Hidden header to maintain column structure */}
            <TableHeader style={{ visibility: 'hidden', height: 0 }}>
              <TableRow>
                {visibleHeaders.map((header, index) => (
                  <TableHead 
                    key={header.key}
                    style={{ width: getColumnWidth(index), height: 0, padding: 0, border: 'none' }}
                  />
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={visibleHeaders.length} className="text-center text-gray-500 h-24">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={visibleHeaders.length} className="text-center text-red-500 h-24">
                    {error}
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleHeaders.length} className="text-center text-gray-500 h-24">
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {visibleHeaders.map((header, index) => {
                      const textMode = textModeState[header.key];
                      const cellClasses = `px-4 py-3 text-sm dark:text-gray-300 ${
                        textMode === 'wrap' ? 'whitespace-normal break-words' : 
                        textMode === 'clip' ? 'truncate' : ''
                      }`;
                      
                      return (
                        <TableCell 
                          key={header.key} 
                          className={cellClasses}
                          style={{ width: getColumnWidth(index) }}
                        >
                          {header.key === 'actions' ? (
                            <TableRowActions
                              rowId={row.id}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              activeDropdown={activeDropdown}
                              setActiveDropdown={setActiveDropdown}
                            />
                          ) : (
                            <div>
                              {header.key === 'id' ? rowIndex + 1 : row[header.key] ?? '-'}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </table>
        </div>
      </div>

      {/* Add Column Modal */}
      <AddColumnModal
        isOpen={showAddColumnModal}
        onClose={() => setShowAddColumnModal(false)}
        availableColumns={availableColumns}
        onAddColumns={handleAddColumns}
        hiddenColumns={hiddenColumns}
      />
    </div>
  );
};