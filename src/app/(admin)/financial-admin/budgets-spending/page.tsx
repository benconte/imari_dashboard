"use client";

import { useState } from "react";
import { MOCK_CATEGORY_LIMITS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import BarChart from "@/components/charts/BarChart";
import type { ApexOptions } from "apexcharts";
import ExportButton from "@/components/shared/ExportButton";

function getPercentColor(pct: number) {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-blue-600";
}

export default function BudgetsSpendingPage() {
  const [search, setSearch] = useState("");
  const categories = MOCK_CATEGORY_LIMITS;
  const filtered = categories.filter((c) => c.category.toLowerCase().includes(search.toLowerCase()));

  const barOptions: ApexOptions = {
    chart: { id: "budget-bars", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#2563eb", "#93c5fd"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: filtered.map((c) => c.category.split(" ").slice(0, 3).join(" ")), labels: { style: { colors: "#6b7280", fontSize: "10px" }, rotate: -15 }, axisBorder: { show: false } },
    yaxis: { labels: { style: { colors: "#6b7280", fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: "light" },
    legend: { position: "top", horizontalAlign: "left", fontSize: "12px", fontWeight: 600 },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Budgets & Spending" subtitle="Platform-wide spending analytics" action={<ExportButton data={filtered} />} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Categories</p><p className="text-3xl font-bold text-gray-900 mt-2">{categories.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Over Budget</p><p className="text-3xl font-bold text-red-600 mt-2">{categories.filter((c) => c.percent >= 90).length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Utilization</p><p className="text-3xl font-bold text-blue-600 mt-2">{Math.round(categories.reduce((s, c) => s + c.percent, 0) / categories.length)}%</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Unallocated</p><p className="text-3xl font-bold text-green-600 mt-2">$896k</p></div>
      </div>

      <Card padded={false}>
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Allocated vs Spent</h3>
          <BarChart options={barOptions} series={[
            { name: "Allocated", data: filtered.map((c) => parseFloat(c.allocated.replace(/[^0-9.]/g, "") || "0")) },
            { name: "Spent", data: filtered.map((c) => parseFloat(c.spent.replace(/[^0-9.]/g, "") || "0")) },
          ]} height={250} />
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search categories..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Allocated</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Spent</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Utilization</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Owner</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><p className="text-xs font-bold text-gray-800">{c.category}</p><p className="text-[10px] text-gray-400 font-mono">{c.id}</p></td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{c.allocated}</td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-700">{c.spent}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-20 bg-gray-100 h-2 rounded-full"><div className={`h-full rounded-full ${getPercentColor(c.percent)}`} style={{ width: `${Math.min(c.percent, 100)}%` }} /></div><span className="font-mono text-xs font-bold">{c.percent}%</span></div></td>
                  <td className="px-6 py-4 text-xs text-gray-600">{c.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
