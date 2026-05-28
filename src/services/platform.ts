import { PlatformOverviewMetrics, PlatformGrowthPoint, SystemEvent, NodeLatency } from '../types';

const mockOverviewMetrics: PlatformOverviewMetrics = {
  activeUsers: '9,842',
  activeUsersPct: '+12%',
  kycPending: 156,
  kycPendingStatus: 'Action Req.',
  walletTotal: '$4.2M',
  avgWalletUsage: 'Avg. $427.50 / user',
  systemStatus: 'Healthy',
  systemUptime: '99.98%',
};

const mockGrowthData: PlatformGrowthPoint[] = [
  { date: 'May 10', dau: 850000, mau: 1050000 },
  { date: 'May 12', dau: 920000, mau: 1080000 },
  { date: 'May 14', dau: 900000, mau: 1100000 },
  { date: 'May 16', dau: 950000, mau: 1120000 },
  { date: 'May 18', dau: 1020000, mau: 1140000 },
  { date: 'May 20', dau: 1120000, mau: 1160000 },
  { date: 'May 22', dau: 1080000, mau: 1180000 },
  { date: 'May 24', dau: 1200000, mau: 1210000 },
];

const mockSystemEvents: SystemEvent[] = [
  {
    id: 'evt-1',
    title: 'New Admin Invited',
    description: 'Sarah Chen granted Node access.',
    timeLabel: 'Just now',
    icon: 'person_add',
    type: 'success',
  },
  {
    id: 'evt-2',
    title: 'System Update deployed',
    description: 'V2.4.1 stable to EU-West clusters.',
    timeLabel: '14 mins ago',
    icon: 'update',
    type: 'info',
  },
  {
    id: 'evt-3',
    title: 'Large Transaction Flagged',
    description: 'ID #88219 awaiting manual review.',
    timeLabel: '42 mins ago',
    icon: 'flag',
    type: 'critical',
  },
  {
    id: 'evt-4',
    title: 'Security Audit Completed',
    description: '0 high-risk vulnerabilities found.',
    timeLabel: '2 hours ago',
    icon: 'security',
    type: 'success',
  },
];

const mockNodeLatencies: NodeLatency[] = [
  {
    id: 'node-1',
    region: 'North America',
    latency: '22ms',
    percentage: 20,
    isWarning: false,
  },
  {
    id: 'node-2',
    region: 'Europe (Frankfurt)',
    latency: '34ms',
    percentage: 35,
    isWarning: false,
  },
  {
    id: 'node-3',
    region: 'Asia (Singapore)',
    latency: '156ms',
    percentage: 85,
    isWarning: true,
  },
];

export const getOverviewMetrics = async (): Promise<PlatformOverviewMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOverviewMetrics), 150);
  });
};

export const getPlatformGrowthData = async (): Promise<PlatformGrowthPoint[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockGrowthData), 150);
  });
};

export const getSystemEvents = async (): Promise<SystemEvent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSystemEvents), 150);
  });
};

export const getNodeLatencies = async (): Promise<NodeLatency[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockNodeLatencies), 150);
  });
};

export const getLiquidityStatus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({
      usdLiquidity: '$42.1M',
      btcReserve: '1,240',
      collateralPct: '140%',
      pairCount: 48,
    }), 150);
  });
};
