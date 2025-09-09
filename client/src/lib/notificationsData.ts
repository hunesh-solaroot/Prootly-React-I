// lib/notificationsData.ts
import { FileText, Edit, CheckCircle, UserCheck, Play, Shield, ShieldCheck, Truck, XCircle, Pause, PlayCircle, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import React from 'react';

// Base notification interface for the existing system
interface Notification {
    id: number;
    projectId: number;
    category: 'TODAY' | 'YESTERDAY' | 'LAST WEEK';
    user: string;
    title: string;
    subtitle: string;
    color: string;
    icon: string;
}

// Navigation notification interface for the panel
export interface NavigationNotification {
  id: number;
  timestamp: string;
  sender: string;
  planset: string;
  read: boolean;
  title: string;
  color: string;
  icon: React.ElementType;
}

export interface Alert {
  project: string;
  client: string;
  remarks: string;
  time: string;
  category: 'Design Query' | 'R&D Approval' | 'Redesign';
  status: 'pending' | 'resolved' | 'on-hold';
}

export interface ChatContact {
  name: string;
  avatar: string;
  status: string;
  online: boolean;
}

export interface ChatMessage {
  from: 'me' | 'other';
  text: string;
  time: string;
}

const generateMockNotifications = (count: number): Notification[] => {
    const data: Notification[] = [];
    const users = ['Auto System', 'John Smith', 'Sarah Wilson', 'Mike Johnson', 'Dev Team A', 'Manager', 'Client', 'QA Team', 'QC Team'];
    const actions = [
        { title: 'Planset | Created', color: 'bg-blue-500', icon: 'FileText' },
        { title: 'Planset | Updated', color: 'bg-yellow-500', icon: 'Edit' },
        { title: 'Planset | Accepted', color: 'bg-green-500', icon: 'CheckCircle' },
        { title: 'Planset | Assigned', color: 'bg-purple-500', icon: 'UserCheck' },
        { title: 'Planset | In Production', color: 'bg-orange-500', icon: 'Play' },
        { title: 'Planset | Delivered', color: 'bg-green-600', icon: 'Truck' },
        { title: 'Planset | Cancelled', color: 'bg-red-600', icon: 'XCircle' },
        { title: 'Planset | Internal Hold', color: 'bg-gray-500', icon: 'Pause' },
        { title: 'Planset | External Hold', color: 'bg-red-400', icon: 'Clock' },
        { title: 'Planset | Rework Requested', color: 'bg-yellow-600', icon: 'RotateCw' },
    ];
    const categories: Notification['category'][] = ['TODAY', 'YESTERDAY', 'LAST WEEK'];

    for (let i = 1; i <= count; i++) {
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomProjectId = Math.floor(Math.random() * 50) + 1;
        const randomMinutes = Math.floor(Math.random() * 59) + 1;

        data.push({
            id: i,
            projectId: randomProjectId,
            category: randomCategory,
            user: randomUser,
            title: randomAction.title,
            subtitle: `${randomMinutes}m ago - System generated event.`,
            color: randomAction.color,
            icon: randomAction.icon,
        });
    }
    return data;
};

// Generate 100 notification items for existing system
export const notifications: Notification[] = generateMockNotifications(100);

// --- Navigation Panel Data ---
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;
const senders = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank'];
const plansets = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];

const rawNotifications = [
  { id: 1, title: 'A new planset has been created.', color: 'bg-blue-500', icon: FileText },
  { id: 2, title: 'The planset has been updated.', color: 'bg-blue-500', icon: Edit },
  { id: 3, title: 'The planset has been accepted.', color: 'bg-blue-500', icon: CheckCircle },
  { id: 4, title: 'The planset has been assigned.', color: 'bg-blue-500', icon: UserCheck },
  { id: 5, title: 'The planset is now in production.', color: 'bg-blue-500', icon: Play },
  { id: 6, title: 'Production stage is complete.', color: 'bg-blue-500', icon: CheckCircle },
  { id: 7, title: 'The planset is in quality check.', color: 'bg-blue-500', icon: Shield },
  { id: 8, title: 'Quality check has been completed.', color: 'bg-blue-500', icon: ShieldCheck },
  { id: 9, title: 'Internal hold: Design query.', color: 'bg-gray-500', icon: Pause },
  { id: 10, title: 'Internal hold has been removed.', color: 'bg-green-500', icon: PlayCircle },
  { id: 11, title: 'The planset is on external hold.', color: 'bg-red-400', icon: Clock },
  { id: 12, title: 'Marked as High Priority.', color: 'bg-red-500', icon: ArrowUp },
];

