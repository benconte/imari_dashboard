import { Wallet, WalletMetrics } from '../types';

const mockWallets: Wallet[] = [
  {
    id: 'WL-00918-A',
    userName: 'Jane Doe',
    userInitials: 'JD',
    userBgClass: 'bg-[#e1e0ff] text-[#07006c]',
    balanceUsd: 1240400.00,
    currency: 'USD',
    lastActivity: '2 mins ago',
    status: 'Active'
  },
  {
    id: 'WL-11245-B',
    userName: 'Artis Smith',
    userInitials: 'AS',
    userBgClass: 'bg-[#d3e4fe] text-[#0b1c30]',
    balanceUsd: 422109.12,
    currency: 'BTC',
    lastActivity: '14 mins ago',
    status: 'Active'
  },
  {
    id: 'WL-00344-F',
    userName: 'Risk Vanguard Ltd',
    userInitials: 'RV',
    userBgClass: 'bg-[#ffdad6] text-[#ba1a1a]',
    balanceUsd: 9550221.00,
    currency: 'USD',
    lastActivity: '2 days ago',
    status: 'Frozen'
  },
  {
    id: 'WL-88121-G',
    userName: 'Marc Kowski',
    userInitials: 'MK',
    userBgClass: 'bg-[#dae2fd] text-[#131b2e]',
    balanceUsd: 12000.45,
    currency: 'EUR',
    lastActivity: '1 hour ago',
    status: 'Active'
  }
];

const mockWalletMetrics: WalletMetrics = {
  totalBalanceUsd: 12842091.55,
  totalBalanceDelta: '+4.2%',
  activeWalletsCount: 142091,
  activeWalletsNewToday: 924,
  fundingRate: 0.0214,
  fundingRateStability: 'Stable Volatility'
};

export const getWallets = async (): Promise<Wallet[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockWallets), 120);
  });
};

export const getWalletMetrics = async (): Promise<WalletMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockWalletMetrics), 100);
  });
};
