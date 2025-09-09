export type SortState = { column: string; direction: 'asc' | 'desc' | 'none' };

export type ColumnConfig = {
  key: string;
  label: string;
  width?: number;
  visible?: boolean;
  sortable?: boolean;
  textMode?: 'wrap' | 'clip';
};

export type Project = {
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
  // Add dynamic button properties from your HTML
  show_accept_button?: boolean;
  show_assign_button?: boolean;
  show_hold_button?: boolean;
  show_activity_button?: boolean;
  show_cancel_button?: boolean;
  show_unhold_button?: boolean;
  show_prd_start_button?: boolean;
  show_prd_pause_button?: boolean;
  show_prd_complete_button?: boolean;
  show_send_revision_button?: boolean;
  show_delete_project_button?: boolean;
};

export type FilterState = {
  search: string;
  dateRange: { start: string; end: string };
  states: string[];
  clients: string[];
  jobTypes: string[];
  propertyTypes: string[];
  projectTypes: string[];
};
