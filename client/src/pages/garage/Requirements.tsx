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

// Table configurations for requirements category
const tableConfigurations: Record<string, TableConfiguration> = {
  "Authority Having Jurisdictions": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'state', label: 'State', sortable: true },
      { key: 'city', label: 'City', sortable: true },
      { key: 'county', label: 'County', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, name: "Los Angeles Department of Building and Safety", state: "California", city: "Los Angeles", county: "Los Angeles County" },
      { id: 2, name: "City of Phoenix Development Services", state: "Arizona", city: "Phoenix", county: "Maricopa County" },
      { id: 3, name: "Austin Development Services Department", state: "Texas", city: "Austin", county: "Travis County" },
      { id: 4, name: "Miami-Dade County Building Department", state: "Florida", city: "Miami", county: "Miami-Dade County" },
      { id: 5, name: "Denver Community Planning and Development", state: "Colorado", city: "Denver", county: "Denver County" }
    ]
  },
  "Utility": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'utilityName', label: 'Utility Name', sortable: true },
      { key: 'serviceTerritory', label: 'Service Territory', sortable: true },
      { key: 'contactInfo', label: 'Contact Info', sortable: true },
      { key: 'interconnectionProcess', label: 'Interconnection Process', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, utilityName: "Pacific Gas and Electric Company (PG&E)", serviceTerritory: "Northern California", contactInfo: "1-877-743-7782", interconnectionProcess: "Rule 21" },
      { id: 2, utilityName: "Southern California Edison (SCE)", serviceTerritory: "Central/Southern California", contactInfo: "1-800-655-4555", interconnectionProcess: "Rule 21" },
      { id: 3, utilityName: "Arizona Public Service (APS)", serviceTerritory: "Arizona", contactInfo: "1-602-371-7171", interconnectionProcess: "Standard Form Agreement" },
      { id: 4, utilityName: "Austin Energy", serviceTerritory: "Austin, Texas", contactInfo: "1-512-494-9400", interconnectionProcess: "Solar PV Program" },
      { id: 5, utilityName: "Florida Power & Light (FPL)", serviceTerritory: "Florida", contactInfo: "1-800-375-2434", interconnectionProcess: "Net Metering" }
    ]
  },
  "Governing Code": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'codeName', label: 'Code Name', sortable: true },
      { key: 'codeVersion', label: 'Version', sortable: true },
      { key: 'jurisdiction', label: 'Jurisdiction', sortable: true },
      { key: 'applicableScope', label: 'Applicable Scope', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, codeName: "National Electrical Code (NEC)", codeVersion: "2023", jurisdiction: "National", applicableScope: "Electrical Installation" },
      { id: 2, codeName: "International Building Code (IBC)", codeVersion: "2021", jurisdiction: "National", applicableScope: "Structural Requirements" },
      { id: 3, codeName: "California Building Code (CBC)", codeVersion: "2022", jurisdiction: "California", applicableScope: "Building Construction" },
      { id: 4, codeName: "Florida Building Code (FBC)", codeVersion: "2023", jurisdiction: "Florida", applicableScope: "Wind Load Requirements" },
      { id: 5, codeName: "IEEE 1547", codeVersion: "2018", jurisdiction: "National", applicableScope: "Interconnection Standards" }
    ]
  },
  "Ambient Temperature": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'location', label: 'Location', sortable: true },
      { key: 'minTemp', label: 'Min Temperature (°F)', sortable: true },
      { key: 'maxTemp', label: 'Max Temperature (°F)', sortable: true },
      { key: 'averageTemp', label: 'Average Temperature (°F)', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, location: "Phoenix, AZ", minTemp: 41, maxTemp: 116, averageTemp: 75 },
      { id: 2, location: "Los Angeles, CA", minTemp: 48, maxTemp: 84, averageTemp: 64 },
      { id: 3, location: "Miami, FL", minTemp: 59, maxTemp: 90, averageTemp: 77 },
      { id: 4, location: "Denver, CO", minTemp: 16, maxTemp: 90, averageTemp: 50 },
      { id: 5, location: "Austin, TX", minTemp: 35, maxTemp: 97, averageTemp: 68 }
    ]
  },
  "Client Updates": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'updateType', label: 'Update Type', sortable: true },
      { key: 'frequency', label: 'Frequency', sortable: true },
      { key: 'method', label: 'Method', sortable: true },
      { key: 'description', label: 'Description', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, updateType: "Project Milestone", frequency: "Weekly", method: "Email", description: "Major project phase completion updates" },
      { id: 2, updateType: "Permit Status", frequency: "As needed", method: "Phone Call", description: "Updates on permit application progress" },
      { id: 3, updateType: "Installation Progress", frequency: "Daily", method: "SMS", description: "Daily installation progress reports" },
      { id: 4, updateType: "Inspection Results", frequency: "As needed", method: "Email", description: "Results from electrical and structural inspections" },
      { id: 5, updateType: "System Performance", frequency: "Monthly", method: "Portal", description: "Monthly system performance and energy production reports" }
    ]
  },
  "Notes": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'noteCategory', label: 'Category', sortable: true },
      { key: 'noteTitle', label: 'Title', sortable: true },
      { key: 'noteContent', label: 'Content', sortable: true },
      { key: 'dateCreated', label: 'Date Created', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, noteCategory: "Design", noteTitle: "Roof Accessibility", noteContent: "Ensure safe access for maintenance activities", dateCreated: "2024-01-15" },
      { id: 2, noteCategory: "Installation", noteTitle: "Weather Considerations", noteContent: "Schedule installation during favorable weather conditions", dateCreated: "2024-01-16" },
      { id: 3, noteCategory: "Electrical", noteTitle: "Grounding Requirements", noteContent: "Follow NEC Article 690 for PV system grounding", dateCreated: "2024-01-17" },
      { id: 4, noteCategory: "Structural", noteTitle: "Load Calculations", noteContent: "Verify structural load capacity before installation", dateCreated: "2024-01-18" },
      { id: 5, noteCategory: "Commissioning", noteTitle: "Performance Testing", noteContent: "Complete system performance verification tests", dateCreated: "2024-01-19" }
    ]
  },
  "Checklist": {
    headers: [
      { key: 'id', label: 'S.No', sortable: false },
      { key: 'checklistItem', label: 'Checklist Item', sortable: true },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'priority', label: 'Priority', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false }
    ],
    data: [
      { id: 1, checklistItem: "Site Survey Completed", category: "Pre-Installation", priority: "High", status: "Completed" },
      { id: 2, checklistItem: "Permits Obtained", category: "Pre-Installation", priority: "High", status: "In Progress" },
      { id: 3, checklistItem: "Equipment Delivered", category: "Installation", priority: "Medium", status: "Pending" },
      { id: 4, checklistItem: "Electrical Inspection", category: "Post-Installation", priority: "High", status: "Pending" },
      { id: 5, checklistItem: "Final System Testing", category: "Commissioning", priority: "High", status: "Pending" }
    ]
  }
};

