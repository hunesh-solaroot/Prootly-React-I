import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, Sun, User, LogOut, Shield, Globe } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Link } from "wouter";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false,
  });

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      // Handle logout logic here
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Theme Settings */}
      <Card className="bg-white dark:bg-gray-900 shadow-sm border border-slate-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300">Theme</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose your preferred theme for the application
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white dark:bg-gray-900 shadow-sm border border-slate-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-700 dark:text-slate-300">Email Notifications</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>

            <Separator className="dark:border-gray-700" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-700 dark:text-slate-300">Push Notifications</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>

            <Separator className="dark:border-gray-700" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-700 dark:text-slate-300">SMS Notifications</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receive important updates via SMS
                </p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
              />
            </div>

            <Separator className="dark:border-gray-700" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-700 dark:text-slate-300">Marketing Communications</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receive newsletters and promotional content
                </p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="bg-white dark:bg-gray-900 shadow-sm border border-slate-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <User className="w-5 h-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/profile">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            
            <Button variant="outline" className="justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>
            
            <Button variant="outline" className="justify-start">
              <Globe className="w-4 h-4 mr-2" />
              Language & Region
            </Button>
            
            <Button 
              variant="destructive" 
              className="justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-white dark:bg-gray-900 shadow-sm border border-slate-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200">System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Version</span>
            <span className="text-slate-800 dark:text-slate-200">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Last Updated</span>
            <span className="text-slate-800 dark:text-slate-200">July 29, 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Environment</span>
            <span className="text-slate-800 dark:text-slate-200">Development</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
