"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCashFlow } from "@/services";
import type { LiveCashFlow } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import BarChart from "@/components/charts/BarChart";
import type { ApexOptions } from "apexcharts";
import ExportButton from "@/components/shared/ExportButton";

type Window = "h24" | "d7" | "d30";
const WINDOW_LABELS: Record<Window, string> = { h24: "24 Hours", d7: "7 Days", d30: "30 Days" };

function buildRows(data: LiveCashFlow["windows"][Window]) {
  const currencies = Array.from(new Set([
    ...data.inflow.map((r) => r.currency),
    ...data.outflow.map((r) => r.currency),
  ]));
  return currencies.map((cur) => {
    const inf = data.inflow.find((r) => r.currency === cur);
    const out = data.outflow.find((r) => r.currency === cur);
    const inflowAmt = Number(inf?.amount ?? 0);
    const outflowAmt = Number(out?.amount ?? 0);
    return {
      currency: cur,
      inflowAmt,
      outflowAmt,
      netAmt: inflowAmt - outflowAmt,
      txCount: (inf?.count ?? 0) + (out?.count ?? 0),
    };
  }).sort((a, b) => b.inflowAmt - a.inflowAmt);
}

function fmt(n: number, cur: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur, notation: "compact", maximumFractionDigits: 1 }).format(n);
  } catch {
    return `${(n / 1_000_000).toFixed(2)}M ${cur}`;
  }
}

function fmtM(n: number) {
  if (n === 0) return "—";
  const abs = Math.abs(n) / 1_000_000;
  return `${n < 0 ? "-" : "+"}${abs.toFixed(2)}M`;
}

export default function CashFlowsPage() {
  const [win, setWin] = useState<Window>("h24");
  const { data, isLoading } = useQuery({ queryKey: ["cashFlow"], queryFn: getCashFlow });

  const rows = data ? buildRows(data.windows[win]) : [];
  const totalInflow = rows.reduce((s, r) => s + r.inflowAmt, 0);
  const totalOutflow = rows.reduce((s, r) => s + r.outflowAmt, 0);
  const netFlow = totalInflow - totalOutflow;
  const currencyCount = rows.length;

  const barOptions: ApexOptions = {
    chart: { id: "cash-flow", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#22c55e", "#ef4444"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: rows.map((r) => r.currency),
      labels: { style: { colors: "#6b7280", fontSize: "10px" } },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          const n = Number(val);
          return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}k` : String(n);
        },
        style: { colors: "#6b7280", fontSize: "11px" },
      },
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: "light" },
    legend: { position: "top", horizontalAlign: "left", fontSize: "12px", fontWeight: 600 },
  };

  // 30-day type breakdown
  const typeRows = data
    ? Object.entries(
        data.byType.reduce<Record<string, { amount: number; count: number }>>((acc, r) => {
          const key = r.type;
          if (!acc[key]) acc[key] = { amount: 0, count: 0 };
          acc[key].amount += Number(r.amount);
          acc[key].count += r.count;
          return acc;
        }, {})
      )
        .map(([type, v]) => ({ type, ...v }))
        .sort((a, b) => b.amount - a.amount)
    : [];

  const exportData = rows.map((r) => ({
    currency: r.currency,
    inflow: r.inflowAmt,
    outflow: r.outflowAmt,
    net: r.netAmt,
    transactions: r.txCount,
    window: win,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash Flow"
        subtitle="Inflow, outflow & liquidity by currency"
        action={<ExportButton data={exportData} />}
      />

      {/* Window selector */}
      <div className="flex gap-2">
        {(Object.keys(WINDOW_LABELS) as Window[]).map((w) => (
          <button
            key={w}
            onClick={() => setWin(w)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              win === w
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300"
            }`}
          >
            {WINDOW_LABELS[w]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-gray-400">Loading cash flow data…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Inflow ({WINDOW_LABELS[win]})</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{fmtM(totalInflow)}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Outflow ({WINDOW_LABELS[win]})</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{fmtM(-totalOutflow)}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Net Flow</p>
              <p className={`text-3xl font-bold mt-2 ${netFlow >= 0 ? "text-blue-600" : "text-red-600"}`}>{fmtM(netFlow)}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Currencies</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{currencyCount}</p>
            </div>
          </div>

          {rows.length > 0 && (
            <Card padded={false}>
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Inflow vs Outflow by Currency — {WINDOW_LABELS[win]}</h3>
                <BarChart
                  options={barOptions}
                  series={[
                    { name: "Inflow", data: rows.map((r) => r.inflowAmt) },
                    { name: "Outflow", data: rows.map((r) => r.outflowAmt) },
                  ]}
                  height={280}
                />
              </div>
            </Card>
          )}

          <Card padded={false}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Currency Flow — {WINDOW_LABELS[win]}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Currency</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Inflow</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Outflow</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Net</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Transactions</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">No completed transactions in this window.</td></tr>
                  ) : rows.map((r) => (
                    <tr key={r.currency} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">{r.currency}</td>
                      <td className="px-6 py-4 font-mono text-xs text-green-600">{fmt(r.inflowAmt, r.currency)}</td>
                      <td className="px-6 py-4 font-mono text-xs text-red-500">{fmt(r.outflowAmt, r.currency)}</td>
                      <td className={`px-6 py-4 font-mono text-xs font-bold ${r.netAmt >= 0 ? "text-blue-600" : "text-red-600"}`}>
                        {r.netAmt >= 0 ? "+" : ""}{fmt(r.netAmt, r.currency)}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{r.txCount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {typeRows.length > 0 && (
            <Card padded={false}>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Transaction Type Breakdown — Last 30 Days</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Type</th>
                    <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Volume</th>
                    <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Transactions</th>
                    <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Share</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {typeRows.map((r) => {
                      const totalVol = typeRows.reduce((s, x) => s + x.amount, 0);
                      const pct = totalVol > 0 ? Math.round((r.amount / totalVol) * 100) : 0;
                      return (
                        <tr key={r.type} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-gray-800">{r.type.replace(/_/g, " ")}</td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-700">{(r.amount / 1_000_000).toFixed(2)}M</td>
                          <td className="px-6 py-4 text-xs text-gray-500">{r.count.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-100 h-1.5 rounded-full">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs font-mono text-gray-600">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
