export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  walletBalance: string;
  kycStatus: "Verified" | "Pending" | "Suspended";
  joinDate: string;
  riskScore?: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "SUPER" | "FINANCIAL" | "SUPPORT";
  status: "Active" | "Inactive";
  lastActive: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  entityName: string;
  entityId: string;
  avatarLetters: string;
  amount: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  riskScore: number;
  status: "Active" | "Pending" | "Failed" | "Flagged";
  type?: string;
}

export interface KYCSubmission {
  id: string;
  name: string;
  email: string;
  avatarCode: string;
  docType: string;
  docNo: string;
  submitDate: string;
  riskScore: number;
  expiryDate: string;
  nationality: string;
  idCardUrl: string;
  faceMatchPct: number;
  noAmlMatches: boolean;
}

export interface AlertItem {
  id: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  target: string;
  timestamp: string;
  status: "Pending Analyst" | "Under Investigation" | "Escalated" | "Dismissed" | "Resolved";
  ip: string;
  userAgent: string;
  payload: string;
  notes?: string;
}

export interface AuditLogItem {
  id: string;
  sha: string;
  timestamp: string;
  operator: string;
  role: "SUPER_ADMIN" | "FINANCIAL_ADMIN" | "SYSTEM_API" | "SUPPORT_ADMIN";
  avatar: string;
  action: string;
  ip: string;
  status: "Success" | "Warning" | "Blocked" | "Info";
}

export interface Ticket {
  id: string;
  user: string;
  email: string;
  subject: string;
  category: "Billing" | "KYC Dispute" | "Transaction Stuck" | "Integrations";
  priority: "Low" | "High" | "Critical";
  status: "Open" | "Pending" | "Escalated" | "Closed";
  createdDate: string;
  messages: Array<{ sender: "user" | "support"; text: string; time: string }>;
}

export interface Dispute {
  id: string;
  txId: string;
  cardholder: string;
  amount: string;
  reason: string;
  dateFlagged: string;
  status: "Under Review" | "Allowed (Refunded)" | "Dismissed";
  evidenceAttachedString: string;
}

export interface TreasuryWallet {
  id: string;
  name: string;
  currency: string;
  balance: string;
  type: "Fiat clearing" | "Escrow" | "Hot Vault" | "Cold Vault";
  lastVerified: string;
  status: "Active" | "Frozen" | "Under Audit";
  accNo: string;
}

export interface VirtualCard {
  id: string;
  pan: string;
  expiry: string;
  cvv: string;
  holder: string;
  type: "VISA" | "MASTERCARD";
  org: string;
  status: "Active" | "Frozen";
  issuedDate: string;
  dailyLimit: string;
  spentThisMonth: string;
}

export interface Vault {
  id: string;
  name: string;
  balance: number;
  goal: number;
  category: "Reserve" | "Yield Pool" | "Escrow" | "Operational";
  apy: number;
  status: "Active Lock" | "Liquid Rebalancing" | "Accumulating";
  deposits: Array<{ id: string; amount: number; date: string; source: string }>;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  medium: "Sms" | "Email" | "Webhook" | "Desktop Push";
  audience: string;
  status: "Sent" | "Scheduled" | "Draft";
  timestamp: string;
}

export interface ConfigToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "Security" | "System" | "Verification";
}

export interface Plan {
  id: string;
  name: string;
  mrrRate: number;
  subscribersCount: number;
  features: string;
  status: "Active" | "Legacy" | "Unavailable";
}

export interface Corridor {
  id: string;
  name: string;
  inflow24h: number;
  outflow24h: number;
  latencyMin: number;
  status: "Nominal" | "High Load" | "Stalled Queue";
}

export interface AuditLog {
  id: string;
  category: "AML Check" | "Liquidity Audit" | "Rule Update" | "Access Revocation";
  executor: string;
  details: string;
  result: "Passed" | "Flagged" | "Pending Action";
  timestamp: string;
}

export interface CategoryLimit {
  id: string;
  category: string;
  allocated: string;
  spent: string;
  percent: number;
  unallocated: string;
  owner: string;
}
