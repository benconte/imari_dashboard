"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWalletById, freezeWallet, unfreezeWallet } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import AreaChart from "@/components/charts/AreaChart";
import type { ApexOptions } from "apexcharts";

const STATUS_BADGE: Record<string, "success" | "warning" | "danger"> = { Active: "success", "Under Audit": "warning", Frozen: "danger" };

export default function WalletDetailPage({ params }: { params: Promise<{ walletId: string }> }) {
  const { walletId } = use(params);
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const { data: wallet } = useQuery({ queryKey: ["wallet", walletId], queryFn: () => getWalletById(walletId) });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["wallet", walletId] });
    queryClient.invalidateQueries({ queryKey: ["wallets"] });
  };

  const { mutate: doFreeze, isPending: freezing, error: freezeErr } = useMutation({
    mutationFn: () => freezeWallet(walletId),
    onSuccess: invalidate,
  });

  const { mutate: doUnfreeze, isPending: unfreezing, error: unfreezeErr } = useMutation({
    mutationFn: () => unfreezeWallet(walletId),
    onSuccess: invalidate,
  });

  const isFrozen = wallet?.status === "Frozen";
  const actionPending = freezing || unfreezing;
  const actionErr = (freezeErr ?? unfreezeErr) as Error | null;

  const chartOptions: ApexOptions = {
    chart: { id: "funding-activity", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#2563eb", "#ef4444"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 5] },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.05, stops: [0, 90, 100] } },
    xaxis: { categories: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"], labels: { style: { colors: "#94a3b8", fontSize: "11px" } }, axisBorder: { show: false } },
    yaxis: { labels: { formatter: (val) => `$${val}M`, style: { colors: "#94a3b8", fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: "light" },
    legend: { show: false },
  };

  if (!wallet) {
    return (
      <div className="space-y-6">
        <PageHeader title="Wallet Not Found" />
        <Card padded><p className="text-gray-500 text-sm">Wallet {walletId} could not be found.</p></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Wallet: ${wallet.name}`} subtitle={`${wallet.currency} · ${wallet.type}`} action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon="content_copy" onClick={() => { navigator.clipboard.writeText(wallet.accNo); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? "Copied!" : "Copy Address"}</Button>
          <Button
            variant={isFrozen ? "primary" : "outline"}
            size="sm"
            icon={isFrozen ? "lock_open" : "block"}
            disabled={actionPending}
            onClick={() => isFrozen ? doUnfreeze() : doFreeze()}
          >
            {actionPending ? (isFrozen ? "Activating…" : "Freezing…") : (isFrozen ? "Unfreeze" : "Freeze")}
          </Button>
        </div>
      } />

      {actionErr && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl">
          {actionErr.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padded>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Balance</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{wallet.balance}</p>
          <p className="text-xs text-gray-400 mt-1">{wallet.currency}</p>
        </Card>
        <Card padded>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
          <div className="mt-2"><Badge variant={STATUS_BADGE[wallet.status] ?? "neutral"}>{wallet.status}</Badge></div>
          <p className="text-xs text-gray-400 mt-2">Last verified: {wallet.lastVerified}</p>
        </Card>
        <Card padded>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Number</p>
          <p className="text-sm font-mono font-bold text-gray-900 mt-2">{wallet.accNo}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-6" padded={false}>
          <div className="flex justify-between items-center mb-6">
            <div><h3 className="font-bold text-gray-900">Funding Activity</h3><p className="text-xs text-gray-400 mt-1">Inflow vs outflow (USD)</p></div>
          </div>
          <div className="min-h-[280px] w-full">
            <AreaChart options={chartOptions} series={[
              { name: "Inflow", data: [1.2, 2.5, 2.1, 4.3, 3.8, 5.2, 4.5] },
              { name: "Outflow", data: [0.5, 0.8, 1.4, 0.9, 1.3, 1.0, 1.2] },
            ]} height={280} />
          </div>
        </Card>

        <div className="lg:col-span-4 space-y-6">
          <Card padded>
            <h4 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" icon="download" className="w-full justify-center">Export Ledger</Button>
            </div>
          </Card>

          <div className="bg-blue-600 p-6 rounded-2xl border border-blue-700/20 shadow-sm text-white relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h4 className="font-bold text-sm mb-2">Safety Directives</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-blue-200 mb-1">
                    <span>Hot Wallet Cap</span><span>$10M</span>
                  </div>
                  <div className="w-full bg-blue-900/60 h-1.5 rounded-full"><div className="bg-blue-400 h-full w-[80%] rounded-full" /></div>
                </div>
                <button
                  disabled={actionPending}
                  onClick={() => isFrozen ? doUnfreeze() : doFreeze()}
                  className="w-full py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-colors"
                >
                  {actionPending
                    ? (isFrozen ? "Activating…" : "Freezing…")
                    : (isFrozen ? "Activate Wallet" : "Freeze Wallet")}
                </button>
                {actionErr && <p className="text-[10px] text-rose-200 mt-1">{actionErr.message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
