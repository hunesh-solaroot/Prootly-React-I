import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Bell, FileText, Edit, CheckCircle, UserCheck, Play, Shield, ShieldCheck, Truck, XCircle, Pause, PlayCircle, ArrowUp, ArrowDown, RotateCw, Clock } from 'lucide-react';

// --- Type Definitions ---
interface Notification {
  id: number;
  category: string;
  user: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  projectInfo: {
    id: string;
    customerName: string;
    company: string;
  };
}

// --- Icon Mapping ---
const iconMap: { [key: string]: React.ReactNode } = {
  FileText: <FileText className="w-4 h-4 text-white" />,
  Edit: <Edit className="w-4 h-4 text-white" />,
  CheckCircle: <CheckCircle className="w-4 h-4 text-white" />,
  UserCheck: <UserCheck className="w-4 h-4 text-white" />,
  Play: <Play className="w-4 h-4 text-white" />,
  Shield: <Shield className="w-4 h-4 text-white" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-white" />,
  Truck: <Truck className="w-4 h-4 text-white" />,
  XCircle: <XCircle className="w-4 h-4 text-white" />,
  Pause: <Pause className="w-4 h-4 text-white" />,
  PlayCircle: <PlayCircle className="w-4 h-4 text-white" />,
  ArrowUp: <ArrowUp className="w-4 h-4 text-white" />,
  ArrowDown: <ArrowDown className="w-4 h-4 text-white" />,
  RotateCw: <RotateCw className="w-4 h-4 text-white" />,
  Clock: <Clock className="w-4 h-4 text-white" />,
};

// --- Main Component ---
export function NotificationPanel({ isOpen, onClose, notifications, projectInfo }: NotificationPanelProps) {
  if (!isOpen) {
    return null; // The component is hidden if not open
  }

  const groupedNotifications = notifications.reduce((acc, n) => {
    (acc[n.category] = acc[n.category] || []).push(n);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}>
      <div 
        className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="relative bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 p-4 text-center">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Activities for Project {projectInfo.id}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{projectInfo.customerName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{projectInfo.company}</p>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(groupedNotifications).map(([category, items]) => (
            <div key={category}>
              <div className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-100 dark:bg-gray-700/30 sticky top-0">
                {category}
              </div>
              {items.map(n => (
                <div key={n.id} className="flex items-start space-x-3 p-4 border-b dark:border-gray-700">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.color}`}>
                    {iconMap[n.icon] || <FileText className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{n.subtitle}</p>
                    <p className="text-xs italic text-gray-600 dark:text-gray-500 mt-1">— {n.user}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}