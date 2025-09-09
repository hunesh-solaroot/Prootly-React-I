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

// Table configurations for structural category
const tableConfigurations: Record<string, TableConfiguration> = {
  "Racking Name": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'rackingName', label: 'Racking Name', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, rackingName: "IronRidge XR Rails" },
      { id: 2, rackingName: "SolarMount UV30" },
      { id: 3, rackingName: "Quick Mount PV" },
      { id: 4, rackingName: "Unirac SolarMount" },
      { id: 5, rackingName: "S-5! PV Kit" }
    ]
  },
  "Racking Model": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'rackingModelName', label: 'Racking Model Name', sortable: true },
      { key: 'partNumber', label: 'Part Number', sortable: true },
      { key: 'railLength', label: 'Rail Length', sortable: true },
      { key: 'rackingName', label: 'Racking Name', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, rackingModelName: "XR-100-168A", partNumber: "XR100168A", railLength: "168 inches", rackingName: "IronRidge XR Rails" },
      { id: 2, rackingModelName: "UV30-144", partNumber: "UV30144", railLength: "144 inches", rackingName: "SolarMount UV30" },
      { id: 3, rackingModelName: "QM-PVKIT-5", partNumber: "QMPVKIT5", railLength: "60 inches", rackingName: "Quick Mount PV" },
      { id: 4, rackingModelName: "SM-168", partNumber: "SM168", railLength: "168 inches", rackingName: "Unirac SolarMount" },
      { id: 5, rackingModelName: "S5-PVKIT-2.1", partNumber: "S5PVKIT21", railLength: "84 inches", rackingName: "S-5! PV Kit" }
    ]
  },
  "Attachment Type": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'attachmentName', label: 'Attachment Name', sortable: true },
      { key: 'rackingName', label: 'Racking Name', sortable: true },
      { key: 'material', label: 'Material', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, attachmentName: "Tile Roof Attachment", rackingName: "IronRidge XR Rails", material: "Stainless Steel" },
      { id: 2, attachmentName: "Composition Shingle Attachment", rackingName: "SolarMount UV30", material: "Aluminum" },
      { id: 3, attachmentName: "Metal Roof Clamp", rackingName: "Quick Mount PV", material: "Aluminum" },
      { id: 4, attachmentName: "Standing Seam Clamp", rackingName: "Unirac SolarMount", material: "Stainless Steel" },
      { id: 5, attachmentName: "Snow Guard Mount", rackingName: "S-5! PV Kit", material: "Aluminum" }
    ]
  },
  "Attachment Material": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'description', label: 'Description', sortable: true },
      { key: 'attachmentType', label: 'Attachment Type', sortable: true },
      { key: 'specification', label: 'Specification', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, description: "316 Stainless Steel Bolt", attachmentType: "Tile Roof Attachment", specification: "1/4-20 x 3\"" },
      { id: 2, description: "Aluminum Flashing", attachmentType: "Composition Shingle Attachment", specification: "0.032\" thick" },
      { id: 3, description: "EPDM Rubber Gasket", attachmentType: "Metal Roof Clamp", specification: "Shore A 70" },
      { id: 4, description: "Stainless Steel Washer", attachmentType: "Standing Seam Clamp", specification: "1/4\" ID" },
      { id: 5, description: "Aluminum Spacer Block", attachmentType: "Snow Guard Mount", specification: "6061-T6" }
    ]
  }
};

const categoryMapping: Record<string, string[]> = {
  'structural': ['Racking Name', 'Racking Model', 'Attachment Type', 'Attachment Material']
};

// Available columns for structural garage tables
const structuralAvailableColumns: Record<string, AvailableColumn[]> = {
  "Racking Name": [
    { key: 'manufacturer', label: 'Manufacturer', description: 'Racking system manufacturer' },
    { key: 'maxSpan', label: 'Max Span', description: 'Maximum unsupported span length' },
    { key: 'loadRating', label: 'Load Rating', description: 'Maximum wind/snow load rating' },
    { key: 'compatibility', label: 'Compatibility', description: 'Compatible panel types' }
  ],
  "Racking Model": [
    { key: 'weight', label: 'Weight', description: 'Weight per linear foot' },
    { key: 'color', label: 'Color', description: 'Available color options' },
    { key: 'finish', label: 'Finish', description: 'Surface finish type' },
    { key: 'warranty', label: 'Warranty', description: 'Warranty period in years' }
  ],
  "Attachment Type": [
    { key: 'roofType', label: 'Roof Type', description: 'Compatible roof types' },
    { key: 'penetration', label: 'Penetration', description: 'Requires roof penetration (Yes/No)' },
    { key: 'installation', label: 'Installation', description: 'Installation difficulty level' },
    { key: 'sealant', label: 'Sealant', description: 'Required sealant type' }
  ],
  "Attachment Material": [
    { key: 'corrosion', label: 'Corrosion Resistance', description: 'Corrosion resistance rating' },
    { key: 'temperature', label: 'Temperature Range', description: 'Operating temperature range' },
    { key: 'certification', label: 'Certification', description: 'Industry certifications' },
    { key: 'lifespan', label: 'Expected Lifespan', description: 'Expected service life' }
  ]
};

