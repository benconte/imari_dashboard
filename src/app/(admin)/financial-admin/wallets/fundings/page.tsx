"use client";

import { MOCK_WALLETS } from "@/mock";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import AreaChart from "@/components/charts/AreaChart";
import type { ApexOptions } from "apexcharts";

const STATUS_BADGE: Record<string, "success" | "warning" | "danger"> = { Active: "success", "Under Audit": "warning", Frozen: "danger" };

export default function FundingActivityPage() {
  const [search, setSearch] = useState("");
  const wallets = MOCK_WALLETS;
  const filtered = wallets.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()));

  const chartOptions: ApexOptions = {
    chart: { id: "funding", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#2563eb"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] } },
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], labels: { style: { colors: "#6b7280", fontSize: "11px" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (val) => `$${(val / 1000).toFixed(0)}k`, style: { colors: "#6b7280", fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: "light" },
    legend: { show: false },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Funding Activity" subtitle="Deposit & funding analysis" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Funding</p><p className="text-3xl font-bold text-gray-900 mt-2">$18.4M</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">24h Deposits</p><p className="text-3xl font-bold text-green-600 mt-2">$2.1M</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">24h Withdrawals</p><p className="text-3xl font-bold text-red-600 mt-2">$1.4M</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Net Flow</p><p className="text-3xl font-bold text-blue-600 mt-2">+$670k</p></div>
      </div>

      <Card padded={false}>
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Funding Trend (7 Days)</h3>
          <AreaChart options={chartOptions} series={[{ name: "Funding", data: [420000, 380000, 510000, 470000, 550000, 610000, 480000] }]} height={250} />
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search wallets..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Wallet</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Currency</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Balance</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Last Verified</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><p className="text-xs font-bold text-gray-800">{w.name}</p><p className="text-[10px] text-gray-400 font-mono">{w.accNo}</p></td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-700">{w.currency}</td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{w.balance}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{w.lastVerified}</td>
                  <td className="px-6 py-4"><Badge variant={STATUS_BADGE[w.status] ?? "neutral"}>{w.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
