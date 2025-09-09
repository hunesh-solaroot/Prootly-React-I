import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

// Add notification animation styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "@/components/planset/PlansetHeader";
import { useColumnResize } from "../hooks/useColumnResize"; // Assuming you saved the hook in 'src/hooks/'
import { DateRangeFilterNew } from "../components/ui/DateRangeFilterNew";
import {
  AddColumnModal,
  AvailableColumn,
} from "../components/modals/AddColumnModal";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Edit,
  Eye,
  Archive,
  Trash2,
  X,
  RotateCcw,
  SortAsc,
  Calendar as CalendarIcon,
  SortDesc,
  Grid3X3,
  ArrowUpDown,
  WrapText,
  Scissors,
  EyeOff,
  XCircle,
  RefreshCw,
  Columns,
  Filter,
  Type,
  ScanLine,
  Plus,
} from "lucide-react";

// Types
interface TeamMember {
  id: number;
  companyName: string;
  name: string;
  position: string;
  mobile: string;
  email: string;
  avatar: string;
  avatarColor: string;
  profileImage: string | null;
  hasImage: boolean;
  fresh: number;
  revision: number;
  completed: number;
  total: number;
  status: string;
  teamLeadId: string;
}

interface SortConfig {
  key: string | null;
  direction: "asc" | "desc";
}

interface TableHeader {
  key: string;
  label: string;
  type: string;
  sortable: boolean;
  filterable: boolean;
  custom?: boolean;
  minWidth?: number;
  resizable?: boolean;
}

interface FilterState {
  dateRange: {
    from: Date | null;
    to: Date | null;
    preset: "today" | "week" | "month" | "quarter" | "year" | "custom" | null;
  };
  teamLeads: string[];
  roles: string[];
  performance: string[];
}

interface TeamTableFilters {
  search: string;
  states: Set<string>;
  portals: Set<string>;
  customerType: "all" | "Residential" | "Commercial";
  dateRange: {
    from: Date | null;
    to: Date | null;
    preset: "today" | "week" | "month" | "quarter" | "year" | "custom" | null;
  };
}

interface Project {
  id: number;
  customerName: string;
  customerType: string;
  address: string;
  projectType: string;
  createdDate: string;
  receivedDate: string;
  status: string;
  statusType: string;
  priority: string;
  assignedTo: string;
}
type TextMode = "wrap" | "clip" | null;

interface ColumnTextModes {
  [key: string]: TextMode;
}

// Storage keys
const COLUMN_WIDTHS_KEY = "team_table_column_widths";
const TEXT_MODES_KEY = "team_table_text_modes";
const HIDDEN_COLUMNS_KEY = "team_table_hidden_columns";

