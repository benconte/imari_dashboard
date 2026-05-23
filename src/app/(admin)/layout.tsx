import type { Metadata } from "next";

import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin area",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <AdminSidebar />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Admin Dashboard
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