interface StructuralComponentProps {
  currentTableType?: string;
}

/**
 * Structural Component for Garage Management
 */
export default function StructuralComponent({ 
  currentTableType: initialTableType = 'Racking Name' 
}: StructuralComponentProps) {
  // --- STATE MANAGEMENT ---
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
    console.log('Add column');
  };

  const handleAddColumns = (selectedKeys: string[]) => {
    setDynamicColumns(prev => new Set([...prev, ...selectedKeys]));
    
    setData(prevData => prevData.map(row => {
      const newRow = { ...row };
      selectedKeys.forEach(key => {
        switch (key) {
          case 'manufacturer':
            newRow[key] = ['IronRidge', 'Unirac', 'Quick Mount', 'S-5!'][Math.floor(Math.random() * 4)];
            break;
          case 'maxSpan':
            newRow[key] = `${4 + Math.floor(Math.random() * 4)}ft`;
            break;
          case 'loadRating':
            newRow[key] = `${40 + Math.floor(Math.random() * 40)} psf`;
            break;
          case 'compatibility':
            newRow[key] = ['Framed', 'Frameless', 'Both'][Math.floor(Math.random() * 3)];
            break;
          case 'weight':
            newRow[key] = `${2 + Math.random() * 3}lbs/ft`;
            break;
          case 'color':
            newRow[key] = ['Black', 'Silver', 'Mill Finish'][Math.floor(Math.random() * 3)];
            break;
          case 'finish':
            newRow[key] = ['Anodized', 'Powder Coated', 'Mill Finish'][Math.floor(Math.random() * 3)];
            break;
          case 'warranty':
            newRow[key] = `${20 + Math.floor(Math.random() * 10)} years`;
            break;
          case 'roofType':
            newRow[key] = ['Tile', 'Shingle', 'Metal', 'Membrane'][Math.floor(Math.random() * 4)];
            break;
          case 'penetration':
            newRow[key] = Math.random() > 0.5 ? 'Yes' : 'No';
            break;
          case 'installation':
            newRow[key] = ['Easy', 'Moderate', 'Complex'][Math.floor(Math.random() * 3)];
            break;
          case 'sealant':
            newRow[key] = ['Butyl', 'Silicone', 'EPDM'][Math.floor(Math.random() * 3)];
            break;
          case 'corrosion':
            newRow[key] = ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)];
            break;
          case 'temperature':
            newRow[key] = `-40°F to ${120 + Math.floor(Math.random() * 40)}°F`;
            break;
          case 'certification':
            newRow[key] = ['UL 2703', 'IBC', 'ASTM'][Math.floor(Math.random() * 3)];
            break;
          case 'lifespan':
            newRow[key] = `${20 + Math.floor(Math.random() * 10)} years`;
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
    const availableCols = structuralAvailableColumns[currentTableType] || [];
    const colDef = availableCols.find(col => col.key === key);
    return {
      key,
      label: colDef?.label || key,
      sortable: true
    };
  });
  
  const actionsIndex = baseHeaders.findIndex(h => h.key === 'actions');
  const currentHeaders = [
    ...baseHeaders.slice(0, actionsIndex),
    ...dynamicHeaders,
    ...baseHeaders.slice(actionsIndex)
  ];

  const availableColumns = (structuralAvailableColumns[currentTableType] || [])
    .filter(col => !dynamicColumns.has(col.key));

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-[#161717]">
      {/* Header Section */}
      <header className="bg-white dark:bg-[#202020] shadow-sm rounded-2xl ml-6 mr-6">
        {/* Toolbar: Add Button & Search */}
        <div className="flex items-center justify-between gap-12 px-4 py-3">
          <button className="bg-orange-400 hover:bg-orange-500 text-black px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors">
            <div className="bg-white text-orange-400 w-6 h-6 rounded-full flex items-center justify-center">
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
        <div className="bg-orange-100 dark:bg-[#2a2a2a] rounded-b-2xl">
          <div className="flex justify-center overflow-x-auto">
            {categoryMapping['structural']?.map((tableType) => (
              <button
                key={tableType}
                onClick={() => setCurrentTableType(tableType)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                  currentTableType === tableType
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-white dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-orange-600'
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
        />
      </main>
    </div>
  );
}