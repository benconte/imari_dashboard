import { ComplianceReport, ComplianceMetrics } from '../types';

const mockReports: ComplianceReport[] = [
  {
    id: 'rep-1',
    type: 'AML Quarterly Compliance',
    period: 'Q3 2023',
    status: 'Generated',
    format: 'PDF'
  },
  {
    id: 'rep-2',
    type: 'KYC Onboarding Audit',
    period: 'Sep 01-30, 2023',
    status: 'Generated',
    format: 'CSV'
  },
  {
    id: 'rep-3',
    type: 'Transaction Monitoring High-Risk',
    period: 'Oct 10-17, 2023',
    status: 'Pending',
    format: 'PDF'
  },
  {
    id: 'rep-4',
    type: 'Ad-hoc Regulatory Request',
    period: 'FY 2022 Archive',
    status: 'Generated',
    format: 'PDF'
  }
];

const mockComplianceMetrics: ComplianceMetrics = {
  healthScore: 98,
  openIssuesCount: 3,
  isUrgent: true,
  nextAuditDays: 12
};

export const getComplianceReports = async (): Promise<ComplianceReport[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReports), 120);
  });
};

export const getComplianceMetrics = async (): Promise<ComplianceMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockComplianceMetrics), 100);
  });
};
