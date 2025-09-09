import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Printer, X, MessageCircle, UserPlus, Camera, Edit, MapPin, Calendar, Users, TrendingUp, Settings, FileText, User, Clock, Building2, Target, Award, BarChart3, Upload, Activity, Zap, CheckCircle, AlertCircle, PauseCircle, XCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";
import ProfileTabsSimple from "@/components/profile/ProfileTabsSimple";
import EditProfileModal from "@/components/profile/EditProfileModal";
import GradeBadge from "@/components/profile/GradeBadge";
import { EmployeeProfile, AttendanceData, LeaveRecord, Document, PerformanceData, ProjectInvolvement, WorkingHours, KPIData, Achievement, LeaveSummary } from "../../../shared/types";

// Mock data - in real app this would come from API/database
const mockProfileData: EmployeeProfile = {
  id: "emp-001",
  employeeId: "EMP001",
  fullName: "Ashwini Bhardwaj",
  department: "Renewable Energy",
  designation: "Senior Renewable Energy Specialist",
  email: "ashwini@prootly.com",
  contactNumber: "+91 9876543210",
  joiningDate: new Date("2022-03-15"),
  profilePicture: null,
  performanceScore: 87,
  location: "Mumbai, India",
  workSchedule: "Full-time",
  reportingManager: "Rajesh Kumar",
  teamSize: 8,
  projectsCompleted: 23,
  gender: "Female",
  dateOfBirth: new Date("1992-08-15"),
  skills: ["Solar Energy", "Project Management", "AutoCAD", "Team Leadership", "Renewable Systems", "Sustainability"],
  bio: "Passionate renewable energy specialist with over 5 years of experience in solar energy systems design and implementation. Dedicated to sustainable energy solutions and leading high-performance teams to deliver innovative projects that contribute to a greener future."
};

const mockAttendanceData: AttendanceData[] = [
  { date: "2024-08-01", status: "present", checkIn: "09:15", checkOut: "18:30" },
  { date: "2024-08-02", status: "present", checkIn: "09:00", checkOut: "18:15" },
  { date: "2024-08-03", status: "absent" },
  { date: "2024-08-04", status: "present", checkIn: "09:10", checkOut: "18:20" },
  { date: "2024-08-05", status: "late", checkIn: "10:30", checkOut: "19:00" },
  { date: "2024-08-06", status: "present", checkIn: "08:45", checkOut: "17:45" },
  { date: "2024-08-07", status: "present", checkIn: "09:05", checkOut: "18:10" },
  { date: "2024-08-08", status: "half-day", checkIn: "09:00", checkOut: "13:00" },
  { date: "2024-08-09", status: "present", checkIn: "09:20", checkOut: "18:25" },
  { date: "2024-08-10", status: "present", checkIn: "08:55", checkOut: "18:05" },
];

const mockLeaveRecords: LeaveRecord[] = [
  {
    id: "leave-001",
    type: "vacation",
    startDate: new Date("2024-07-15"),
    endDate: new Date("2024-07-19"),
    days: 5,
    status: "approved",
    reason: "Family vacation to Goa"
  },
  {
    id: "leave-002", 
    type: "sick",
    startDate: new Date("2024-06-10"),
    endDate: new Date("2024-06-11"),
    days: 2,
    status: "approved",
    reason: "Fever and cold"
  },
  {
    id: "leave-003",
    type: "personal",
    startDate: new Date("2024-09-05"),
    endDate: new Date("2024-09-05"),
    days: 1,
    status: "pending",
    reason: "Personal work"
  }
];

const mockDocuments: Document[] = [
  {
    id: "doc-001",
    name: "Aadhaar Card",
    type: "PDF",
    size: 2048,
    uploadDate: new Date("2022-03-20"),
    url: "#"
  },
  {
    id: "doc-002",
    name: "PAN Card",
    type: "PDF", 
    size: 1536,
    uploadDate: new Date("2022-03-20"),
    url: "#"
  },
  {
    id: "doc-003",
    name: "Educational Certificate",
    type: "PDF",
    size: 3072,
    uploadDate: new Date("2022-03-22"),
    url: "#"
  },
  {
    id: "doc-004",
    name: "Experience Certificate",
    type: "PDF",
    size: 1024,
    uploadDate: new Date("2022-03-25"),
    url: "#"
  }
];

