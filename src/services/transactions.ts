import { Transaction, ActivityLog, OverviewMetrics } from '../types';

// Concrete, high-fidelity mock data matching the screenshot/HTML precisely
const mockTransactions: Transaction[] = [
  {
    id: '#TX-94285-IM',
    clientName: 'John Sterling',
    clientEmail: 'john.s@example.com',
    clientInitials: 'JS',
    clientAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    amount: 12450.00,
    type: 'WITHDRAWAL',
    status: 'Completed',
    dateTime: 'Oct 24, 2023 14:22:45',
    timezone: 'EST'
  },
  {
    id: '#TX-94286-IM',
    clientName: 'Elena Chen',
    clientEmail: 'elena.c@corp.net',
    clientInitials: 'EC',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    amount: 50000.00,
    type: 'DEPOSIT',
    status: 'Pending',
    dateTime: 'Oct 24, 2023 15:01:12',
    timezone: 'EST'
  },
  {
    id: '#TX-94287-IM',
    clientName: 'Marcus Aurelio',
    clientEmail: 'm.aurelio@global.io',
    clientInitials: 'MA',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    amount: 2800.00,
    type: 'TRANSFER',
    status: 'Flagged',
    dateTime: 'Oct 24, 2023 15:15:30',
    timezone: 'EST'
  },
  {
    id: '#TX-94288-IM',
    clientName: 'Sarah Wong',
    clientEmail: 'sarah.w@limitless.com',
    clientInitials: 'SW',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    amount: 1420.50,
    type: 'CARD',
    status: 'Completed',
    dateTime: 'Oct 24, 2023 16:10:05',
    timezone: 'EST'
  },
  {
    id: '#TX-94289-IM',
    clientName: 'Solaris Capital',
    clientEmail: 'billing@solaris.net',
    clientInitials: 'SC',
    amount: 12400.00,
    type: 'TRANSFER',
    status: 'Pending',
    dateTime: 'Oct 24, 2023 17:05:00',
    timezone: 'EST'
  },
  {
    id: '#TX-94290-IM',
    clientName: 'Nova Weaver',
    clientEmail: 'n.weaver@nova.io',
    clientInitials: 'NW',
    amount: 1050.00,
    type: 'CARD',
    status: 'Cleared',
    dateTime: 'Oct 24, 2023 17:45:10',
    timezone: 'EST'
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'act-1',
    title: 'Flagged: High-Volume Transfer',
    description: 'User ID: #IM-8821 initiated $50,000 to offshore account.',
    timeAgo: '2 mins ago',
    type: 'warning'
  },
  {
    id: 'act-2',
    title: 'Batch Deposit Successful',
    description: 'Merchant #VND-09 approved. Volume: $1.2M.',
    timeAgo: '15 mins ago',
    type: 'success'
  },
  {
    id: 'act-3',
    title: 'New Institutional Client',
    description: 'Zetta Corp completed KYC Tier 3 verification.',
    timeAgo: '1 hour ago',
    type: 'info'
  },
  {
    id: 'act-4',
    title: 'Admin Security Alert',
    description: 'Unusual login attempt from IP 192.168.1.45 (San Jose).',
    timeAgo: '3 hours ago',
    type: 'alert'
  }
];

const mockOverviewMetrics: OverviewMetrics = {
  totalVolumeToday: '$4.2M',
  totalVolumeDelta: '12%',
  pendingCount: 156,
  failedCount: 24,
  failedDelta: '-2%',
  kycQueueCount: 14,
  kycAvatars: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  ]
};

// Async service functions with simulated network delay
export const getTransactions = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTransactions), 150);
  });
};

export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockActivityLogs), 120);
  });
};

export const getOverviewMetrics = async (): Promise<OverviewMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOverviewMetrics), 100);
  });
};
