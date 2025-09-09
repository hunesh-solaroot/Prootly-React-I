// components/notifications/NotificationPanel.tsx
import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  navigationNotifications, 
  NavigationNotification 
} from '@/lib/notificationsData';

// Helper function to group notifications by date
const groupByDate = (arr: NavigationNotification[]) => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date(now - (now % oneDay));
  const yesterday = new Date(today.getTime() - oneDay);
  
  return arr.reduce((acc, n) => {
    const d = new Date(n.timestamp);
    let key: string;
    if (d >= today) key = 'Today';
    else if (d >= yesterday) key = 'Yesterday';
    else key = d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    (acc[key] = acc[key] || []).push(n);
    return acc;
  }, {} as Record<string, NavigationNotification[]>);
};

// Notification item component
const NotificationItem = ({ notification }: { notification: NavigationNotification }) => {
  const [isRead, setIsRead] = useState(notification.read);
  
  const handleClick = () => {
    if (!isRead) {
      setIsRead(true);
      notification.read = true; // Update the original object
    }
  };

  return (
    <div 
      className={`flex items-start space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer ${isRead ? 'opacity-60' : ''}`}
      onClick={handleClick}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notification.color}`}>
        <notification.icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {notification.title}{' '}
          <span className="text-green-600 font-semibold">({notification.planset})</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {notification.sender} • {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// Main NotificationPanel component
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredNotifications = navigationNotifications.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.planset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}>
      <div 
        className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl border-l dark:border-gray-700 flex flex-col z-50 animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 py-4 border-b dark:border-gray-700">
          <Bell className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Notifications
          </h2>
        </div>
        
        {/* Search Bar */}
        <div className="p-3 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search notifications..." 
              className="pl-9 rounded-full text-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Notifications Content */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(groupByDate(filteredNotifications)).map(([label, items]) => (
            <div key={label}>
              <div className="text-xs uppercase text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-700/30 sticky top-0 font-medium">
                {label}
              </div>
              {items.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          ))}
          
          {filteredNotifications.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}