"use client";

import { useQuery } from "@tanstack/react-query";
import { getOverviewMetrics } from "@/services";
import { MOCK_TICKETS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

const PRIORITY_BADGE: Record<string, "danger" | "warning" | "neutral"> = { Critical: "danger", High: "warning", Low: "neutral" };
const STATUS_BADGE: Record<string, "info" | "warning" | "danger" | "neutral"> = { Open: "info", Pending: "warning", Escalated: "danger", Closed: "neutral" };

export default function SupportAdminOverview() {
  const { data: metrics } = useQuery({ queryKey: ["overviewMetrics"], queryFn: getOverviewMetrics });
  const tickets = MOCK_TICKETS;

  return (
    <div className="space-y-6">
      <PageHeader title="Support Overview" subtitle="Ticket pipeline & resolution metrics" action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon="sync">Refresh</Button>
          <Button variant="primary" size="sm" icon="add">New Ticket</Button>
        </div>
      } />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Open Tickets" value={String(tickets.filter((t) => t.status === "Open").length)} delta="Action Req." deltaVariant="danger" icon="confirmation_number" />
        <StatCard label="Escalated" value={String(tickets.filter((t) => t.status === "Escalated").length)} delta="Priority" deltaVariant="danger" icon="priority_high" />
        <StatCard label="Total Users" value={metrics?.totalUsers ?? "1.2M"} delta="+12%" icon="person" />
        <StatCard label="Avg Response" value="2.4h" delta="Improved" deltaVariant="success" icon="schedule" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8" padded={false}>
          <div className="px-6 py-4 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-900">Active Tickets</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">User</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Subject</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Priority</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{t.id}</td>
                    <td className="px-6 py-4"><div><p className="text-xs font-bold text-gray-800">{t.user}</p><p className="text-[10px] text-gray-400">{t.email}</p></div></td>
                    <td className="px-6 py-4 text-xs text-gray-700 max-w-xs truncate">{t.subject}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{t.category}</td>
                    <td className="px-6 py-4"><Badge variant={PRIORITY_BADGE[t.priority] ?? "neutral"}>{t.priority}</Badge></td>
                    <td className="px-6 py-4"><Badge variant={STATUS_BADGE[t.status] ?? "neutral"}>{t.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="lg:col-span-4" padded={false}>
          <div className="p-5 border-b border-gray-50"><h3 className="font-bold text-gray-900">Quick Actions</h3></div>
          <div className="p-5 space-y-3">
            {[
              { icon: "confirmation_number", label: "View Open Tickets", desc: "3 tickets awaiting response", color: "bg-blue-50 text-blue-600" },
              { icon: "priority_high", label: "Escalated Queue", desc: "1 high-priority escalation", color: "bg-red-50 text-red-600" },
              { icon: "campaign", label: "Send Announcement", desc: "Broadcast to users", color: "bg-green-50 text-green-600" },
              { icon: "person", label: "User Lookup", desc: "Search & view user details", color: "bg-amber-50 text-amber-600" },
            ].map((a) => (
              <button key={a.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}><span className="material-symbols-outlined text-[18px]">{a.icon}</span></div>
                <div><p className="text-xs font-bold text-gray-800">{a.label}</p><p className="text-[10px] text-gray-400">{a.desc}</p></div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
