"use client";

import { MOCK_VAULTS } from "@/mock";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import BarChart from "@/components/charts/BarChart";
import type { ApexOptions } from "apexcharts";

const STATUS_BADGE: Record<string, "success" | "warning" | "info"> = {
  "Active Lock": "success",
  "Liquid Rebalancing": "warning",
  Accumulating: "info",
};

export default function SavingsStatsPage() {
  const [search, setSearch] = useState("");
  const vaults = MOCK_VAULTS;

  const filtered = vaults.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  const barOptions: ApexOptions = {
    chart: { id: "vault-balance", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#2563eb"],
    plotOptions: { bar: { borderRadius: 6, horizontal: true, barHeight: "65%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: vaults.map((v) => v.name.split(" ").slice(0, 3).join(" ")),
      labels: { style: { colors: "#6b7280", fontSize: "11px" }, formatter: (val) => `$${(Number(val) / 1000000).toFixed(1)}M` },
      axisBorder: { show: false },
    },
    yaxis: { labels: { style: { colors: "#374151", fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: "light" },
  };

  const totalBalance = vaults.reduce((s, v) => s + v.balance, 0);
  const totalGoal = vaults.reduce((s, v) => s + v.goal, 0);
  const avgApy = (vaults.reduce((s, v) => s + v.apy, 0) / vaults.length).toFixed(2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savings Stats"
        subtitle="Savings performance & trends"
        action={<Button variant="outline" size="sm" icon="download">Export</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Balance</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${(totalBalance / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Goal Target</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">${(totalGoal / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg APY</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{avgApy}%</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Vaults</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{vaults.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 p-6" padded={false}>
          <h3 className="font-bold text-gray-900 mb-4">Vault Balances</h3>
          <BarChart options={barOptions} series={[{ name: "Balance", data: vaults.map((v) => v.balance) }]} height={250} />
        </Card>

        <Card className="lg:col-span-7" padded={false}>
          <div className="p-4 border-b border-gray-100">
            <SearchBar value={search} onChange={setSearch} placeholder="Search vaults..." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Vault</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Balance / Goal</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">APY</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-800">{v.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{v.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-900">${(v.balance / 1000000).toFixed(2)}M</p>
                      <p className="text-[10px] text-gray-400">of ${(v.goal / 1000000).toFixed(1)}M</p>
                      <div className="mt-1.5 w-full bg-gray-100 h-1.5 rounded-full">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min((v.balance / v.goal) * 100, 100)}%` }} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">{v.category}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-green-600">{v.apy}%</td>
                    <td className="px-6 py-4">
                      <Badge variant={STATUS_BADGE[v.status] ?? "neutral"}>{v.status}</Badge>
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
