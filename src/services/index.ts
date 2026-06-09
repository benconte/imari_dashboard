import { getSession } from "next-auth/react";
import {
  MOCK_USERS, MOCK_ADMINS, MOCK_TRANSACTIONS, MOCK_KYC_QUEUE,
  MOCK_ALERTS, MOCK_AUDITS, MOCK_OVERVIEW_METRICS, MOCK_SECURITY_STATUS
} from "@/mock";
import type { User, Admin, Transaction, KYCSubmission, AlertItem, AuditLogItem, OverviewMetrics, TreasuryWallet, CategoryLimit } from "@/types";

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

// ── Financial Admin: live adapters for /api/v1/admin/finance/* ───────────
// `getOverviewMetrics`/`getTransactions` above are shared (mocked) across
// super-admin, support-admin and fraud-admin dashboards, so the financial
// admin pages get their own real-data variants instead of reusing those names.

const FINANCE_API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"}/api/v1/admin/finance`;

async function fetchAdminFinance<T>(path: string): Promise<T> {
  const session = await getSession();
  const accessToken = session?.user.accessToken;

  const res = await fetch(`${FINANCE_API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status}): ${path}`);
  }

  const json = await res.json();
  return json.data as T;
}

interface BackendParty {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface BackendTransaction {
  id: string;
  reference: string;
  amount: string;
  currency: string;
  type: string;
  riskScore: number | null;
  status: string;
  createdAt: string;
  sender: BackendParty | null;
  receiver: BackendParty | null;
  senderWallet: { walletNumber: string } | null;
  receiverWallet: { walletNumber: string } | null;
}

interface BackendWallet {
  id: string;
  walletNumber: string;
  currency: string;
  balance: string;
  isPrimary: boolean;
  status: string;
  createdAt: string;
  owner: BackendParty;
}

const TX_STATUS_MAP: Record<string, Transaction["status"]> = {
  COMPLETED: "Active",
  PENDING: "Pending",
  PROCESSING: "Pending",
  FAILED: "Failed",
  CANCELLED: "Failed",
  REVERSED: "Flagged",
  REQUIRES_ACTION: "Flagged",
};

function toRiskLevel(score: number | null): Transaction["riskLevel"] {
  if (score === null) return "Low";
  if (score > 70) return "Critical";
  if (score > 40) return "High";
  if (score > 15) return "Medium";
  return "Low";
}

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString();
}

