import {
  MOCK_USERS, MOCK_ADMINS, MOCK_TRANSACTIONS, MOCK_KYC_QUEUE,
  MOCK_ALERTS, MOCK_AUDITS, MOCK_OVERVIEW_METRICS, MOCK_SECURITY_STATUS
} from "@/mock";
import type { User, Admin, Transaction, KYCSubmission, AlertItem, AuditLogItem } from "@/types";

export const getOverviewMetrics = async () => MOCK_OVERVIEW_METRICS;
export const getSecurityStatus = async () => MOCK_SECURITY_STATUS;

export const getUsers = async (): Promise<User[]> => MOCK_USERS;
export const addUser = async (data: Partial<User>): Promise<User> => {
  const u: User = { id: `USR-${Math.floor(Math.random() * 9000) + 1000}`, name: data.name ?? "", email: data.email ?? "", avatar: "https://lh3.googleusercontent.com/a/default-user", walletBalance: data.walletBalance ?? "$0.00", kycStatus: data.kycStatus ?? "Pending", joinDate: "Just Now", riskScore: 50 };
  return u;
};
export const updateKYCStatus = async (id: string, status: User["kycStatus"]): Promise<void> => { /* mock */ };

export const getAdmins = async (): Promise<Admin[]> => MOCK_ADMINS;
export const inviteAdmin = async (data: Partial<Admin>): Promise<Admin> => {
  const a: Admin = { id: `ADM-${Math.floor(Math.random() * 9000) + 1000}`, name: data.name ?? "", email: data.email ?? "", avatar: "https://lh3.googleusercontent.com/a/default-user", role: data.role ?? "SUPPORT", status: "Active", lastActive: "Just Now" };
  return a;
};
export const deleteAdmin = async (id: string): Promise<void> => { /* mock */ };

export const getTransactions = async (): Promise<Transaction[]> => MOCK_TRANSACTIONS;
export const getFlaggedTransactions = async (): Promise<Transaction[]> => MOCK_TRANSACTIONS.filter((t) => t.status === "Flagged");

export const getKYCQueue = async (): Promise<KYCSubmission[]> => MOCK_KYC_QUEUE;

export const getAlerts = async (): Promise<AlertItem[]> => MOCK_ALERTS;
export const getAudits = async (): Promise<AuditLogItem[]> => MOCK_AUDITS;

export const getPlatformGrowthData = async () => [
  { date: "May 10", dau: 850000, mau: 1050000 },
  { date: "May 12", dau: 920000, mau: 1080000 },
  { date: "May 14", dau: 900000, mau: 1100000 },
  { date: "May 16", dau: 950000, mau: 1120000 },
  { date: "May 18", dau: 1020000, mau: 1140000 },
  { date: "May 20", dau: 1120000, mau: 1160000 },
  { date: "May 22", dau: 1080000, mau: 1180000 },
  { date: "May 24", dau: 1200000, mau: 1210000 },
];

export const getSystemEvents = async () => [
  { id: "1", type: "critical", icon: "warning", title: "SQL Injection Attempt Blocked", description: "Source IP 185.220.101.5 blocked by WAF", timeLabel: "2m ago" },
  { id: "2", type: "info", icon: "swap_horiz", title: "Liquidity Sweep Completed", description: "$2.4M rebalanced across corridors", timeLabel: "15m ago" },
  { id: "3", type: "info", icon: "person_add", title: "New Admin Invited", description: "Douglas Rain invited as SUPPORT_ADMIN", timeLabel: "1h ago" },
  { id: "4", type: "critical", icon: "gpp_maybe", title: "OFAC Sanction Match", description: "KYC applicant matched OFAC SDN list #8812", timeLabel: "3h ago" },
];

export const getNodeLatencies = async () => [
  { id: "1", region: "US East (Virginia)", latency: "12ms", percentage: 15, isWarning: false },
  { id: "2", region: "EU West (Frankfurt)", latency: "28ms", percentage: 35, isWarning: false },
  { id: "3", region: "APAC (Singapore)", latency: "145ms", percentage: 85, isWarning: true },
];

export const getLiquidityStatus = async () => ({
  pairCount: 48,
  collateralPct: "140%",
  usdLiquidity: "$42.1M",
  btcReserve: "1,240",
});
