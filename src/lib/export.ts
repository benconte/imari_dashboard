
export type ExportFormat = "csv" | "pdf";
 
export interface ExportColumn {
  key: string;
  label: string;
  /** Optional formatter — receives the raw cell value, returns display string */
  format?: (value: unknown) => string;
}
 
// ── CSV ───────────────────────────────────────────────────────────────────────
 
function escapeCSV(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  // Wrap in quotes if the value contains commas, quotes, or newlines
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
 
export function exportToCSV(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string
): void {
  const header = columns.map((c) => escapeCSV(c.label)).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const raw = row[col.key];
        const display = col.format ? col.format(raw) : raw;
        return escapeCSV(display);
      })
      .join(",")
  );
 
  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}.csv`);
}
 
// ── PDF ───────────────────────────────────────────────────────────────────────
// Pure-browser PDF via HTML → print-to-PDF approach.
// No external dependencies needed.
 
export function exportToPDF(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
  title?: string
): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
 
  const tableRows = data
    .map(
      (row) =>
        `<tr>${columns
          .map((col) => {
            const raw = row[col.key];
            const display = col.format ? col.format(raw) : (raw ?? "—");
            return `<td>${String(display)}</td>`;
          })
          .join("")}</tr>`
    )
    .join("");
 
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${filename}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: #111827;
      background: #fff;
      padding: 32px 40px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e5e7eb;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.5px;
    }
    .logo-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4f46e5;
      display: inline-block;
      margin-right: 6px;
    }
    .meta { text-align: right; color: #6b7280; font-size: 10px; line-height: 1.6; }
    h1 {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    .subtitle { color: #6b7280; font-size: 11px; margin-bottom: 20px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    thead tr {
      background: #f9fafb;
    }
    th {
      padding: 8px 12px;
      text-align: left;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #9ca3af;
      border-bottom: 1px solid #e5e7eb;
    }
    td {
      padding: 9px 12px;
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
      vertical-align: middle;
    }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:nth-child(even) td { background: #fafafa; }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #9ca3af;
    }
    .count-badge {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    @media print {
      body { padding: 20px 28px; }
      @page { margin: 0.5cm; size: A4 landscape; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke="#6366F1" stroke-width="3.5" stroke-dasharray="70 30" stroke-linecap="round"/>
        <circle cx="18" cy="18" r="8" fill="#6366F1" opacity="0.2"/>
      </svg>
      <span class="logo-text">Imari</span>
    </div>
    <div class="meta">
      <div>Imari Admin Platform</div>
      <div>Generated: ${new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })}</div>
    </div>
  </div>
 
  <h1>${title ?? filename}</h1>
  <p class="subtitle">Exported from Imari Admin Dashboard</p>
  <div class="count-badge">${data.length} record${data.length !== 1 ? "s" : ""}</div>
 
  <table>
    <thead>
      <tr>
        ${columns.map((c) => `<th>${c.label}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
 
  <div class="footer">
    <span>© ${new Date().getFullYear()} Imari. Confidential — Internal Use Only.</span>
    <span>${filename}.pdf</span>
  </div>