function formatAmount(value: string, currency: string): string {
  const n = Number(value);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
  } catch {
    // Intl.NumberFormat throws on non-ISO-4217 codes (e.g. BTC, USDT)
    return `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  }
}

function toEntity(tx: BackendTransaction) {
  // CREDIT txs (deposits, inbound P2P) populate `receiver`; DEBIT txs
  // (withdrawals) only populate `sender` — receiver-first covers both.
  const counterparty = tx.receiver ?? tx.sender;
  if (!counterparty) {
    return {
      entityName: tx.senderWallet?.walletNumber ?? tx.receiverWallet?.walletNumber ?? "System",
      entityId: tx.reference,
      avatarLetters: "SY",
    };
  }
  const name = `${counterparty.firstName} ${counterparty.lastName}`.trim();
  const initials = `${counterparty.firstName?.[0] ?? ""}${counterparty.lastName?.[0] ?? ""}`.toUpperCase();
  return { entityName: name, entityId: counterparty.id, avatarLetters: initials };
}

function mapTransaction(tx: BackendTransaction): Transaction {
  const { entityName, entityId, avatarLetters } = toEntity(tx);
  return {
    id: tx.id,
    timestamp: formatTimestamp(tx.createdAt),
    entityName,
    entityId,
    avatarLetters,
    amount: formatAmount(tx.amount, tx.currency),
    riskLevel: toRiskLevel(tx.riskScore),
    riskScore: tx.riskScore ?? 0,
    status: TX_STATUS_MAP[tx.status] ?? "Pending",
    type: tx.type,
  };
}

const WALLET_STATUS_MAP: Record<string, TreasuryWallet["status"]> = {
  ACTIVE: "Active",
  FROZEN: "Frozen",
  CLOSED: "Under Audit", // closest semantic fit — backend has no audit concept
};

function mapWallet(w: BackendWallet): TreasuryWallet {
  return {
    id: w.id,
    name: `${w.owner.firstName} ${w.owner.lastName}`.trim(),
    currency: w.currency,
    balance: formatAmount(w.balance, w.currency),
    type: w.isPrimary ? "Fiat clearing" : "Escrow",
    lastVerified: formatTimestamp(w.createdAt),
    status: WALLET_STATUS_MAP[w.status] ?? "Active",
    accNo: w.walletNumber,
  };
}

export const getFinancialOverviewMetrics = async (): Promise<OverviewMetrics & { transactionVolume: string; activeWallets: string }> => {
  const overview = await fetchAdminFinance<{
    volumeLast24h: string;
    pendingCount: number;
    failedCount: number;
    activeWalletsCount: number;
  }>("/overview");

  return {
    totalVolumeToday: formatAmount(overview.volumeLast24h, "USD"),
    totalVolumeDelta: "—",
    pendingCount: overview.pendingCount,
    failedCount: overview.failedCount,
    failedDelta: "—",
    kycQueueCount: 0,
    kycAvatars: [],
    // ad-hoc keys financial-admin/overview actually reads (not in OverviewMetrics)
    transactionVolume: formatAmount(overview.volumeLast24h, "USD"),
    activeWallets: String(overview.activeWalletsCount),
  };
};

export const getFinancialTransactions = async (): Promise<Transaction[]> => {
  const { transactions } = await fetchAdminFinance<{ transactions: BackendTransaction[] }>("/transactions?limit=50");
  return transactions.map(mapTransaction);
};

export const getWallets = async (): Promise<TreasuryWallet[]> => {
  const { wallets } = await fetchAdminFinance<{ wallets: BackendWallet[] }>("/wallets?limit=50");
  return wallets.map(mapWallet);
};

export const getWalletById = async (id: string): Promise<TreasuryWallet | undefined> => {
  try {
    const wallet = await fetchAdminFinance<BackendWallet>(`/wallets/${id}`);
    return mapWallet(wallet);
  } catch {
    return undefined; // page already renders a "Wallet Not Found" state on `undefined`
  }
};

// ── Financial Admin: cards / vaults / budgets / subscriptions / compliance ──
// More live adapters for /api/v1/admin/finance/*, added alongside the block
// above without touching the existing overview/transactions/wallets wiring.

const ADMIN_API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"}/api/v1`;

async function fetchAdminApi<T>(path: string): Promise<T> {
  const session = await getSession();
  const accessToken = session?.user.accessToken;

  const res = await fetch(`${ADMIN_API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },

  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status}): ${path}`);
  }

  const json = await res.json();
  return json.data as T;
}

