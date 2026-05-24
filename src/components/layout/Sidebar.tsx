"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import type { AdminRole } from "@/types/next-auth";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavChild {
  label: string;
  href: string;
  badge?: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon: (props: { className?: string }) => React.ReactElement;
  children?: NavChild[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

function TransactionsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

function FraudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}

function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  );
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
    </svg>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
  );
}

function BudgetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function SavingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  );
}

function CashFlowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  );
}

function ComplianceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
  );
}

function ReportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
    </svg>
  );
}

function DisputeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  );
}

function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
    </svg>
  );
}

function AdminMgmtIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

function SubscriptionsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

// ── Nav Configs per Role ──────────────────────────────────────────────────────

const NAV_CONFIG: Record<AdminRole, NavSection[]> = {
  SUPER_ADMIN: [
    {
      title: "MAIN MENU",
      items: [
        { label: "Overview", href: "/super-admin/overview", icon: OverviewIcon },
        {
          label: "Users",
          href: "/super-admin/users",
          icon: UsersIcon,
          children: [
            { label: "All Users", href: "/super-admin/users" },
            { label: "KYC Queue", href: "/super-admin/users/kyc-queue" },
          ],
        },
        {
          label: "Admin Management",
          href: "/super-admin/admin-management",
          icon: AdminMgmtIcon,
          children: [
            { label: "All Admins", href: "/super-admin/admin-management" },
            { label: "Roles & Permissions", href: "/super-admin/admin-management/roles" },
          ],
        },
        { label: "Transactions", href: "/super-admin/transactions", icon: TransactionsIcon },
      ],
    },
    {
      title: "SECURITY",
      items: [
        {
          label: "Fraud & Security",
          href: "/super-admin/fraud-security",
          icon: FraudIcon,
          children: [
            { label: "Overview", href: "/super-admin/fraud-security" },
            { label: "Active Alerts", href: "/super-admin/fraud-security/alerts" },
            { label: "Audit Log", href: "/super-admin/fraud-security/audit-log" },
          ],
        },
      ],
    },
    {
      title: "ANALYTICS & CONFIG",
      items: [
        {
          label: "Platform Analytics",
          href: "/super-admin/platform-analytics",
          icon: AnalyticsIcon,
          children: [
            { label: "Overview", href: "/super-admin/platform-analytics" },
            { label: "Wallet Stats", href: "/super-admin/platform-analytics/wallet-stats" },
            { label: "Savings Stats", href: "/super-admin/platform-analytics/savings-stats" },
            { label: "Subscription Stats", href: "/super-admin/platform-analytics/subscription-stats" },
          ],
        },
        {
          label: "Notifications",
          href: "/super-admin/notifications",
          icon: BellIcon,
          children: [
            { label: "Broadcasts", href: "/super-admin/notifications" },
            { label: "Templates", href: "/super-admin/notifications/templates" },
          ],
        },
        {
          label: "System Config",
          href: "/super-admin/system-config",
          icon: CogIcon,
          children: [
            { label: "General", href: "/super-admin/system-config" },
            { label: "Categories", href: "/super-admin/system-config/categories" },
            { label: "Integrations", href: "/super-admin/system-config/integrations" },
          ],
        },
      ],
    },
  ],

  FINANCIAL_ADMIN: [
    {
      title: "MAIN MENU",
      items: [
        { label: "Overview", href: "/financial-admin/overview", icon: OverviewIcon },
        {
          label: "Transactions",
          href: "/financial-admin/transactions",
          icon: TransactionsIcon,
          children: [
            { label: "All Transactions", href: "/financial-admin/transactions" },
            { label: "Pending", href: "/financial-admin/transactions/pending" },
            { label: "Failed", href: "/financial-admin/transactions/failed" },
          ],
        },
        {
          label: "Wallets",
          href: "/financial-admin/wallets",
          icon: WalletIcon,
          children: [
            { label: "All Wallets", href: "/financial-admin/wallets" },
            { label: "Funding Activity", href: "/financial-admin/wallets/funding" },
          ],
        },
        { label: "Virtual Cards", href: "/financial-admin/virtual-cards", icon: CreditCardIcon },
      ],
    },
    {
      title: "ANALYTICS",
      items: [
        {
          label: "Budgets & Spending",
          href: "/financial-admin/budgets-spending",
          icon: BudgetIcon,
          children: [
            { label: "Overview", href: "/financial-admin/budgets-spending" },
            { label: "Categories", href: "/financial-admin/budgets-spending/categories" },
          ],
        },
        {
          label: "Savings Vaults",
          href: "/financial-admin/saving-vaults",
          icon: SavingsIcon,
          children: [
            { label: "Vault Activity", href: "/financial-admin/saving-vaults" },
            { label: "Goals", href: "/financial-admin/saving-vaults/goals" },
          ],
        },
        { label: "Subscriptions", href: "/financial-admin/subscriptions", icon: SubscriptionsIcon },
        { label: "Cash Flow", href: "/financial-admin/cash-flows", icon: CashFlowIcon },
      ],
    },
    {
      title: "COMPLIANCE",
      items: [
        {
          label: "Compliance",
          href: "/financial-admin/compliance",
          icon: ComplianceIcon,
          children: [
            { label: "Overview", href: "/financial-admin/compliance" },
            { label: "Reports", href: "/financial-admin/compliance/reports" },
          ],
        },
        { label: "Reports", href: "/financial-admin/reports", icon: ReportIcon },
      ],
    },
  ],

  SUPPORT_ADMIN: [
    {
      title: "MAIN MENU",
      items: [
        { label: "Overview", href: "/support-admin/overview", icon: OverviewIcon },
        {
          label: "Tickets",
          href: "/support-admin/tickets",
          icon: TicketIcon,
          children: [
            { label: "All Tickets", href: "/support-admin/tickets" },
            { label: "Escalated", href: "/support-admin/tickets/escalated" },
          ],
        },
        { label: "Users", href: "/support-admin/users", icon: UsersIcon },
      ],
    },
    {
      title: "RESOLUTION",
      items: [
        {
          label: "Disputes",
          href: "/support-admin/disputes",
          icon: DisputeIcon,
        },
        {
          label: "Announcements",
          href: "/support-admin/announcements",
          icon: MegaphoneIcon,
        },
      ],
    },
  ],
};

