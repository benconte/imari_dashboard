"use client";

import { useQuery } from "@tanstack/react-query";
import { getOverviewMetrics, getPlatformGrowthData, getSystemEvents, getNodeLatencies, getLiquidityStatus } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import AreaChart from "@/components/charts/AreaChart";
import type { ApexOptions } from "apexcharts";

export default function SuperAdminOverview() {
  const { data: metrics } = useQuery({ queryKey: ["overviewMetrics"], queryFn: getOverviewMetrics });
  const { data: growthData } = useQuery({ queryKey: ["growthData"], queryFn: getPlatformGrowthData });
  const { data: events } = useQuery({ queryKey: ["systemEvents"], queryFn: getSystemEvents });
  const { data: latencies } = useQuery({ queryKey: ["nodeLatencies"], queryFn: getNodeLatencies });
  const { data: liquidity } = useQuery({ queryKey: ["liquidityStatus"], queryFn: getLiquidityStatus });

  const chartOptions: ApexOptions = {
    chart: { id: "platform-growth", type: "area", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#2563eb", "#6b7280"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 5] },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] } },
    xaxis: { categories: growthData?.map((d) => d.date) ?? [], labels: { style: { colors: "#6b7280", fontSize: "11px" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (val) => `${(val / 1000000).toFixed(1)}M`, style: { colors: "#6b7280", fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { x: { show: true }, theme: "light" },
    legend: { show: false },
  };

  const chartSeries = [
    { name: "DAU", data: growthData?.map((d) => d.dau) ?? [] },
    { name: "MAU Trend", data: growthData?.map((d) => d.mau) ?? [] },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="System Health" subtitle="Real-time performance across all global nodes" action={
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon="sync">Refresh</Button>
          <Button variant="outline" size="sm" icon="ios_share">Export Report</Button>
          <Button variant="primary" size="sm" icon="warning">View Alerts</Button>
        </div>
      } />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={metrics?.totalUsers ?? "1.2M"} delta={metrics?.activeUsersPct} icon="person" />
        <StatCard label="Transaction Volume" value={metrics?.transactionVolume ?? "$124.8M"} delta="+12%" icon="currency_exchange" />
        <StatCard label="Active Wallets" value={metrics?.activeWallets ?? "890k"} delta="Stable" deltaVariant="neutral" icon="account_balance_wallet" />
        <div className="bg-white border-l-4 border-l-red-500 border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-red-50 rounded-xl"><span className="material-symbols-outlined text-red-600">gpp_maybe</span></div>
            <Badge variant="danger" className="animate-pulse">Critical</Badge>
          </div>
          <div className="mt-3">
            <p className="text-gray-400 font-bold tracking-wider text-[11px] uppercase">Fraud Alerts</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{metrics?.fraudAlerts ?? 14} Active</p>
          </div>
          <div className="mt-3 h-1 w-full bg-gray-100 rounded-full"><div className="h-1 bg-red-500 rounded-full" style={{ width: "75%" }} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-6" padded={false}>
          <div className="flex justify-between items-center mb-6">
            <div><h3 className="font-bold text-gray-900">Platform Growth</h3><p className="text-xs text-gray-400 mt-1">DAU vs MAU</p></div>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-gray-800 rounded-md shadow-sm">30 Days</button>
              <button className="px-3 py-1.5 text-xs font-semibold text-gray-400 rounded-md">90 Days</button>
            </div>
          </div>
          <div className="min-h-[300px] w-full"><AreaChart options={chartOptions} series={chartSeries} height={300} /></div>
        </Card>

        <Card className="lg:col-span-4 flex flex-col justify-between" padded={false}>
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">System Events</h3>
            <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="flex-1 p-5 space-y-4 max-h-[310px] overflow-y-auto">
            {events?.map((evt) => (
              <div key={evt.id} className="flex gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${evt.type === "critical" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                  <span className="material-symbols-outlined">{evt.icon}</span>
                </div>
                <div>
                  <p className={`text-xs font-bold ${evt.type === "critical" ? "text-red-600" : "text-gray-900"}`}>{evt.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{evt.description}</p>
                  <span className="text-[10px] font-semibold text-gray-400 mt-1 block">{evt.timeLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padded title="Node Latency (Global)">
          <div className="space-y-4">
            {latencies?.map((lat) => (
              <div key={lat.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${lat.isWarning ? "bg-red-500 animate-pulse" : "bg-blue-600"}`} />
                    <span className="text-xs font-bold text-gray-700">{lat.region}</span>
                  </div>
                  <span className={`font-mono text-xs font-semibold ${lat.isWarning ? "text-red-500" : "text-gray-500"}`}>{lat.latency}</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${lat.isWarning ? "bg-red-500" : "bg-blue-600"}`} style={{ width: `${lat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="bg-blue-600 p-6 rounded-2xl border border-blue-700/20 shadow-sm relative overflow-hidden text-white">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h4 className="font-bold mb-1">Liquidity Monitoring</h4>
              <p className="text-blue-200 text-xs mb-6 max-w-xs leading-relaxed">
                Automatic rebalancing is active across {(liquidity as any)?.pairCount ?? 48} exchange pairs. Reserve collateral at {(liquidity as any)?.collateralPct ?? "140%"}.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <p className="text-[10px] uppercase font-bold text-blue-200">USD Liquidity</p>
                <p className="text-xl font-extrabold mt-0.5">{(liquidity as any)?.usdLiquidity ?? "$42.1M"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <p className="text-[10px] uppercase font-bold text-blue-200">BTC Reserve</p>
                <p className="text-xl font-extrabold mt-0.5">{(liquidity as any)?.btcReserve ?? "1,240"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