async function mutateAdminFinance<T = void>(path: string, body?: unknown): Promise<T> {
  const session = await getSession();
  const accessToken = session?.user.accessToken;
  const res = await fetch(`${FINANCE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(errBody?.message ?? `Request failed (${res.status})`);
  }
  const json = await res.json();
  return json.data as T;
}

async function mutateAdminApi<T = void>(path: string, body?: unknown): Promise<T> {
  const session = await getSession();
  const accessToken = session?.user.accessToken;
  const res = await fetch(`${ADMIN_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(errBody?.message ?? `Request failed (${res.status})`);
  }
  const json = await res.json();
  return json.data as T;
}

// ── Virtual Cards ─────────────────────────────────────────────────────────

interface BackendVirtualCard {
  id: string;
  maskedNumber: string;
  cardNumberLast4: string;
  expiryMonth: number;
  expiryYear: number;
  cardHolder: string;
  type: string;
  status: string;
  currency: string;
  spendingLimit: string | null;
  dailyLimit: string | null;
  spentToday: string;
  spentTotal: string;
  createdAt: string;
  owner: BackendParty;
}

const CARD_STATUS_MAP: Record<string, "Active" | "Frozen"> = {
  ACTIVE: "Active",
  FROZEN: "Frozen",
  EXPIRED: "Frozen",
  CANCELLED: "Frozen",
};

// No raw card number / CVV is ever returned by the backend (by design) —
// the mapped shape only carries fields that genuinely exist on VirtualCard.
function mapVirtualCard(c: BackendVirtualCard) {
  return {
    id: c.id,
    maskedNumber: c.maskedNumber,
    expiry: `${String(c.expiryMonth).padStart(2, "0")}/${String(c.expiryYear).slice(-2)}`,
    cardHolder: c.cardHolder,
    type: c.type,
    currency: c.currency,
    status: CARD_STATUS_MAP[c.status] ?? "Active",
    issuedDate: formatTimestamp(c.createdAt),
    dailyLimit: c.dailyLimit ? formatAmount(c.dailyLimit, c.currency) : "—",
    spentToday: formatAmount(c.spentToday, c.currency),
    spentTodayValue: Number(c.spentToday),
  };
}

export type LiveVirtualCard = ReturnType<typeof mapVirtualCard>;

export const getVirtualCards = async (): Promise<LiveVirtualCard[]> => {
  const { cards } = await fetchAdminFinance<{ cards: BackendVirtualCard[] }>("/virtual-cards?limit=50");
  return cards.map(mapVirtualCard);
};

// ── Savings Vaults ────────────────────────────────────────────────────────

interface BackendVault {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  currency: string;
  status: string;
  isLocked: boolean;
  lockUntil: string | null;
  createdAt: string;
  owner: { id: string; firstName: string; lastName: string };
}

// `apy`/`category` don't exist on the backend Vault model — the mapped shape
// deliberately omits them rather than fabricating display values.
function mapVault(v: BackendVault) {
  return {
    id: v.id,
    name: v.name,
    balance: Number(v.currentAmount),
    goal: Number(v.targetAmount),
    currency: v.currency,
    status: v.status,
    isLocked: v.isLocked,
    owner: `${v.owner.firstName} ${v.owner.lastName}`.trim(),
  };
}

export type LiveVault = ReturnType<typeof mapVault>;

export const getVaults = async (): Promise<LiveVault[]> => {
  const { vaults } = await fetchAdminFinance<{ vaults: BackendVault[] }>("/vaults?limit=50");
  return vaults.map(mapVault);
};

// ── Budgets ───────────────────────────────────────────────────────────────
// Backend returns raw Budget + categoryBudgets[]; flattened here into
// CategoryLimit rows so budgets-spending/* can consume it without changes.

interface BackendBudget {
  id: string;
  name: string;
  period: string;
  status: string;
  totalLimit: string;
  totalSpent: string;
  currency: string;
  owner: { id: string; firstName: string; lastName: string };
  categoryBudgets: Array<{ category: string; limit: string; spent: string; alertAt: number | string | null }>;
}

function mapBudgetCategoryLimits(b: BackendBudget): CategoryLimit[] {
  const ownerName = `${b.owner.firstName} ${b.owner.lastName}`.trim();
  return b.categoryBudgets.map((cb, i) => {
    const limit = Number(cb.limit);
    const spent = Number(cb.spent);
    return {
      id: `${b.id}-${i}`,
      category: cb.category,
      allocated: formatAmount(cb.limit, b.currency),
      spent: formatAmount(cb.spent, b.currency),
      percent: limit > 0 ? Math.round((spent / limit) * 100) : 0,
      unallocated: formatAmount(String(Math.max(limit - spent, 0)), b.currency),
      owner: ownerName,
    };
  });
}

export const getBudgetCategoryLimits = async (): Promise<CategoryLimit[]> => {
  const { budgets } = await fetchAdminFinance<{ budgets: BackendBudget[] }>("/budgets?limit=50");
  return budgets.flatMap(mapBudgetCategoryLimits);
};

// ── Subscriptions ─────────────────────────────────────────────────────────
// Real per-user recurring payments — not platform pricing plans, so this
// gets its own shape rather than reusing the (conceptually unrelated) `Plan`.

interface BackendSubscription {
  id: string;
  merchantName: string;
  amount: string;
  currency: string;
  billingCycle: string;
  status: string;
  nextBillingDate: string;
  lastBilledAt: string | null;
  owner: { id: string; firstName: string; lastName: string };
}

const SUBSCRIPTION_STATUS_MAP: Record<string, string> = {
  ACTIVE: "Active",
  CANCELLED: "Cancelled",
  PAUSED: "Paused",
  EXPIRED: "Expired",
  PENDING_RENEWAL: "Pending Renewal",
};

const BILLING_CYCLE_LABEL: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
  CUSTOM: "Custom",
};

