import { useState, useEffect } from 'react';
import { Search, Edit, Activity, MoreHorizontal, Download, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';

// Types for project data
interface Project {
  id: string;
  customer: {
    name: string;
    address: string;
    initials: string;
    color: string;
  };
  projectDetails: string;
  keyDates: {
    created: string;
    received: string;
  };
  status: string;
  assignedTo?: string;
  countdown: string;
  autoComplete: string;
  priority?: string;
}

// Advanced table types
type SortDirection = 'asc' | 'desc' | null;
type FilterType = 'all' | 'IN PROGRESS' | 'READY FOR DESIGN';

interface TableFilters {
  status: FilterType;
  search: string;
  dateRange: {
    start: string;
    end: string;
  };
}

// Enhanced Responsive Header Component
function Header({ 
  filters, 
  onFiltersChange, 
  onExport
}: {
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters) => void;
  onExport: () => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Mobile Layout */}
      <div className="block lg:hidden p-4 space-y-4">
        {/* Top Row - Title and Export */}
        <div className="flex items-center justify-between">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors text-sm">
            <span>📍</span>
            <span>Planset</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onExport}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
        
        {/* Bottom Row - Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({
                ...filters,
                status: e.target.value as FilterType
              })}
              className="w-full px-3 py-2 rounded-md text-white font-medium border-none outline-none appearance-none cursor-pointer bg-green-600 hover:bg-green-700 transition-colors text-sm"
            >
              <option value="all">All Status</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="READY FOR DESIGN">Ready for Design</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => onFiltersChange({
                ...filters,
                search: e.target.value
              })}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors">
            <span>📍</span>
            <span>Planset</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({
                ...filters,
                status: e.target.value as FilterType
              })}
              className="px-3 py-2 rounded-md text-white font-medium border-none outline-none appearance-none cursor-pointer bg-green-600 hover:bg-green-700 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="READY FOR DESIGN">Ready for Design</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>

          {/* Export Button */}
          <button
            onClick={onExport}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Advanced Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search here..."
              value={filters.search}
              onChange={(e) => onFiltersChange({
                ...filters,
                search: e.target.value
              })}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Responsive Table Header Component
function TableHeader({ 
  sortField, 
  sortDirection, 
  onSort 
}: {
  sortField: string | null;
  sortDirection: SortDirection;
  onSort: (field: string) => void;
}) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 md:w-4 md:h-4 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-3 h-3 md:w-4 md:h-4" /> : 
      <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />;
  };

  const headerClass = "flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity min-w-0";

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:grid grid-cols-7 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
        <div className={headerClass} onClick={() => onSort('customer')}>
          <span>Customer Details</span>
          {getSortIcon('customer')}
        </div>
        <div className={headerClass} onClick={() => onSort('project')}>
          <span>Project Details</span>
          {getSortIcon('project')}
        </div>
        <div className={headerClass} onClick={() => onSort('created')}>
          <span>Key Dates</span>
          {getSortIcon('created')}
        </div>
        <div className={headerClass} onClick={() => onSort('status')}>
          <span>Status</span>
          {getSortIcon('status')}
        </div>
        <div className={headerClass} onClick={() => onSort('assigned')}>
          <span>Assigned To</span>
          {getSortIcon('assigned')}
        </div>
        <div className={headerClass} onClick={() => onSort('countdown')}>
          <span>Countdown</span>
          {getSortIcon('countdown')}
        </div>
        <div>Actions</div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden grid grid-cols-3 gap-2 p-3 border-b border-gray-200 dark:border-gray-700 text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
        <div className={headerClass} onClick={() => onSort('customer')}>
          <span>Customer</span>
          {getSortIcon('customer')}
        </div>
        <div className={headerClass} onClick={() => onSort('status')}>
          <span>Status</span>
          {getSortIcon('status')}
        </div>
        <div className="text-center">Actions</div>
      </div>
    </>
  );
}

