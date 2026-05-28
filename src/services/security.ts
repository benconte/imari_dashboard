export interface SecurityStatus {
  riskScore: number;
  riskText: string;
  vs24h: string;
  statusText: string;
  criticalAlertCount: number;
  criticalAlertPct: string;
  pendingReviewsCount: number;
  blockedAttempts: string;
  authFailureRate: string;
  threats: {
    sqliRate: string;
    xssRate: string;
  };
}

const mockSecurityStatus: SecurityStatus = {
  riskScore: 14,
  riskText: 'Low',
  vs24h: '-4.2%',
  statusText: 'Stable',
  criticalAlertCount: 3,
  criticalAlertPct: '+12% surge',
  pendingReviewsCount: 127,
  blockedAttempts: '4,829',
  authFailureRate: '0.42%',
  threats: {
    sqliRate: '1.2k/hr',
    xssRate: '0.8k/hr',
  },
};

export const getSecurityStatus = async (): Promise<SecurityStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSecurityStatus), 150);
  });
};