function mapSubscription(s: BackendSubscription) {
  return {
    id: s.id,
    merchantName: s.merchantName,
    amount: formatAmount(s.amount, s.currency),
    billingCycle: BILLING_CYCLE_LABEL[s.billingCycle] ?? s.billingCycle,
    status: SUBSCRIPTION_STATUS_MAP[s.status] ?? s.status,
    nextBillingDate: formatTimestamp(s.nextBillingDate),
    lastBilledAt: s.lastBilledAt ? formatTimestamp(s.lastBilledAt) : "—",
    owner: `${s.owner.firstName} ${s.owner.lastName}`.trim(),
  };
}

export type LiveSubscription = ReturnType<typeof mapSubscription>;

export const getSubscriptions = async (): Promise<LiveSubscription[]> => {
  const { subscriptions } = await fetchAdminFinance<{ subscriptions: BackendSubscription[] }>("/subscriptions?limit=50");
  return subscriptions.map(mapSubscription);
};

// ── Compliance Audits ─────────────────────────────────────────────────────

interface BackendComplianceAudit {
  id: string;
  action: string;
  resource: string | null;
  adminId: string | null;
  admin: { id: string; firstName: string; lastName: string; email: string } | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  result: "Passed" | "Flagged";
}

// `action` is an AuditAction enum value (KYC_SUBMITTED, SUSPICIOUS_ACTIVITY, ...);
// the frontend AuditLog["category"] union doesn't cover this real subset, so
// audits map to readable labels rather than forcing a mismatched enum.
const AUDIT_CATEGORY_LABEL: Record<string, string> = {
  KYC_SUBMITTED: "KYC Review",
  KYC_VERIFIED: "KYC Review",
  KYC_REJECTED: "KYC Review",
  SUSPICIOUS_ACTIVITY: "AML Check",
  ADMIN_ACTION: "Admin Action",
  CARD_FROZEN: "Card Control",
  CARD_UNFROZEN: "Card Control",
  MFA_ENABLED: "Account Security",
  MFA_DISABLED: "Account Security",
  DEVICE_REGISTERED: "Device Activity",
  DEVICE_REMOVED: "Device Activity",
};

function toAuditDetails(a: BackendComplianceAudit): string {
  const parts: string[] = [];
  if (a.resource) parts.push(a.resource);
  if (a.metadata && typeof a.metadata === "object") {
    const entries = Object.entries(a.metadata).slice(0, 2).map(([k, v]) => `${k}: ${v}`);
    if (entries.length) parts.push(entries.join(", "));
  }
  return parts.join(" — ") || "—";
}

function mapComplianceAudit(a: BackendComplianceAudit) {
  return {
    id: a.id,
    category: AUDIT_CATEGORY_LABEL[a.action] ?? a.action.replace(/_/g, " "),
    executor: a.admin ? `${a.admin.firstName} ${a.admin.lastName}`.trim() : "System",
    details: toAuditDetails(a),
    result: a.result,
    timestamp: formatTimestamp(a.createdAt),
  };
}

export type LiveComplianceAudit = ReturnType<typeof mapComplianceAudit>;

export const getComplianceAudits = async (): Promise<LiveComplianceAudit[]> => {
  const { audits } = await fetchAdminFinance<{ audits: BackendComplianceAudit[] }>("/compliance/audits?limit=50");
  return audits.map(mapComplianceAudit);
};

// ── KYC Queue ─────────────────────────────────────────────────────────────
// Lives at /admin/kyc/queue — a different controller than /admin/finance/*,
// hence the separate `fetchAdminApi` base. Requires `kyc:read`, which the
// financial-admin (OPS_ADMIN) account does not hold, so this is wired into
// the super-admin KYC queue page rather than financial-admin/kyc-queue.

