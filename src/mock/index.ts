import type {
  User, Admin, Transaction, KYCSubmission, AlertItem, AuditLogItem,
  Ticket, Dispute, TreasuryWallet, VirtualCard, Vault, BroadcastMessage,
  ConfigToggle, Plan, Corridor, AuditLog, CategoryLimit
} from "@/types";

// ── Users ─────────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: "USR-001", name: "Robert Taylor", email: "robert.t@alphastat.io", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-R0Hiuv29c8acSml7p-XtqYlTY8FyA3TbdHrQtPm7ouCywcSbJxylF5795AVQj5RbrrfVjHIACB6ejDrsBU3GZSJt4DArXWygq94bYndFj0MzmzeQaWYl_mh1-UHHrDB9dNGXbajtCGCEQI9OSyjoALnM5j5ktM3Yb0jilEZqSZf-l40c423Hyl6F-7p6OdHpV4eN8Xa4EzL_gl38ZARpCWQPrcVt68yFKd6WeQ_UXsq13qCfLmJy64aUqXGXVsWSTRpLyP0HB0U", walletBalance: "$12,480.50", kycStatus: "Verified", joinDate: "Jan 12, 2026", riskScore: 8 },
  { id: "USR-002", name: "Elena Rostova", email: "e.rost@globalfiat.com", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATp9iqS5SqcpjS3etyNwptRQK_Iqac7-Xdd8uXXR26TSmto_8W6cR8aYTRbLtvrji5xAjDlQeyh96ApuVKFnLTE14colQFM2rIAla5ZUn8u9Ke9Y18zhIZv734cltccjrhzGufzexroX_hhWQvF8Bfq0FHgCV2Rx5YYzWcZ5_4T-lBiS9NLv2Eeg-gPjc0nuDpr664kQayRQFWPvUc61HBuLRyF78aaFnLN4O8322IeK5yDdA5h2Yo-pxAy2e93agZk4xkL9YuteE", walletBalance: "$8,340.00", kycStatus: "Pending", joinDate: "Mar 5, 2026", riskScore: 35 },
  { id: "USR-003", name: "Marcus Aurelius", email: "m.aurelius@stoic.capital", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATp9iqS5SqcpjS3etyNwptRQK_Iqac7-Xdd8uXXR26TSmto_8W6cR8aYTRbLtvrji5xAjDlQeyh96ApuVKFnLTE14colQFM2rIAla5ZUn8u9Ke9Y18zhIZv734cltccjrhzGufzexroX_hhWQvF8Bfq0FHgCV2Rx5YYzWcZ5_4T-lBiS9NLv2Eeg-gPjc0nuDpr664kQayRQFWPvUc61HBuLRyF78aaFnLN4O8322IeK5yDdA5h2Yo-pxAy2e93agZk4xkL9YuteE", walletBalance: "$2,100.75", kycStatus: "Suspended", joinDate: "Feb 18, 2026", riskScore: 72 },
  { id: "USR-004", name: "David Hoffman", email: "d.hoffman@clearpath.io", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-R0Hiuv29c8acSml7p-XtqYlTY8FyA3TbdHrQtPm7ouCywcSbJxylF5795AVQj5RbrrfVjHIACB6ejDrsBU3GZSJt4DArXWygq94bYndFj0MzmzeQaWYl_mh1-UHHrDB9dNGXbajtCGCEQI9OSyjoALnM5j5ktM3Yb0jilEZqSZf-l40c423Hyl6F-7p6OdHpV4eN8Xa4EzL_gl38ZARpCWQPrcVt68yFKd6WeQ_UXsq13qCfLmJy64aUqXGXVsWSTRpLyP0HB0U", walletBalance: "$45,920.00", kycStatus: "Verified", joinDate: "Dec 1, 2025", riskScore: 5 },
  { id: "USR-005", name: "Amara Diallo", email: "a.diallo@novapay.ng", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATp9iqS5SqcpjS3etyNwptRQK_Iqac7-Xdd8uXXR26TSmto_8W6cR8aYTRbLtvrji5xAjDlQeyh96ApuVKFnLTE14colQFM2rIAla5ZUn8u9Ke9Y18zhIZv734cltccjrhzGufzexroX_hhWQvF8Bfq0FHgCV2Rx5YYzWcZ5_4T-lBiS9NLv2Eeg-gPjc0nuDpr664kQayRQFWPvUc61HBuLRyF78aaFnLN4O8322IeK5yDdA5h2Yo-pxAy2e93agZk4xkL9YuteE", walletBalance: "$6,780.30", kycStatus: "Verified", joinDate: "Apr 22, 2026", riskScore: 12 },
];

// ── Admins ─────────────────────────────────────────────────────────────────
export const MOCK_ADMINS: Admin[] = [
  { id: "ADM-001", name: "Sarah Chen", email: "superadmin@imari.com", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-R0Hiuv29c8acSml7p-XtqYlTY8FyA3TbdHrQtPm7ouCywcSbJxylF5795AVQj5RbrrfVjHIACB6ejDrsBU3GZSJt4DArXWygq94bYndFj0MzmzeQaWYl_mh1-UHHrDB9dNGXbajtCGCEQI9OSyjoALnM5j5ktM3Yb0jilEZqSZf-l40c423Hyl6F-7p6OdHpV4eN8Xa4EzL_gl38ZARpCWQPrcVt68yFKd6WeQ_UXsq13qCfLmJy64aUqXGXVsWSTRpLyP0HB0U", role: "SUPER", status: "Active", lastActive: "2 min ago" },
  { id: "ADM-002", name: "James Okafor", email: "financial@imari.com", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATp9iqS5SqcpjS3etyNwptRQK_Iqac7-Xdd8uXXR26TSmto_8W6cR8aYTRbLtvrji5xAjDlQeyh96ApuVKFnLTE14colQFM2rIAla5ZUn8u9Ke9Y18zhIZv734cltccjrhzGufzexroX_hhWQvF8Bfq0FHgCV2Rx5YYzWcZ5_4T-lBiS9NLv2Eeg-gPjc0nuDpr664kQayRQFWPvUc61HBuLRyF78aaFnLN4O8322IeK5yDdA5h2Yo-pxAy2e93agZk4xkL9YuteE", role: "FINANCIAL", status: "Active", lastActive: "15 min ago" },
  { id: "ADM-003", name: "Amara Diallo", email: "support@imari.com", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATp9iqS5SqcpjS3etyNwptRQK_Iqac7-Xdd8uXXR26TSmto_8W6cR8aYTRbLtvrji5xAjDlQeyh96ApuVKFnLTE14colQFM2rIAla5ZUn8u9Ke9Y18zhIZv734cltccjrhzGufzexroX_hhWQvF8Bfq0FHgCV2Rx5YYzWcZ5_4T-lBiS9NLv2Eeg-gPjc0nuDpr664kQayRQFWPvUc61HBuLRyF78aaFnLN4O8322IeK5yDdA5h2Yo-pxAy2e93agZk4xkL9YuteE", role: "SUPPORT", status: "Active", lastActive: "1h ago" },
];

// ── Transactions ──────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TX-76412", timestamp: "May 26, 2026 09:14 AM", entityName: "Robert Taylor", entityId: "USR-001", avatarLetters: "RT", amount: "$1,480.00", riskLevel: "Low", riskScore: 12, status: "Active", type: "Card Payment" },
  { id: "TX-01824", timestamp: "May 25, 2026 03:45 PM", entityName: "Elena Rostova", entityId: "USR-002", avatarLetters: "ER", amount: "€950.00", riskLevel: "Medium", riskScore: 42, status: "Active", type: "Wire Transfer" },
  { id: "TX-90284", timestamp: "May 24, 2026 11:22 AM", entityName: "David Hoffman", entityId: "USR-004", avatarLetters: "DH", amount: "$42,000.00", riskLevel: "High", riskScore: 68, status: "Flagged", type: "Cross-border" },
  { id: "TX-55102", timestamp: "May 24, 2026 08:10 AM", entityName: "Marcus Aurelius", entityId: "USR-003", avatarLetters: "MA", amount: "$250.00", riskLevel: "Low", riskScore: 8, status: "Active", type: "Subscription" },
  { id: "TX-88209", timestamp: "May 23, 2026 02:30 PM", entityName: "Amara Diallo", entityId: "USR-005", avatarLetters: "AD", amount: "$3,200.00", riskLevel: "Critical", riskScore: 92, status: "Flagged", type: "Velocity Alert" },
];

// ── KYC Queue ─────────────────────────────────────────────────────────────
export const MOCK_KYC_QUEUE: KYCSubmission[] = [
  { id: "KYC-001", name: "Elena Rostova", email: "e.rost@globalfiat.com", avatarCode: "ER", docType: "Passport", docNo: "PS7842109", submitDate: "May 25, 2026", riskScore: 18, expiryDate: "Jun 2030", nationality: "Russian Federation", idCardUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa47A7-SVWmRnWgqz0kw448wzG1H5fSvmhhPsb0-qQCoBHafY7TPAFq3NlnlaaqNWeH-RtSqzCdDXMeEu4QEMti5MXIw4VwhVt1sPjIlnHESLARhqr9wepX2HuyigcoExtbIO8nKS02JcLhsfYeIY8CCDIp0W9D9fE-07VT1ckpURkcf8PPU1ngjgWxzx2oJC-U__ZY8EN8Gi3htNeu4kjFLym7wkxlheU8SstO9IO6k9qRLXk5LE69mMeZzW3OXun4IaXzutDpto", faceMatchPct: 97, noAmlMatches: true },
  { id: "KYC-002", name: "David Hoffman", email: "d.hoffman@clearpath.io", avatarCode: "DH", docType: "Driver License", docNo: "DL4492018", submitDate: "May 24, 2026", riskScore: 45, expiryDate: "Dec 2028", nationality: "United States", idCardUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa47A7-SVWmRnWgqz0kw448wzG1H5fSvmhhPsb0-qQCoBHafY7TPAFq3NlnlaaqNWeH-RtSqzCdDXMeEu4QEMti5MXIw4VwhVt1sPjIlnHESLARhqr9wepX2HuyigcoExtbIO8nKS02JcLhsfYeIY8CCDIp0W9D9fE-07VT1ckpURkcf8PPU1ngjgWxzx2oJC-U__ZY8EN8Gi3htNeu4kjFLym7wkxlheU8SstO9IO6k9qRLXk5LE69mMeZzW3OXun4IaXzutDpto", faceMatchPct: 82, noAmlMatches: true },
];

// ── Security Alerts ───────────────────────────────────────────────────────
export const MOCK_ALERTS: AlertItem[] = [
  { id: "ALT-9082", type: "SQL Injection Probe Attempt", severity: "Critical", target: "Sovereign Ledger DB Node", timestamp: "May 26, 2026 13:14", status: "Pending Analyst", ip: "185.220.101.5", userAgent: "Chrome/103.0.0.0", payload: "UNION SELECT username, password_hash FROM admin_credentials --" },
  { id: "ALT-7821", type: "Rapid Location Swap Flag", severity: "High", target: "Operator session: Douglas Rain", timestamp: "May 26, 2026 12:45", status: "Under Investigation", ip: "12.80.122.90", userAgent: "Safari/15.4 Mobile", payload: "Session switched from London to Shanghai in 4.5 min." },
  { id: "ALT-4411", type: "Velocity-Limit Cross-Border Outflow", severity: "High", target: "EU-SEPA Settlement Pool", timestamp: "May 25, 2026 19:12", status: "Escalated", ip: "98.140.22.18", userAgent: "Webhook Daemon", payload: "14 repeated $50k SEPA outbound clears in 20 seconds." },
  { id: "ALT-3109", type: "Credential Overuse Probe Warning", severity: "Medium", target: "API Gateway", timestamp: "May 25, 2026 15:30", status: "Resolved", ip: "201.24.110.150", userAgent: "Go-http-client/1.1", payload: "Rate-limit exceeded (1,480/500 req/min). Auto-throttled." },
];

// ── Audit Log ─────────────────────────────────────────────────────────────
export const MOCK_AUDITS: AuditLogItem[] = [
  { id: "AUD-8820", sha: "8ef2c1b4a0", timestamp: "2026-05-26 13:05", operator: "Alex Rivera", role: "SUPER_ADMIN", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-R0Hiuv29c8acSml7p-XtqYlTY8FyA3TbdHrQtPm7ouCywcSbJxylF5795AVQj5RbrrfVjHIACB6ejDrsBU3GZSJt4DArXWygq94bYndFj0MzmzeQaWYl_mh1-UHHrDB9dNGXbajtCGCEQI9OSyjoALnM5j5ktM3Yb0jilEZqSZf-l40c423Hyl6F-7p6OdHpV4eN8Xa4EzL_gl38ZARpCWQPrcVt68yFKd6WeQ_UXsq13qCfLmJy64aUqXGXVsWSTRpLyP0HB0U", action: "Rotated API credentials for Visa-Stripe Gateway", ip: "104.28.19.4", status: "Success" },
  { id: "AUD-8819", sha: "4ef901c812", timestamp: "2026-05-26 12:50", operator: "Douglas Rain", role: "SUPPORT_ADMIN", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATp9iqS5SqcpjS3etyNwptRQK_Iqac7-Xdd8uXXR26TSmto_8W6cR8aYTRbLtvrji5xAjDlQeyh96ApuVKFnLTE14colQFM2rIAla5ZUn8u9Ke9Y18zhIZv734cltccjrhzGufzexroX_hhWQvF8Bfq0FHgCV2Rx5YYzWcZ5_4T-lBiS9NLv2Eeg-gPjc0nuDpr664kQayRQFWPvUc61HBuLRyF78aaFnLN4O8322IeK5yDdA5h2Yo-pxAy2e93agZk4xkL9YuteE", action: "Revoked operator session due to geographical anomaly flag", ip: "12.80.122.90", status: "Warning" },
  { id: "AUD-8818", sha: "7db021ea5c", timestamp: "2026-05-26 11:42", operator: "System API Router", role: "SYSTEM_API", avatar: "https://lh3.googleusercontent.com/a/default-user", action: "Initiated automated global liquidity sweep", ip: "10.240.12.8", status: "Success" },
  { id: "AUD-8816", sha: "ea3b9012f2", timestamp: "2026-05-25 21:03", operator: "System API Router", role: "SYSTEM_API", avatar: "https://lh3.googleusercontent.com/a/default-user", action: "Blocked malicious payload source IP 185.220.101.5 on WAF", ip: "185.220.101.5", status: "Blocked" },
];

// ── Tickets ───────────────────────────────────────────────────────────────
export const MOCK_TICKETS: Ticket[] = [
  { id: "TCK-8921", user: "Robert Taylor", email: "robert.t@alphastat.io", subject: "Wire Transfer Clearance Delayed", category: "Transaction Stuck", priority: "Critical", status: "Open", createdDate: "May 25, 2026", messages: [
    { sender: "user", text: "Sent $42,000 yesterday but cleared and unsettled. Please verify.", time: "10:14 AM" },
    { sender: "support", text: "Connecting with Bank of America clearing node. Investigating bank holiday latency.", time: "11:02 AM" },
  ]},
  { id: "TCK-3210", user: "Elena Rostova", email: "e.rost@globalfiat.com", subject: "KYC Rejected for Invalid Address Proof", category: "KYC Dispute", priority: "High", status: "Escalated", createdDate: "May 24, 2026", messages: [
    { sender: "user", text: "My utility bill was issued within 30 days. Why was address check flagged?", time: "3:40 PM" },
  ]},
  { id: "TCK-0941", user: "Marcus Aurelius", email: "m.aurelius@stoic.capital", subject: "API credentials for sandbox environment", category: "Integrations", priority: "Low", status: "Closed", createdDate: "May 20, 2026", messages: [
    { sender: "user", text: "Can we request a secondary public key for our webhooks?", time: "9:00 AM" },
    { sender: "support", text: "Yes, generated secondary hooks are accessible in Admin settings.", time: "11:30 AM" },
  ]},
];

// ── Disputes ──────────────────────────────────────────────────────────────
export const MOCK_DISPUTES: Dispute[] = [
  { id: "DSP-5029", txId: "TX-76412", cardholder: "Robert Taylor", amount: "$1,480.00", reason: "Unauthorized Card Charge", dateFlagged: "May 24, 2026", status: "Under Review", evidenceAttachedString: "Cardholder claims physical card was stolen during travel." },
  { id: "DSP-3921", txId: "TX-01824", cardholder: "Elena Rostova", amount: "€950.00", reason: "Double Charged on Node Settlement", dateFlagged: "May 22, 2026", status: "Under Review", evidenceAttachedString: "Dual validation webhook triggered, debiting client twice." },
  { id: "DSP-1090", txId: "TX-90284", cardholder: "David Hoffman", amount: "$250.00", reason: "Subscription Duplicate", dateFlagged: "May 18, 2026", status: "Dismissed", evidenceAttachedString: "Self-retracted. Client confirmed voluntary sign-up." },
];

// ── Wallets ───────────────────────────────────────────────────────────────
export const MOCK_WALLETS: TreasuryWallet[] = [
  { id: "W-LT-109", name: "Sovereign Settlement Reserve", currency: "USD", balance: "$12,480,950.00", type: "Fiat clearing", lastVerified: "14m ago", status: "Active", accNo: "US-NY-CHASE-0482" },
  { id: "W-LT-204", name: "Institutional Escrow Reserves", currency: "EUR", balance: "€4,120,400.00", type: "Escrow", lastVerified: "22m ago", status: "Active", accNo: "EU-FR-SOCIETE-9284" },
  { id: "W-LT-502", name: "Hot Liquid Clearing Node", currency: "BTC", balance: "182.404 BTC", type: "Hot Vault", lastVerified: "2m ago", status: "Active", accNo: "BTC-ADDR-0842" },
  { id: "W-LT-911", name: "Sovereign Savings Vault (Cold)", currency: "USDT", balance: "5,000,000.00 USDT", type: "Cold Vault", lastVerified: "1h ago", status: "Under Audit", accNo: "ERC-ADDR-9502" },
];

// ── Virtual Cards ─────────────────────────────────────────────────────────
export const MOCK_VIRTUAL_CARDS: VirtualCard[] = [
  { id: "CARD-001", pan: "•••• •••• •••• 1482", expiry: "11/29", cvv: "264", holder: "Imari Clearing LLC", type: "VISA", org: "Clearing Dept", status: "Active", issuedDate: "May 12, 2025", dailyLimit: "$500,000", spentThisMonth: "$310,480" },
  { id: "CARD-002", pan: "•••• •••• •••• 9385", expiry: "04/28", cvv: "109", holder: "Alex Rivera (Travel/Ops)", type: "MASTERCARD", org: "Executive Admin", status: "Active", issuedDate: "Jan 18, 2025", dailyLimit: "$25,000", spentThisMonth: "$4,120" },
  { id: "CARD-003", pan: "•••• •••• •••• 5029", expiry: "08/27", cvv: "898", holder: "Automated Rebalancing Bot", type: "VISA", org: "Arbitrage System", status: "Frozen", issuedDate: "Nov 02, 2024", dailyLimit: "$1,500,000", spentThisMonth: "$0" },
];

// ── Vaults ────────────────────────────────────────────────────────────────
export const MOCK_VAULTS: Vault[] = [
  { id: "VLT-8812", name: "Sovereign Liquidity Backup Fund", balance: 4200000, goal: 5000000, category: "Reserve", apy: 3.85, status: "Active Lock", deposits: [{ id: "TX-9901", amount: 250000, date: "May 25, 2026", source: "USD Clearing Node" }] },
  { id: "VLT-0219", name: "Yield Opt Clearing Vault", balance: 1850000, goal: 2000000, category: "Yield Pool", apy: 5.45, status: "Accumulating", deposits: [{ id: "TX-5092", amount: 450000, date: "May 24, 2026", source: "Auto rebalancer" }] },
  { id: "VLT-4401", name: "Stripe-Visa Collateral Escrow", balance: 950000, goal: 1500000, category: "Escrow", apy: 1.20, status: "Active Lock", deposits: [{ id: "TX-0128", amount: 100000, date: "May 18, 2026", source: "Collateral top-up" }] },
];

// ── Broadcasts ────────────────────────────────────────────────────────────
export const MOCK_BROADCASTS: BroadcastMessage[] = [
  { id: "BCST-094", title: "Scheduled Maintenance Lock Window Notice", medium: "Email", audience: "All Institutional Clients", status: "Sent", timestamp: "May 25, 2026 10:00 AM" },
  { id: "BCST-012", title: "High Risk KYC Auto-Reject Rules Alert", medium: "Sms", audience: "Super Admins", status: "Sent", timestamp: "May 24, 2026 03:30 AM" },
  { id: "BCST-881", title: "System Update: Virtual Cards Daily Settlement Caps", medium: "Webhook", audience: "Connected API Clients", status: "Scheduled", timestamp: "June 01, 2026 12:00 AM" },
];

// ── Config Toggles ────────────────────────────────────────────────────────
export const MOCK_CONFIG_TOGGLES: ConfigToggle[] = [
  { id: "cfg-1", name: "Auto-Approve High Match KYC", description: "Instantly approve KYC submissions with >95% face match and zero AML match hits.", enabled: true, category: "Verification" },
  { id: "cfg-2", name: "Enforce Multi-Factor for Withdrawals", description: "Require Hardware and SMS Auth for transfers exceeding $50k.", enabled: true, category: "Security" },
  { id: "cfg-3", name: "Stripe Sandbox Environment Link", description: "Map all card processes to sandboxed gateways instead of live rails.", enabled: false, category: "System" },
  { id: "cfg-4", name: "Audit Log Slack Webhooks", description: "Stream live compliance alerts and risk notifications to corp security channel.", enabled: true, category: "System" },
];

// ── Plans ─────────────────────────────────────────────────────────────────
export const MOCK_PLANS: Plan[] = [
  { id: "PLN-K89", name: "Enterprise High-Frequency Desk API", mrrRate: 15000, subscribersCount: 24, features: "Sub-millisecond settling triggers, Dedicated BoA bridge, unlimited KYC slots", status: "Active" },
  { id: "PLN-U12", name: "Institutional Multi-Sig Cleared Buffer", mrrRate: 5000, subscribersCount: 88, features: "MPC keys, automated reserve sweeps, SOC2 PDF logs", status: "Active" },
  { id: "PLN-T30", name: "Sovereign Clearing Sandbox Starter", mrrRate: 1250, subscribersCount: 312, features: "Restricted clearing simulation, standard dev help center, mock test cards", status: "Active" },
  { id: "PLN-X09", name: "Legacy Unlimited Ledger Tier", mrrRate: 800, subscribersCount: 42, features: "Offline DB snapshot exports, standard webhook triggers API", status: "Legacy" },
];

// ── Corridors ─────────────────────────────────────────────────────────────
export const MOCK_CORRIDORS: Corridor[] = [
  { id: "CR-ACH", name: "ACH Clearing Desk", inflow24h: 3800000, outflow24h: 2100000, latencyMin: 180, status: "Nominal" },
  { id: "CR-SEPA", name: "Euro SEPA Instant Corridor", inflow24h: 1200000, outflow24h: 850000, latencyMin: 0.5, status: "Nominal" },
  { id: "CR-FEDNW", name: "FedNow US Instant Node", inflow24h: 4900000, outflow24h: 4600000, latencyMin: 0.1, status: "High Load" },
  { id: "CR-SWIFT", name: "Cross-Border SWIFT Network", inflow24h: 840000, outflow24h: 1500000, latencyMin: 1440, status: "Stalled Queue" },
];

// ── Compliance Audits ─────────────────────────────────────────────────────
export const MOCK_COMPLIANCE_AUDITS: AuditLog[] = [
  { id: "COMP-9018", category: "AML Check", executor: "Compliance Scanner", details: "Automated scan on entity Sovereign Clearing SA. No sanctions watchlist matches.", result: "Passed", timestamp: "May 26, 2026 11:20 AM" },
  { id: "COMP-4091", category: "Liquidity Audit", executor: "Internal Audit Desk", details: "Checked reserve parity on Hot Liquid Clearing Nodes against real bank balance certificates.", result: "Passed", timestamp: "May 25, 2026 04:30 PM" },
  { id: "COMP-0914", category: "AML Check", executor: "Compliance Scanner", details: "Entity TX-80924 triggered warning score. Possible indirect connection with suspended wallet.", result: "Flagged", timestamp: "May 24, 2026 03:00 PM" },
];

// ── Category Limits ───────────────────────────────────────────────────────
export const MOCK_CATEGORY_LIMITS: CategoryLimit[] = [
  { id: "BC-09", category: "Forex Settlement Buffers", allocated: "$2,000,000", spent: "$1,420,000", percent: 71, unallocated: "$580,000", owner: "Settlement Operations" },
  { id: "BC-12", category: "Virtual Card Transactions Vault", allocated: "$500,000", spent: "$310,480", percent: 62, unallocated: "$189,520", owner: "Card Processing LLC" },
  { id: "BC-44", category: "Development & AWS Infrastructure", allocated: "$80,000", spent: "$78,500", percent: 98, unallocated: "$1,500", owner: "DevOps / Tech Infrastructure" },
  { id: "BC-68", category: "Corporate Marketing & Affiliates", allocated: "$150,005", spent: "$25,000", percent: 16, unallocated: "$125,005", owner: "Institutional Outreach" },
];

// ── Overview Metrics ──────────────────────────────────────────────────────
export const MOCK_OVERVIEW_METRICS = {
  totalUsers: "1.2M",
  transactionVolume: "$124.8M",
  activeWallets: "890k",
  fraudAlerts: 14,
  activeUsersPct: "+12%",
  kycPending: 156,
  kycPendingStatus: "Action Req.",
  walletTotal: "$4.2M",
  systemUptime: "99.98%",
};

export const MOCK_SECURITY_STATUS = {
  riskScore: 14,
  riskText: "Low",
  vs24h: "-4.2%",
  statusText: "Stable",
  criticalAlertCount: 3,
  criticalAlertPct: "+12% surge",
  pendingReviewsCount: 127,
  blockedAttempts: "4,829",
  authFailureRate: "0.42%",
  threats: { sqliRate: "1.2k/hr", xssRate: "0.8k/hr" },
};
