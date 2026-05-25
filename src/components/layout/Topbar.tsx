"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

// ── Page title map ────────────────────────────────────────────────────────────

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  overview:             { title: "Overview",           subtitle: "Dashboard summary & key metrics"       },
  users:                { title: "Users",              subtitle: "Manage platform users"                 },
  "kyc-queue":          { title: "KYC Queue",          subtitle: "Pending identity verification reviews" },
  "admin-management":   { title: "Admin Management",   subtitle: "Manage admin accounts & permissions"   },
  roles:                { title: "Roles & Permissions", subtitle: "Configure role access"                },
  transactions:         { title: "Transactions",        subtitle: "Transaction monitoring & ledger"      },
  pending:              { title: "Pending",             subtitle: "Transactions awaiting processing"     },
  failed:               { title: "Failed",              subtitle: "Failed transactions & recovery queue" },
  "fraud-security":     { title: "Fraud & Security",   subtitle: "Risk monitoring & audit trail"        },
  alerts:               { title: "Fraud Alerts",        subtitle: "Active fraud alerts & flags"          },
  "audit-log":          { title: "Audit Log",           subtitle: "Full security audit trail"            },
  "platform-analytics": { title: "Platform Analytics", subtitle: "Growth, engagement & retention"       },
  "wallet-stats":       { title: "Wallet Stats",        subtitle: "Wallet distribution & activity"      },
  "savings-stats":      { title: "Savings Stats",       subtitle: "Savings performance & trends"        },
  "subscription-stats": { title: "Subscription Stats", subtitle: "Subscription intelligence"            },
  notifications:        { title: "Notifications",       subtitle: "Broadcast notification management"   },
  templates:            { title: "Templates",           subtitle: "Notification template editor"         },
  "system-config":      { title: "System Config",       subtitle: "Platform settings & integrations"    },
  categories:           { title: "Categories",          subtitle: "Expense category rules"              },
  integrations:         { title: "Integrations",        subtitle: "External API connection status"      },
  wallets:              { title: "Wallets",             subtitle: "Wallet operations & funding"         },
  funding:              { title: "Funding Activity",    subtitle: "Deposit & funding analysis"          },
  "virtual-cards":      { title: "Virtual Cards",       subtitle: "Card status, limits & activity"      },
  "budgets-spending":   { title: "Budgets & Spending",  subtitle: "Platform-wide spending analytics"    },
  "saving-vaults":      { title: "Savings Vaults",      subtitle: "Vault activity & savings performance"},
  goals:                { title: "Goals",               subtitle: "Goal completion & milestones"        },
  subscriptions:        { title: "Subscriptions",       subtitle: "Subscription intelligence dashboard" },
  "cash-flows":         { title: "Cash Flow",           subtitle: "Inflow, outflow & liquidity"         },
  compliance:           { title: "Compliance",          subtitle: "Compliance monitoring & reports"     },
  reports:              { title: "Reports",             subtitle: "Financial report history"            },
  tickets:              { title: "Tickets",             subtitle: "Support ticket management"           },
  escalated:            { title: "Escalated",           subtitle: "High-priority escalated issues"      },
  disputes:             { title: "Disputes",            subtitle: "Transaction dispute resolution"      },
  announcements:        { title: "Announcements",       subtitle: "User-facing support announcements"   },
  settings:             { title: "Settings",            subtitle: "Account preferences & security"      },
  profile:              { title: "Profile",             subtitle: "Your admin profile"                  },
  security:             { title: "Security",            subtitle: "Password & 2FA settings"             },
};

function getPageMeta(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    if (/^[0-9a-f-]{8,}$/i.test(seg) || /^\d+$/.test(seg)) continue;
    if (PAGE_META[seg]) return PAGE_META[seg];
  }
  return { title: "Dashboard", subtitle: "Imari Admin Portal" };
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function HamburgerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
function SignOutIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

// ── Topbar ────────────────────────────────────────────────────────────────────

interface TopbarProps {
  userName: string;
  userEmail: string;
  userImage?: string | null;
  onMenuClick: () => void;
}

export default function Topbar({ userName, userEmail, userImage, onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { title, subtitle } = getPageMeta(pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">

        {/* ── Hamburger (mobile only) ───────────────────────────────── */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex-shrink-0 p-2 -ml-1 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Open navigation"
        >
          <HamburgerIcon />
        </button>

        {/* ── Page title ────────────────────────────────────────────── */}
        <div className="flex-none min-w-0">
          <h1 className="text-[16px] sm:text-[17px] font-bold text-gray-900 leading-tight truncate">{title}</h1>
          <p className="text-[11px] text-gray-400 leading-tight mt-0.5 hidden sm:block">{subtitle}</p>
        </div>

        {/* ── Search ────────────────────────────────────────────────── */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-[340px] hidden sm:block">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-9 pl-9 pr-4 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        {/* ── Right actions ─────────────────────────────────────────── */}
        <div className="flex-none flex items-center gap-1.5 sm:gap-2">

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen((v) => !v); setDropdownOpen(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <BellIcon />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 mt-1 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    <p className="text-xs text-gray-400">3 unread</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      { title: "New KYC submission",           time: "2m ago",  dot: "bg-indigo-500" },
                      { title: "High-risk transaction flagged", time: "15m ago", dot: "bg-red-500"    },
                      { title: "Daily report ready",            time: "1h ago",  dot: "bg-green-500"  },
                    ].map((n, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                        <div>
                          <p className="text-sm text-gray-800">{n.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-gray-100">
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                      View all notifications →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => { setDropdownOpen((v) => !v); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100 flex items-center justify-center">
                {userImage ? (
                  <Image src={userImage} alt={userName} width={32} height={32} className="object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-indigo-600">{initials}</span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {userName.split(" ")[0]}
              </span>
              <ChevronDownIcon />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                  </div>
                  <div className="py-1">
                    <a href="/shared/settings/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <SettingsIcon /> Account Settings
                    </a>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <SignOutIcon /> Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}