// Sample data
const sampleTeamMembers: TeamMember[] = [
  {
    id: 1,
    companyName: "PATS Electric and Solar",
    name: "Taylor Majeed",
    position: "Regional Operations Manager",
    mobile: "(209) 675-0984",
    email: "t.majeedpatssolar@gmail.com",
    avatar: "T",
    avatarColor: "bg-purple-500",
    profileImage: null,
    hasImage: false,
    fresh: 42,
    revision: 3,
    completed: 39,
    total: 45,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 2,
    companyName: "Momentum Solar",
    name: "Momentum Solar",
    position: "Admin",
    mobile: "(594) 959-5944",
    email: "momentumsolar@prootly.com",
    avatar: "M",
    avatarColor: "bg-orange-500",
    profileImage: null,
    hasImage: false,
    fresh: 28,
    revision: 1,
    completed: 27,
    total: 29,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 3,
    companyName: "Lux Solar Energy INC",
    name: "Lux Solar Energy",
    position: "Admin",
    mobile: "(464) 646-4646",
    email: "luxsolar@prootly.com",
    avatar: "L",
    avatarColor: "bg-blue-500",
    profileImage: null,
    hasImage: false,
    fresh: 35,
    revision: 2,
    completed: 33,
    total: 37,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 4,
    companyName: "Soluna",
    name: "William Sanchez",
    position: "Founder",
    mobile: "(816) 288-3072",
    email: "livesoluna@gmail.com",
    avatar: "W",
    avatarColor: "bg-red-500",
    profileImage: null,
    hasImage: false,
    fresh: 18,
    revision: 5,
    completed: 13,
    total: 23,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 5,
    companyName: "FOREVER SOLAR",
    name: "FOREVER SOLAR",
    position: "Admin",
    mobile: "(714) 493-9920",
    email: "foreversolar@prootly.com",
    avatar: "F",
    avatarColor: "bg-teal-500",
    profileImage: null,
    hasImage: false,
    fresh: 51,
    revision: 0,
    completed: 51,
    total: 51,
    status: "active",
    teamLeadId: "lead3",
  },
  {
    id: 6,
    companyName: "PATS Electric and Solar",
    name: "Taylor Majeed",
    position: "Regional Operations Manager",
    mobile: "(209) 675-0984",
    email: "t.majeedpatssolar@gmail.com",
    avatar: "T",
    avatarColor: "bg-purple-500",
    profileImage: null,
    hasImage: false,
    fresh: 42,
    revision: 3,
    completed: 39,
    total: 45,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 7,
    companyName: "Momentum Solar",
    name: "Momentum Solar",
    position: "Admin",
    mobile: "(594) 959-5944",
    email: "momentumsolar@prootly.com",
    avatar: "M",
    avatarColor: "bg-orange-500",
    profileImage: null,
    hasImage: false,
    fresh: 28,
    revision: 1,
    completed: 27,
    total: 29,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 8,
    companyName: "Lux Solar Energy INC",
    name: "Lux Solar Energy",
    position: "Admin",
    mobile: "(464) 646-4646",
    email: "luxsolar@prootly.com",
    avatar: "L",
    avatarColor: "bg-blue-500",
    profileImage: null,
    hasImage: false,
    fresh: 35,
    revision: 2,
    completed: 33,
    total: 37,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 9,
    companyName: "Soluna",
    name: "William Sanchez",
    position: "Founder",
    mobile: "(816) 288-3072",
    email: "livesoluna@gmail.com",
    avatar: "W",
    avatarColor: "bg-red-500",
    profileImage: null,
    hasImage: false,
    fresh: 18,
    revision: 5,
    completed: 13,
    total: 23,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 10,
    companyName: "FOREVER SOLAR",
    name: "FOREVER SOLAR",
    position: "Admin",
    mobile: "(714) 493-9920",
    email: "foreversolar@prootly.com",
    avatar: "F",
    avatarColor: "bg-teal-500",
    profileImage: null,
    hasImage: false,
    fresh: 51,
    revision: 0,
    completed: 51,
    total: 51,
    status: "active",
    teamLeadId: "lead3",
  },
  {
    id: 11,
    companyName: "PATS Electric and Solar",
    name: "Taylor Majeed",
    position: "Regional Operations Manager",
    mobile: "(209) 675-0984",
    email: "t.majeedpatssolar@gmail.com",
    avatar: "T",
    avatarColor: "bg-purple-500",
    profileImage: null,
    hasImage: false,
    fresh: 42,
    revision: 3,
    completed: 39,
    total: 45,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 12,
    companyName: "Momentum Solar",
    name: "Momentum Solar",
    position: "Admin",
    mobile: "(594) 959-5944",
    email: "momentumsolar@prootly.com",
    avatar: "M",
    avatarColor: "bg-orange-500",
    profileImage: null,
    hasImage: false,
    fresh: 28,
    revision: 1,
    completed: 27,
    total: 29,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 13,
    companyName: "Lux Solar Energy INC",
    name: "Lux Solar Energy",
    position: "Admin",
    mobile: "(464) 646-4646",
    email: "luxsolar@prootly.com",
    avatar: "L",
    avatarColor: "bg-blue-500",
    profileImage: null,
    hasImage: false,
    fresh: 35,
    revision: 2,
    completed: 33,
    total: 37,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 14,
    companyName: "Soluna",
    name: "William Sanchez",
    position: "Founder",
    mobile: "(816) 288-3072",
    email: "livesoluna@gmail.com",
    avatar: "W",
    avatarColor: "bg-red-500",
    profileImage: null,
    hasImage: false,
    fresh: 18,
    revision: 5,
    completed: 13,
    total: 23,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 15,
    companyName: "FOREVER SOLAR",
    name: "FOREVER SOLAR",
    position: "Admin",
    mobile: "(714) 493-9920",
    email: "foreversolar@prootly.com",
    avatar: "F",
    avatarColor: "bg-teal-500",
    profileImage: null,
    hasImage: false,
    fresh: 51,
    revision: 0,
    completed: 51,
    total: 51,
    status: "active",
    teamLeadId: "lead3",
  },
  {
    id: 16,
    companyName: "PATS Electric and Solar",
    name: "Taylor Majeed",
    position: "Regional Operations Manager",
    mobile: "(209) 675-0984",
    email: "t.majeedpatssolar@gmail.com",
    avatar: "T",
    avatarColor: "bg-purple-500",
    profileImage: null,
    hasImage: false,
    fresh: 42,
    revision: 3,
    completed: 39,
    total: 45,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 17,
    companyName: "Momentum Solar",
    name: "Momentum Solar",
    position: "Admin",
    mobile: "(594) 959-5944",
    email: "momentumsolar@prootly.com",
    avatar: "M",
    avatarColor: "bg-orange-500",
    profileImage: null,
    hasImage: false,
    fresh: 28,
    revision: 1,
    completed: 27,
    total: 29,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 18,
    companyName: "Lux Solar Energy INC",
    name: "Lux Solar Energy",
    position: "Admin",
    mobile: "(464) 646-4646",
    email: "luxsolar@prootly.com",
    avatar: "L",
    avatarColor: "bg-blue-500",
    profileImage: null,
    hasImage: false,
    fresh: 35,
    revision: 2,
    completed: 33,
    total: 37,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 19,
    companyName: "Soluna",
    name: "William Sanchez",
    position: "Founder",
    mobile: "(816) 288-3072",
    email: "livesoluna@gmail.com",
    avatar: "W",
    avatarColor: "bg-red-500",
    profileImage: null,
    hasImage: false,
    fresh: 18,
    revision: 5,
    completed: 13,
    total: 23,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 20,
    companyName: "FOREVER SOLAR",
    name: "FOREVER SOLAR",
    position: "Admin",
    mobile: "(714) 493-9920",
    email: "foreversolar@prootly.com",
    avatar: "F",
    avatarColor: "bg-teal-500",
    profileImage: null,
    hasImage: false,
    fresh: 51,
    revision: 0,
    completed: 51,
    total: 51,
    status: "active",
    teamLeadId: "lead3",
  },
  {
    id: 21,
    companyName: "PATS Electric and Solar",
    name: "Taylor Majeed",
    position: "Regional Operations Manager",
    mobile: "(209) 675-0984",
    email: "t.majeedpatssolar@gmail.com",
    avatar: "T",
    avatarColor: "bg-purple-500",
    profileImage: null,
    hasImage: false,
    fresh: 42,
    revision: 3,
    completed: 39,
    total: 45,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 22,
    companyName: "Momentum Solar",
    name: "Momentum Solar",
    position: "Admin",
    mobile: "(594) 959-5944",
    email: "momentumsolar@prootly.com",
    avatar: "M",
    avatarColor: "bg-orange-500",
    profileImage: null,
    hasImage: false,
    fresh: 28,
    revision: 1,
    completed: 27,
    total: 29,
    status: "active",
    teamLeadId: "lead1",
  },
  {
    id: 23,
    companyName: "Lux Solar Energy INC",
    name: "Lux Solar Energy",
    position: "Admin",
    mobile: "(464) 646-4646",
    email: "luxsolar@prootly.com",
    avatar: "L",
    avatarColor: "bg-blue-500",
    profileImage: null,
    hasImage: false,
    fresh: 35,
    revision: 2,
    completed: 33,
    total: 37,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 24,
    companyName: "Soluna",
    name: "William Sanchez",
    position: "Founder",
    mobile: "(816) 288-3072",
    email: "livesoluna@gmail.com",
    avatar: "W",
    avatarColor: "bg-red-500",
    profileImage: null,
    hasImage: false,
    fresh: 18,
    revision: 5,
    completed: 13,
    total: 23,
    status: "active",
    teamLeadId: "lead2",
  },
  {
    id: 25,
    companyName: "FOREVER SOLAR",
    name: "FOREVER SOLAR",
    position: "Admin",
    mobile: "(714) 493-9920",
    email: "foreversolar@prootly.com",
    avatar: "F",
    avatarColor: "bg-teal-500",
    profileImage: null,
    hasImage: false,
    fresh: 51,
    revision: 0,
    completed: 51,
    total: 51,
    status: "active",
    teamLeadId: "lead3",
  },
];

