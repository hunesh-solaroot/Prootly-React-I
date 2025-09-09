export interface SortConfig {
  key: keyof IPlanset | 'customer' | 'created' | null;
  direction: 'asc' | 'desc';
}

export interface TableFilters {
  search: string;
  states: Set<string>;
  portals: Set<string>;
  customerType: 'all' | 'Residential' | 'Commercial';
  dateRange: {
    from: Date | null;
    to: Date | null;
    preset: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom' | null;
  };
}

export type TextMode = 'wrap' | 'clip';

export type ColumnTextModes = {
  customer: TextMode | null;
  projectDetails: TextMode | null;
  keyDates: TextMode | null;
  status: TextMode | null;
  assignedTo: TextMode | null;
  countdown: TextMode | null;
  budget: TextMode | null;
  estimatedHours: TextMode | null;
  actualHours: TextMode | null;
  progress: TextMode | null;
  tags: TextMode | null;
  notes: TextMode | null;
};

export interface HeaderConfig {
  key: string;
  label: string;
  type: string;
  sortable: boolean;
  width: string;
}

// Import IPlanset from shared types
import type { IPlanset } from '@shared/types';