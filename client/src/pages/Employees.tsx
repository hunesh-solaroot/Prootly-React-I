import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeModal from "@/components/employee/EmployeeModal";


import EmployeeGridView from "@/components/employee/EmployeeGridView";
import EmployeeTableView from "@/components/employee/EmployeeTableView";

// Define the Employee type once, here in the main page component
interface Employee {
  id: number;
  full_name: string;
  email: string;
  job_title: string;
  department: string;
  emp_code: string;
  mobile: string;
  is_active: boolean;
  date_joined: string;
  dp_url: string;
  group_name: string;
}

// Function to fetch and process employee data
const fetchEmployees = async (searchQuery: string): Promise<Employee[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("User not authenticated");
  }
  const API_URL = "http://155.117.40.181:8000";
  const endpoint = searchQuery ? `/api/users-list/?search=${encodeURIComponent(searchQuery)}` : "/api/users-list/";
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  const data = await response.json();
  if (data.success && Array.isArray(data.users)) {
    return data.users;
  } else {
    throw new Error("Invalid data format from API");
  }
};

export default function EmployeesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();

  const { data: employees, isLoading, error } = useQuery<Employee[]>({
    queryKey: ["employees", searchQuery],
    queryFn: () => fetchEmployees(searchQuery),
    staleTime: 1000 * 60 * 5,
  });

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.full_name}?`)) {
      console.log("Deleting:", employee.id);
    }
  };

  if (isLoading) return <div className="text-center p-10">Loading employees...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
        <Button onClick={() => setModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </div>

      {/* Search and View Toggle Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input type="text" placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}>
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {employees && employees.length > 0 ? (
          viewMode === 'grid' ? (
            <EmployeeGridView employees={employees} handleEdit={handleEdit} handleDelete={handleDelete} />
          ) : (
            <EmployeeTableView employees={employees} handleEdit={handleEdit} handleDelete={handleDelete} />
          )
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold">No employees found</h3>
            <p className="text-slate-600 mt-2">Get started by adding your first employee.</p>
          </div>
        )}
      </div>

       {modalOpen && <EmployeeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} employee={selectedEmployee} />}
    </div>
  );
}