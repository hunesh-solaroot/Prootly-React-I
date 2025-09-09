import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Grid3X3, List, Edit, Trash2, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import EmployeeModal from "@/components/EmployeeModal";
import { Employee } from "@shared/schema";

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: searchQuery ? ["/api/employees/search", { q: searchQuery }] : ["/api/employees"],
    queryFn: searchQuery 
      ? () => fetch(`/api/employees/search?q=${encodeURIComponent(searchQuery)}`).then(res => res.json())
      : undefined,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({ title: "Employee deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete employee", variant: "destructive" });
    },
  });

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      deleteMutation.mutate(employee.id);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEmployee(undefined);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Employees</h1>
        <Button 
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-[#00a15d] to-[#7cb342] text-white hover:from-[#008a4f] hover:to-[#6a9b37] shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200 dark:border-slate-700 focus:border-[#00a15d] dark:focus:border-[#00a15d]"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-[#00a15d] hover:bg-[#008a4f]" : ""}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-[#00a15d] hover:bg-[#008a4f]" : ""}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Employees Grid/List */}
      {employees && employees.length > 0 ? (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {employees.map((employee) => (
            <Card key={employee.id} className="group hover:shadow-xl hover:shadow-[#00a15d]/10 transition-all duration-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:-translate-y-1">
              <CardContent className="p-0">
                {viewMode === "grid" ? (
                  <div className="relative overflow-hidden">
                    {/* Header gradient background */}
                    <div className="h-20 bg-gradient-to-r from-[#00a15d] to-[#7cb342] relative">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00a15d] to-[#7cb342] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white dark:ring-slate-800">
                          {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-12 pb-6 px-6 text-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">{employee.name}</h3>
                      
                      <div className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400 text-sm mb-2">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-500 text-sm mb-4">
                        <User className="w-3 h-3" />
                        <span>{employee.role}</span>
                      </div>
                      
                      <Badge 
                        variant={employee.status === "active" ? "default" : "secondary"}
                        className={employee.status === "active" 
                          ? "bg-[#00a15d]/10 text-[#00a15d] hover:bg-[#00a15d]/20 border-[#00a15d]/20" 
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                        }
                      >
                        {employee.status}
                      </Badge>
                      
                      <div className="flex justify-center gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(employee)}
                          className="hover:bg-[#00a15d] hover:text-white hover:border-[#00a15d] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(employee)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#00a15d] to-[#7cb342] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                            employee.status === "active" ? "bg-[#00a15d]" : "bg-slate-400"
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{employee.name}</h3>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm mb-1">
                            <Mail className="w-3 h-3" />
                            <span>{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-500 text-sm">
                            <User className="w-3 h-3" />
                            <span>{employee.role}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={employee.status === "active" ? "default" : "secondary"}
                          className={employee.status === "active" 
                            ? "bg-[#00a15d]/10 text-[#00a15d] hover:bg-[#00a15d]/20 border-[#00a15d]/20" 
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                          }
                        >
                          {employee.status}
                        </Badge>
                        <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(employee)}
                            className="hover:bg-[#00a15d] hover:text-white hover:border-[#00a15d] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(employee)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-[#00a15d]/10 to-[#7cb342]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-12 h-12 text-[#00a15d]" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No employees found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {searchQuery ? "Try adjusting your search criteria to find what you're looking for." : "Get started by adding your first employee to build your team."}
          </p>
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-[#00a15d] to-[#7cb342] text-white hover:from-[#008a4f] hover:to-[#6a9b37] shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      )}

      <EmployeeModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        employee={selectedEmployee}
      />
    </div>
  );
}