// Enhanced Responsive Individual Row Component
function ProjectRow({ project }: { project: Project }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN PROGRESS':
        return 'bg-blue-500';
      case 'READY FOR DESIGN':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Desktop Row */}
      <div className="hidden lg:grid grid-cols-7 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
        {/* Customer Details */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: project.customer.color }}
          >
            {project.customer.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {project.customer.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {project.customer.address}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="text-gray-900 dark:text-gray-100 font-medium truncate">
          {project.projectDetails}
        </div>

        {/* Key Dates */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div><span className="font-medium">Created:</span> {project.keyDates.created}</div>
          <div><span className="font-medium">Received:</span> {project.keyDates.received}</div>
        </div>

        {/* Status */}
        <div className="flex flex-col space-y-1">
          <span className={`px-2 py-1 rounded text-xs font-medium w-fit text-white ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          {project.priority && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium w-fit">
              {project.priority}
            </span>
          )}
        </div>

        {/* Assigned To */}
        <div className="text-gray-500 dark:text-gray-400 italic truncate">
          {project.assignedTo || 'Not assigned'}
        </div>

        {/* Countdown */}
        <div className="text-sm">
          <div className="text-gray-900 dark:text-gray-100 font-medium">{project.countdown}</div>
          <div className="text-gray-500 dark:text-gray-400">{project.autoComplete}</div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
            Edit
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
            Activity
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Card */}
      <div className="lg:hidden border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <div className="grid grid-cols-3 gap-3 p-4">
          {/* Customer Info */}
          <div className="flex items-center space-x-2 col-span-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ backgroundColor: project.customer.color }}
            >
              {project.customer.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                {project.customer.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {project.customer.address}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col items-end space-y-1">
            <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            {project.priority && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                {project.priority}
              </span>
            )}
          </div>
        </div>
        
        {/* Project Details */}
        <div className="px-4 pb-2">
          <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
            {project.projectDetails}
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="px-4 pb-2 grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <div><span className="font-medium">Created:</span> {project.keyDates.created}</div>
            <div><span className="font-medium">Assigned:</span> {project.assignedTo || 'Not assigned'}</div>
          </div>
          <div>
            <div><span className="font-medium">Countdown:</span> {project.countdown}</div>
            <div className="text-gray-500 dark:text-gray-400">{project.autoComplete}</div>
          </div>
        </div>
        
        {/* Mobile Actions */}
        <div className="px-4 pb-4 flex justify-end space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors">
            Edit
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors">
            Activity
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors">
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>
      </div>
    </>
  );
}

// Enhanced Table Component
function Table({ 
  projects, 
  loading, 
  error, 
  sortField, 
  sortDirection, 
  onSort,
  pagination,
  onPageChange
}: { 
  projects: Project[]; 
  loading: boolean; 
  error: string | null;
  sortField: string | null;
  sortDirection: SortDirection;
  onSort: (field: string) => void;
  pagination: {
    current: number;
    total: number;
    size: number;
  };
  onPageChange: (page: number) => void;
}) {
  if (loading) {
    return (
      <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
        <TableHeader 
          sortField={sortField} 
          sortDirection={sortDirection} 
          onSort={onSort} 
        />
        <div className="p-8 text-center">
          <div className="text-gray-600 dark:text-gray-400">Loading projects...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
        <TableHeader 
          sortField={sortField} 
          sortDirection={sortDirection} 
          onSort={onSort} 
        />
        <div className="p-8 text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
      <TableHeader 
        sortField={sortField} 
        sortDirection={sortDirection} 
        onSort={onSort} 
      />
      <div>
        {projects.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            No projects found
          </div>
        ) : (
          projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))
        )}
      </div>
      
      {/* Responsive Pagination */}
      {pagination.total > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {/* Desktop Pagination */}
          <div className="hidden sm:flex items-center justify-between p-4">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Showing {((pagination.current - 1) * pagination.size) + 1} to{' '}
              {Math.min(pagination.current * pagination.size, projects.length)} of{' '}
              {projects.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {pagination.current} / {pagination.total}
              </span>
              <button
                onClick={() => onPageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.total}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {/* Mobile Pagination */}
          <div className="sm:hidden p-3">
            <div className="text-center text-gray-600 dark:text-gray-400 text-xs mb-3">
              {pagination.current} / {pagination.total} pages
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="flex-1 max-w-20 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Prev
              </button>
              <button
                onClick={() => onPageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.total}
                className="flex-1 max-w-20 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Enhanced New Projects Component
export default function NewProjects() {
  // State management
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Table controls
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState<TableFilters>({
    status: 'all',
    search: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  // Fetch function
  const fetchProjectsData = async () => {
    try {
      setLoading(true);
      // Try the external API first, fallback to local mock data
      let response;
      try {
        response = await fetch('http://localhost:8000/api/new-projects-data/');
      } catch (externalError) {
        // If external API fails, use local mock endpoint
        response = await fetch('/api/new-projects-data');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setAllProjects(data.projects);
        setFilteredProjects(data.projects);
      } else {
        setError('Failed to fetch projects data');
      }
    } catch (err) {
      setError((err as Error).message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sorting function
  const handleSort = (field: string) => {
    let newDirection: SortDirection = 'asc';
    
    if (sortField === field) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      }
    }
    
    setSortField(newDirection ? field : null);
    setSortDirection(newDirection);
  };

  // Filtering and sorting logic
  useEffect(() => {
    let filtered = [...allProjects];

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(project => 
        project.customer.name.toLowerCase().includes(searchTerm) ||
        project.customer.address.toLowerCase().includes(searchTerm) ||
        project.projectDetails.toLowerCase().includes(searchTerm) ||
        project.status.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case 'customer':
            aValue = a.customer.name;
            bValue = b.customer.name;
            break;
          case 'project':
            aValue = a.projectDetails;
            bValue = b.projectDetails;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'created':
            aValue = new Date(a.keyDates.created);
            bValue = new Date(b.keyDates.created);
            break;
          case 'assigned':
            aValue = a.assignedTo || '';
            bValue = b.assignedTo || '';
            break;
          case 'countdown':
            aValue = a.countdown;
            bValue = b.countdown;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allProjects, filters, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + pageSize);

  // Export function
  const handleExport = () => {
    const csvData = filteredProjects.map(project => ({
      'Customer Name': project.customer.name,
      'Customer Address': project.customer.address,
      'Project Details': project.projectDetails,
      'Created Date': project.keyDates.created,
      'Received Date': project.keyDates.received,
      'Status': project.status,
      'Assigned To': project.assignedTo || 'Not assigned',
      'Countdown': project.countdown,
      'Priority': project.priority || 'Normal'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projects-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Effect for data fetching
  useEffect(() => {
    fetchProjectsData();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">New Projects</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Manage all new project requests</p>
      </div>
      
      <Header 
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
      />
      
      <div className="overflow-hidden">
        <Table 
          projects={paginatedProjects}
          loading={loading}
          error={error}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            current: currentPage,
            total: totalPages,
            size: pageSize
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}