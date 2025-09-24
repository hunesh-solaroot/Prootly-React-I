import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Calendar, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

// Mock data for the dashboard - will be replaced with real API calls
const mockDashboardData = {
  totalEmployees: 42,
  presentToday: 38,
  onLeave: 3,
  late: 1,
  upcomingHolidays: [
    { name: "Independence Day", date: "2024-08-15", type: "national" },
    { name: "Gandhi Jayanti", date: "2024-10-02", type: "national" },
  ],
  todayAttendance: {
    present: 38,
    absent: 3,
    late: 1,
    percentage: 90.5,
  },
  monthlyStats: {
    avgAttendance: 89.2,
    totalLeaves: 45,
    pendingLeaves: 8,
    payrollProcessed: 98.5,
  },
  recentActivities: [
    { id: 1, type: "leave", message: "John Smith applied for sick leave", time: "2 hours ago" },
    { id: 2, type: "attendance", message: "Sarah Johnson marked late arrival", time: "3 hours ago" },
    { id: 3, type: "payroll", message: "July payroll processed successfully", time: "1 day ago" },
    { id: 4, type: "employee", message: "New employee Mike Brown joined", time: "2 days ago" },
  ],
};

export default function OrganisationDashboard() {
  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ["/api/attendance"],
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">HRM Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your organization's human resources
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(employees) ? employees.length : mockDashboardData.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.presentToday}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardData.todayAttendance.percentage}% attendance
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.onLeave}</div>
            <p className="text-xs text-muted-foreground">Employees on leave</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.monthlyStats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Average attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Attendance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Present</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {mockDashboardData.todayAttendance.present}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {mockDashboardData.todayAttendance.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Absent</span>
                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  {mockDashboardData.todayAttendance.absent}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Late Arrivals</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  {mockDashboardData.todayAttendance.late}
                </Badge>
              </div>

              {/* Attendance Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Attendance Rate</span>
                  <span>{mockDashboardData.todayAttendance.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${mockDashboardData.todayAttendance.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDashboardData.upcomingHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{holiday.name}</p>
                    <p className="text-xs text-gray-500">{new Date(holiday.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {holiday.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockDashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 border-l-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                <div className="flex-shrink-0">
                  {activity.type === "leave" && <Calendar className="h-4 w-4 text-yellow-600" />}
                  {activity.type === "attendance" && <Clock className="h-4 w-4 text-blue-600" />}
                  {activity.type === "payroll" && <DollarSign className="h-4 w-4 text-green-600" />}
                  {activity.type === "employee" && <Users className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Add Employee</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Calendar className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm font-medium">Leave Request</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <DollarSign className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Process Payroll</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}