const sampleProjects: Project[] = [
  {
    id: 1,
    customerName: "John Smith",
    customerType: "Residential",
    address: "123 Main St, Los Angeles, CA",
    projectType: "Solar Installation",
    createdDate: "2024-08-01T10:30:00Z",
    receivedDate: "2024-08-01T14:20:00Z",
    status: "In Progress",
    statusType: "in-progress",
    priority: "High",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 2,
    customerName: "Sarah Johnson",
    customerType: "Commercial",
    address: "456 Business Ave, San Diego, CA",
    projectType: "Roof Mount System",
    createdDate: "2024-08-02T09:15:00Z",
    receivedDate: "2024-08-02T11:30:00Z",
    status: "Review",
    statusType: "review",
    priority: "Normal",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 3,
    customerName: "John Smith",
    customerType: "Residential",
    address: "123 Main St, Los Angeles, CA",
    projectType: "Solar Installation",
    createdDate: "2024-08-01T10:30:00Z",
    receivedDate: "2024-08-01T14:20:00Z",
    status: "In Progress",
    statusType: "in-progress",
    priority: "High",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 4,
    customerName: "Sarah Johnson",
    customerType: "Commercial",
    address: "456 Business Ave, San Diego, CA",
    projectType: "Roof Mount System",
    createdDate: "2024-08-02T09:15:00Z",
    receivedDate: "2024-08-02T11:30:00Z",
    status: "Review",
    statusType: "review",
    priority: "Normal",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 5,
    customerName: "John Smith",
    customerType: "Residential",
    address: "123 Main St, Los Angeles, CA",
    projectType: "Solar Installation",
    createdDate: "2024-08-01T10:30:00Z",
    receivedDate: "2024-08-01T14:20:00Z",
    status: "In Progress",
    statusType: "in-progress",
    priority: "High",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 6,
    customerName: "Sarah Johnson",
    customerType: "Commercial",
    address: "456 Business Ave, San Diego, CA",
    projectType: "Roof Mount System",
    createdDate: "2024-08-02T09:15:00Z",
    receivedDate: "2024-08-02T11:30:00Z",
    status: "Review",
    statusType: "review",
    priority: "Normal",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 7,
    customerName: "John Smith",
    customerType: "Residential",
    address: "123 Main St, Los Angeles, CA",
    projectType: "Solar Installation",
    createdDate: "2024-08-01T10:30:00Z",
    receivedDate: "2024-08-01T14:20:00Z",
    status: "In Progress",
    statusType: "in-progress",
    priority: "High",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 8,
    customerName: "Sarah Johnson",
    customerType: "Commercial",
    address: "456 Business Ave, San Diego, CA",
    projectType: "Roof Mount System",
    createdDate: "2024-08-02T09:15:00Z",
    receivedDate: "2024-08-02T11:30:00Z",
    status: "Review",
    statusType: "review",
    priority: "Normal",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 9,
    customerName: "John Smith",
    customerType: "Residential",
    address: "123 Main St, Los Angeles, CA",
    projectType: "Solar Installation",
    createdDate: "2024-08-01T10:30:00Z",
    receivedDate: "2024-08-01T14:20:00Z",
    status: "In Progress",
    statusType: "in-progress",
    priority: "High",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 10,
    customerName: "Sarah Johnson",
    customerType: "Commercial",
    address: "456 Business Ave, San Diego, CA",
    projectType: "Roof Mount System",
    createdDate: "2024-08-02T09:15:00Z",
    receivedDate: "2024-08-02T11:30:00Z",
    status: "Review",
    statusType: "review",
    priority: "Normal",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 11,
    customerName: "John Smith",
    customerType: "Residential",
    address: "123 Main St, Los Angeles, CA",
    projectType: "Solar Installation",
    createdDate: "2024-08-01T10:30:00Z",
    receivedDate: "2024-08-01T14:20:00Z",
    status: "In Progress",
    statusType: "in-progress",
    priority: "High",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 12,
    customerName: "Sarah Johnson",
    customerType: "Commercial",
    address: "456 Business Ave, San Diego, CA",
    projectType: "Roof Mount System",
    createdDate: "2024-08-02T09:15:00Z",
    receivedDate: "2024-08-02T11:30:00Z",
    status: "Review",
    statusType: "review",
    priority: "Normal",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 13,
    customerName: "John Smith",
    customerType: "Residential",
    address: "123 Main St, Los Angeles, CA",
    projectType: "Solar Installation",
    createdDate: "2024-08-01T10:30:00Z",
    receivedDate: "2024-08-01T14:20:00Z",
    status: "In Progress",
    statusType: "in-progress",
    priority: "High",
    assignedTo: "Taylor Majeed",
  },
  {
    id: 14,
    customerName: "Sarah Johnson",
    customerType: "Commercial",
    address: "456 Business Ave, San Diego, CA",
    projectType: "Roof Mount System",
    createdDate: "2024-08-02T09:15:00Z",
    receivedDate: "2024-08-02T11:30:00Z",
    status: "Review",
    statusType: "review",
    priority: "Normal",
    assignedTo: "Taylor Majeed",
  },
];

const defaultHeaders: TableHeader[] = [
  {
    key: "name",
    label: "Team Member",
    type: "member",
    sortable: true,
    filterable: true,
    resizable: true,
    minWidth: 200,
  },
  {
    key: "role",
    label: "Role",
    type: "role-badge",
    sortable: true,
    filterable: true,
    resizable: true,
    minWidth: 100,
  },
  {
    key: "fresh",
    label: "Fresh",
    type: "count",
    sortable: true,
    filterable: true,
    resizable: true,
    minWidth: 80,
  },
  {
    key: "revision",
    label: "Revision",
    type: "count",
    sortable: true,
    filterable: true,
    resizable: true,
    minWidth: 80,
  },
  {
    key: "completed",
    label: "Completed",
    type: "count",
    sortable: true,
    filterable: true,
    resizable: true,
    minWidth: 80,
  },
  {
    key: "total",
    label: "Total",
    type: "count",
    sortable: true,
    filterable: false,
    resizable: true,
    minWidth: 80,
  },
  {
    key: "actions",
    label: "Actions",
    type: "actions",
    sortable: false,
    filterable: false,
    resizable: true,
    minWidth: 120,
  },
];

const StatsCard: React.FC<{
  title: string;
  value: number;
  onClick?: () => void;
}> = ({ title, value, onClick }) => (
  <div
    className="bg-white p-2 rounded-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-green-500 text-center flex-1"
    onClick={onClick}
  >
    <div className="text-base font-bold text-green-500 mb-0.5">{value}</div>
    <div className="text-gray-600 text-xs font-medium leading-tight whitespace-nowrap">
      {title}
    </div>
  </div>
);

