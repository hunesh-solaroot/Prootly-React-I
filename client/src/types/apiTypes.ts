// API-driven dynamic header configuration
export interface ApiHeaderConfig {
  key: string;
  label: string;
  width?: string;
  minWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'status' | 'progress' | 'tags' | 'customer' | 'actions';
}

// API response structure for table data
export interface ApiTableResponse<T = any> {
  headers: ApiHeaderConfig[];
  data: T[];
  totalCount?: number;
  filters?: {
    available: string[];
    current: Record<string, any>;
  };
}

// Dynamic project data structure (flexible for any API response)
export interface DynamicProjectData {
  id: string;
  [key: string]: any; // Allow any additional fields from API
}

// Table configuration for different project types
export interface TableConfig {
  tableType: string;
  apiEndpoint?: string;
  defaultHeaders: ApiHeaderConfig[];
  defaultHiddenColumns?: string[];
}