interface BackendKycDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  documentFrontUrl: string;
  documentBackUrl: string | null;
  selfieUrl: string | null;
  createdAt: string;
  verifiedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  owner: BackendParty;
}

// riskScore/faceMatchPct/expiryDate/nationality/avatarCode don't exist on
// KYCDocument/User — only fields that are genuinely present are surfaced.
function mapKycDocument(d: BackendKycDocument) {
  let reviewStatus: "Verified" | "Rejected" | "Pending" = "Pending";
  if (d.verifiedAt) reviewStatus = "Verified";
  else if (d.rejectedAt) reviewStatus = "Rejected";

  return {
    id: d.id,
    name: `${d.owner.firstName} ${d.owner.lastName}`.trim(),
    email: d.owner.email,
    avatarCode: `${d.owner.firstName?.[0] ?? ""}${d.owner.lastName?.[0] ?? ""}`.toUpperCase(),
    documentType: d.documentType,
    documentNumber: d.documentNumber,
    documentFrontUrl: d.documentFrontUrl,
    documentBackUrl: d.documentBackUrl,
    selfieUrl: d.selfieUrl,
    submittedAt: formatTimestamp(d.createdAt),
    reviewStatus,
    rejectionReason: d.rejectionReason,
  };
}

export type LiveKycSubmission = ReturnType<typeof mapKycDocument>;

export const getKycQueue = async (): Promise<LiveKycSubmission[]> => {
  const { documents } = await fetchAdminApi<{ documents: BackendKycDocument[] }>("/admin/kyc/queue?limit=50");
  return documents.map(mapKycDocument);
};

// ── KYC Actions ───────────────────────────────────────────────────────────
// kyc:approve / kyc:reject — NOT held by OPS_ADMIN, only SUPER_ADMIN/SUPPORT.

export const approveKyc = (id: string) => mutateAdminApi(`/admin/kyc/${id}/approve`);
export const rejectKyc = (id: string, rejectionReason: string) =>
  mutateAdminApi(`/admin/kyc/${id}/reject`, { rejectionReason });

// ── Wallet Actions ────────────────────────────────────────────────────────
// wallets:freeze / wallets:unfreeze — held by OPS_ADMIN.

export const freezeWallet = (id: string) => mutateAdminFinance(`/wallets/${id}/freeze`);
export const unfreezeWallet = (id: string) => mutateAdminFinance(`/wallets/${id}/unfreeze`);

// ── Transaction Actions ───────────────────────────────────────────────────
// transactions:reverse / transactions:mark_suspect — held by OPS_ADMIN.
// reverse is status-only (sets REVERSED, writes audit); balance unwinding is a
// separate finance-ops step per backend docs.

export const reverseTransaction = (id: string, reason?: string) =>
  mutateAdminFinance(`/transactions/${id}/reverse`, { reason });
export const flagTransaction = (id: string, reason: string, riskScore?: number) =>
  mutateAdminFinance(`/transactions/${id}/flag`, { reason, ...(riskScore !== undefined ? { riskScore } : {}) });

// ── Virtual Card Actions ──────────────────────────────────────────────────
// Same wallets:freeze / wallets:unfreeze permission gate as wallet ops.

export const freezeVirtualCard = (id: string) => mutateAdminFinance(`/virtual-cards/${id}/freeze`);
export const unfreezeVirtualCard = (id: string) => mutateAdminFinance(`/virtual-cards/${id}/unfreeze`);

// ── Cash Flow ─────────────────────────────────────────────────────────────
// Real inflow/outflow aggregations by currency × 24h/7d/30d windows + type
// breakdown. No corridor concept — data is currency-pair-free.

interface CashFlowRow {
  currency: string;
  amount: string;
  count: number;
}
interface CashFlowWindow {
  inflow: CashFlowRow[];
  outflow: CashFlowRow[];
}
export interface LiveCashFlow {
  windows: { h24: CashFlowWindow; d7: CashFlowWindow; d30: CashFlowWindow };
  byType: Array<{ type: string; currency: string; amount: string; count: number }>;
}

export const getCashFlow = (): Promise<LiveCashFlow> =>
  fetchAdminFinance<LiveCashFlow>("/cash-flow");
