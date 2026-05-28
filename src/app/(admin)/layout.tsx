import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import AdminShell from "@/components/layout/Adminshell";
import type { AdminRole } from "@/types/next-auth";

export const metadata: Metadata = {
  title: "Imari Admin",
  description: "Imari Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  const role      = (session?.user?.role  ?? "SUPPORT_ADMIN") as AdminRole;
  const userName  =  session?.user?.name  ?? "Admin";
  const userEmail =  session?.user?.email ?? "";
  const userImage = (session?.user as { image?: string })?.image ?? null;

  return (
    <div className="min-h-screen bg-white">
      <AdminShell
        role={role}
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
      >
        {children}
      </AdminShell>
    </div>
  );
}