const mockPerformanceData: PerformanceData[] = [
  { month: "August 2024", score: 87, goals: 90, feedback: "Excellent work on the solar panel installation project" },
  { month: "July 2024", score: 92, goals: 85, feedback: "Outstanding leadership during the team restructuring" },
  { month: "June 2024", score: 85, goals: 80, feedback: "Good progress on renewable energy initiatives" },
  { month: "May 2024", score: 89, goals: 85, feedback: "Strong performance in client presentations" },
  { month: "April 2024", score: 81, goals: 80, feedback: "Met all project deadlines successfully" },
  { month: "March 2024", score: 88, goals: 85, feedback: "Excellent team collaboration and project delivery" }
];

const mockProjectInvolvement: ProjectInvolvement[] = [
  {
    id: "proj-001",
    name: "Solar Farm Development - Phase II",
    status: "active",
    progress: 75,
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-12-15"),
    role: "Project Lead",
    priority: "high"
  },
  {
    id: "proj-002",
    name: "Wind Energy Feasibility Study",
    status: "completed",
    progress: 100,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-05-30"),
    role: "Technical Consultant",
    priority: "medium"
  },
  {
    id: "proj-003",
    name: "Green Building Certification",
    status: "active",
    progress: 45,
    startDate: new Date("2024-07-15"),
    endDate: new Date("2025-01-30"),
    role: "Sustainability Expert",
    priority: "medium"
  },
  {
    id: "proj-004",
    name: "Energy Storage Solutions",
    status: "on-hold",
    progress: 30,
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-10-15"),
    role: "Senior Engineer",
    priority: "low"
  }
];

const mockWorkingHours: WorkingHours[] = [
  {
    week: "This Week",
    totalHours: 42,
    regularHours: 40,
    overtimeHours: 2,
    efficiency: 95
  },
  {
    week: "Last Week",
    totalHours: 45,
    regularHours: 40,
    overtimeHours: 5,
    efficiency: 88
  }
];

const mockKPIData: KPIData[] = [
  {
    metric: "Project Delivery",
    value: 95,
    target: 90,
    unit: "%",
    trend: "up",
    change: 5
  },
  {
    metric: "Client Satisfaction",
    value: 4.8,
    target: 4.5,
    unit: "/5",
    trend: "up",
    change: 0.3
  },
  {
    metric: "Team Efficiency",
    value: 87,
    target: 85,
    unit: "%",
    trend: "stable",
    change: 0
  },
  {
    metric: "Innovation Score",
    value: 92,
    target: 85,
    unit: "%",
    trend: "up",
    change: 7
  }
];

const mockAchievements: Achievement[] = [
  {
    id: "ach-001",
    title: "Certified Solar Energy Professional",
    description: "Advanced certification in solar energy systems design and implementation",
    date: new Date("2024-05-15"),
    type: "certification",
    issuer: "Solar Power International"
  },
  {
    id: "ach-002",
    title: "Employee of the Quarter Q2 2024",
    description: "Recognized for exceptional performance and leadership in renewable energy projects",
    date: new Date("2024-06-30"),
    type: "award",
    issuer: "Prootly Energy Solutions"
  },
  {
    id: "ach-003",
    title: "Project Management Professional",
    description: "PMP certification for advanced project management skills",
    date: new Date("2024-03-20"),
    type: "certification",
    issuer: "Project Management Institute"
  },
  {
    id: "ach-004",
    title: "Green Building Expert",
    description: "Completed advanced training in sustainable building practices",
    date: new Date("2024-07-10"),
    type: "training",
    issuer: "Green Building Council"
  }
];

const mockLeaveSummary: LeaveSummary = {
  totalLeaves: 30,
  usedLeaves: 8,
  remainingLeaves: 22,
  casualLeaves: 12,
  sickLeaves: 10,
  annualLeaves: 8
};

