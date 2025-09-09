import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus
} from 'lucide-react';
import { EnhancedGarageTable } from '@/components/garage/EnhancedGarageTable';
import { AvailableColumn } from '@/components/modals/AddColumnModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterIcon } from "@/components/planset/PlansetHeader";
import { DateRangeFilterNew } from '@/components/ui/DateRangeFilterNew';

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

interface TableConfiguration {
  headers: TableHeader[];
  data: TableData[];
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

interface GarageFilters {
  search: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
    preset: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom' | null;
  };
}

// Data is hardcoded here for demonstration.
const tableConfigurations: Record<string, TableConfiguration> = {
  "Module Make": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'moduleMake', label: 'Module Make', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, moduleMake: "Alps Technology", dateCreated: "2024-01-10" },
      { id: 2, moduleMake: "Amerisolar-Worldwide Energy", dateCreated: "2024-01-12" },
      { id: 3, moduleMake: "Andalay Solar", dateCreated: "2024-01-15" },
      { id: 4, moduleMake: "AU Optronics", dateCreated: "2024-01-18" },
      { id: 5, moduleMake: "3S Swiss Solar Solutions AG", dateCreated: "2024-01-20" },
      { id: 6, moduleMake: "Abora Solar", dateCreated: "2024-01-22" },
      { id: 7, moduleMake: "Ablytek", dateCreated: "2024-01-25" },
      { id: 8, moduleMake: "Adani Solar", dateCreated: "2024-01-28" },
      { id: 9, moduleMake: "Advance Power Inc", dateCreated: "2024-01-30" }
    ]
  },
  "Module Model": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'moduleModelName', label: 'Module Model Name', sortable: true },
      { key: 'weight', label: 'Weight', sortable: true },
      { key: 'moduleMakeName', label: 'Module Make Name', sortable: true },
      { key: 'moduleType', label: 'Module Type', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, moduleModelName: "L 195", weight: 40, moduleMakeName: "Zytech Solar", moduleType: "Monocrystalline" },
      { id: 2, moduleModelName: "M 145", weight: 30, moduleMakeName: "3S Swiss Solar Solutions AG", moduleType: "Monocrystalline" },
      { id: 3, moduleModelName: "Q 155", weight: 32, moduleMakeName: "3S Swiss Solar Solutions AG", moduleType: "Monocrystalline" },
      { id: 4, moduleModelName: "S 115", weight: 24, moduleMakeName: "3S Swiss Solar Solutions AG", moduleType: "Monocrystalline" },
      { id: 5, moduleModelName: "AH72 SK", weight: 72, moduleMakeName: "Abora Solar", moduleType: "Mono-crystalline" }
    ]
  },
  "Inverter Make": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'inverterName', label: 'Inverter Name', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, inverterName: "Enphase" },
      { id: 2, inverterName: "SolarEdge" },
      { id: 3, inverterName: "Tesla" },
      { id: 4, inverterName: "SOL-ARK" },
      { id: 5, inverterName: "(NEP) Northern Electric Power" }
    ]
  }
};

const categoryMapping: Record<string, string[]> = {
  'electrical': ['Module Make', 'Module Model', 'Inverter Make', 'Inverter Model', 'Battery Make', 'Battery Model', 'Optimizers', 'Cabinet Make', 'Cabinet Model', 'Controller'],
  'structural': ['Racking Name', 'Racking Model', 'Attachment Type', 'Attachment Material'],
  'requirements': ['Authority Having Jurisdictions', 'Utility', 'Governing Code', 'Ambient Temperature', 'Client Updates', 'Notes', 'Checklist']
};

// Available columns for electrical garage tables
const electricalAvailableColumns: Record<string, AvailableColumn[]> = {
  "Module Make": [
    { key: 'country', label: 'Country', description: 'Manufacturing country of the module' },
    { key: 'certification', label: 'Certification', description: 'Module certifications (IEC, UL, etc.)' },
    { key: 'warranty', label: 'Warranty', description: 'Warranty period in years' },
    { key: 'efficiency', label: 'Efficiency', description: 'Module efficiency rating percentage' }
  ],
  "Module Model": [
    { key: 'power', label: 'Power (W)', description: 'Maximum power output in watts' },
    { key: 'voltage', label: 'Voltage (V)', description: 'Voltage rating' },
    { key: 'current', label: 'Current (A)', description: 'Current rating in amperes' },
    { key: 'dimensions', label: 'Dimensions', description: 'Physical dimensions (L×W×H)' },
    { key: 'temperature', label: 'Temperature Coefficient', description: 'Temperature coefficient rating' }
  ],
  "Inverter Make": [
    { key: 'country', label: 'Country', description: 'Manufacturing country of the inverter' },
    { key: 'certification', label: 'Certification', description: 'Safety and quality certifications' },
    { key: 'warranty', label: 'Warranty', description: 'Warranty period in years' },
    { key: 'support', label: 'Support', description: 'Technical support availability' }
  ]
};

