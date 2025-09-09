import { useState, useEffect, useMemo } from "react";
import { PlansetHeader } from "../../components/planset/PlansetHeader";
import { PlansetDataTable } from "../../components/planset/PlansetDataTable";
import { AddColumnModal } from "../../components/modals/AddColumnModal";
import { NotificationPanel } from "../../components/notifications/NotificationPanel";
import { notifications as allNotificationsData } from '../../lib/notificationsData';
import {
  SortConfig,
  TableFilters,
  TextMode,
} from "@shared/types";
import { mockApiService } from "../../services/mockApiService";
import { ApiHeaderConfig, DynamicProjectData } from "../../types/apiTypes";
import { useRef } from "react";

interface DesignWorkflowPageProps {
  tableType: string;
  pageTitle: string;
}

export default function DesignWorkflowPage({
  tableType,
  pageTitle,
}: DesignWorkflowPageProps) {
  // --- STATE MANAGEMENT ---
  const [allProjects, setAllProjects] = useState<DynamicProjectData[]>([]);
  const [apiHeaders, setApiHeaders] = useState<ApiHeaderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // --- NOTIFICATION PANEL STATE ---
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DynamicProjectData | null>(null);

  // --- HANDLER TO OPEN THE NOTIFICATION PANEL ---
  const handleShowActivity = (projectId: string) => {
    const project = allProjects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsPanelOpen(true);
    }
  };
  const [filters, setFilters] = useState<TableFilters>({
    search: "",
    states: new Set<string>(),
    portals: new Set<string>(),
    customerType: "all",
    dateRange: {
      from: null,
      to: null,
      preset: null,
    },
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "customer",
    direction: "asc",
  });

  const [columnTextModes, setColumnTextModes] = useState<Record<string, TextMode | null>>({});

  // Default hidden columns (will be set from API response)
  const [defaultHiddenColumns, setDefaultHiddenColumns] = useState<Set<string>>(new Set());
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [manuallyHiddenColumns, setManuallyHiddenColumns] = useState<Set<string>>(new Set());

  // Updated column width management with widths for all 12 columns
  const initialWidths = [20, 15, 15, 10, 10, 8, 8, 6, 6, 6, 8, 10];
  const [columnWidths, setColumnWidths] = useState<number[]>(initialWidths);
  const tableRef = useRef<HTMLTableElement>(null);

  // --- API DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      console.log(`🚀 NewProjects: Starting data fetch for tableType: "${tableType}"`);
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from API, fallback to mock data
        const response = await mockApiService.fetchTableData(tableType, {
          mockApiFailure: false, // Set to true to test fallback
        });
        
        console.log(`✅ NewProjects: Received response with ${response.data.length} projects and ${response.headers.length} headers`);
        
        setApiHeaders(response.headers);
        setAllProjects(response.data);
        setError(null);
        
        // Initialize column text modes for all headers
        const initialTextModes: Record<string, TextMode | null> = {};
        response.headers.forEach(header => {
          initialTextModes[header.key] = null;
        });
        setColumnTextModes(initialTextModes);
        
        // Set initial column widths based on headers
        const initialWidths = response.headers.map(header => 
          parseFloat(header.width?.replace('%', '') || '10')
        );
        setColumnWidths(initialWidths);
        
        console.log(`✅ NewProjects: Setup complete with ${initialWidths.length} columns`);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load project data";
        console.error('❌ NewProjects: Error during fetch:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableType]);

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  };

  // --- PERSISTENCE: Load/Save column widths ---
  useEffect(() => {
    // Load saved widths on mount
    const savedWidths = localStorage.getItem("planset-column-widths");
    if (savedWidths) {
      try {
        const parsedWidths = JSON.parse(savedWidths);
        if (Array.isArray(parsedWidths) && parsedWidths.length === 12) {
          setColumnWidths(parsedWidths);
        }
      } catch (error) {
        console.warn("Failed to load saved column widths:", error);
      }
    }
  }, []);

  // Save widths whenever they change
  useEffect(() => {
    localStorage.setItem("planset-column-widths", JSON.stringify(columnWidths));
  }, [columnWidths]);

  // --- FILTERING & SORTING LOGIC ---
  const processedProjects = useMemo(() => {
    let filtered = [...allProjects];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((p) => {
        // Safe search across dynamic fields
        const customerName = p.customer?.name || '';
        const customerAddress = p.customer?.address || '';
        const projectDetails = p.projectDetails || '';
        
        return (
          customerName.toLowerCase().includes(searchTerm) ||
          customerAddress.toLowerCase().includes(searchTerm) ||
          projectDetails.toLowerCase().includes(searchTerm)
        );
      });
    }

    if (filters.customerType !== "all") {
      filtered = filtered.filter(
        (p) => p.customer?.type === filters.customerType
      );
    }

    // Date range filtering with safe access
    if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter((p) => {
        const createdDate = p.keyDates?.created || p.keyDates;
        if (!createdDate) return false;
        
        const projectDate = new Date(typeof createdDate === 'object' ? createdDate.created : createdDate);
        return (
          projectDate >= filters.dateRange.from! &&
          projectDate <= filters.dateRange.to!
        );
      });
    }

    // States filtering with safe access
    if (filters.states.size > 0) {
      filtered = filtered.filter((p) => p.customer?.state && filters.states.has(p.customer.state));
    }

    // Portals filtering with safe access
    if (filters.portals.size > 0) {
      filtered = filtered.filter(
        (p) => p.portal && filters.portals.has(p.portal)
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const getSortValue = (p: DynamicProjectData, key: string) => {
          if (key === "customer") return p.customer?.name || '';
          if (key === "created") return p.keyDates?.created || p.keyDates || '';
          return p[key] || '';
        };

        const aValue = getSortValue(a, sortConfig.key!);
        const bValue = getSortValue(b, sortConfig.key!);

        // Handle undefined values - sort undefined to end
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [allProjects, filters, sortConfig]);

  // --- HANDLERS ---
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleHideColumn = (key: string) => {
    setHiddenColumns((prev) => new Set(prev).add(key));
    // Track this as a manually hidden column (only if it's not already in default hidden)
    if (!defaultHiddenColumns.has(key)) {
      setManuallyHiddenColumns((prev) => new Set(prev).add(key));
    }
  };

  const handleShowAllColumns = () => {
    // Only show default visible columns + restore manually hidden columns
    // Keep the default hidden columns hidden, but show any manually hidden columns
    setHiddenColumns(new Set(defaultHiddenColumns));
    setManuallyHiddenColumns(new Set()); // Clear manually hidden tracking
    setColumnWidths(apiHeaders.map(h => parseFloat(h.width?.replace('%', '') || '10')));
  };

  const handleColumnTextModeChange = (
    column: string,
    mode: TextMode | null
  ) => {
    setColumnTextModes((prev) => ({
      ...prev,
      [column]: mode,
    }));
  };


  // Modal state management
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  // Define the columns that are available to be added (dynamic based on API response)
  const availableColumns = apiHeaders.map(header => ({
    key: header.key,
    label: header.label,
    description: `${header.label} - ${header.type || 'text'} field`,
  }));

  // Handler to show the selected columns by removing them from hiddenColumns
  const handleAddColumns = (selectedKeys: string[]) => {
    setHiddenColumns((prev) => {
      const newHidden = new Set(prev);
      selectedKeys.forEach((key) => {
        newHidden.delete(key);
      });
      return newHidden;
    });

    // Ensure column widths array has proper length and values based on API headers
    if (columnWidths.length !== apiHeaders.length) {
      const newWidths = apiHeaders.map(header => 
        parseFloat(header.width?.replace('%', '') || '10')
      );
      setColumnWidths(newWidths);
    }
  };

  // Updated table reset handler
  const handleTableReset = (action: string) => {
    switch (action) {
      case "everything":
        // Reset all filters and sorting
        setFilters({
          search: "",
          states: new Set(),
          portals: new Set(),
          customerType: "all",
          dateRange: { from: null, to: null, preset: null },
        });
        setSortConfig({ key: apiHeaders[0]?.key || "customer", direction: "asc" });
        // Reset column widths based on API headers
        const resetWidths = apiHeaders.map(h => parseFloat(h.width?.replace('%', '') || '10'));
        setColumnWidths(resetWidths);
        // Reset to default visible columns
        setHiddenColumns(new Set(defaultHiddenColumns));
        setManuallyHiddenColumns(new Set()); // Clear manually hidden tracking
        // Reset text modes for all API headers
        const resetTextModes: Record<string, TextMode | null> = {};
        apiHeaders.forEach(header => {
          resetTextModes[header.key] = null;
        });
        setColumnTextModes(resetTextModes);
        console.log("✅ Everything reset to default");
        break;

      case "custom-columns":
        // Reset to default visible columns (hide the extra ones)
        setHiddenColumns(new Set(defaultHiddenColumns));
        setManuallyHiddenColumns(new Set()); // Clear manually hidden tracking
        console.log("✅ Custom columns reset");
        break;

      case "columns":
        // Reset column widths to initial values
        setColumnWidths([20, 15, 15, 10, 10, 8, 8, 6, 6, 6, 8, 10]);
        console.log("✅ Column widths reset");
        break;

      case "filters":
        // Clear all filters and sorting
        setFilters({
          search: "",
          states: new Set(),
          portals: new Set(),
          customerType: "all",
          dateRange: { from: null, to: null, preset: null },
        });
        setSortConfig({ key: null, direction: "asc" });
        console.log("✅ Filters and sorting cleared");
        break;

      case "autofit":
        // Auto-fit columns based on content
        const autoFitWidths = [18, 14, 16, 12, 12, 8, 8, 6, 6, 6, 8, 10];
        setColumnWidths(autoFitWidths);
        console.log("✅ Columns auto-fitted");
        break;

      case "textmode":
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
        console.log("✅ Text mode reset");
        break;

      case "showall":
        // Show only default visible columns + restore manually hidden columns
        // Keep the default hidden columns hidden (available via Add Column modal)
        setHiddenColumns(new Set(defaultHiddenColumns));
        setManuallyHiddenColumns(new Set()); // Clear manually hidden tracking
        console.log("✅ Manually hidden columns restored");
        break;

      default:
        console.log("Unknown reset action:", action);
        break;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-[#161717]">
      <PlansetHeader
        filters={filters}
        onFiltersChange={setFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />
      <main className="flex-1 flex flex-col p-4 md:p-6 min-h-0">
        <PlansetDataTable
          onShowActivity={handleShowActivity}
          projects={processedProjects}
          headers={apiHeaders}
          loading={loading}
          error={error}
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
      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        notifications={
          selectedProject
            ? allNotificationsData.filter(
                (n) =>
                  n.projectId === parseInt(selectedProject.id.split("_")[1])
              )
            : []
        }
        projectInfo={{
          id: selectedProject?.id || "",
          customerName: selectedProject?.customer?.name || selectedProject?.projectDetails || "Unknown",
          company: "Axia", // Example company
        }}
      />
    </div>
  );
}