export const navigationNotifications: NavigationNotification[] = rawNotifications.map((n, i) => ({
  ...n,
  timestamp: new Date(now - i * (oneDay / 4)).toISOString(),
  sender: senders[i % senders.length],
  planset: plansets[i % plansets.length],
  read: i > 5, // Mark older ones as read
}));

export const alerts: Alert[] = [
  { 
    project: 'Website Redesign', 
    client: 'T&K Electric LLC', 
    remarks: 'Please review the latest mockup and let us know if the color palette is acceptable. We need your feedback by EOD so development can proceed on schedule.', 
    time: '2h ago', 
    category: 'Design Query', 
    status: 'pending' 
  },
  { 
    project: 'Mobile App', 
    client: 'Acme Corp', 
    remarks: 'Mockup feedback addressed. Updated icons, adjusted spacing, and refined typography across all screens.', 
    time: '1h ago', 
    category: 'Design Query', 
    status: 'pending' 
  },
  { 
    project: 'Dashboard UI', 
    client: 'Beta Industries', 
    remarks: 'Waiting on R&D sign-off before we can finalize the component library for reuse across the entire platform.', 
    time: '3h ago', 
    category: 'R&D Approval', 
    status: 'pending' 
  },
  { 
    project: 'Marketing Site', 
    client: 'Gamma LLC', 
    remarks: 'R&D has approved the design; go ahead and merge the feature branch into master for staging deploy.', 
    time: 'Just now', 
    category: 'R&D Approval', 
    status: 'pending' 
  },
  { 
    project: 'Landing Page', 
    client: 'Delta Co.', 
    remarks: 'Client asked for a full redesign of the hero section, including new imagery and revised copy—please update ASAP.', 
    time: 'Yesterday', 
    category: 'Redesign', 
    status: 'pending' 
  },
  { 
    project: 'E-commerce App', 
    client: 'Epsilon Inc.', 
    remarks: 'Colors updated as requested. Please verify contrast ratios and mobile scaling before final sign-off.', 
    time: 'Yesterday', 
    category: 'Redesign', 
    status: 'pending' 
  }
];

export const chats: ChatContact[] = [
  { name: 'Archie Parker', avatar: 'https://i.pravatar.cc/40?img=1', status: 'Kalid is online', online: true },
  { name: 'Alfie Mason', avatar: 'https://i.pravatar.cc/40?img=2', status: 'Taherah left 7 mins ago', online: false },
  { name: 'Aharlie Kane', avatar: 'https://i.pravatar.cc/40?img=3', status: 'Sami is online', online: true },
  { name: 'Athan Jacoby', avatar: 'https://i.pravatar.cc/40?img=4', status: 'Nargis left 30 mins ago', online: false },
  { name: 'Bashid Samim', avatar: 'https://i.pravatar.cc/40?img=5', status: 'Rashid left 50 mins ago', online: false },
];

export const conversations: Record<string, ChatMessage[]> = {
  'Archie Parker': [
    { from: 'other', text: 'Hi, how are you samim?', time: '8:40 AM, Today' },
    { from: 'me', text: 'I am good too, thank you!', time: '8:45 AM, Today' },
  ],
  'Alfie Mason': [
    { from: 'other', text: 'Can you review the latest designs?', time: '2:30 PM, Yesterday' },
    { from: 'me', text: 'Sure, I\'ll check them now.', time: '2:45 PM, Yesterday' },
  ]
};

// Helper functions to get counts
export const getUnreadNotificationsCount = (): number => {
  return navigationNotifications.filter(n => !n.read).length;
};

export const getPendingAlertsCount = (): number => {
  return alerts.filter(a => a.status === 'pending').length;
};