interface GarageInventoryAppProps {
  currentCategory?: string;
  currentTableType?: string;
}

/**
 * Main Garage Inventory Application Component
 */
export default function GarageInventoryApp({
  currentCategory: initialCategory = 'electrical',
  currentTableType: initialTableType = 'Module Make'
}: GarageInventoryAppProps) {
  // --- STATE MANAGEMENT ---
  const [currentCategory, setCurrentCategory] = useState<string>(initialCategory);
  const [currentTableType, setCurrentTableType] = useState<string>(initialTableType);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<GarageFilters>({
    search: '',
    dateRange: {
      from: null,
      to: null,
      preset: null
    }
  });
  const hasActiveFilters = !!(filters.dateRange.from && filters.dateRange.to);
  const [dynamicColumns, setDynamicColumns] = useState<Set<string>>(new Set());

  // Custom notification system
  const showNotification = useCallback(
    (
      title: string,
      message: string,
      type: "success" | "info" | "warning" | "error" = "info"
    ) => {
      const notification = document.createElement("div");
      notification.className = "notification-toast";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid;
        max-width: 400px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
      `;
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
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    },
    []
  );

  // --- DATA LOADING EFFECT ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      const config = tableConfigurations[currentTableType];
      setData(config ? config.data : []);
      setSortConfig({ key: null, direction: 'asc' });
    } catch (err) {
      setError('Failed to load data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentTableType]);

  // --- FILTERED AND SORTED DATA ---
  const processedData = useMemo(() => {
    let filteredItems = [...data];

    // Search filtering
    if (searchTerm) {
      filteredItems = filteredItems.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Date range filtering (if data has date fields)
    if (filters.dateRange.from && filters.dateRange.to) {
      filteredItems = filteredItems.filter(row => {
        // Check if row has any date fields (you can customize this logic)
        const dateFields = ['dateCreated', 'date', 'createdAt', 'updatedAt'];
        return dateFields.some(field => {
          if (row[field]) {
            const rowDate = new Date(row[field]);
            return rowDate >= filters.dateRange.from! && rowDate <= filters.dateRange.to!;
          }
          return false;
        });
      });
    }

    // Sorting
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredItems;
  }, [data, searchTerm, sortConfig, filters]);

  // --- HANDLERS ---
  const handleSort = (key: string, direction?: 'asc' | 'desc') => {
    if (direction) {
      setSortConfig({ key, direction });
    } else {
      const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      setSortConfig({ key, direction: newDirection });
    }
  };

  const handleTableReset = (action: string) => {
    switch (action) {
      case 'everything':
        setSortConfig({ key: null, direction: 'asc' });
        setSearchTerm('');
        showNotification("Reset Complete", "All table settings have been restored to default", "success");
        break;
      case 'columns':
        showNotification("Columns Reset", "Column widths have been restored to default", "success");
        break;
      case 'auto-fit':
        showNotification("Auto-Fit Applied", "Columns have been automatically sized to content", "success");
        break;
      case 'custom-columns':
        showNotification("Custom Columns Reset", "All custom added columns have been removed", "success");
        break;
      case 'filters':
        setSortConfig({ key: null, direction: 'asc' });
        setSearchTerm('');
        setFilters({
          search: '',
          dateRange: {
            from: null,
            to: null,
            preset: null
          }
        });
        showNotification("Filters Cleared", "All filters and sorting have been removed", "success");
        break;
      case 'textmode':
        showNotification("Text Mode Reset", "Text wrap and clip settings have been cleared", "success");
        break;
      case 'showall':
        showNotification("Columns Shown", "All hidden columns are now visible", "success");
        break;
      default:
        console.log('Unknown reset action:', action);
        break;
    }
  };

  const handleDeleteRow = (id: number) => {
    setData(prevData => prevData.filter(item => item.id !== id));
    showNotification("Item Deleted", "The selected item has been removed from the table", "success");
  };

  const handleEditRow = (id: number) => {
    showNotification("Edit Mode", `Editing item with ID: ${id}`, "info");
    console.log('Edit', id);
  };

  const handleHideColumn = (field: string) => {
    showNotification("Column Hidden", `Column "${field}" has been hidden from view`, "info");
    console.log('Hide column:', field);
  };

  const handleAddColumn = () => {
    // This is called by the column header dropdown, actual modal is handled by EnhancedGarageTable
    console.log('Add column');
  };

  const handleAddColumns = (selectedKeys: string[]) => {
    setDynamicColumns(prev => new Set([...prev, ...selectedKeys]));
    
    // Update table data to include new columns with sample data
    setData(prevData => prevData.map(row => {
      const newRow = { ...row };
      selectedKeys.forEach(key => {
        // Add sample data based on column type
        switch (key) {
          case 'country':
            newRow[key] = ['USA', 'China', 'Germany', 'Japan'][Math.floor(Math.random() * 4)];
            break;
          case 'certification':
            newRow[key] = ['IEC 61215', 'UL 1703', 'CE', 'TUV'][Math.floor(Math.random() * 4)];
            break;
          case 'warranty':
            newRow[key] = `${[20, 25, 30][Math.floor(Math.random() * 3)]} years`;
            break;
          case 'efficiency':
            newRow[key] = `${(18 + Math.random() * 4).toFixed(1)}%`;
            break;
          case 'power':
            newRow[key] = `${300 + Math.floor(Math.random() * 200)}W`;
            break;
          case 'voltage':
            newRow[key] = `${24 + Math.floor(Math.random() * 24)}V`;
            break;
          case 'current':
            newRow[key] = `${8 + Math.floor(Math.random() * 4)}A`;
            break;
          case 'dimensions':
            newRow[key] = `${1980 + Math.floor(Math.random() * 100)}×${990 + Math.floor(Math.random() * 50)}×${35 + Math.floor(Math.random() * 10)}mm`;
            break;
          case 'temperature':
            newRow[key] = `-0.${35 + Math.floor(Math.random() * 10)}%/°C`;
            break;
          case 'support':
            newRow[key] = ['24/7', 'Business Hours', 'Online Only'][Math.floor(Math.random() * 3)];
            break;
          default:
            newRow[key] = 'Sample Data';
        }
      });
      return newRow;
    }));
  };

  const handleResetCustomColumns = () => {
    setDynamicColumns(new Set());
    
    // Remove custom column data from all rows
    setData(prevData => prevData.map(row => {
      const newRow = { ...row };
      // Remove all dynamic column keys from row data
      Array.from(dynamicColumns).forEach(key => {
        delete newRow[key];
      });
      return newRow;
    }));
  };

  // Current table configuration with dynamic columns
  const baseHeaders = tableConfigurations[currentTableType]?.headers || [];
  const dynamicHeaders = Array.from(dynamicColumns).map(key => {
    // Find the column definition from available columns
    const availableCols = electricalAvailableColumns[currentTableType] || [];
    const colDef = availableCols.find(col => col.key === key);
    return {
      key,
      label: colDef?.label || key,
      sortable: true
    };
  });
  
  // Insert dynamic columns before the Actions column
  const actionsIndex = baseHeaders.findIndex(h => h.key === 'actions');
  const currentHeaders = [
    ...baseHeaders.slice(0, actionsIndex),
    ...dynamicHeaders,
    ...baseHeaders.slice(actionsIndex)
  ];

  // Get available columns for current table type (exclude already added columns)
  const availableColumns = (electricalAvailableColumns[currentTableType] || [])
    .filter(col => !dynamicColumns.has(col.key));

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-[#161717]">
      {/* Header Section */}
      <header className="bg-white dark:bg-[#202020] shadow-sm ml-6 mr-6 rounded-2xl">
        {/* Toolbar: Add Button & Search */}
        <div className="flex items-center justify-between gap-12 px-4 py-3">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors">
            <div className="bg-white text-yellow-400 w-6 h-6 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            Add {currentTableType}
          </button>
          
          {/* Center: Date Range Filter */}
          <div className="flex-1 flex justify-center">
            {showFilters && (
              <DateRangeFilterNew
                filters={filters as any}
                onFiltersChange={setFilters as any}
              />
            )}
          </div>
          
          {/* Right Side: Search and Filter Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={`${
                hasActiveFilters
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  : "bg-gradient-to-br from-emerald-500 to-green-600"
              } text-white border-none px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 relative hover:shadow-lg hover:shadow-emerald-500/30`}
            >
              <FilterIcon />
            </Button>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-4 pr-4 rounded-full border-2 border-green-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-green-700 w-64"
              />
            </div>
          </div>

        </div>

        {/* Category Navigation */}
        <div className="bg-gray-100 dark:bg-[#2a2a2a] rounded-b-2xl">
          <div className="flex justify-center overflow-x-auto">
            {categoryMapping[currentCategory]?.map((tableType) => (
              <button
                key={tableType}
                onClick={() => setCurrentTableType(tableType)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                  currentTableType === tableType
                    ? 'text-green-600 border-b-2 border-green-600 bg-white dark:bg-gray-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600'
                }`}
              >
                {tableType}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 md:p-6 min-h-0 dark:bg-[#161717]">
        <EnhancedGarageTable
          headers={currentHeaders}
          data={processedData}
          loading={loading}
          error={error}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEditRow}
          onDelete={handleDeleteRow}
          onReset={handleTableReset}
          onHideColumn={handleHideColumn}
          onAddColumn={handleAddColumn}
          onShowNotification={showNotification}
          availableColumns={availableColumns}
          onAddColumns={handleAddColumns}
          onResetCustomColumns={handleResetCustomColumns}
        />
      </main>
    </div>
  );
}