export default function Profile() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<EmployeeProfile>(mockProfileData);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fade-in animation on component mount
  useEffect(() => {
    setIsVisible(true);
    
    // Animate performance score
    const timer = setTimeout(() => {
      let current = 0;
      const increment = profileData.performanceScore / 50;
      const scoreAnimation = setInterval(() => {
        current += increment;
        if (current >= profileData.performanceScore) {
          setAnimatedScore(profileData.performanceScore);
          clearInterval(scoreAnimation);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, 20);
      
      return () => clearInterval(scoreAnimation);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [profileData.performanceScore]);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (updatedProfile: EmployeeProfile) => {
    setProfileData(updatedProfile);
    // In real app, this would save to backend
    localStorage.setItem("employee-profile", JSON.stringify(updatedProfile));
  };

  const handleDownloadPDF = () => {
    // In real app, this would generate and download a PDF
    console.log("Downloading profile as PDF...");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    document.getElementById('image-upload')?.click();
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Full Width Container */}
        <div className="w-full">
          {/* Cover Banner & Profile Header */}
          <div className="relative">
            {/* Cover Image */}
            <div className="h-64 md:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black bg-opacity-30"></div>
              {/* Geometric pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>

            {/* Profile Picture - Overlapping the banner */}
            <div className="absolute -bottom-16 left-4 md:left-8">
              <div className="relative">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-6 border-white dark:border-gray-800 shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300" 
                      onClick={() => setIsImageModalOpen(true)}>
                  <AvatarImage src={profileData.profilePicture || ""} />
                  <AvatarFallback className="text-4xl md:text-5xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {profileData.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                      onClick={triggerImageUpload}
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload new profile picture</p>
                  </TooltipContent>
                </Tooltip>
                <input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm gap-2 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 border-white/20"
                data-testid="download-pdf-button"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm gap-2 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 border-white/20"
                data-testid="print-button"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="w-full px-4 md:px-8 pb-6 pt-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              {/* Name and Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{profileData.fullName}</h1>
                  <GradeBadge score={profileData.performanceScore} />
                </div>
                <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">{profileData.designation}</p>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {profileData.joiningDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 gap-2">
                  <UserPlus className="h-4 w-4" />
                  Follow
                </Button>
                <Button variant="outline" className="px-6 py-2 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEditProfile}
                  className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-6 grid grid-cols-3 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{profileData.teamSize}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{profileData.projectsCompleted}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{animatedScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Performance Score</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="w-full px-4 md:px-8">
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-8 bg-transparent h-12">
                  <TabsTrigger 
                    value="posts" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-3 px-2 text-sm"
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="about" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-3 px-2 text-sm"
                  >
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-3 px-2 text-sm"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger 
                    value="performance" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-3 px-2 text-sm"
                  >
                    Performance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="attendance" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-3 px-2 text-sm"
                  >
                    Attendance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="leave" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-3 px-2 text-sm"
                  >
                    Leave
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-3 px-2 text-sm"
                  >
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-3 px-2 text-sm"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content */}
                <div className="w-full py-8 px-4 md:px-8">
                  <TabsContent value="posts" className="space-y-6">
                    <Card className="bg-white dark:bg-[#1e1e1e]">
                      <CardContent className="p-6">
                        <div className="text-center py-12">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">Share your thoughts, achievements, or updates with your team.</p>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">Create Post</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="about" className="space-y-6">
                    {/* Bio Section */}
                    <Card className="bg-white dark:bg-[#1e1e1e] hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <User className="h-5 w-5 text-blue-500" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About Me</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profileData.bio}</p>
                      </CardContent>
                    </Card>

                    {/* Main Dashboard Grid - Full width with no gaps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      
                      {/* Personal Information Card */}
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500 rounded-lg">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Personal Info</h3>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Employee ID</p>
                              <p className="font-medium text-gray-900 dark:text-white">{profileData.employeeId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                              <p className="font-medium text-gray-900 dark:text-white">{profileData.department}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Joining Date</p>
                              <p className="font-medium text-gray-900 dark:text-white">{profileData.joiningDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Grade & Performance Card */}
                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500 rounded-lg">
                              <Target className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Performance</h3>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{animatedScore}</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                            <div className="mt-3 bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${animatedScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Leave Summary Card */}
                      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-500 rounded-lg">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Leave Summary</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-center">
                            <div>
                              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{mockLeaveSummary.usedLeaves}</div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Used</p>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{mockLeaveSummary.remainingLeaves}</div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Remaining</p>
                            </div>
                          </div>
                          <div className="mt-3 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Total: {mockLeaveSummary.totalLeaves} days
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Working Hours Card */}
                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500 rounded-lg">
                              <Clock className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Working Hours</h3>
                          </div>
                          <div className="space-y-3">
                            {mockWorkingHours.map((week, index) => (
                              <div key={index}>
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{week.week}</p>
                                  <p className="font-semibold text-purple-600 dark:text-purple-400">{week.totalHours}h</p>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                  Regular: {week.regularHours}h | OT: {week.overtimeHours}h
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* KPI Overview Card */}
                      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-500 rounded-lg">
                              <BarChart3 className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">KPI Overview</h3>
                          </div>
                          <div className="space-y-3">
                            {mockKPIData.slice(0, 2).map((kpi, index) => (
                              <div key={index}>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.metric}</p>
                                  <div className="flex items-center gap-1">
                                    {kpi.trend === 'up' && <ArrowUp className="h-3 w-3 text-green-500" />}
                                    {kpi.trend === 'down' && <ArrowDown className="h-3 w-3 text-red-500" />}
                                    {kpi.trend === 'stable' && <Minus className="h-3 w-3 text-gray-500" />}
                                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                      {kpi.value}{kpi.unit}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-1 bg-indigo-200 dark:bg-indigo-800 rounded-full h-1.5">
                                  <div 
                                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000" 
                                    style={{ width: `${(kpi.value / kpi.target) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Document Upload Section */}
                      <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-teal-500 rounded-lg">
                              <Upload className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Documents</h3>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">{mockDocuments.length}</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Documents Uploaded</p>
                            <Button size="sm" variant="outline" className="gap-2 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                              <Upload className="h-3 w-3" />
                              Upload New
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Project Involvement Section */}
                    <Card className="bg-white dark:bg-[#1e1e1e] hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Building2 className="h-5 w-5 text-blue-500" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Involvement</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mockProjectInvolvement.map((project) => (
                            <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{project.name}</h4>
                                <div className="flex items-center gap-2">
                                  {project.status === 'active' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                  {project.status === 'completed' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                                  {project.status === 'on-hold' && <PauseCircle className="h-4 w-4 text-yellow-500" />}
                                  {project.status === 'cancelled' && <XCircle className="h-4 w-4 text-red-500" />}
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    project.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                  }`}>
                                    {project.priority}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.role}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-500">Progress</span>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{project.progress}%</span>
                              </div>
                              <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Achievements/Certifications Section */}
                    <Card className="bg-white dark:bg-[#1e1e1e] hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements & Certifications</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mockAchievements.map((achievement) => (
                            <div key={achievement.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-lg hover:shadow-md transition-shadow duration-200">
                              <div className={`p-2 rounded-lg ${
                                achievement.type === 'certification' ? 'bg-blue-500' :
                                achievement.type === 'award' ? 'bg-yellow-500' :
                                achievement.type === 'training' ? 'bg-green-500' :
                                'bg-purple-500'
                              }`}>
                                <Award className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{achievement.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{achievement.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize">
                                    {achievement.type}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-500">
                                    {achievement.date.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Skills Section */}
                    <Card className="bg-white dark:bg-[#1e1e1e] hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Zap className="h-5 w-5 text-purple-500" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Expertise</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills?.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 cursor-default">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-6">
                    {/* Projects Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6 text-center">
                          <Building2 className="h-8 w-8 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{mockProjectInvolvement.length}</div>
                          <div className="text-sm opacity-90">Total Projects</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <CardContent className="p-6 text-center">
                          <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{mockProjectInvolvement.filter(p => p.status === 'completed').length}</div>
                          <div className="text-sm opacity-90">Completed</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-6 text-center">
                          <Activity className="h-8 w-8 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{mockProjectInvolvement.filter(p => p.status === 'active').length}</div>
                          <div className="text-sm opacity-90">Active</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6 text-center">
                          <Target className="h-8 w-8 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{Math.round(mockProjectInvolvement.reduce((acc, p) => acc + p.progress, 0) / mockProjectInvolvement.length)}%</div>
                          <div className="text-sm opacity-90">Avg Progress</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Projects List */}
                    <Card className="bg-white dark:bg-[#1e1e1e]">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Project Details</h3>
                        <div className="space-y-4">
                          {mockProjectInvolvement.map((project) => (
                            <div key={project.id} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-lg ${
                                    project.status === 'active' ? 'bg-green-100 dark:bg-green-900/20' :
                                    project.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/20' :
                                    project.status === 'on-hold' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                                    'bg-red-100 dark:bg-red-900/20'
                                  }`}>
                                    {project.status === 'active' && <CheckCircle className="h-5 w-5 text-green-600" />}
                                    {project.status === 'completed' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                                    {project.status === 'on-hold' && <PauseCircle className="h-5 w-5 text-yellow-600" />}
                                    {project.status === 'cancelled' && <XCircle className="h-5 w-5 text-red-600" />}
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {project.role} • {project.startDate.toLocaleDateString()} - {project.endDate.toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge className={`${
                                    project.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                  }`}>
                                    {project.priority} priority
                                  </Badge>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
                                    {project.status}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
                                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                  <div 
                                    className={`h-3 rounded-full transition-all duration-1000 ${
                                      project.progress >= 80 ? 'bg-green-500' :
                                      project.progress >= 50 ? 'bg-blue-500' :
                                      project.progress >= 25 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-6">
                    {/* Performance Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {mockKPIData.map((kpi, index) => (
                        <Card key={index} className="bg-white dark:bg-[#1e1e1e] hover:shadow-lg transition-shadow duration-300">
                          <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-3">
                              {kpi.trend === 'up' && <ArrowUp className="h-5 w-5 text-green-500" />}
                              {kpi.trend === 'down' && <ArrowDown className="h-5 w-5 text-red-500" />}
                              {kpi.trend === 'stable' && <Minus className="h-5 w-5 text-gray-500" />}
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{kpi.metric}</h3>
                            </div>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                              {kpi.value}{kpi.unit}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Target: {kpi.target}{kpi.unit}</p>
                            <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                  kpi.value >= kpi.target ? 'bg-green-500' : 
                                  kpi.value >= kpi.target * 0.8 ? 'bg-blue-500' : 
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Performance Timeline */}
                    <Card className="bg-white dark:bg-[#1e1e1e]">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          Performance Timeline
                        </h3>
                        <div className="space-y-4">
                          {mockPerformanceData.map((data, index) => (
                            <div key={index} className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{data.score}</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{data.month}</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Goal: {data.goals}</span>
                                    {data.score >= data.goals ? 
                                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                      <AlertCircle className="h-4 w-4 text-orange-500" />
                                    }
                                  </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{data.feedback}</p>
                                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                      data.score >= 90 ? 'bg-green-500' :
                                      data.score >= 80 ? 'bg-blue-500' :
                                      data.score >= 70 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${data.score}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="attendance" className="space-y-6">
                    <ProfileTabsSimple
                      profile={profileData}
                      attendanceData={mockAttendanceData}
                      leaveRecords={mockLeaveRecords}
                      documents={mockDocuments}
                      performanceData={mockPerformanceData}
                      activeTab="attendance"
                    />
                  </TabsContent>

                  <TabsContent value="leave" className="space-y-6">
                    <ProfileTabsSimple
                      profile={profileData}
                      attendanceData={mockAttendanceData}
                      leaveRecords={mockLeaveRecords}
                      documents={mockDocuments}
                      performanceData={mockPerformanceData}
                      activeTab="leave"
                    />
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-6">
                    <ProfileTabsSimple
                      profile={profileData}
                      attendanceData={mockAttendanceData}
                      leaveRecords={mockLeaveRecords}
                      documents={mockDocuments}
                      performanceData={mockPerformanceData}
                      activeTab="documents"
                    />
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-6">
                    <ProfileTabsSimple
                      profile={profileData}
                      attendanceData={mockAttendanceData}
                      leaveRecords={mockLeaveRecords}
                      documents={mockDocuments}
                      performanceData={mockPerformanceData}
                      activeTab="performance"
                    />
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <Card className="bg-white dark:bg-[#1e1e1e]">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Settings</h3>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Notifications</label>
                              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                <option>All notifications</option>
                                <option>Important only</option>
                                <option>None</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Privacy Level</label>
                              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                <option>Public</option>
                                <option>Team only</option>
                                <option>Private</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Show performance score publicly</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Allow team members to see your performance grade</p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Activity status</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Show when you're online or away</p>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profileData}
          onSave={handleSaveProfile}
        />

        {/* Profile Image Modal */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Profile Picture
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsImageModalOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-6">
              <Avatar className="w-80 h-80 border-4 border-gray-200 dark:border-gray-700 shadow-2xl">
                <AvatarImage src={profileData.profilePicture || ""} />
                <AvatarFallback className="text-8xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {profileData.fullName.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center space-y-2 pb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{profileData.fullName}</h3>
              <p className="text-gray-600 dark:text-gray-400">{profileData.designation}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}