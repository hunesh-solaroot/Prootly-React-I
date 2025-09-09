export interface EmployeeProfile {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  designation: string;
  email: string;
  contactNumber: string;
  joiningDate: Date;
  profilePicture: string | null;
  performanceScore: number;
  location: string;
  workSchedule: string;
  reportingManager: string;
  teamSize: number;
  projectsCompleted: number;
  gender?: string;
  dateOfBirth?: Date;
  skills?: string[];
  bio?: string;
}

export interface AttendanceData {
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkIn?: string;
  checkOut?: string;
}

export interface LeaveRecord {
  id: string;
  type: 'sick' | 'vacation' | 'personal' | 'emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  status: 'approved' | 'pending' | 'rejected';
  reason: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url: string;
}

export interface PerformanceData {
  month: string;
  score: number;
  goals: number;
  feedback?: string;
}

export interface ProjectInvolvement {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  progress: number;
  startDate: Date;
  endDate: Date;
  role: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WorkingHours {
  week: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  efficiency: number;
}

export interface KPIData {
  metric: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'certification' | 'award' | 'milestone' | 'training';
  issuer?: string;
  badge?: string;
}

export interface LeaveSummary {
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  casualLeaves: number;
  sickLeaves: number;
  annualLeaves: number;
}
export interface IPlanset {
  id: string;
  customer: {
    name: string;
    type: 'Residential' | 'Commercial';
    address: string;
    state: string;
    initials: string;
    color: string;
  };
  projectDetails: string;
  keyDates: {
    created: string;
    received: string;
  };
  status: 'IN PROGRESS' | 'READY FOR DESIGN' | 'COMPLETED' | 'ON HOLD';
  assignedTo?: string;
  countdown: string;
  autoComplete: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  budget?: number;
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  tags?: string[];
  notes?: string;
  portal?: string;
}

export interface SortConfig {
  key: string | null; // Changed to string for dynamic API-driven headers
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