const MultiSelectDropdown: React.FC<{
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  icon?: React.ReactNode;
}> = ({ label, options, selected, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const displayText =
    selected.length === 0
      ? label
      : selected.length === 1
      ? options.find((opt) => opt.value === selected[0])?.label || label
      : `${selected.length} selected`;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {icon}
        <div className="multi-select-container">
          <div
            className="multi-select-trigger flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-full text-sm bg-white min-w-[140px] cursor-pointer hover:border-green-500 hover:shadow-sm transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`flex-1 text-left ${
                selected.length === 0 ? "text-gray-500" : "text-gray-700"
              }`}
            >
              {displayText}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[99999] max-h-48 overflow-y-auto">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => handleToggle(option.value)}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  projects: Project[];
}> = ({ isOpen, onClose, memberName, projects }) => {
  if (!isOpen) return null;

  const getStatusBadgeClass = (statusType: string) => {
    const classes = {
      "in-progress": "bg-orange-100 text-orange-800",
      review: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      pending: "bg-purple-100 text-purple-800",
      revision: "bg-red-100 text-red-800",
    };
    return (
      classes[statusType as keyof typeof classes] || "bg-gray-100 text-gray-800"
    );
  };

  const getPriorityBadgeClass = (priority: string) => {
    const classes = {
      high: "bg-red-100 text-red-800",
      normal: "bg-green-100 text-green-800",
      low: "bg-purple-100 text-purple-800",
      expedite: "bg-orange-100 text-orange-800",
    };
    return (
      classes[priority.toLowerCase() as keyof typeof classes] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[95vw] max-w-6xl max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="font-semibold">{memberName.charAt(0)}</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{memberName} Projects</h2>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                {projects.length}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-0 bg-gray-50 flex-1">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Project Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Key Dates
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                            {project.customerName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {project.customerName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {project.customerType}
                            </div>
                            <div className="text-xs text-gray-500">
                              {project.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900">
                          {project.projectType}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-600">
                              Created:
                            </span>
                            <span className="text-gray-900">
                              {new Date(
                                project.createdDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-600">
                              Received:
                            </span>
                            <span className="text-gray-900">
                              {new Date(
                                project.receivedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                              project.statusType
                            )}`}
                          >
                            {project.status}
                          </span>
                          <br />
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(
                              project.priority
                            )}`}
                          >
                            {project.priority}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamSidebar: React.FC<{
  selectedLead: string;
  onLeadChange: (leadId: string) => void;
}> = ({ selectedLead, onLeadChange }) => {
  const teamLeads = [
    { id: "lead1", name: "Shivam Kumar", avatar: "S", color: "bg-green-500" },
    {
      id: "lead2",
      name: "Abhishek Thukral",
      avatar: "A",
      color: "bg-purple-500",
    },
    { id: "lead3", name: "Arshad Malik", avatar: "A", color: "bg-cyan-500" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border h-fit">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Team Lead</h3>

      <div className="space-y-2">
        {teamLeads.map((lead) => (
          <div
            key={lead.id}
            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
              selectedLead === lead.id
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onLeadChange(lead.id)}
          >
            <div
              className={`w-12 h-12 ${lead.color} rounded-lg flex items-center justify-center text-white font-semibold text-lg`}
            >
              {lead.avatar}
            </div>
            <div>
              <h4 className="font-semibold">{lead.name}</h4>
              <p
                className={`text-sm ${
                  selectedLead === lead.id
                    ? "text-white opacity-80"
                    : "text-gray-600"
                }`}
              >
                @mail
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
const TeamPerformanceDashboard: React.FC = () => {
  const [teamMembers] = useState<TeamMember[]>(sampleTeamMembers);
  const [filteredMembers, setFilteredMembers] =
    useState<TeamMember[]>(sampleTeamMembers);
  const [headers, setHeaders] = useState<TableHeader[]>(defaultHeaders);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: null, to: null, preset: null },
    teamLeads: [],
    roles: [],
    performance: [],
  });

  // Enhanced table features
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [columnTextModes, setColumnTextModes] = useState<ColumnTextModes>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Keep original states
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedLead, setSelectedLead] = useState("lead1");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

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

  const allAvailableColumns: AvailableColumn[] = [
    {
      key: "email",
      label: "Email",
      description: "Team member's email address",
    },
    {
      key: "phone",
      label: "Phone Number",
      description: "Contact phone number",
    },
    {
      key: "department",
      label: "Department",
      description: "Team member's department",
    },
    {
      key: "joinDate",
      label: "Join Date",
      description: "Date when the team member joined",
    },
    {
      key: "lastActive",
      label: "Last Active",
      description: "Last activity timestamp",
    },
    {
      key: "efficiency",
      label: "Efficiency %",
      description: "Performance efficiency percentage",
    },
    {
      key: "workload",
      label: "Current Workload",
      description: "Current number of assigned tasks",
    },
    {
      key: "teamLead",
      label: "Team Lead",
      description: "Assigned team lead",
    },
    {
      key: "location",
      label: "Location",
      description: "Team member's work location",
    },
    {
      key: "notes",
      label: "Notes",
      description: "Additional notes and comments",
    },
  ];
  const columnsForModal = useMemo(() => {
    const currentHeaderKeys = new Set(headers.map((h) => h.key));
    return allAvailableColumns.filter((col) => !currentHeaderKeys.has(col.key));
  }, [headers]);
  // Function to handle opening the add column modal
  const onAddColumn = () => {
    setIsAddColumnModalOpen(true);
  };

  // Function to handle adding the selected columns
  const handleAddColumns = (selectedKeys: string[]) => {
    const columnsToAdd = allAvailableColumns.filter((col) =>
      selectedKeys.includes(col.key)
    );

    // Find the index of the actions column to insert new columns before it
    const actionsIndex = headers.findIndex(
      (header) => header.key === "actions"
    );
    const insertIndex = actionsIndex !== -1 ? actionsIndex : headers.length;

    // Create new header objects for the selected columns
    const newColumnHeaders: TableHeader[] = columnsToAdd.map((col) => ({
      key: col.key,
      label: col.label,
      type: "text", // default type for new columns
      sortable: true,
      filterable: true,
      custom: true,
      resizable: true,
      minWidth: 120,
    }));

    // Insert new columns before the actions column
    const newHeaders = [
      ...headers.slice(0, insertIndex),
      ...newColumnHeaders,
      ...headers.slice(insertIndex),
    ];

    // Update the headers state
    setHeaders(newHeaders);

    // Show success notification
    showNotification(
      "✅ Columns Added",
      `Successfully added ${selectedKeys.length} column${
        selectedKeys.length > 1 ? "s" : ""
      } to the table.`,
      "success"
    );
  };

  // Column resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizeData, setResizeData] = useState<{
    columnIndex: number;
    startX: number;
    startWidth: number;
    tableWidth: number;
  } | null>(null);
  const [savedColumnWidths, setSavedColumnWidths] = useState<{
    [key: string]: string;
  }>({});

  const tableRef = useRef<HTMLTableElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);

  const visibleHeaders = headers.filter((h) => !hiddenColumns.has(h.key));

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    (filters.dateRange.from && filters.dateRange.to) ||
    filters.roles.length > 0 ||
    filters.performance.length > 0 ||
    filters.teamLeads.length > 0;

  // Load saved settings
  useEffect(() => {
    try {
      const savedWidths = localStorage.getItem(COLUMN_WIDTHS_KEY);
      if (savedWidths) {
        setSavedColumnWidths(JSON.parse(savedWidths));
      }
      const savedTextModes = localStorage.getItem(TEXT_MODES_KEY);
      if (savedTextModes) {
        setColumnTextModes(JSON.parse(savedTextModes));
      }
      const savedHiddenColumns = localStorage.getItem(HIDDEN_COLUMNS_KEY);
      if (savedHiddenColumns) {
        setHiddenColumns(new Set(JSON.parse(savedHiddenColumns)));
      }
    } catch (error) {
      console.warn("Failed to load table settings from localStorage:", error);
    }
  }, []);

  // Save settings to localStorage
  const saveToLocalStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
    }
  }, []);

  // Column width management
  const getColumnWidth = useCallback(
    (index: number): string => {
      const savedKey = `col_${index}`;
      if (savedColumnWidths[savedKey]) {
        return savedColumnWidths[savedKey];
      }
      const defaultWidths = ["30%", "15%", "10%", "10%", "10%", "10%", "15%"];
      
      // Ensure Actions column (last column) has minimum width
      if (index === visibleHeaders.length - 1 && visibleHeaders[index]?.key === 'actions') {
        return "140px";
      }
      
      return defaultWidths[index] || "10%";
    },
    [savedColumnWidths, visibleHeaders]
  );

  const saveColumnWidth = useCallback(
    (columnIndex: number, width: string) => {
      const key = `col_${columnIndex}`;
      const newWidths = { ...savedColumnWidths, [key]: width };
      setSavedColumnWidths(newWidths);
      saveToLocalStorage(COLUMN_WIDTHS_KEY, newWidths);
      updateBothTablesColumnWidth(columnIndex, width);
    },
    [savedColumnWidths, saveToLocalStorage]
  );

  const updateBothTablesColumnWidth = useCallback(
    (columnIndex: number, width: string) => {
      const bodyColgroup = tableRef.current?.querySelector("colgroup");
      if (bodyColgroup?.children[columnIndex]) {
        (bodyColgroup.children[columnIndex] as HTMLElement).style.width = width;
      }
    },
    []
  );

  // Resize functionality
  const handleResizeStart = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!tableRef.current) return;

      const tableRect = tableRef.current.getBoundingClientRect();
      const currentWidth = parseFloat(getColumnWidth(index));
      const currentPixelWidth = (currentWidth / 100) * tableRect.width;

      setIsResizing(true);
      setResizeData({
        columnIndex: index,
        startX: event.clientX,
        startWidth: currentPixelWidth,
        tableWidth: tableRect.width,
      });
    },
    [getColumnWidth]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing || !resizeData || !tableRef.current) return;

      const deltaX = event.clientX - resizeData.startX;
      const newPixelWidth = Math.max(
        visibleHeaders[resizeData.columnIndex]?.minWidth || 50,
        resizeData.startWidth + deltaX
      );
      const newPercentWidth = (newPixelWidth / resizeData.tableWidth) * 100;
      const clampedWidth = Math.max(5, Math.min(50, newPercentWidth));
      const newWidth = `${clampedWidth}%`;

      saveColumnWidth(resizeData.columnIndex, newWidth);
    },
    [isResizing, resizeData, visibleHeaders, saveColumnWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeData(null);
  }, []);

  // Sync scroll between header and body
  const syncScroll = (
    source: HTMLDivElement,
    target: React.RefObject<HTMLDivElement>
  ) => {
    if (target.current && source !== target.current) {
      target.current.scrollLeft = source.scrollLeft;
    }
  };

  // Mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Text mode management
  const handleTextModeChange = useCallback(
    (column: string, mode: TextMode) => {
      const newTextModes = { ...columnTextModes, [column]: mode };
      setColumnTextModes(newTextModes);
      saveToLocalStorage(TEXT_MODES_KEY, newTextModes);
    },
    [columnTextModes, saveToLocalStorage]
  );

  // Column visibility
  const handleHideColumn = useCallback(
    (key: string) => {
      const newHiddenColumns = new Set(hiddenColumns);
      newHiddenColumns.add(key);
      setHiddenColumns(newHiddenColumns);
      saveToLocalStorage(HIDDEN_COLUMNS_KEY, Array.from(newHiddenColumns));
    },
    [hiddenColumns, saveToLocalStorage]
  );

  const handleShowAllColumns = useCallback(() => {
    setHiddenColumns(new Set());
    saveToLocalStorage(HIDDEN_COLUMNS_KEY, []);
  }, [saveToLocalStorage]);

  // Enhanced sortable header component
  const SortableHeader = ({
    label,
    field,
    className = "",
    index,
    header,
  }: {
    label: string;
    field: string;
    className?: string;
    index: number;
    header: TableHeader;
  }) => {
    const isSorting = sortConfig.key === field;
    const Icon = isSorting
      ? sortConfig.direction === "asc"
        ? ChevronUp
        : ChevronDown
      : ArrowUpDown;
    const isFilterActive =
      columnTextModes[field] !== null && columnTextModes[field] !== undefined;
    const currentTextMode = columnTextModes[field];

    return (
      <th
        className={`column-header ${
          header.sortable ? "sortable" : ""
        } hover:bg-gray-50 transition-colors duration-150 py-3 text-left text-sm font-medium text-gray-600 relative group ${className}`}
        style={{ width: getColumnWidth(index) }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1 group cursor-pointer"
            onClick={() => header.sortable && handleSort(field)}
          >
            <span>{label}</span>
            {header.sortable && (
              <Icon
                className={`w-4 h-4 transition-colors duration-150 sort-indicator ${
                  isSorting ? "active" : ""
                }`}
              />
            )}
          </div>

          {field === "actions" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-gray-100 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white rounded-full transition-all duration-300"
                  title="Table Reset Options"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[260px] p-0 rounded-2xl" align="end">
                <div>
                  <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-t-2xl flex items-center">
                    <span className="flex items-center gap-3">
                      <RotateCcw className="h-4 w-4" />
                      TABLE RESET OPTIONS
                    </span>
                  </div>
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                      onClick={() => handleReset("everything")}
                    >
                      <RefreshCw className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">Reset Everything</div>
                        <div className="text-gray-500 text-xs">
                          Restore all default settings
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                      onClick={() => handleReset("columns")}
                    >
                      <Columns className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">Reset Column Widths</div>
                        <div className="text-gray-500 text-xs">
                          Restore default column sizes
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                      onClick={() => handleReset("auto-fit")}
                    >
                      <ScanLine className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">Auto-Fit Columns</div>
                        <div className="text-gray-500 text-xs">
                          Automatically size columns to content
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                      onClick={() => handleReset("custom-columns")}
                    >
                      <Columns className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">Reset Custom Columns</div>
                        <div className="text-gray-500 text-xs">
                          Remove all custom added columns
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                      onClick={() => handleReset("filters")}
                    >
                      <Filter className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">
                          Clear Filters & Sorting
                        </div>
                        <div className="text-gray-500 text-xs">
                          Remove all filters and sorts
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal text-xs px-4 py-5 border-b border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
                      onClick={() => handleReset("textmode")}
                    >
                      <Type className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">Reset Text Mode</div>
                        <div className="text-gray-500 text-xs">
                          Clear wrap/clip text settings
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal text-xs px-4 py-5 rounded-none hover:bg-gray-50 transition-colors"
                      onClick={() => handleReset("showall")}
                    >
                      <Eye className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">Show All Columns</div>
                        <div className="text-gray-500 text-xs">
                          Display all hidden columns
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Popover
              open={activeDropdown === field}
              onOpenChange={(open: boolean) =>
                setActiveDropdown(open ? field : null)
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${isFilterActive ? "filter-active" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronDown
                    className={`h-4 w-4 ${
                      isFilterActive ? "text-white" : "text-gray-400"
                    }`}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                {/* Text Display Options */}
                <div className="dropdown-section">
                  <div className="dropdown-section-title">Text Display</div>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start font-normal text-sm ${
                      currentTextMode === "wrap" ? "text-mode-active" : ""
                    }`}
                    onClick={() =>
                      handleTextModeChange(
                        field,
                        currentTextMode === "wrap" ? null : "wrap"
                      )
                    }
                  >
                    <WrapText className="w-4 h-4 mr-2" />
                    Wrap Text
                    {currentTextMode === "wrap" && (
                      <span className="ml-auto">✓</span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start font-normal text-sm ${
                      currentTextMode === "clip" ? "text-mode-active" : ""
                    }`}
                    onClick={() =>
                      handleTextModeChange(
                        field,
                        currentTextMode === "clip" ? null : "clip"
                      )
                    }
                  >
                    <Scissors className="w-4 h-4 mr-2" />
                    Clip Text
                    {currentTextMode === "clip" && (
                      <span className="ml-auto">✓</span>
                    )}
                  </Button>
                </div>

                {/* Column Actions */}
                <div className="dropdown-section border-t pt-2 mt-2">
                  <div className="dropdown-section-title">Column Actions</div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal text-sm"
                    onClick={() => {
                      onAddColumn();
                      setActiveDropdown(null);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Column
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal text-sm"
                    onClick={() => {
                      handleHideColumn(field);
                      setActiveDropdown(null);
                    }}
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Column
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal text-sm"
                    onClick={() => {
                      handleTextModeChange(field, null);
                      setActiveDropdown(null);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Enhanced Resize handle */}
        {header.resizable && (
          <div
            className={`resize-handle ${
              isResizing && resizeData?.columnIndex === index ? "resizing" : ""
            }`}
            onMouseDown={(e) => handleResizeStart(index, e)}
            title="Drag to resize column"
          />
        )}
      </th>
    );
  };

  const convertToTableFilters = (
    filterState: FilterState
  ): TeamTableFilters => {
    return {
      search: searchTerm,
      states: new Set<string>(),
      portals: new Set<string>(),
      customerType: "all" as const,
      dateRange: filterState.dateRange,
    };
  };

  const handleTableFiltersChange = (tableFilters: TeamTableFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      dateRange: tableFilters.dateRange,
    }));
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalMembers = filteredMembers.length;
    const totalFresh = filteredMembers.reduce(
      (sum, member) => sum + member.fresh,
      0
    );
    const totalRevision = filteredMembers.reduce(
      (sum, member) => sum + member.revision,
      0
    );
    const totalCompleted = filteredMembers.reduce(
      (sum, member) => sum + member.completed,
      0
    );
    return { totalMembers, totalFresh, totalRevision, totalCompleted };
  }, [filteredMembers]);

  // Filter and sort members
  useEffect(() => {
    let filtered = teamMembers.filter(
      (member) => member.teamLeadId === selectedLead
    );

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filters.roles.length > 0) {
      filtered = filtered.filter((member) =>
        filters.roles.some((role) =>
          member.position.toLowerCase().includes(role.toLowerCase())
        )
      );
    }

    // Apply performance filter
    if (filters.performance.length > 0) {
      filtered = filtered.filter((member) => {
        return filters.performance.some((perf) => {
          switch (perf) {
            case "high":
              return member.completed >= 40;
            case "average":
              return member.completed >= 20 && member.completed <= 39;
            case "low":
              return member.completed >= 0 && member.completed <= 19;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting with enhanced sort config
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key as keyof TeamMember];
        let bVal = b[sortConfig.key as keyof TeamMember];

        if (sortConfig.key === "role") {
          aVal = a.position;
          bVal = b.position;
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal || "").toLowerCase();
        const bStr = String(bVal || "").toLowerCase();
        return sortConfig.direction === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    setFilteredMembers(filtered);
  }, [teamMembers, selectedLead, searchTerm, filters, sortConfig]);

  // Enhanced sort handler
  const handleSort = useCallback((key: string) => {
    setSortConfig((prev: SortConfig) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Reset functionality
  const handleReset = useCallback(
    (action: string) => {
      switch (action) {
        case "everything":
          setHeaders(defaultHeaders);
          setSavedColumnWidths({});
          setColumnTextModes({});
          setHiddenColumns(new Set());
          setSortConfig({ key: null, direction: "asc" });
          setSearchTerm("");
          setFilters({
            dateRange: { from: null, to: null, preset: null },
            teamLeads: [],
            roles: [],
            performance: [],
          });
          localStorage.removeItem(COLUMN_WIDTHS_KEY);
          localStorage.removeItem(TEXT_MODES_KEY);
          localStorage.removeItem(HIDDEN_COLUMNS_KEY);
          setTimeout(() => {
            const defaultWidths = [
              "30%",
              "15%",
              "10%",
              "10%",
              "10%",
              "10%",
              "15%",
            ];
            defaultWidths.forEach((width, index) => {
              updateBothTablesColumnWidth(index, width);
            });
          }, 0);
          showNotification(
            "Reset Complete",
            "All settings restored to default",
            "success"
          );
          break;
        case "columns":
          setSavedColumnWidths({});
          localStorage.removeItem(COLUMN_WIDTHS_KEY);
          setTimeout(() => {
            const defaultWidths = [
              "30%",
              "15%",
              "10%",
              "10%",
              "10%",
              "10%",
              "15%",
            ];
            defaultWidths.forEach((width, index) => {
              updateBothTablesColumnWidth(index, width);
            });
          }, 0);
          showNotification(
            "Column Widths Reset",
            "Default column sizes restored",
            "info"
          );
          break;
        case "textmode":
          setColumnTextModes({});
          localStorage.removeItem(TEXT_MODES_KEY);
          showNotification(
            "Text Mode Reset",
            "Text display restored to default",
            "info"
          );
          break;
        case "showall":
          handleShowAllColumns();
          showNotification(
            "Columns Restored",
            "All hidden columns are now visible",
            "info"
          );
          break;
        case "filters":
          setSortConfig({ key: null, direction: "asc" });
          setSearchTerm("");
          setFilters({
            dateRange: { from: null, to: null, preset: null },
            teamLeads: [],
            roles: [],
            performance: [],
          });
          showNotification(
            "Filters Cleared",
            "All filters and sorting removed",
            "info"
          );
          break;
        case "auto-fit":
          // Auto-fit columns based on content
          if (tableRef.current) {
            const table = tableRef.current;
            const headers = table.querySelectorAll("th");
            const newWidths: { [key: string]: string } = {};

            headers.forEach((header, index) => {
              if (header.scrollWidth > 0) {
                const contentWidth = Math.max(header.scrollWidth + 32, 80); // Add padding + min width
                const percentWidth = Math.min(
                  Math.max((contentWidth / table.offsetWidth) * 100, 8),
                  40
                );
                const width = `${percentWidth}%`;
                newWidths[`col_${index}`] = width;
                updateBothTablesColumnWidth(index, width);
              }
            });

            setSavedColumnWidths(newWidths);
            saveToLocalStorage(COLUMN_WIDTHS_KEY, newWidths);
          }
          showNotification(
            "📐 Auto-Fit Applied",
            "Columns have been automatically sized to their content.",
            "success"
          );
          break;
        case "custom-columns":
          // Reset to default columns (remove any custom added columns)
          setHeaders(defaultHeaders);
          setHiddenColumns(new Set());
          setSavedColumnWidths({});
          setColumnTextModes({});
          localStorage.removeItem(COLUMN_WIDTHS_KEY);
          localStorage.removeItem(TEXT_MODES_KEY);
          localStorage.removeItem(HIDDEN_COLUMNS_KEY);
          setTimeout(() => {
            const defaultWidths = [
              "30%",
              "15%",
              "10%",
              "10%",
              "10%",
              "10%",
              "15%",
            ];
            defaultWidths.forEach((width, index) => {
              updateBothTablesColumnWidth(index, width);
            });
          }, 0);
          showNotification(
            "🔧 Custom Columns Reset",
            "All custom column settings have been removed.",
            "success"
          );
          break;
      }
    },
    [
      updateBothTablesColumnWidth,
      handleShowAllColumns,
      showNotification,
      saveToLocalStorage,
    ]
  );

  const handleMemberClick = (id: number, name: string) => {
    setSelectedMember({ id, name });
    setShowProjectModal(true);
  };

  const handleViewMember = (memberId: number) => {
    const member = filteredMembers.find((m) => m.id === memberId);
    if (member) {
      handleMemberClick(memberId, member.name);
    }
  };

  const handleArchiveMember = (memberId: number) => {
    const member = filteredMembers.find((m) => m.id === memberId);
    if (member) {
      showNotification(
        "Member Archived",
        `${member.name} has been archived successfully.`,
        "info"
      );
      // Here you would typically make an API call to archive the member
      console.log("Archive member:", memberId);
    }
  };

  const handleDeleteMember = (memberId: number) => {
    const member = filteredMembers.find((m) => m.id === memberId);
    if (member) {
      if (
        confirm(
          `Are you sure you want to delete ${member.name}? This action cannot be undone.`
        )
      ) {
        showNotification(
          "Member Deleted",
          `${member.name} has been deleted successfully.`,
          "success"
        );
        // Here you would typically make an API call to delete the member
        console.log("Delete member:", memberId);
      }
    }
  };

  const getRoleBadgeClass = (position: string) => {
    const role = position.toLowerCase();
    if (role.includes("admin")) return "bg-blue-100 text-blue-800";
    if (
      role.includes("manager") ||
      role.includes("ceo") ||
      role.includes("director")
    )
      return "bg-purple-100 text-purple-800";
    if (role.includes("engineer")) return "bg-green-100 text-green-800";
    if (role.includes("founder")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getRoleText = (position: string) => {
    const role = position.toLowerCase();
    if (role.includes("admin")) return "Admin";
    if (
      role.includes("manager") ||
      role.includes("ceo") ||
      role.includes("director")
    )
      return "Manager";
    if (role.includes("engineer")) return "Engineer";
    if (role.includes("founder")) return "Founder";
    return "Member";
  };

  const getTextModeClass = (column: string) => {
    const mode = columnTextModes[column];
    return mode === "wrap" ? "text-wrap" : mode === "clip" ? "text-clip" : "";
  };

  const getPlaceholderValue = (columnKey: string) => {
    // Provide placeholder values for new columns
    switch (columnKey) {
      case "email":
        return "N/A";
      case "phone":
        return "N/A";
      case "department":
        return "General";
      case "joinDate":
        return "2024-01-01";
      case "lastActive":
        return "2024-08-14";
      case "efficiency":
        return "85%";
      case "workload":
        return "12";
      case "teamLead":
        return "Unassigned";
      case "location":
        return "Remote";
      case "notes":
        return "No notes";
      default:
        return "—";
    }
  };

  const renderCell = (header: TableHeader, member: TeamMember) => {
    const textModeClass = getTextModeClass(header.key);

    switch (header.type) {
      case "member":
        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-16 h-16 ${member.avatarColor} rounded-lg flex items-center justify-center text-white font-semibold text-lg cursor-pointer hover:scale-105 transition-transform`}
            >
              {member.avatar}
            </div>
            <div className={textModeClass}>
              <div
                className="font-semibold text-gray-900 cursor-pointer  text-decoration: none;"
                onClick={() => handleMemberClick(member.id, member.name)}
              >
                {member.name}
              </div>
              <a
                href={`mailto:${member.email}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {member.email}
              </a>
            </div>
          </div>
        );

      case "role-badge":
        return (
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeClass(
              member.position
            )} ${textModeClass}`}
          >
            {getRoleText(member.position)}
          </span>
        );

      case "count":
        const countClass =
          header.key === "fresh"
            ? "text-green-600"
            : header.key === "revision"
            ? "text-red-600"
            : header.key === "completed"
            ? "text-purple-600"
            : "text-gray-900";
        return (
          <div
            className={`text-left font-semibold text-lg ${countClass} ${textModeClass}`}
          >
            {member[header.key as keyof TeamMember] as number}
          </div>
        );

      case "actions":
        return (
          <div className="flex items-center gap-2 justify-start relative">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white h-10 w-10 rounded-lg transition-all duration-200"
              title="Edit Member"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Button>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white h-10 w-10 rounded-lg transition-all duration-200"
              title="View Activity"
              onClick={() => handleViewMember(member.id)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </Button>
            <DropdownMenu
              open={activeDropdown === `actions-${member.id}`}
              onOpenChange={(open: boolean) =>
                setActiveDropdown(open ? `actions-${member.id}` : null)
              }
            >
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-700 text-white w-10 h-10 p-0 rounded-xl transition-transform duration-200"
                  aria-label="More options"
                >
                  <MoreHorizontal
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === `actions-${member.id}`
                        ? "rotate-90"
                        : ""
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-36">
                {/* DELETE (dark hover) */}
                <DropdownMenuItem
                  className="
                       group cursor-pointer transition-all duration-200
                        pl-3 hover:pl-4
                        text-[#dc2626]
                        hover:text-white
                        hover:bg-gradient-to-b hover:from-[#ef4444] hover:to-[#b91c1c]
                        data-[highlighted]:text-white
                        data-[highlighted]:bg-gradient-to-b
                        data-[highlighted]:from-[#ef4444]
                        data-[highlighted]:to-[#b91c1c]
                    "
                >
                  <Trash2
                    className="
                        w-4 h-6 mr-2
                        text-[#dc2626]
                        group-hover:text-white
                        data-[highlighted]:text-white
                      "
                  />
                  <span className="group-hover:text-white data-[highlighted]:text-white">
                    Delete
                  </span>
                </DropdownMenuItem>

                {/* VIEW DETAILS (dark hover) */}
                <DropdownMenuItem
                  className="
                        group cursor-pointer transition-all duration-200
                        pl-3 hover:pl-4
                        text-[#2563eb]
                        hover:text-white
                        hover:bg-gradient-to-b hover:from-[#3b82f6] hover:to-[#1d4ed8]
                        data-[highlighted]:text-white
                        data-[highlighted]:bg-gradient-to-b
                        data-[highlighted]:from-[#3b82f6]
                        data-[highlighted]:to-[#1d4ed8]
                    "
                >
                  <Eye
                    className="
                        w-4 h-6 mr-2
                        text-[#2563eb]
                        group-hover:text-white
                        data-[highlighted]:text-white
                      "
                  />
                  <span className="group-hover:text-white data-[highlighted]:text-white">
                    View Details
                  </span>
                </DropdownMenuItem>

                {/* ARCHIVE (dark hover) */}
                <DropdownMenuItem
                  className="
                     group cursor-pointer transition-all duration-200
                    pl-3 hover:pl-4
                    text-[#d97706]
                    hover:text-white
                    hover:bg-gradient-to-b hover:from-[#f59e0b] hover:to-[#b45309]
                    data-[highlighted]:text-white
                    data-[highlighted]:bg-gradient-to-b
                    data-[highlighted]:from-[#f59e0b]
                    data-[highlighted]:to-[#b45309]
                    "
                >
                  <Archive
                    className="
                        w-4 h-6 mr-2
                        text-[#d97706]
                        group-hover:text-white
                        data-[highlighted]:text-white
                      "
                  />
                  <span className="group-hover:text-white data-[highlighted]:text-white">
                    Archive
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        // Handle custom columns that might not exist in the member object
        const value = member[header.key as keyof TeamMember];
        return (
          <span className={textModeClass}>
            {value !== undefined
              ? String(value)
              : getPlaceholderValue(header.key)}
          </span>
        );
    }
  };

  const calculateMinWidth = () => {
    const defaultWidths = ["30%", "15%", "10%", "10%", "10%", "10%", "15%"];
    const totalPercentage = defaultWidths
      .slice(0, visibleHeaders.length)
      .reduce((sum, width) => sum + parseFloat(width), 0);
    const minBaseWidth = 1200;
    return Math.max(minBaseWidth, (totalPercentage / 100) * minBaseWidth);
  };

  const minTableWidth = calculateMinWidth();

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white rounded-2xl shadow-sm border mb-6 mx-4 md:mx-6 flex-shrink-0">
        <div className="flex items-center justify-between gap-12 px-6 py-3">
          {/* Stats Grid */}
          <div className="flex items-end gap-4 flex-1">
            <StatsCard title="Total Members" value={metrics.totalMembers} />
            <StatsCard title="Fresh Tasks" value={metrics.totalFresh} />
            <StatsCard title="In Revision" value={metrics.totalRevision} />
            <StatsCard title="Completed" value={metrics.totalCompleted} />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex items-center gap-4">
              <DateRangeFilterNew
                filters={convertToTableFilters(filters)}
                onFiltersChange={handleTableFiltersChange}
              />
              <MultiSelectDropdown
                label="Select Performance Range"
                options={[
                  { value: "high", label: "High Performer (40+)" },
                  { value: "average", label: "Average (20-39)" },
                  { value: "low", label: "Needs Support (0-19)" },
                ]}
                selected={filters.performance}
                onChange={(selected) =>
                  setFilters((prev) => ({ ...prev, performance: selected }))
                }
              />
              <MultiSelectDropdown
                label="Select Roles"
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "manager", label: "Manager" },
                  { value: "engineer", label: "Engineer" },
                  { value: "founder", label: "Founder" },
                ]}
                selected={filters.roles}
                onChange={(selected) =>
                  setFilters((prev) => ({ ...prev, roles: selected }))
                }
              />
              <button
                onClick={() =>
                  setFilters({
                    dateRange: { from: null, to: null, preset: null },
                    teamLeads: [],
                    roles: [],
                    performance: [],
                  })
                }
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Right Side: Search and Filter Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={`${
                hasActiveFilters
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  : "bg-gradient-to-br from-emerald-500 to-green-600"
              } text-white border-none px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 relative hover:shadow-lg hover:shadow-emerald-500/30`}
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
      </div>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 px-4 md:px-6 pt-2 pb-4 min-h-0">
        {/* Team Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <TeamSidebar
            selectedLead={selectedLead}
            onLeadChange={setSelectedLead}
          />
        </div>

        {/* Enhanced Main Table Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border relative flex flex-col overflow-hidden">
          <div className="enhanced-table-container rounded-2xl bg-white shadow-sm flex flex-col flex-1 overflow-hidden relative">
            {/* Fixed Header */}
            <div className="flex-shrink-0 bg-gray-100 border-b border-gray-200">
              <div
                ref={headerScrollRef}
                className="overflow-x-auto overflow-y-hidden table-scroll"
                onScroll={(e) => syncScroll(e.currentTarget, bodyScrollRef)}
              >
                <table
                  className="caption-bottom text-sm"
                  style={{
                    tableLayout: "fixed",
                    minWidth: `${minTableWidth}px`,
                    width: "100%",
                  }}
                >
                  <colgroup>
                    {visibleHeaders.map((_, index) => (
                      <col
                        key={index}
                        style={{
                          width: getColumnWidth(index),
                        }}
                      />
                    ))}
                  </colgroup>
                  <thead>
                    <tr className="hover:bg-transparent">
                      {visibleHeaders.map((header, index) => (
                        <SortableHeader
                          key={header.key}
                          label={header.label}
                          field={header.key}
                          className="px-4"
                          index={index}
                          header={header}
                        />
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            {/* Scrollable Body - FIXED */}
            <div
              className="flex-1 overflow-hidden"
             
            >
              <div
                ref={bodyScrollRef}
                className="h-full overflow-x-auto overflow-y-auto table-scroll"
                onScroll={(e) => syncScroll(e.currentTarget, headerScrollRef)}
              >
                <table
                  ref={tableRef}
                  className="caption-bottom text-sm"
                  style={{
                    tableLayout: "fixed",
                    minWidth: `${minTableWidth}px`,
                    width: "100%",
                  }}
                >
                  <colgroup>
                    {visibleHeaders.map((_, index) => (
                      <col
                        key={index}
                        style={{
                          width: getColumnWidth(index),
                        }}
                      />
                    ))}
                  </colgroup>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={visibleHeaders.length}
                          className="text-center text-gray-500 h-24"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Grid3X3 className="w-12 h-12 text-gray-300" />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                No team members found
                              </h3>
                              <p className="text-sm text-gray-500">
                                Try adjusting your search or filters.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member) => (
                        <tr
                          key={member.id}
                          className={`hover:bg-gray-50 border-0 transition-colors duration-150 ${
                            selectedRows.has(member.id)
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : ""
                          }`}
                        >
                          {visibleHeaders.map((header) => (
                            <td key={header.key} className="border-0 px-4 py-4">
                              {renderCell(header, member)}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Selection Info Bar */}
      {selectedRows.size > 0 && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
          <span className="font-medium">
            {selectedRows.size} row{selectedRows.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium transition-colors">
              <Edit className="w-4 h-4 inline mr-1" />
              Edit
            </button>
            <button className="bg-red-500 bg-opacity-90 hover:bg-red-600 px-3 py-1 rounded-full text-sm font-medium transition-colors">
              <Trash2 className="w-4 h-4 inline mr-1" />
              Delete
            </button>
            <button className="bg-green-500 bg-opacity-90 hover:bg-green-600 px-3 py-1 rounded-full text-sm font-medium transition-colors">
              Assign
            </button>
            <button
              onClick={() => setSelectedRows(new Set())}
              className="bg-gray-500 bg-opacity-90 hover:bg-gray-600 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4 inline mr-1" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setSelectedMember(null);
        }}
        memberName={selectedMember?.name || ""}
        projects={sampleProjects}
      />

      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        availableColumns={columnsForModal}
        onAddColumns={handleAddColumns}
        hiddenColumns={hiddenColumns}
      />
    </div>
  );
};

export default TeamPerformanceDashboard;