// ── Role Labels ───────────────────────────────────────────────────────────────

const ROLE_META: Record<AdminRole, { label: string; color: string }> = {
  SUPER_ADMIN:     { label: "Super Admin",     color: "bg-violet-100 text-violet-700" },
  FINANCIAL_ADMIN: { label: "Financial Admin", color: "bg-emerald-100 text-emerald-700" },
  SUPPORT_ADMIN:   { label: "Support Admin",   color: "bg-blue-100 text-blue-700" },
};

// ── Chevron ───────────────────────────────────────────────────────────────────

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// ── Nav Item Component ────────────────────────────────────────────────────────

function SidebarItem({ item }: { item: NavItem }) {
  const pathname = usePathname();

  const isChildActive = item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));
  const isSelfActive  = item.href ? (pathname === item.href || pathname.startsWith(item.href + "/")) : false;
  const isActive      = isSelfActive || !!isChildActive;

  const [open, setOpen] = useState(isActive);

  const hasChildren = !!item.children?.length;

  // Item with children — collapsible
  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
            isActive
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <item.icon
            className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
              isActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDownIcon
            className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            } ${isActive ? "text-indigo-400" : "text-gray-400"}`}
          />
        </button>

        {open && (
          <div className="mt-0.5 ml-[30px] pl-3 border-l border-gray-100 space-y-0.5">
            {item.children!.map((child) => {
              const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                    childActive
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span>{child.label}</span>
                  {child.badge && (
                    <span className="text-[10px] font-semibold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                      {child.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Simple link
  return (
    <Link
      href={item.href!}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
        isActive
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <item.icon
        className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
          isActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-600"
        }`}
      />
      <span className="flex-1">{item.label}</span>
    </Link>
  );
}

// ── Sidebar Component ─────────────────────────────────────────────────────────

interface SidebarProps {
  role: AdminRole;
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const sections = NAV_CONFIG[role] ?? [];
  const meta     = ROLE_META[role];

  return (
    <aside className="hidden lg:flex lg:w-[250px] lg:flex-col lg:fixed lg:inset-y-0 z-20">
      <div className="flex flex-col h-full bg-white border-r border-gray-100">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="flex-shrink-0">
            <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
              <circle cx="18" cy="18" r="16" stroke="#6366F1" strokeWidth="3.5"
                strokeDasharray="70 30" strokeLinecap="round" />
              <circle cx="18" cy="18" r="8" fill="#6366F1" opacity="0.2" />
            </svg>
          </div>
          <span className="text-[17px] font-bold text-gray-900 tracking-tight">Imari</span>
        </div>

        {/* ── Nav ──────────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 tracking-widest uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarItem key={item.label} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-indigo-600">
                {userName?.charAt(0).toUpperCase() ?? "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full ${meta.color}`}>
                {meta.label}
              </span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}