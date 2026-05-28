"use client";

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { getWallets, getWalletMetrics } from '@/services/wallets';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageWrapper } from '@/components/shared/PageWrapper';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Coins,
  Copy,
  FolderLock,
  Key,
  RefreshCw,
  Activity
} from 'lucide-react';

type WalletDetailPageProps = {
  params: Promise<{ walletId: string }>;
};

export default function WalletDetailPage({ params }: WalletDetailPageProps) {
  const queryClient = useQueryClient();
  const resolvedParams = React.use(params);
  const walletId = resolvedParams.walletId;


  const [copied, setCopied] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('250000');
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const { data: wallets = [] } = useQuery({
    queryKey: ['walletsList'],
    queryFn: getWallets
  });

  // Keep metrics query for KPI consistency (detail page could reuse it later)
  const { data: metrics } = useQuery({
    queryKey: ['walletMetrics'],
    queryFn: getWalletMetrics
  });

  const selectedWallet = useMemo(() => {
    return wallets.find((w) => w.id === walletId) || null;
  }, [wallets, walletId]);




  const handleCopyAddress = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLocalTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId || isToppingUp) return;
    const amount = parseFloat(topUpAmount);
    if (Number.isNaN(amount) || amount <= 0) return;

    setIsToppingUp(true);
    setTopUpSuccess(false);

    setTimeout(() => {
      setIsToppingUp(false);
      setTopUpSuccess(true);

      // Update local wallet memory
      queryClient.setQueryData(['walletsList'], (old: Array<{ id: string; balanceUsd: number; status: string }> | undefined) => {
        if (!old) return [];
        return old.map((w) => {
          if (w.id === walletId) {
            return {
              ...w,
              balanceUsd: w.balanceUsd + amount
            };
          }
          return w;
        });
      });

      setTimeout(() => setTopUpSuccess(false), 3000);
    }, 1500);
  };

  const toggleWalletStatus = useMutation({
    mutationFn: async (id: string) => {
      return new Promise<string>((resolve) => setTimeout(() => resolve(id), 200));
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['walletsList'], (old: Array<{ id: string; status: string }> | undefined) => {
        if (!old) return [];
        return old.map((w) => {
          if (w.id === id) {
            return {
              ...w,
              status: w.status === 'Active' ? 'Frozen' : 'Active'
            };
          }
          return w;
        });
      });
    }
  });

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      id: 'funding-activity-spline',
      type: 'area',
      height: 280,
      toolbar: { show: false },
      sparkline: { enabled: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#6366f1', '#ba1a1a'],
    stroke: {
      curve: 'smooth',
      width: [3, 2],
      dashArray: [0, 5]
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: [0.25, 0.05],
        opacityTo: [0.01, 0.0],
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '11px' },
        formatter: (val) => `$${val}M`
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } }
    },
    legend: { show: false },
    tooltip: {
      theme: 'light',
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `$${val}M USD`
      }
    }
  };

  const chartSeries = [
    {
      name: 'Top-ups (Inflow)',
      data: [1.2, 2.5, 2.1, 4.3, 3.8, 5.2, 4.5]
    },
    {
      name: 'Withdrawals (Outflow)',
      data: [0.5, 0.8, 1.4, 0.9, 1.3, 1.0, 1.2]
    }
  ];

  const defaultAddress =
    selectedWallet?.currency === 'BTC'
      ? 'bc1qxy2kg3ut6g3ut5628yx5628ygxy2kg'
      : '0xbc85A90deD74A1249A80FF82b4C642D0562e29c';

  if (!selectedWallet) {
    return (
      <PageWrapper
        category="Admin"
        title="Wallet Intelligence"
        subtitle={`Wallet ${walletId} not found.`}
        actions={
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.history.back();
            }}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to List
          </button>
        }
      >
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-sm text-gray-500">
          Loading wallet details...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      category="Wallets"
      title={`Wallet Intelligence: ${selectedWallet.id}`}
      subtitle="Solvency ratio audits, ledger locks, and manual capital allocations."
      actions={
        <button
          onClick={() => {
            if (typeof window !== 'undefined') window.history.pushState({}, '', '/financial-admin/wallets');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to List
        </button>
      }
    >
      {/* Optional top KPI row (keeps parity with the list page style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="LEDGER SOLVENCY RATIO"
          value={`$${selectedWallet.balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          delta={metrics?.totalBalanceDelta || '+4.2%'}
          deltaType="up"
          sparkline
          icon={<Coins />}
          iconBgClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="STATUS"
          value={selectedWallet.status}
          delta={selectedWallet.status === 'Active' ? '+0.9%' : '-0.4%'}
          deltaType={selectedWallet.status === 'Active' ? 'up' : 'down'}
          icon={<FolderLock className="w-5 h-5" />}
          iconBgClass={selectedWallet.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
        />
        <StatCard
          title="LAST INTERACTION"
          value={selectedWallet.lastActivity}
          subtitle={selectedWallet.currency}
          icon={<Activity className="w-5 h-5" />}
          iconBgClass="bg-gray-100 text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        <div className="lg:col-span-8 space-y-6">
          {/* Left Panel: Ledger info & Top-up Sweep */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-start border-b border-gray-50 pb-5 mb-5">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">LEDGER SOLVENCY RATIO</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-extrabold text-gray-950 font-mono">
                    ${selectedWallet.balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-sm font-bold text-slate-500 uppercase font-mono">{selectedWallet.currency}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">STATUS STATUS</span>
                <div className="mt-2">
                  <StatusBadge status={selectedWallet.status} />
                </div>
              </div>
            </div>

            {/* Public Blockchain Address copy box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/40 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs mb-6">
              <div className="font-mono">
                <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">PUBLIC COLD HARDWARE ADDRESS</span>
                <span className="font-bold text-slate-800 break-all select-all">{defaultAddress}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-sm shrink-0 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-400" />
                    Copy Address
                  </>
                )}
              </button>
            </div>

            {/* Client Owner metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm shadow-sm ${selectedWallet.userBgClass}`}>
                  {selectedWallet.userInitials}
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold">CLIENT BENEFICIARY</span>
                  <span className="font-bold text-gray-900 leading-tight block text-sm">{selectedWallet.userName}</span>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full font-bold flex items-center justify-center text-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold">LAST INTERACTION RECORDED</span>
                  <span className="font-semibold text-gray-900 leading-tight block text-sm">{selectedWallet.lastActivity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Sweep / Instant Funding */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-gray-950 tracking-tight">Manual Node Capital Inflow Sweep</h4>
              <p className="text-xs text-gray-400 mt-1">Initiate a mock liquidity transfer directly to simulate incoming deposit sweeping operations.</p>
            </div>

            <form onSubmit={handleLocalTopUp} className="mt-5 space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">TRANSFER INFLOW SIZE ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    required
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 pl-8 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white"
                    placeholder="e.g. 100000"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isToppingUp}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-2"
                >
                  {isToppingUp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sweeping Ledger Node...
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      Initiate Node Sweep
                    </>
                  )}
                </button>

                {topUpSuccess && (
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold font-sans animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    Sweep success! Cash loaded.
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Small chart section (reuse existing visual style) */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-base font-bold text-gray-900 font-sans tracking-tight">Wallet Funding Activity</h4>
                <p className="text-xs text-gray-400 mt-0.5 font-sans">Aggregated inflows vs. outflows (USD)</p>
              </div>
            </div>
            <div className="h-[280px]">
              <Chart options={chartOptions} series={chartSeries} type="area" height="100%" width="100%" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Multi-Signature Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-950 tracking-tight">Consensus Key Status</h4>
              <p className="text-xs text-gray-400 mt-1">Multi-signature hardware validation parameters.</p>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center gap-2.5 justify-between py-1.5 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800">Compliance key</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-black py-0.5 px-1.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">SIGNED</span>
              </div>

              <div className="flex items-center gap-2.5 justify-between py-1.5 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800">Finance Analyst key</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-black py-0.5 px-1.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">SIGNED</span>
              </div>

              <div className="flex items-center gap-2.5 justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-bold text-slate-800">Support Auditor key</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-black py-0.5 px-1.5 bg-amber-50 text-amber-700 rounded border border-amber-100">AWAITING</span>
              </div>
            </div>
          </div>

          {/* Cold storage limit parameters */}
          <div className="bg-indigo-950 text-white rounded-2xl p-6 space-y-4 shadow-xl shadow-indigo-950/20">
            <h4 className="text-xs font-bold font-sans tracking-wide uppercase text-indigo-200">System Safety Directives</h4>
            <p className="text-[11px] text-indigo-100/80 leading-relaxed">Adjust platform safety gates to restrict bulk out-bound velocity.</p>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-sans text-indigo-200 font-bold">
                  <span>Hot Wallet Max Bound</span>
                  <span>$10,000,000</span>
                </div>
                <div className="w-full bg-indigo-900/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full w-[80%] rounded-full" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleWalletStatus.mutate(selectedWallet.id)}
                  className={`flex-1 flex justify-center items-center py-2 px-3 rounded-lg text-[11px] font-bold font-sans transition-colors ${
                    selectedWallet.status === 'Active'
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {selectedWallet.status === 'Active' ? 'Freeze Wallet Block' : 'Activate Wallet Block'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

