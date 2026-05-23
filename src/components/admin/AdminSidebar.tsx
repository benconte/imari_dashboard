"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/financial-admin/overview", label: "Overview" },
  { href: "/financial-admin/wallets", label: "Wallets" },
  { href: "/financial-admin/reports", label: "Reports" },
  { href: "/financial-admin/transactions", label: "Transactions" },
  { href: "/financial-admin/virtual-cards", label: "Virtual cards" },
  { href: "/financial-admin/budgets-spending", label: "Budgets & spending" },
  { href: "/financial-admin/cash-flows", label: "Cash flows" },
  { href: "/financial-admin/saving-vaults", label: "Saving vaults" },
  { href: "/financial-admin/compliance", label: "Compliance" },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col h-full border-r bg-white dark:bg-zinc-950 dark:border-zinc-800">
        <div className="px-4 py-4">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Admin
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Financial
          </div>
        </div>

        <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex items-center px-3 py-2 text-sm rounded-lg transition-colors " +
                  (active
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Sidebar is a starter layout.
          </div>
        </div>
      </div>
    </aside>
  );
}

