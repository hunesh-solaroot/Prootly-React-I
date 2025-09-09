import { useState, useEffect, useMemo } from 'react';
import { PlansetHeader } from '../../components/planset/PlansetHeader';
import { PlansetDataTable } from '../../components/planset/PlansetDataTable';
import { AddColumnModal } from '../../components/modals/AddColumnModal';
import { IPlanset, SortConfig, TableFilters, TextMode, ColumnTextModes } from '@shared/types';
import { generateMockProjects } from '../../lib/mockData';
import { useRef } from 'react';

interface DesignWorkflowPageProps {
  tableType: string;
  pageTitle: string;
}


export default function DesignWorkflowPage({ tableType, pageTitle }: DesignWorkflowPageProps) {
  // --- STATE MANAGEMENT ---
  const [allProjects, setAllProjects] = useState<IPlanset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<TableFilters>({
    search: '',
    states: new Set<string>(),
    portals: new Set<string>(),
    customerType: 'all',
    dateRange: {
      from: null,
      to: null,
      preset: null,
    },
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'customer',
    direction: 'asc',
  });

  const [columnTextModes, setColumnTextModes] = useState<ColumnTextModes>({
    customer: null,
    projectDetails: null,
    keyDates: null,
    status: null,
    assignedTo: null,
    countdown: null,
    budget: null,
    estimatedHours: null,
    actualHours: null,
    progress: null,
    tags: null,
    notes: null,
  });

  // Default columns that are hidden by design (available via Add Column modal)
  const defaultHiddenColumns = new Set(['budget', 'estimatedHours', 'actualHours', 'progress', 'tags', 'notes'] as (keyof IPlanset | 'customer')[]);
  
  const [hiddenColumns, setHiddenColumns] = useState<Set<keyof IPlanset | 'customer'>>(
    new Set(defaultHiddenColumns)
  );
  
  // Track columns that were manually hidden by user (not default hidden)
  const [manuallyHiddenColumns, setManuallyHiddenColumns] = useState<Set<keyof IPlanset | 'customer'>>(
    new Set()
  );

  // Updated column width management with widths for all 12 columns
  const initialWidths = [20, 15, 15, 10, 10, 8, 8, 6, 6, 6, 8, 10];
  const [columnWidths, setColumnWidths] = useState<number[]>(initialWidths);
  const tableRef = useRef<HTMLTableElement>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        // You may need to adjust this to match the structure of different IPlanset types
      try {
        setAllProjects(generateMockProjects(50));
        setError(null);
      } catch (err) {
        setError("Failed to generate mock data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, []);

 
  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  };


  // --- PERSISTENCE: Load/Save column widths ---
  useEffect(() => {
    // Load saved widths on mount
    const savedWidths = localStorage.getItem('planset-column-widths');
    if (savedWidths) {
      try {
        const parsedWidths = JSON.parse(savedWidths);
        if (Array.isArray(parsedWidths) && parsedWidths.length === 12) {
          setColumnWidths(parsedWidths);
        }
      } catch (error) {
        console.warn('Failed to load saved column widths:', error);
      }
    }
  }, []);

  // Save widths whenever they change
  useEffect(() => {
    localStorage.setItem('planset-column-widths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  // --- FILTERING & SORTING LOGIC ---
  const processedProjects = useMemo(() => {
    let filtered = [...allProjects];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.customer.name.toLowerCase().includes(searchTerm) ||
        p.customer.address.toLowerCase().includes(searchTerm) ||
        p.projectDetails.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.customerType !== 'all') {
      filtered = filtered.filter(p => p.customer.type === filters.customerType);
    }

    // Date range filtering
    if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter(p => {
        const projectDate = new Date(p.keyDates.created);
        return projectDate >= filters.dateRange.from! && projectDate <= filters.dateRange.to!;
      });
    }

    // States filtering
    if (filters.states.size > 0) {
      filtered = filtered.filter(p => filters.states.has(p.customer.state));
    }

    // Portals filtering
    if (filters.portals.size > 0) {
      filtered = filtered.filter(p => p.portal && filters.portals.has(p.portal));
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const getSortValue = (p: IPlanset, key: keyof IPlanset | 'customer' | 'created') => {
          if (key === 'customer') return p.customer.name;
          if (key === 'created') return p.keyDates.created;
          return p[key as keyof IPlanset];
        };

        const aValue = getSortValue(a, sortConfig.key!);
        const bValue = getSortValue(b, sortConfig.key!);

        // Handle undefined values - sort undefined to end
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [allProjects, filters, sortConfig]);

  // --- HANDLERS ---
  const handleSort = (key: keyof IPlanset | 'customer' | 'created') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleHideColumn = (key: keyof IPlanset | 'customer') => {
    setHiddenColumns(prev => new Set(prev).add(key));
    // Track this as a manually hidden column (only if it's not already in default hidden)
    if (!defaultHiddenColumns.has(key)) {
      setManuallyHiddenColumns(prev => new Set(prev).add(key));
    }
  };

  const handleShowAllColumns = () => {
    // Only show default visible columns + restore manually hidden columns
    // Keep the default hidden columns hidden, but show any manually hidden columns
    setHiddenColumns(new Set(defaultHiddenColumns));
    setManuallyHiddenColumns(new Set()); // Clear manually hidden tracking
    setColumnWidths(initialWidths);
  };

  const handleColumnTextModeChange = (column: keyof ColumnTextModes, mode: TextMode | null) => {
    setColumnTextModes(prev => ({
      ...prev,
      [column]: mode
    }));
  };

  // Updated resize handler to match the new table component interface
  const handleResizeColumn = (newWidths: number[]) => {
    setColumnWidths(newWidths);
  };

  // Modal state management
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  // Define the columns that are available to be added
  const availableColumns = [
    { key: 'customer', label: 'Customer Details', description: 'Customer name, type, and address' },
    { key: 'projectDetails', label: 'Project Details', description: 'Detailed project description' },
    { key: 'keyDates', label: 'Key Dates', description: 'Project creation and received dates' },
    { key: 'status', label: 'Status', description: 'Current project status and priority' },
    { key: 'assignedTo', label: 'Assigned To', description: 'Person assigned to this project' },
    { key: 'countdown', label: 'Countdown', description: 'Time remaining and auto-completion info' },
    { key: 'budget', label: 'Budget', description: 'Project budget allocation' },
    { key: 'estimatedHours', label: 'Estimated Hours', description: 'Estimated time to complete' },
    { key: 'actualHours', label: 'Actual Hours', description: 'Actual time spent on project' },
    { key: 'progress', label: 'Progress', description: 'Project completion percentage' },
    { key: 'tags', label: 'Tags', description: 'Project tags and categories' },
    { key: 'notes', label: 'Notes', description: 'Additional project notes' },
  ];

  // Handler to show the selected columns by removing them from hiddenColumns
  const handleAddColumns = (selectedKeys: string[]) => {
    setHiddenColumns(prev => {
      const newHidden = new Set(prev);
      selectedKeys.forEach(key => {
        newHidden.delete(key as keyof IPlanset | 'customer');
      });
      return newHidden;
    });
    
    // Ensure column widths array has proper length and values
    const allColumnKeys = ['customer', 'projectDetails', 'keyDates', 'status', 'assignedTo', 'countdown', 'budget', 'estimatedHours', 'actualHours', 'progress', 'tags', 'notes'];
    if (columnWidths.length !== allColumnKeys.length) {
      setColumnWidths([20, 15, 15, 10, 10, 8, 8, 6, 6, 6, 8, 10]);
    }
  };

  // Updated table reset handler
  const handleTableReset = (action: string) => {
    switch (action) {
      case 'everything':
        // Reset all filters and sorting
        setFilters({ 
          search: '', 
          states: new Set(), 
          portals: new Set(), 
          customerType: 'all',
          dateRange: { from: null, to: null, preset: null }
        });
        setSortConfig({ key: 'customer', direction: 'asc' });
        // Reset column widths
        setColumnWidths([20, 15, 15, 10, 10, 8, 8, 6, 6, 6, 8, 10]);
        // Reset to default visible columns
        setHiddenColumns(new Set(defaultHiddenColumns));
        setManuallyHiddenColumns(new Set()); // Clear manually hidden tracking
        // Reset text modes
        setColumnTextModes({
          customer: null,
          projectDetails: null,
          keyDates: null,
          status: null,
          assignedTo: null,
          countdown: null,
          budget: null,
          estimatedHours: null,
          actualHours: null,
          progress: null,
          tags: null,
          notes: null,
        });
        console.log('✅ Everything reset to default');
        break;

      case 'custom-columns':
        // Reset to default visible columns (hide the extra ones)
        setHiddenColumns(new Set(defaultHiddenColumns));
        setManuallyHiddenColumns(new Set()); // Clear manually hidden tracking
        console.log('✅ Custom columns reset');
        break;

      case 'columns':
        // Reset column widths to initial values
        setColumnWidths([20, 15, 15, 10, 10, 8, 8, 6, 6, 6, 8, 10]);
        console.log('✅ Column widths reset');
        break;

      case 'filters':
        // Clear all filters and sorting
        setFilters({ 
          search: '', 
          states: new Set(), 
          portals: new Set(), 
          customerType: 'all',
          dateRange: { from: null, to: null, preset: null }
        });
        setSortConfig({ key: null, direction: 'asc' });
        console.log('✅ Filters and sorting cleared');
        break;

      case 'autofit':
        // Auto-fit columns based on content
        const autoFitWidths = [18, 14, 16, 12, 12, 8, 8, 6, 6, 6, 8, 10];
        setColumnWidths(autoFitWidths);
        console.log('✅ Columns auto-fitted');
        break;

      case 'textmode':
        // Reset all text modes to null (default)
        setColumnTextModes({
          customer: null,
          projectDetails: null,
          keyDates: null,
          status: null,
          assignedTo: null,
          countdown: null,
          budget: null,
          estimatedHours: null,
          actualHours: null,
          progress: null,
          tags: null,
          notes: null,
        });
        console.log('✅ Text mode reset');
        break;

      case 'showall':
        // Show only default visible columns + restore manually hidden columns
        // Keep the default hidden columns hidden (available via Add Column modal)
        setHiddenColumns(new Set(defaultHiddenColumns));
        setManuallyHiddenColumns(new Set()); // Clear manually hidden tracking
        console.log('✅ Manually hidden columns restored');
        break;

      default:
        console.log('Unknown reset action:', action);
        break;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900">
      <PlansetHeader
        filters={filters}
        onFiltersChange={setFilters}
        showFilters={showFilters}   

        onToggleFilters={() => setShowFilters(!showFilters)}
      />
      <main className="flex-1 flex flex-col p-4 md:p-6 min-h-0">
        <PlansetDataTable
          projects={processedProjects}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onFilterChange={handleFilterChange}
          currentFilter={filters.customerType}
          columnTextModes={columnTextModes}
          onColumnTextModeChange={handleColumnTextModeChange}
          hiddenColumns={hiddenColumns}
          onHideColumn={handleHideColumn}
          onShowAllColumns={handleShowAllColumns}
          onAddColumn={() => setIsAddColumnModalOpen(true)}
          columnWidths={columnWidths}
          onResizeColumn={handleResizeColumn}
          tableRef={tableRef}
          onReset={handleTableReset}
        />
      </main>
      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        availableColumns={availableColumns}
        onAddColumns={handleAddColumns}
        hiddenColumns={new Set(Array.from(hiddenColumns).map(String))}
      />
    </div>
  );
}