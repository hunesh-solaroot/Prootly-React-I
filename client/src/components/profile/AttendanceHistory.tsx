import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Timer, Clock } from "lucide-react";

interface AttendanceHistoryProps {
  employeeId: string;
}

// Mock data for last 7 days - will be replaced with real API call
const mockAttendanceHistory = [
  {
    id: "1",
    date: "2024-08-17",
    punchIn: "09:15",
    punchOut: "18:30",
    workingHours: 555,
    status: "present",
  },
  {
    id: "2", 
    date: "2024-08-16",
    punchIn: "09:00",
    punchOut: "18:15",
    workingHours: 555,
    status: "present",
  },
  {
    id: "3",
    date: "2024-08-15",
    punchIn: null,
    punchOut: null,
    workingHours: 0,
    status: "absent",
  },
  {
    id: "4",
    date: "2024-08-14",
    punchIn: "10:30",
    punchOut: "19:00",
    workingHours: 510,
    status: "late",
  },
  {
    id: "5",
    date: "2024-08-13",
    punchIn: "09:05",
    punchOut: "18:10",
    workingHours: 545,
    status: "present",
  },
  {
    id: "6",
    date: "2024-08-12",
    punchIn: "09:00",
    punchOut: "13:00",
    workingHours: 240,
    status: "half-day",
  },
  {
    id: "7",
    date: "2024-08-11",
    punchIn: "08:55",
    punchOut: "18:05",
    workingHours: 550,
    status: "present",
  },
];

const statusColors = {
  present: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  absent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "half-day": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

const statusIcons = {
  present: CheckCircle,
  absent: XCircle,
  late: AlertTriangle,
  "half-day": Timer,
};

export default function AttendanceHistory({ employeeId }: AttendanceHistoryProps) {
  const { data: attendanceHistory = [], isLoading } = useQuery({
    queryKey: [`/api/employees/${employeeId}/attendance`],
  });

  // Use mock data for now, replace with real data when available
  const historyData = Array.isArray(attendanceHistory) && attendanceHistory.length > 0 ? attendanceHistory.slice(0, 7) : mockAttendanceHistory;

  const formatWorkingHours = (minutes: number) => {
    if (minutes === 0) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Last 7 Days Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {historyData.map((record: any) => {
              const StatusIcon = statusIcons[record.status as keyof typeof statusIcons];
              return (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <p className="font-medium">{getDayName(record.date)}</p>
                      <p className="text-gray-500">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <p className="font-medium">
                        {record.punchIn && record.punchOut 
                          ? `${record.punchIn} - ${record.punchOut}`
                          : record.punchIn 
                            ? `${record.punchIn} - ...`
                            : "-"
                        }
                      </p>
                      <p className="text-gray-500">
                        {formatWorkingHours(record.workingHours)}
                      </p>
                    </div>
                    
                    <Badge className={statusColors[record.status as keyof typeof statusColors]}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500">This Week Average</p>
              <p className="font-semibold text-blue-600">8h 15m</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Attendance Rate</p>
              <p className="font-semibold text-green-600">85.7%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}