</body>
</html>`;
 
  printWindow.document.write(html);
  printWindow.document.close();
 
  // Give fonts a moment to load, then trigger print dialog
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 600);
}
 
// ── Generic trigger ───────────────────────────────────────────────────────────
 
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
 
// ── Convenience presets for each entity type ──────────────────────────────────
 
export const EXPORT_PRESETS = {
  transactions: {
    filename: "imari-transactions",
    title: "Transaction Ledger",
    columns: [
      { key: "id", label: "TX ID" },
      { key: "timestamp", label: "Timestamp" },
      { key: "entityName", label: "Entity" },
      { key: "amount", label: "Amount" },
      { key: "type", label: "Type", format: (v: unknown) => String(v ?? "—") },
      { key: "riskLevel", label: "Risk Level" },
      { key: "riskScore", label: "Risk Score" },
      { key: "status", label: "Status" },
    ] as ExportColumn[],
  },
  users: {
    filename: "imari-users",
    title: "Platform Users",
    columns: [
      { key: "id", label: "User ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "walletBalance", label: "Wallet Balance" },
      { key: "kycStatus", label: "KYC Status" },
      { key: "joinDate", label: "Join Date" },
    ] as ExportColumn[],
  },
  kyc: {
    filename: "imari-kyc-queue",
    title: "KYC Verification Queue",
    columns: [
      { key: "id", label: "KYC ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "docType", label: "Doc Type" },
      { key: "docNo", label: "Doc Number" },
      { key: "submitDate", label: "Submitted" },
      { key: "riskScore", label: "Risk Score" },
      { key: "faceMatchPct", label: "Face Match %", format: (v: unknown) => `${v}%` },
      { key: "noAmlMatches", label: "AML", format: (v: unknown) => (v ? "Clear" : "HIT") },
      { key: "nationality", label: "Nationality" },
    ] as ExportColumn[],
  },
  alerts: {
    filename: "imari-alerts",
    title: "Surveillance Alerts",
    columns: [
      { key: "id", label: "Alert ID" },
      { key: "type", label: "Type" },
      { key: "severity", label: "Severity" },
      { key: "target", label: "Target" },
      { key: "timestamp", label: "Timestamp" },
      { key: "status", label: "Status" },
      { key: "ip", label: "Source IP" },
    ] as ExportColumn[],
  },
  audits: {
    filename: "imari-audit-log",
    title: "Security Audit Trail",
    columns: [
      { key: "id", label: "Audit ID" },
      { key: "sha", label: "SHA Hash" },
      { key: "timestamp", label: "Timestamp" },
      { key: "operator", label: "Operator" },
      { key: "role", label: "Role" },
      { key: "action", label: "Action" },
      { key: "ip", label: "Source IP" },
      { key: "status", label: "Status" },
    ] as ExportColumn[],
  },
  categories: {
    filename: "imari-budget-categories",
    title: "Budget Categories",
    columns: [
      { key: "id", label: "ID" },
      { key: "category", label: "Category" },
      { key: "allocated", label: "Allocated" },
      { key: "spent", label: "Spent" },
      { key: "percent", label: "Utilization %", format: (v: unknown) => `${v}%` },
      { key: "unallocated", label: "Unallocated" },
      { key: "owner", label: "Owner" },
    ] as ExportColumn[],
  },
  wallets: {
    filename: "imari-wallets",
    title: "Treasury Wallets",
    columns: [
      { key: "id", label: "Wallet ID" },
      { key: "name", label: "Name" },
      { key: "currency", label: "Currency" },
      { key: "balance", label: "Balance" },
      { key: "type", label: "Type" },
      { key: "status", label: "Status" },
      { key: "lastVerified", label: "Last Verified" },
      { key: "accNo", label: "Account No." },
    ] as ExportColumn[],
  },
  vaults: {
    filename: "imari-savings-vaults",
    title: "Savings Vaults",
    columns: [
      { key: "id", label: "Vault ID" },
      { key: "name", label: "Name" },
      { key: "category", label: "Category" },
      { key: "balance", label: "Balance", format: (v: unknown) => `$${Number(v).toLocaleString()}` },
      { key: "goal", label: "Goal", format: (v: unknown) => `$${Number(v).toLocaleString()}` },
      { key: "apy", label: "APY %", format: (v: unknown) => `${v}%` },
      { key: "status", label: "Status" },
    ] as ExportColumn[],
  },
  corridors: {
    filename: "imari-corridors",
    title: "Payment Corridors",
    columns: [
      { key: "id", label: "Corridor ID" },
      { key: "name", label: "Name" },
      { key: "inflow24h", label: "24h Inflow", format: (v: unknown) => `$${(Number(v) / 1_000_000).toFixed(2)}M` },
      { key: "outflow24h", label: "24h Outflow", format: (v: unknown) => `$${(Number(v) / 1_000_000).toFixed(2)}M` },
      { key: "latencyMin", label: "Latency", format: (v: unknown) => Number(v) >= 60 ? `${(Number(v) / 60).toFixed(0)}h` : `${v}m` },
      { key: "status", label: "Status" },
    ] as ExportColumn[],
  },
  compliance: {
    filename: "imari-compliance-audits",
    title: "Compliance Audit Log",
    columns: [
      { key: "id", label: "ID" },
      { key: "category", label: "Category" },
      { key: "executor", label: "Executor" },
      { key: "details", label: "Details" },
      { key: "result", label: "Result" },
      { key: "timestamp", label: "Timestamp" },
    ] as ExportColumn[],
  },
  disputes: {
    filename: "imari-disputes",
    title: "Transaction Disputes",
    columns: [
      { key: "id", label: "Dispute ID" },
      { key: "txId", label: "TX Reference" },
      { key: "cardholder", label: "Cardholder" },
      { key: "amount", label: "Amount" },
      { key: "reason", label: "Reason" },
      { key: "dateFlagged", label: "Date Flagged" },
      { key: "status", label: "Status" },
    ] as ExportColumn[],
  },
  virtualCards: {
    filename: "imari-virtual-cards",
    title: "Virtual Cards",
    columns: [
      { key: "id", label: "Card ID" },
      { key: "pan", label: "PAN (Masked)" },
      { key: "holder", label: "Holder" },
      { key: "type", label: "Network" },
      { key: "org", label: "Organisation" },
      { key: "status", label: "Status" },
      { key: "dailyLimit", label: "Daily Limit" },
      { key: "spentThisMonth", label: "Spent This Month" },
      { key: "issuedDate", label: "Issued Date" },
    ] as ExportColumn[],
  },
};
 