const categoryMapping: Record<string, string[]> = {
  'requirements': ['Authority Having Jurisdictions', 'Utility', 'Governing Code', 'Ambient Temperature', 'Client Updates', 'Notes', 'Checklist']
};

// Available columns for requirements garage tables
const requirementsAvailableColumns: Record<string, AvailableColumn[]> = {
  "Authority Having Jurisdictions": [
    { key: 'contact', label: 'Contact Person', description: 'Primary contact at the jurisdiction' },
    { key: 'phone', label: 'Phone', description: 'Contact phone number' },
    { key: 'email', label: 'Email', description: 'Contact email address' },
    { key: 'website', label: 'Website', description: 'Official website URL' }
  ],
  "Utility": [
    { key: 'region', label: 'Region', description: 'Service region or zone' },
    { key: 'rate', label: 'Rate Schedule', description: 'Applicable rate schedule' },
    { key: 'netMetering', label: 'Net Metering', description: 'Net metering availability' },
    { key: 'timeOfUse', label: 'Time of Use', description: 'Time of use rate structure' }
  ],
  "Governing Code": [
    { key: 'adoptedDate', label: 'Adopted Date', description: 'Date code was adopted' },
    { key: 'effectiveDate', label: 'Effective Date', description: 'Date code became effective' },
    { key: 'amendments', label: 'Local Amendments', description: 'Local code amendments' },
    { key: 'inspector', label: 'Inspector Requirements', description: 'Special inspector requirements' }
  ],
  "Ambient Temperature": [
    { key: 'humidity', label: 'Humidity', description: 'Average humidity levels' },
    { key: 'season', label: 'Season', description: 'Seasonal variation data' },
    { key: 'heatIndex', label: 'Heat Index', description: 'Heat index values' },
    { key: 'windChill', label: 'Wind Chill', description: 'Wind chill factor' }
  ],
  "Client Updates": [
    { key: 'contact', label: 'Contact Method', description: 'Preferred contact method' },
    { key: 'language', label: 'Language', description: 'Preferred communication language' },
    { key: 'timezone', label: 'Timezone', description: 'Client timezone' },
    { key: 'schedule', label: 'Schedule', description: 'Preferred contact schedule' }
  ],
  "Notes": [
    { key: 'priority', label: 'Priority', description: 'Note priority level' },
    { key: 'author', label: 'Author', description: 'Note author' },
    { key: 'tags', label: 'Tags', description: 'Note tags/categories' },
    { key: 'attachments', label: 'Attachments', description: 'Attached files count' }
  ],
  "Checklist": [
    { key: 'assignee', label: 'Assignee', description: 'Person responsible for task' },
    { key: 'dueDate', label: 'Due Date', description: 'Task due date' },
    { key: 'estimatedTime', label: 'Estimated Time', description: 'Estimated completion time' },
    { key: 'dependencies', label: 'Dependencies', description: 'Task dependencies' }
  ]
};

