import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Users,
  Building,
  Briefcase,
  UserCheck
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Mock departments data - will be replaced with real API calls
const mockDepartments = [
  {
    id: "1",
    name: "Engineering",
    description: "Software development and technical operations",
    manager: "John Smith",
    employeeCount: 12,
    budget: 500000,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Marketing",
    description: "Brand promotion and customer acquisition",
    manager: "Sarah Johnson",
    employeeCount: 8,
    budget: 200000,
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Sales",
    description: "Customer relations and revenue generation",
    manager: "Mike Brown",
    employeeCount: 15,
    budget: 150000,
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Human Resources",
    description: "Employee management and organizational development",
    manager: "Emily Davis",
    employeeCount: 5,
    budget: 100000,
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "5",
    name: "Finance",
    description: "Financial planning and accounting operations",
    manager: "Robert Wilson",
    employeeCount: 6,
    budget: 120000,
    status: "inactive",
    createdAt: "2024-03-01",
  },
];

// Mock roles data
const mockRoles = [
  { id: "1", title: "Software Engineer", department: "Engineering", level: "Mid-level", employees: 5 },
  { id: "2", title: "Senior Developer", department: "Engineering", level: "Senior", employees: 3 },
  { id: "3", title: "Marketing Manager", department: "Marketing", level: "Manager", employees: 1 },
  { id: "4", title: "Sales Executive", department: "Sales", level: "Junior", employees: 8 },
  { id: "5", title: "HR Specialist", department: "Human Resources", level: "Mid-level", employees: 2 },
];

const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  manager: z.string().min(2, "Manager name is required"),
  budget: z.number().min(0, "Budget must be a positive number"),
});

const roleSchema = z.object({
  title: z.string().min(2, "Role title must be at least 2 characters"),
  department: z.string().min(1, "Department is required"),
  level: z.string().min(1, "Level is required"),
});

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function DepartmentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("departments");
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  const queryClient = useQueryClient();
  
  const { data: departments = [], isLoading: isDeptLoading } = useQuery({
    queryKey: ["/api/departments"],
  });

  // Use mock data for now, replace with real data when available
  const departmentData = Array.isArray(departments) && departments.length > 0 ? departments : mockDepartments;
  const roleData = mockRoles;

  const filteredDepartments = departmentData.filter((dept: any) => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roleData.filter((role: any) => 
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departmentForm = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
      manager: "",
      budget: 0,
    },
  });

  const roleForm = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      title: "",
      department: "",
      level: "",
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create department");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      setIsAddDeptOpen(false);
      departmentForm.reset();
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const departmentStats = {
    total: departmentData.length,
    active: departmentData.filter((dept: any) => dept.status === 'active').length,
    totalEmployees: departmentData.reduce((sum: number, dept: any) => sum + dept.employeeCount, 0),
    totalBudget: departmentData.reduce((sum: number, dept: any) => sum + dept.budget, 0),
  };

  const onSubmitDepartment = (data: any) => {
    createDepartmentMutation.mutate(data);
  };

  const onSubmitRole = (data: any) => {
    console.log("Role data:", data);
    // Implement role creation
    setIsAddRoleOpen(false);
    roleForm.reset();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Department & Role Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage organizational structure and employee roles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Building className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <Form {...departmentForm}>
                <form onSubmit={departmentForm.handleSubmit(onSubmitDepartment)} className="space-y-4">
                  <FormField
                    control={departmentForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Engineering" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={departmentForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Department description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={departmentForm.control}
                    name="manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Manager name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={departmentForm.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            placeholder="100000"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDeptOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createDepartmentMutation.isPending}>
                      {createDepartmentMutation.isPending ? "Creating..." : "Create Department"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Role</DialogTitle>
              </DialogHeader>
              <Form {...roleForm}>
                <form onSubmit={roleForm.handleSubmit(onSubmitRole)} className="space-y-4">
                  <FormField
                    control={roleForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Software Engineer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={roleForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Engineering" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={roleForm.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Mid-level" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddRoleOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Role
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
                <p className="text-2xl font-bold">{departmentStats.total}</p>
              </div>
              <Building className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Departments</p>
                <p className="text-2xl font-bold text-green-600">{departmentStats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                <p className="text-2xl font-bold text-blue-600">{departmentStats.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(departmentStats.totalBudget)}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search departments or roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={activeTab === "departments" ? "default" : "outline"}
                onClick={() => setActiveTab("departments")}
              >
                Departments
              </Button>
              <Button 
                variant={activeTab === "roles" ? "default" : "outline"}
                onClick={() => setActiveTab("roles")}
              >
                Roles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      {activeTab === "departments" && (
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department: any) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{department.name}</p>
                        <p className="text-sm text-gray-500">{department.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{department.manager}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{department.employeeCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(department.budget)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[department.status as keyof typeof statusColors]}>
                        {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Roles Table */}
      {activeTab === "roles" && (
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role: any) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.title}</TableCell>
                    <TableCell>{role.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{role.employees}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}