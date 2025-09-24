import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface ProfileTabsProps {
  profile: EmployeeProfile;
  attendanceData: AttendanceData[];
  leaveRecords: LeaveRecord[];
  documents: Document[];
  performanceData: PerformanceData[];
  activeTab?: string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profile,
  attendanceData,
  leaveRecords,
  documents,
  performanceData,
  activeTab = "overview",
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const calculateTenure = () => {
    const now = new Date();
    const joining = profile.joiningDate;
    const diffTime = Math.abs(now.getTime() - joining.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
    }
    return `${months} month${months !== 1 ? "s" : ""}`;
  };

  // Render specific tab content based on activeTab prop
  const renderTabContent = () => {
    switch (activeTab) {
      case "attendance":
        return renderAttendanceTab();
      case "leave":
        return renderLeaveTab();
      case "documents":
        return renderDocumentsTab();
      case "performance":
        return renderPerformanceTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                      <p className="font-medium text-gray-900 dark:text-white" data-testid="profile-email">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Phone className="h-4 w-4 text-green-500" />
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Contact</label>
                      <p className="font-medium text-gray-900 dark:text-white" data-testid="profile-contact">{profile.contactNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Location</label>
                      <p className="font-medium text-gray-900 dark:text-white" data-testid="profile-location">{profile.location}</p>
                    </div>
                  </div>

                  {profile.gender && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <User className="h-4 w-4 text-purple-500" />
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Gender</label>
                        <p className="font-medium text-gray-900 dark:text-white" data-testid="profile-gender">{profile.gender}</p>
                      </div>
                    </div>
                  )}

                  {profile.dateOfBirth && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</label>
                        <p className="font-medium text-gray-900 dark:text-white" data-testid="profile-dob">{formatDate(profile.dateOfBirth)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Briefcase className="h-5 w-5 text-indigo-500" />
                  Work Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Building className="h-4 w-4 text-purple-500" />
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Department</label>
                      <p className="font-medium text-gray-900 dark:text-white" data-testid="work-department">{profile.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Briefcase className="h-4 w-4 text-orange-500" />
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Designation</label>
                      <p className="font-medium text-gray-900 dark:text-white" data-testid="work-designation">{profile.designation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Joining Date</label>
                      <p className="font-medium text-gray-900 dark:text-white" data-testid="work-joining">{formatDate(profile.joiningDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Clock className="h-4 w-4 text-teal-500" />
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Tenure</label>
                      <p className="font-medium text-gray-900 dark:text-white" data-testid="work-tenure">{calculateTenure()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <User className="h-4 w-4 text-indigo-500" />
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Reporting Manager</label>
                      <p className="font-medium text-gray-900 dark:text-white" data-testid="work-manager">{profile.reportingManager}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <Card className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="h-5 w-5 text-green-500" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed" data-testid="profile-bio">
                  {profile.bio}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Attendance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {attendanceData.filter(a => a.status === 'present').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Present Days</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {attendanceData.filter(a => a.status === 'absent').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Absent Days</p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {attendanceData.filter(a => a.status === 'late').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Late Days</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {((attendanceData.filter(a => a.status === 'present').length / attendanceData.length) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {attendanceData.slice(0, 10).map((attendance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        attendance.status === 'present' ? 'bg-green-500' :
                        attendance.status === 'absent' ? 'bg-red-500' :
                        attendance.status === 'late' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="font-medium">{attendance.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {attendance.checkIn && <span>In: {attendance.checkIn}</span>}
                      {attendance.checkOut && <span>Out: {attendance.checkOut}</span>}
                      <Badge variant={attendance.status === 'present' ? 'default' : 'destructive'}>
                        {attendance.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave History Tab */}
        <TabsContent value="leave" className="space-y-6">
          <Card className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Leave History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRecords.map((leave, index) => (
                  <div key={leave.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={leave.status === 'approved' ? 'default' : leave.status === 'pending' ? 'secondary' : 'destructive'}>
                          {leave.type}
                        </Badge>
                        <span className="font-medium">{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                      </div>
                      <Badge variant={leave.status === 'approved' ? 'default' : leave.status === 'pending' ? 'secondary' : 'destructive'}>
                        {leave.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{leave.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Documents
              </CardTitle>
              <Button size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {doc.type} • {(doc.size / 1024).toFixed(1)} KB • {formatDate(doc.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((perf, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{perf.month}</p>
                      {perf.feedback && <p className="text-sm text-gray-600 dark:text-gray-400">{perf.feedback}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400">{perf.score}/100</p>
                      </div>
                      <div className="w-24">
                        <Progress value={perf.score} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;