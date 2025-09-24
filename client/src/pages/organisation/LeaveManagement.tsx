import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  Download,
  Check,
  X,
  Clock,
  User,
  FileText,
  CalendarDays,
  Briefcase
} from "lucide-react";

// Mock leave data - will be replaced with real API calls
const mockLeaveData = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "John Smith",
    department: "Engineering",
    leaveType: "vacation",
    startDate: "2024-08-20",
    endDate: "2024-08-24",
    days: 5,
    reason: "Family vacation to Hawaii",
    status: "pending",
    appliedDate: "2024-08-15",
    avatar: null,
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Sarah Johnson",
    department: "Marketing",
    leaveType: "sick",
    startDate: "2024-08-18",
    endDate: "2024-08-19",
    days: 2,
    reason: "Medical treatment",
    status: "approved",
    appliedDate: "2024-08-17",
    approvedBy: "HR Manager",
    avatar: null,
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Mike Brown",
    department: "Sales",
    leaveType: "personal",
    startDate: "2024-08-25",
    endDate: "2024-08-25",
    days: 1,
    reason: "Personal appointment",
    status: "rejected",
    appliedDate: "2024-08-14",
    rejectedBy: "Manager",
    comments: "Insufficient notice period",
    avatar: null,
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "Emily Davis",
    department: "HR",
    leaveType: "maternity",
    startDate: "2024-09-01",
    endDate: "2024-12-01",
    days: 90,
    reason: "Maternity leave",
    status: "approved",
    appliedDate: "2024-07-15",
    approvedBy: "CEO",
    avatar: null,
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const leaveTypeColors = {
  vacation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  sick: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  personal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  maternity: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  paternity: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
};

export default function LeaveManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const queryClient = useQueryClient();
  
  const { data: leaveRequests = [], isLoading } = useQuery({
    queryKey: ["/api/leave-requests"],
  });

  // Use mock data for now, replace with real data when available
  const leaveData = Array.isArray(leaveRequests) && leaveRequests.length > 0 ? leaveRequests : mockLeaveData;

  const filteredLeaves = leaveData.filter((leave: any) => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    const matchesType = typeFilter === "all" || leave.leaveType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const leaveStats = {
    total: leaveData.length,
    pending: leaveData.filter((leave: any) => leave.status === 'pending').length,
    approved: leaveData.filter((leave: any) => leave.status === 'approved').length,
    rejected: leaveData.filter((leave: any) => leave.status === 'rejected').length,
  };

  const approveLeave = useMutation({
    mutationFn: async (leaveId: string) => {
      const response = await fetch(`/api/leave-requests/${leaveId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: "HR Manager" }),
      });
      if (!response.ok) throw new Error("Failed to approve leave");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leave-requests"] });
    },
  });

  const rejectLeave = useMutation({
    mutationFn: async (leaveId: string) => {
      const response = await fetch(`/api/leave-requests/${leaveId}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          approvedBy: "HR Manager",
          comments: "Unable to approve due to business requirements"
        }),
      });
      if (!response.ok) throw new Error("Failed to reject leave");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leave-requests"] });
    },
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage employee leave requests and approvals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold">{leaveStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{leaveStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-600">{leaveStats.approved}</p>
              </div>
              <Check className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{leaveStats.rejected}</p>
              </div>
              <X className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by employee name, ID, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="maternity">Maternity</SelectItem>
                <SelectItem value="paternity">Paternity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.map((leave: any) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={leave.avatar} />
                        <AvatarFallback>{getInitials(leave.employeeName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{leave.employeeName}</p>
                        <p className="text-sm text-gray-500">{leave.employeeId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={leaveTypeColors[leave.leaveType as keyof typeof leaveTypeColors]}>
                      {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{leave.days} days</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{formatDate(leave.startDate)}</p>
                      <p className="text-gray-500">to {formatDate(leave.endDate)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[leave.status as keyof typeof statusColors]}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {leave.status === 'pending' ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => approveLeave.mutate(leave.id)}
                            disabled={approveLeave.isPending}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => rejectLeave.mutate(leave.id)}
                            disabled={rejectLeave.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {leave.status === 'approved' ? `Approved by ${leave.approvedBy}` : 
                           leave.status === 'rejected' ? `Rejected by ${leave.rejectedBy}` : '-'}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}