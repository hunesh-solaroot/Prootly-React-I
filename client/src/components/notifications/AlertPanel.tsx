// components/notifications/AlertPanel.tsx
import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  alerts, 
  Alert 
} from '@/lib/notificationsData';

// Alert item component
const AlertItem = ({ alert }: { alert: Alert }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [alertStatus, setAlertStatus] = useState(alert.status);

  const handleResolve = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertStatus('resolved');
    alert.status = 'resolved'; // Update the original object
  };

  const handleHold = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertStatus('on-hold');
    alert.status = 'on-hold'; // Update the original object
  };

  const getStatusColor = () => {
    switch (alertStatus) {
      case 'pending': return 'bg-red-500';
      case 'resolved': return 'bg-green-500';
      case 'on-hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50">
      <div className="flex items-start space-x-3">
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getStatusColor()}`} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {alert.project}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {alert.client}
          </p>
        </div>
        <div className="text-xs text-gray-500 whitespace-nowrap">
          {alert.time}
        </div>
      </div>
      
      <div className="pl-5 mt-1">
        <p 
          className={`text-xs text-gray-600 dark:text-gray-300 cursor-pointer ${!isExpanded ? 'line-clamp-3' : ''}`} 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {alert.remarks}
        </p>
      </div>
      
      {alertStatus === 'pending' && (
        <div className="pl-5 mt-3 flex space-x-2">
          <Button 
            size="sm" 
            variant="default"
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full h-auto"
            onClick={handleResolve}
          >
            Resolve
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs rounded-full h-auto"
            onClick={handleHold}
          >
            On Hold
          </Button>
        </div>
      )}

      {alertStatus === 'resolved' && (
        <div className="pl-5 mt-2">
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            ✓ Resolved
          </span>
        </div>
      )}

      {alertStatus === 'on-hold' && (
        <div className="pl-5 mt-2">
          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
            ⏸ On Hold
          </span>
        </div>
      )}
    </div>
  );
};

// Main AlertPanel component
interface AlertPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertPanel({ isOpen, onClose }: AlertPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter(a =>
    a.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}>
      <div 
        className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl border-l dark:border-gray-700 flex flex-col z-50 animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 py-4 border-b dark:border-gray-700">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Alerts
          </h2>
        </div>
        
        {/* Search Bar */}
        <div className="p-3 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search alerts..." 
              className="pl-9 rounded-full text-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Alerts Content */}
        <div className="flex-1 overflow-y-auto">
          {['Design Query', 'R&D Approval', 'Redesign'].map(category => {
            const categoryAlerts = filteredAlerts.filter(a => a.category === category);
            if (categoryAlerts.length === 0) return null;
            
            return (
              <div key={category}>
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 px-4 py-2 bg-gray-50 dark:bg-gray-700/30 sticky top-0 font-medium">
                  {category}
                </div>
                {categoryAlerts.map((alert, index) => (
                  <AlertItem key={`${category}-${index}`} alert={alert} />
                ))}
              </div>
            );
          })}
          
          {filteredAlerts.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No alerts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}