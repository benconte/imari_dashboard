"use client";

import { useQuery } from "@tanstack/react-query";
import { getPlatformGrowthData, getOverviewMetrics } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import AreaChart from "@/components/charts/AreaChart";
import BarChart from "@/components/charts/BarChart";
import type { ApexOptions } from "apexcharts";

export default function PlatformAnalyticsPage() {
  const { data: growthData } = useQuery({ queryKey: ["growthData"], queryFn: getPlatformGrowthData });
  const { data: metrics } = useQuery({ queryKey: ["overviewMetrics"], queryFn: getOverviewMetrics });

  const growthOptions: ApexOptions = {
    chart: { id: "platform-growth", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#2563eb"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] } },
    xaxis: { categories: growthData?.map((d) => d.date) ?? [], labels: { style: { colors: "#6b7280", fontSize: "11px" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (val) => `${(val / 1000000).toFixed(1)}M`, style: { colors: "#6b7280", fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: "light" },
    legend: { show: false },
  };

  const barOptions: ApexOptions = {
    chart: { id: "retention-bars", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#2563eb", "#93c5fd"],
    plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Week 1", "Week 2", "Week 3", "Week 4"], labels: { style: { colors: "#6b7280", fontSize: "11px" } }, axisBorder: { show: false } },
    yaxis: { labels: { style: { colors: "#6b7280", fontSize: "11px" }, formatter: (val) => `${val}%` } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: "light" },
    legend: { position: "top", horizontalAlign: "left", fontSize: "12px", fontWeight: 600 },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        subtitle="Growth, engagement & retention metrics"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon="date_range">Last 30 Days</Button>
            <Button variant="outline" size="sm" icon="download">Export</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={metrics?.totalUsers ?? "1.2M"} delta={metrics?.activeUsersPct} icon="person" />
        <StatCard label="Active Wallets" value={metrics?.activeWallets ?? "890k"} delta="Stable" deltaVariant="neutral" icon="account_balance_wallet" />
        <StatCard label="KYC Pending" value={String(metrics?.kycPending ?? 156)} delta={metrics?.kycPendingStatus} deltaVariant="danger" icon="verified_user" />
        <StatCard label="System Uptime" value={metrics?.systemUptime ?? "99.98%"} delta="Healthy" deltaVariant="success" icon="cloud_done" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-6" padded={false}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900">User Growth</h3>
              <p className="text-xs text-gray-400 mt-1">DAU vs MAU over time</p>
            </div>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-gray-800 rounded-md shadow-sm">30 Days</button>
              <button className="px-3 py-1.5 text-xs font-semibold text-gray-400 rounded-md">90 Days</button>
            </div>
          </div>
          <div className="min-h-[300px] w-full">
            <AreaChart
              options={growthOptions}
              series={[
                { name: "DAU", data: growthData?.map((d) => d.dau) ?? [] },
                { name: "MAU", data: growthData?.map((d) => d.mau) ?? [] },
              ]}
              height={300}
            />
          </div>
        </Card>

        <Card className="lg:col-span-4 p-6" padded={false}>
          <div className="mb-6">
            <h3 className="font-bold text-gray-900">Retention</h3>
            <p className="text-xs text-gray-400 mt-1">Weekly cohort analysis</p>
          </div>
          <div className="min-h-[300px] w-full">
            <BarChart
              options={barOptions}
              series={[
                { name: "New Users", data: [78, 64, 52, 45] },
                { name: "Returning", data: [42, 55, 60, 68] },
              ]}
              height={300}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padded>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Session Duration</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">8m 42s</p>
          <p className="text-xs text-green-600 font-semibold mt-1">+1.2m vs last month</p>
        </Card>
        <Card padded>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transactions Per User</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">12.4</p>
          <p className="text-xs text-blue-600 font-semibold mt-1">+0.8 vs last month</p>
        </Card>
        <Card padded>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Churn Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">2.1%</p>
          <p className="text-xs text-green-600 font-semibold mt-1">-0.3% vs last month</p>
        </Card>
      </div>
    </div>
  );
}
