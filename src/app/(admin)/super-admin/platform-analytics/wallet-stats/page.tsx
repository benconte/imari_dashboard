"use client";

import { MOCK_PLANS } from "@/mock";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import DonutChart from "@/components/charts/DonutChart";
import type { ApexOptions } from "apexcharts";

const STATUS_BADGE: Record<string, "success" | "warning" | "neutral"> = {
  Active: "success",
  Legacy: "warning",
  Unavailable: "neutral",
};

export default function SubscriptionStatsPage() {
  const [search, setSearch] = useState("");
  const plans = MOCK_PLANS;

  const filtered = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase())
  );

  const donutOptions: ApexOptions = {
    chart: { fontFamily: "Inter, sans-serif" },
    labels: plans.map((p) => p.name.split(" ").slice(0, 3).join(" ")),
    colors: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
    legend: { position: "bottom", fontSize: "11px", fontWeight: 500 },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "72%", labels: { show: true, total: { show: true, label: "Subscribers", fontSize: "14px", fontWeight: 700 } } } } },
    stroke: { width: 2 },
  };

  const totalMrr = plans.reduce((s, p) => s + p.mrrRate * p.subscribersCount, 0);
  const totalSubs = plans.reduce((s, p) => s + p.subscribersCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Stats"
        subtitle="Subscription intelligence"
        action={<Button variant="outline" size="sm" icon="download">Export</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total MRR</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${(totalMrr / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subscribers</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalSubs}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Plans</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{plans.filter((p) => p.status === "Active").length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Legacy Plans</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{plans.filter((p) => p.status === "Legacy").length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 p-6" padded={false}>
          <h3 className="font-bold text-gray-900 mb-4">Subscriber Distribution</h3>
          <DonutChart
            options={donutOptions}
            series={plans.map((p) => p.subscribersCount)}
            height={280}
          />
        </Card>

        <Card className="lg:col-span-8" padded={false}>
          <div className="p-4 border-b border-gray-100">
            <SearchBar value={search} onChange={setSearch} placeholder="Search plans..." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Plan</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">MRR Rate</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Subscribers</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Revenue</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-800">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{p.id}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">${p.mrrRate.toLocaleString()}/mo</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-700">{p.subscribersCount}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-green-600">${(p.mrrRate * p.subscribersCount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={STATUS_BADGE[p.status] ?? "neutral"}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
