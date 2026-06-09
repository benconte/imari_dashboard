"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWallets } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import DonutChart from "@/components/charts/DonutChart";
import type { ApexOptions } from "apexcharts";

const STATUS_BADGE: Record<string, "success" | "warning" | "danger"> = { Active: "success", "Under Audit": "warning", Frozen: "danger" };

export default function WalletsPage() {
  const [search, setSearch] = useState("");
  const { data: wallets = [] } = useQuery({ queryKey: ["wallets"], queryFn: getWallets });
  const filtered = wallets.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()) || w.currency.toLowerCase().includes(search.toLowerCase()));

  const donutOptions: ApexOptions = {
    chart: { fontFamily: "Inter, sans-serif" },
    labels: wallets.map((w) => w.name.split(" ").slice(0, 2).join(" ")),
    colors: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
    legend: { position: "bottom", fontSize: "11px" },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "72%", labels: { show: true, total: { show: true, label: "Wallets", fontSize: "14px", fontWeight: 700 } } } } },
    stroke: { width: 2 },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Wallets" subtitle="Wallet operations & funding" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 p-6" padded={false}>
          <h3 className="font-bold text-gray-900 mb-4">Balance Distribution</h3>
          <DonutChart options={donutOptions} series={wallets.map((w) => parseFloat(w.balance.replace(/[^0-9.]/g, "") || "0"))} height={280} />
        </Card>

        <Card className="lg:col-span-8" padded={false}>
          <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search wallets..." /></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Wallet</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Currency</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Balance</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Type</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4"><p className="text-xs font-bold text-gray-800">{w.name}</p><p className="text-[10px] text-gray-400 font-mono">{w.accNo}</p></td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-700">{w.currency}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{w.balance}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{w.type}</td>
                    <td className="px-6 py-4"><Badge variant={STATUS_BADGE[w.status] ?? "neutral"}>{w.status}</Badge></td>
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
