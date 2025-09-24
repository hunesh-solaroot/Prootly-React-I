import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings,
  Building,
  Clock,
  Calendar,
  Mail,
  Shield,
  Database,
  Bell,
  Users,
  Save,
  RefreshCw
} from "lucide-react";

export default function OrganisationSettings() {
  const [settings, setSettings] = useState({
    // Company Settings
    companyName: "GreenTech Solutions",
    companyEmail: "admin@greentech.com",
    companyPhone: "+1 (555) 123-4567",
    companyAddress: "123 Green Street, Eco City, EC 12345",
    timezone: "America/New_York",
    dateFormat: "MM/dd/yyyy",
    
    // Working Hours
    workStartTime: "09:00",
    workEndTime: "17:00",
    workDaysPerWeek: "5",
    weekStartDay: "monday",
    
    // Leave Settings
    annualLeaveQuota: 25,
    sickLeaveQuota: 10,
    personalLeaveQuota: 5,
    leaveCarryForward: true,
    leaveApprovalRequired: true,
    
    // Attendance Settings
    lateThreshold: 15, // minutes
    halfDayThreshold: 4, // hours
    overtimeThreshold: 8, // hours
    trackLocation: false,
    requireCheckout: true,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    attendanceReminders: true,
    leaveNotifications: true,
    payrollNotifications: true,
    
    // Security
    passwordExpiry: 90, // days
    sessionTimeout: 30, // minutes
    twoFactorAuth: false,
    ipWhitelist: "",
    
    // Data & Backup
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365, // days
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // Implement save functionality
  };

  const handleReset = () => {
    console.log("Resetting to defaults");
    // Implement reset functionality
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure your organization's HR system settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data & Backup</TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => handleSettingChange("companyEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    value={settings.companyPhone}
                    onChange={(e) => handleSettingChange("companyPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  value={settings.companyAddress}
                  onChange={(e) => handleSettingChange("companyAddress", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange("dateFormat", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                      <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                      <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekStartDay">Week Start Day</Label>
                  <Select value={settings.weekStartDay} onValueChange={(value) => handleSettingChange("weekStartDay", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Settings */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Attendance Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workStartTime">Work Start Time</Label>
                  <Input
                    id="workStartTime"
                    type="time"
                    value={settings.workStartTime}
                    onChange={(e) => handleSettingChange("workStartTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workEndTime">Work End Time</Label>
                  <Input
                    id="workEndTime"
                    type="time"
                    value={settings.workEndTime}
                    onChange={(e) => handleSettingChange("workEndTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateThreshold">Late Threshold (minutes)</Label>
                  <Input
                    id="lateThreshold"
                    type="number"
                    value={settings.lateThreshold}
                    onChange={(e) => handleSettingChange("lateThreshold", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="halfDayThreshold">Half Day Threshold (hours)</Label>
                  <Input
                    id="halfDayThreshold"
                    type="number"
                    value={settings.halfDayThreshold}
                    onChange={(e) => handleSettingChange("halfDayThreshold", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireCheckout">Require Check-out</Label>
                    <p className="text-sm text-gray-500">Employees must check out at end of day</p>
                  </div>
                  <Switch
                    id="requireCheckout"
                    checked={settings.requireCheckout}
                    onCheckedChange={(checked) => handleSettingChange("requireCheckout", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="trackLocation">Track Location</Label>
                    <p className="text-sm text-gray-500">Record GPS location during check-in/out</p>
                  </div>
                  <Switch
                    id="trackLocation"
                    checked={settings.trackLocation}
                    onCheckedChange={(checked) => handleSettingChange("trackLocation", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Settings */}
        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Leave Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualLeaveQuota">Annual Leave (days)</Label>
                  <Input
                    id="annualLeaveQuota"
                    type="number"
                    value={settings.annualLeaveQuota}
                    onChange={(e) => handleSettingChange("annualLeaveQuota", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sickLeaveQuota">Sick Leave (days)</Label>
                  <Input
                    id="sickLeaveQuota"
                    type="number"
                    value={settings.sickLeaveQuota}
                    onChange={(e) => handleSettingChange("sickLeaveQuota", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personalLeaveQuota">Personal Leave (days)</Label>
                  <Input
                    id="personalLeaveQuota"
                    type="number"
                    value={settings.personalLeaveQuota}
                    onChange={(e) => handleSettingChange("personalLeaveQuota", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="leaveCarryForward">Allow Carry Forward</Label>
                    <p className="text-sm text-gray-500">Allow unused leave to carry forward to next year</p>
                  </div>
                  <Switch
                    id="leaveCarryForward"
                    checked={settings.leaveCarryForward}
                    onCheckedChange={(checked) => handleSettingChange("leaveCarryForward", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="leaveApprovalRequired">Approval Required</Label>
                    <p className="text-sm text-gray-500">All leave requests require manager approval</p>
                  </div>
                  <Switch
                    id="leaveApprovalRequired"
                    checked={settings.leaveApprovalRequired}
                    onCheckedChange={(checked) => handleSettingChange("leaveApprovalRequired", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Send notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="attendanceReminders">Attendance Reminders</Label>
                    <p className="text-sm text-gray-500">Remind employees to check-in/out</p>
                  </div>
                  <Switch
                    id="attendanceReminders"
                    checked={settings.attendanceReminders}
                    onCheckedChange={(checked) => handleSettingChange("attendanceReminders", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="leaveNotifications">Leave Notifications</Label>
                    <p className="text-sm text-gray-500">Notify about leave requests and approvals</p>
                  </div>
                  <Switch
                    id="leaveNotifications"
                    checked={settings.leaveNotifications}
                    onCheckedChange={(checked) => handleSettingChange("leaveNotifications", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payrollNotifications">Payroll Notifications</Label>
                    <p className="text-sm text-gray-500">Notify about salary processing</p>
                  </div>
                  <Switch
                    id="payrollNotifications"
                    checked={settings.payrollNotifications}
                    onCheckedChange={(checked) => handleSettingChange("payrollNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => handleSettingChange("passwordExpiry", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for all users</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="Enter IP addresses, one per line"
                  value={settings.ipWhitelist}
                  onChange={(e) => handleSettingChange("ipWhitelist", e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-gray-500">Restrict access to specific IP addresses (optional)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Backup */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup">Automatic Backup</Label>
                    <p className="text-sm text-gray-500">Enable automatic data backups</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange("backupFrequency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange("dataRetention", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Create Manual Backup
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restore from Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}