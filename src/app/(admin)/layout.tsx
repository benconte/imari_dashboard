import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import type { AdminRole } from "@/types/next-auth";

export const metadata: Metadata = {
  title: "Imari Admin",
  description: "Imari Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  const role      = (session?.user?.role ?? "SUPPORT_ADMIN") as AdminRole;
  const userName  = session?.user?.name  ?? "Admin";
  const userEmail = session?.user?.email ?? "";
  const userImage = (session?.user as { image?: string })?.image ?? null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar role={role} userName={userName} />

      <div className="lg:pl-[250px] flex flex-col min-h-screen">
        <Topbar
          userName={userName}
          userEmail={userEmail}
          userImage={userImage}
        />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}