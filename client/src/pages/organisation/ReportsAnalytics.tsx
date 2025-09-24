import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Download,
  FileText,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";

// Mock analytics data
const attendanceData = [
  { month: "Jan", present: 85, absent: 15, late: 8 },
  { month: "Feb", present: 88, absent: 12, late: 6 },
  { month: "Mar", present: 82, absent: 18, late: 10 },
  { month: "Apr", present: 91, absent: 9, late: 5 },
  { month: "May", present: 89, absent: 11, late: 7 },
  { month: "Jun", present: 93, absent: 7, late: 4 },
  { month: "Jul", present: 87, absent: 13, late: 8 },
  { month: "Aug", present: 90, absent: 10, late: 6 },
];

const departmentData = [
  { name: "Engineering", employees: 12, budget: 500000, color: "#0ea5e9" },
  { name: "Marketing", employees: 8, budget: 200000, color: "#10b981" },
  { name: "Sales", employees: 15, budget: 150000, color: "#f59e0b" },
  { name: "HR", employees: 5, budget: 100000, color: "#ef4444" },
  { name: "Finance", employees: 6, budget: 120000, color: "#8b5cf6" },
];

const leaveData = [
  { month: "Jan", vacation: 12, sick: 8, personal: 5 },
  { month: "Feb", vacation: 15, sick: 6, personal: 4 },
  { month: "Mar", vacation: 10, sick: 12, personal: 7 },
  { month: "Apr", vacation: 18, sick: 5, personal: 3 },
  { month: "May", vacation: 22, sick: 9, personal: 6 },
  { month: "Jun", vacation: 25, sick: 7, personal: 4 },
  { month: "Jul", vacation: 20, sick: 11, personal: 8 },
  { month: "Aug", vacation: 16, sick: 6, personal: 5 },
];

const performanceData = [
  { month: "Jan", avgScore: 82 },
  { month: "Feb", avgScore: 85 },
  { month: "Mar", avgScore: 79 },
  { month: "Apr", avgScore: 88 },
  { month: "May", avgScore: 86 },
  { month: "Jun", avgScore: 91 },
  { month: "Jul", avgScore: 89 },
  { month: "Aug", avgScore: 87 },
];

export default function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("attendance");

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ["/api/attendance"],
  });

  const totalEmployees = Array.isArray(employees) ? employees.length : 42;
  const avgAttendance = 89.2;
  const totalLeaves = 45;
  const avgPerformance = 86.5;

  const renderChart = () => {
    switch (selectedReport) {
      case "attendance":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10b981" name="Present %" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent %" />
              <Bar dataKey="late" fill="#f59e0b" name="Late %" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "departments":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="employees"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "leaves":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="vacation" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" />
              <Area type="monotone" dataKey="sick" stackId="1" stroke="#ef4444" fill="#ef4444" />
              <Area type="monotone" dataKey="personal" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case "performance":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 95]} />
              <Tooltip />
              <Line type="monotone" dataKey="avgScore" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive HR analytics and reporting dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                <p className="text-2xl font-bold">{totalEmployees}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+5.2% from last month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Attendance</p>
                <p className="text-2xl font-bold text-blue-600">{avgAttendance}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+2.1% from last month</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leaves</p>
                <p className="text-2xl font-bold text-yellow-600">{totalLeaves}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-xs text-red-600">-3.4% from last month</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Performance</p>
                <p className="text-2xl font-bold text-purple-600">{avgPerformance}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+1.8% from last month</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
            <div className="flex items-center gap-4">
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance Trends</SelectItem>
                  <SelectItem value="departments">Department Distribution</SelectItem>
                  <SelectItem value="leaves">Leave Analysis</SelectItem>
                  <SelectItem value="performance">Performance Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {selectedReport === "attendance" && "Attendance Trends"}
            {selectedReport === "departments" && "Department Distribution"}
            {selectedReport === "leaves" && "Leave Analysis"}
            {selectedReport === "performance" && "Performance Trends"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: dept.color }}
                    ></div>
                    <span className="font-medium">{dept.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{dept.employees} employees</p>
                    <p className="text-sm text-gray-500">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(dept.budget)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Ashwini Bhardwaj", score: 95, department: "Engineering" },
                { name: "John Smith", score: 92, department: "Marketing" },
                { name: "Sarah Johnson", score: 90, department: "Sales" },
                { name: "Mike Brown", score: 88, department: "HR" },
                { name: "Emily Davis", score: 87, department: "Finance" },
              ].map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{performer.name}</p>
                    <p className="text-sm text-gray-500">{performer.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{performer.score}%</p>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${performer.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <FileText className="h-6 w-6 mb-2" />
              <span>Attendance Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <PieChartIcon className="h-6 w-6 mb-2" />
              <span>Department Analysis</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Performance Review</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}