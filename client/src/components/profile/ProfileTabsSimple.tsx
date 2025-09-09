import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Calendar,
  FileText,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Clock,
  Building,
  Briefcase,
  Download,
  Upload,
  Eye,
} from "lucide-react";
import { EmployeeProfile, AttendanceData, LeaveRecord, Document, PerformanceData } from "../../../../shared/types";

interface ProfileTabsSimpleProps {
  profile: EmployeeProfile;
  attendanceData: AttendanceData[];
  leaveRecords: LeaveRecord[];
  documents: Document[];
  performanceData: PerformanceData[];
  activeTab: string;
}

const ProfileTabsSimple: React.FC<ProfileTabsSimpleProps> = ({
  profile,
  attendanceData,
  leaveRecords,
  documents,
  performanceData,
  activeTab,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      present: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      absent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "half-day": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  const getLeaveStatusBadge = (status: string) => {
    const statusColors = {
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  if (activeTab === "attendance") {
    const presentDays = attendanceData.filter(day => day.status === "present").length;
    const absentDays = attendanceData.filter(day => day.status === "absent").length;
    const lateDays = attendanceData.filter(day => day.status === "late").length;
    const attendancePercentage = (presentDays / attendanceData.length) * 100;

    return (
      <Card className="bg-white dark:bg-[#1e1e1e]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Calendar className="h-5 w-5 text-blue-500" />
            Attendance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{presentDays}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Present</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{absentDays}</div>
              <div className="text-sm text-red-600 dark:text-red-400">Absent</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{lateDays}</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Late</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{attendancePercentage.toFixed(1)}%</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Rate</div>
            </div>
          </div>

          {/* Attendance List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Attendance</h3>
            {attendanceData.slice(0, 10).map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{day.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  {day.checkIn && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {day.checkIn} - {day.checkOut}
                    </span>
                  )}
                  <Badge className={getStatusBadge(day.status)}>
                    {day.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeTab === "leave") {
    return (
      <Card className="bg-white dark:bg-[#1e1e1e]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock className="h-5 w-5 text-blue-500" />
            Leave History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {leaveRecords.map((leave) => (
            <div key={leave.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {leave.type} Leave
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)} 
                    <span className="ml-2">({leave.days} day{leave.days > 1 ? 's' : ''})</span>
                  </p>
                </div>
                <Badge className={getLeaveStatusBadge(leave.status)}>
                  {leave.status}
                </Badge>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{leave.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (activeTab === "documents") {
    return (
      <Card className="bg-white dark:bg-[#1e1e1e]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <FileText className="h-5 w-5 text-blue-500" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {doc.type} • {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <Eye className="h-3 w-3" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (activeTab === "performance") {
    return (
      <Card className="bg-white dark:bg-[#1e1e1e]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {performanceData.map((data, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-white">{data.month}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Score:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{data.score}/100</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-gray-600 dark:text-gray-400">{data.score}%</span>
                </div>
                <Progress value={data.score} className="h-2" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{data.feedback}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Default return (shouldn't happen)
  return null;
};

export default ProfileTabsSimple;