interface RequirementsComponentProps {
  currentTableType?: string;
}

/**
 * Requirements Component for Garage Management
 */
export default function RequirementsComponent({ 
  currentTableType: initialTableType = 'Authority Having Jurisdictions' 
}: RequirementsComponentProps) {
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
          case 'contact':
            newRow[key] = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson'][Math.floor(Math.random() * 4)];
            break;
          case 'phone':
            newRow[key] = `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
            break;
          case 'email':
            newRow[key] = ['contact@city.gov', 'permits@county.gov', 'building@state.gov'][Math.floor(Math.random() * 3)];
            break;
          case 'website':
            newRow[key] = ['www.city.gov', 'www.county.gov', 'www.state.gov'][Math.floor(Math.random() * 3)];
            break;
          case 'region':
            newRow[key] = ['Zone A', 'Zone B', 'Zone C', 'Metro'][Math.floor(Math.random() * 4)];
            break;
          case 'rate':
            newRow[key] = ['TOU-D-4', 'TOU-D-5', 'E-19', 'A-6'][Math.floor(Math.random() * 4)];
            break;
          case 'netMetering':
            newRow[key] = Math.random() > 0.2 ? 'Available' : 'Not Available';
            break;
          case 'timeOfUse':
            newRow[key] = Math.random() > 0.3 ? 'Yes' : 'No';
            break;
          case 'adoptedDate':
            newRow[key] = `${2020 + Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`;
            break;
          case 'effectiveDate':
            newRow[key] = `${2021 + Math.floor(Math.random() * 3)}-01-01`;
            break;
          case 'amendments':
            newRow[key] = ['None', 'Minor', 'Significant'][Math.floor(Math.random() * 3)];
            break;
          case 'inspector':
            newRow[key] = Math.random() > 0.5 ? 'Required' : 'Not Required';
            break;
          case 'humidity':
            newRow[key] = `${30 + Math.floor(Math.random() * 40)}%`;
            break;
          case 'season':
            newRow[key] = ['Spring', 'Summer', 'Fall', 'Winter'][Math.floor(Math.random() * 4)];
            break;
          case 'heatIndex':
            newRow[key] = `${80 + Math.floor(Math.random() * 40)}°F`;
            break;
          case 'windChill':
            newRow[key] = `${-10 + Math.floor(Math.random() * 60)}°F`;
            break;
          case 'language':
            newRow[key] = ['English', 'Spanish', 'French'][Math.floor(Math.random() * 3)];
            break;
          case 'timezone':
            newRow[key] = ['PST', 'MST', 'CST', 'EST'][Math.floor(Math.random() * 4)];
            break;
          case 'schedule':
            newRow[key] = ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)];
            break;
          case 'priority':
            newRow[key] = ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];
            break;
          case 'author':
            newRow[key] = ['Admin', 'Engineer', 'Inspector'][Math.floor(Math.random() * 3)];
            break;
          case 'tags':
            newRow[key] = ['Safety', 'Electrical', 'Structural'][Math.floor(Math.random() * 3)];
            break;
          case 'attachments':
            newRow[key] = Math.floor(Math.random() * 5);
            break;
          case 'assignee':
            newRow[key] = ['Team Lead', 'Inspector', 'Engineer'][Math.floor(Math.random() * 3)];
            break;
          case 'dueDate':
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * 30));
            newRow[key] = date.toISOString().split('T')[0];
            break;
          case 'estimatedTime':
            newRow[key] = `${1 + Math.floor(Math.random() * 8)} hours`;
            break;
          case 'dependencies':
            newRow[key] = ['None', 'Permits', 'Inspection', 'Materials'][Math.floor(Math.random() * 4)];
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
    const availableCols = requirementsAvailableColumns[currentTableType] || [];
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

  const availableColumns = (requirementsAvailableColumns[currentTableType] || [])
    .filter(col => !dynamicColumns.has(col.key));

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-[#161717] rounded-2xl overflow-hidden">
      {/* Header Section */}
      <header className="bg-white dark:bg-[#202020] shadow-sm rounded-2xl ml-6 mr-6">
        {/* Toolbar: Add Button & Search */}
        <div className="flex items-center justify-between gap-12 px-4 py-3">
          <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors">
            <div className="bg-white text-blue-400 w-6 h-6 rounded-full flex items-center justify-center">
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
        <div className="bg-blue-100 dark:bg-[#2a2a2a] rounded-b-2xl">
          <div className="flex justify-center overflow-x-auto">
            {categoryMapping['requirements']?.map((tableType) => (
              <button
                key={tableType}
                onClick={() => setCurrentTableType(tableType)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                  currentTableType === tableType
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
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