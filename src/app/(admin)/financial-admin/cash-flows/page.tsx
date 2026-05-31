"use client";

import { MOCK_CORRIDORS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import BarChart from "@/components/charts/BarChart";
import type { ApexOptions } from "apexcharts";
import ExportButton from "@/components/shared/ExportButton";

const CORRIDOR_STATUS: Record<string, "success" | "warning" | "danger"> = { Nominal: "success", "High Load": "warning", "Stalled Queue": "danger" };

export default function CashFlowsPage() {
  const corridors = MOCK_CORRIDORS;
  const totalInflow = corridors.reduce((s, c) => s + c.inflow24h, 0);
  const totalOutflow = corridors.reduce((s, c) => s + c.outflow24h, 0);

  const barOptions: ApexOptions = {
    chart: { id: "cash-flow", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#22c55e", "#ef4444"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: corridors.map((c) => c.name.split(" ").slice(0, 2).join(" ")), labels: { style: { colors: "#6b7280", fontSize: "10px" } }, axisBorder: { show: false } },
    yaxis: { labels: { formatter: (val) => `$${(Number(val) / 1000000).toFixed(1)}M`, style: { colors: "#6b7280", fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: "light" },
    legend: { position: "top", horizontalAlign: "left", fontSize: "12px", fontWeight: 600 },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Cash Flow" subtitle="Inflow, outflow & liquidity" action={<ExportButton data={corridors}  />} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">24h Inflow</p><p className="text-3xl font-bold text-green-600 mt-2">${(totalInflow / 1000000).toFixed(1)}M</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">24h Outflow</p><p className="text-3xl font-bold text-red-600 mt-2">${(totalOutflow / 1000000).toFixed(1)}M</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Net Flow</p><p className="text-3xl font-bold text-blue-600 mt-2">${((totalInflow - totalOutflow) / 1000000).toFixed(1)}M</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Collateral Ratio</p><p className="text-3xl font-bold text-green-600 mt-2">140%</p></div>
      </div>

      <Card padded={false}>
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Corridor Flow Analysis</h3>
          <BarChart
            options={barOptions}
            series={[
              { name: "Inflow", data: corridors.map((c) => c.inflow24h) },
              { name: "Outflow", data: corridors.map((c) => c.outflow24h) },
            ]}
            height={280}
          />
        </div>
      </Card>

      <Card padded={false}>
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-900">Payment Corridors</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Corridor</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Inflow 24h</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Outflow 24h</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Latency</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {corridors.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><p className="text-xs font-bold text-gray-800">{c.name}</p><p className="text-[10px] text-gray-400 font-mono">{c.id}</p></td>
                  <td className="px-6 py-4 font-mono text-xs text-green-600">${(c.inflow24h / 1000000).toFixed(1)}M</td>
                  <td className="px-6 py-4 font-mono text-xs text-red-500">${(c.outflow24h / 1000000).toFixed(1)}M</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{c.latencyMin >= 60 ? `${(c.latencyMin / 60).toFixed(0)}h` : `${c.latencyMin}m`}</td>
                  <td className="px-6 py-4"><Badge variant={CORRIDOR_STATUS[c.status] ?? "neutral"}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
