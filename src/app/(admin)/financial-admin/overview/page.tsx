"use client";

import { useQuery } from "@tanstack/react-query";
import { getOverviewMetrics, getTransactions } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import AreaChart from "@/components/charts/AreaChart";
import type { ApexOptions } from "apexcharts";

export default function FinancialAdminOverview() {
  const { data: metrics } = useQuery({ queryKey: ["overviewMetrics"], queryFn: getOverviewMetrics });
  const { data: txList } = useQuery({ queryKey: ["transactions"], queryFn: getTransactions });

  const chartOptions: ApexOptions = {
    chart: { id: "tx-volume", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "Inter, sans-serif" },
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
      <PageHeader title="Financial Overview" subtitle="Treasury metrics & settlement pipeline" action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon="sync">Refresh</Button>
          <Button variant="outline" size="sm" icon="ios_share">Export Report</Button>
        </div>
      } />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Transaction Volume" value={metrics?.transactionVolume ?? "$124.8M"} delta="+12%" icon="currency_exchange" />
        <StatCard label="Pending Settlements" value="23" delta="Action Req." deltaVariant="danger" icon="schedule" />
        <StatCard label="Active Wallets" value={metrics?.activeWallets ?? "890k"} delta="Stable" deltaVariant="neutral" icon="account_balance_wallet" />
        <StatCard label="Fraud Score" value="Low" delta="14/100" deltaVariant="success" icon="gpp_maybe" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-6" padded={false}>
          <div className="flex justify-between items-center mb-6">
            <div><h3 className="font-bold text-gray-900">Transaction Volume</h3><p className="text-xs text-gray-400 mt-1">Daily settlement throughput</p></div>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-gray-800 rounded-md shadow-sm">7 Days</button>
              <button className="px-3 py-1.5 text-xs font-semibold text-gray-400 rounded-md">30 Days</button>
            </div>
          </div>
          <div className="min-h-[300px] w-full">
            <AreaChart options={chartOptions} series={[{ name: "Volume", data: [42000, 38000, 51000, 47000, 55000, 61000, 48000] }]} height={300} />
          </div>
        </Card>

        <Card className="lg:col-span-4" padded={false}>
          <div className="p-5 border-b border-gray-50"><h3 className="font-bold text-gray-900">Quick Actions</h3><p className="text-xs text-gray-400 mt-0.5">Financial operations</p></div>
          <div className="p-5 space-y-3">
            {[
              { icon: "swap_horiz", label: "Process Pending", desc: "23 settlements queued", color: "bg-blue-50 text-blue-600" },
              { icon: "account_balance", label: "Liquidity Sweep", desc: "Auto-rebalance reserves", color: "bg-green-50 text-green-600" },
              { icon: "gpp_maybe", label: "Review Flagged", desc: "2 transactions flagged", color: "bg-red-50 text-red-600" },
              { icon: "description", label: "Generate Report", desc: "Monthly compliance PDF", color: "bg-amber-50 text-amber-600" },
            ].map((a) => (
              <button key={a.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}><span className="material-symbols-outlined text-[18px]">{a.icon}</span></div>
                <div><p className="text-xs font-bold text-gray-800">{a.label}</p><p className="text-[10px] text-gray-400">{a.desc}</p></div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-900">Recent Transactions</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Entity</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Amount</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Risk</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {txList?.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{tx.id}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 font-bold text-[10px] border border-gray-200">{tx.avatarLetters}</div><p className="text-xs font-bold text-gray-800">{tx.entityName}</p></div></td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{tx.amount}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 font-bold text-xs ${tx.riskLevel === "Critical" ? "text-red-500" : tx.riskLevel === "High" ? "text-amber-500" : "text-gray-500"}`}><span className={`w-1.5 h-1.5 rounded-full ${tx.riskLevel === "Critical" ? "bg-red-500" : tx.riskLevel === "High" ? "bg-amber-400" : "bg-gray-400"}`} />{tx.riskLevel}</span></td>
                  <td className="px-6 py-4"><Badge variant={tx.status === "Active" ? "info" : tx.status === "Flagged" ? "danger" : "neutral"}>{tx.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
