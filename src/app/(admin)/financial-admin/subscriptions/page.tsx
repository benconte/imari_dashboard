"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptions } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import SearchBar from "@/components/shared/SearchBar";
import ExportButton from "@/components/shared/ExportButton";

const STATUS_BADGE: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  Active: "success",
  Paused: "warning",
  "Pending Renewal": "warning",
  Cancelled: "neutral",
  Expired: "danger",
};

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const { data: subscriptions = [], isLoading } = useQuery({ queryKey: ["subscriptions"], queryFn: getSubscriptions });
  const filtered = subscriptions.filter((s) => s.merchantName.toLowerCase().includes(search.toLowerCase()) || s.owner.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" subtitle="Per-user recurring payments" action={<ExportButton data={filtered} />} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Subscriptions</p><p className="text-3xl font-bold text-gray-900 mt-2">{subscriptions.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active</p><p className="text-3xl font-bold text-green-600 mt-2">{subscriptions.filter((s) => s.status === "Active").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Paused</p><p className="text-3xl font-bold text-amber-600 mt-2">{subscriptions.filter((s) => s.status === "Paused").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cancelled / Expired</p><p className="text-3xl font-bold text-red-600 mt-2">{subscriptions.filter((s) => s.status === "Cancelled" || s.status === "Expired").length}</p></div>
      </div>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search merchant or owner..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Merchant</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Amount</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Billing Cycle</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Next Billing</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Last Billed</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Owner</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading subscriptions...</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><p className="text-xs font-bold text-gray-800">{s.merchantName}</p><p className="text-[10px] text-gray-400 font-mono">{s.id}</p></td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{s.amount}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-700">{s.billingCycle}</td>
                  <td className="px-6 py-4"><Badge variant={STATUS_BADGE[s.status] ?? "neutral"}>{s.status}</Badge></td>
                  <td className="px-6 py-4 text-xs text-gray-600">{s.nextBillingDate}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{s.lastBilledAt}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{s.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
