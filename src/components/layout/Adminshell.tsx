"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar  from "@/components/layout/Topbar";
import type { AdminRole } from "@/types/next-auth";

interface AdminShellProps {
  role: AdminRole;
  userName: string;
  userEmail: string;
  userImage?: string | null;
  children: React.ReactNode;
}


export default function AdminShell({
  role,
  userName,
  userEmail,
  userImage,
  children,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Sidebar
        role={role}
        userName={userName}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="lg:pl-[250px] flex flex-col min-h-screen">
        <Topbar
          userName={userName}
          userEmail={userEmail}
          userImage={userImage}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}