import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, LogOut, LogIn, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PunchInOutCardProps {
  employeeId: string;
}

export default function PunchInOutCard({ employeeId }: PunchInOutCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get today's attendance
  const { data: todayAttendance, isLoading } = useQuery({
    queryKey: [`/api/attendance/today/${employeeId}`],
  });

  // Punch In mutation
  const punchInMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/attendance/punch-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to punch in");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/attendance/today/${employeeId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/attendance`] });
      toast({
        title: "Punched In Successfully",
        description: "Your work day has started!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Punch In Failed",
        description: error.message || "Failed to punch in",
        variant: "destructive",
      });
    },
  });

  // Punch Out mutation
  const punchOutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/attendance/punch-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to punch out");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/attendance/today/${employeeId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/attendance`] });
      toast({
        title: "Punched Out Successfully",
        description: "Have a great day!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Punch Out Failed",
        description: error.message || "Failed to punch out",
        variant: "destructive",
      });
    },
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatWorkingHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const attendance = todayAttendance as any;
  const isPunchedIn = attendance?.punchIn && !attendance?.punchOut;
  const isPunchedOut = attendance?.punchIn && attendance?.punchOut;
  const canPunchIn = !attendance?.punchIn;
  const canPunchOut = isPunchedIn;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Attendance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Time */}
        <div className="text-center">
          <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
            {formatTime(currentTime)}
          </p>
          <p className="text-sm text-gray-500">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Attendance Status */}
        <div className="flex justify-center">
          {isLoading ? (
            <Badge variant="secondary">Loading...</Badge>
          ) : canPunchIn ? (
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Punched In
            </Badge>
          ) : isPunchedIn ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              Punched In at {attendance.punchIn}
            </Badge>
          ) : isPunchedOut ? (
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              <LogOut className="h-3 w-3 mr-1" />
              Punched Out at {attendance.punchOut}
            </Badge>
          ) : null}
        </div>

        {/* Today's Details */}
        {attendance && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-500">Punch In</p>
              <p className="font-semibold">{attendance.punchIn || "-"}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Punch Out</p>
              <p className="font-semibold">{attendance.punchOut || "-"}</p>
            </div>
            {attendance.workingHours > 0 && (
              <div className="col-span-2 text-center">
                <p className="text-sm text-gray-500">Working Hours</p>
                <p className="font-semibold text-blue-600">
                  {formatWorkingHours(attendance.workingHours)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {canPunchIn && (
            <Button 
              onClick={() => punchInMutation.mutate()}
              disabled={punchInMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {punchInMutation.isPending ? "Punching In..." : "Punch In"}
            </Button>
          )}
          
          {canPunchOut && (
            <Button 
              onClick={() => punchOutMutation.mutate()}
              disabled={punchOutMutation.isPending}
              variant="outline"
              className="flex-1"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {punchOutMutation.isPending ? "Punching Out..." : "Punch Out"}
            </Button>
          )}
          
          {isPunchedOut && (
            <div className="flex-1 text-center text-sm text-gray-500 py-2">
              ✓ Work day completed
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}