"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSecurityStatus, getFlaggedTransactions } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import Link from "next/link";

export default function FraudAdminOverviewPage() {
  const [needleAngle, setNeedleAngle] = useState(-120);
  const { data: status } = useQuery({ queryKey: ["securityStatus"], queryFn: getSecurityStatus });
  const { data: flaggedTx } = useQuery({ queryKey: ["flaggedTransactions"], queryFn: getFlaggedTransactions });

  useEffect(() => {
    const t = setTimeout(() => setNeedleAngle(-85), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fraud & Security Overview"
        subtitle="Real-time risk monitoring dashboard"
        action={
          <Link href="/fraud-admin/alerts">
            <Button icon="warning" size="sm">View Alerts</Button>
          </Link>
        }
      />

      {/* KPI row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Gauge */}
        <Card className="lg:col-span-4 p-6 flex flex-col items-center justify-center" padded={false}>
          <h3 className="text-gray-400 font-bold tracking-wider text-[11px] uppercase mb-4">
            Current Platform Risk
          </h3>
          <div className="relative w-44 h-44 flex items-center justify-center">
            <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center border border-gray-100 shadow-inner">
              <span className="text-3xl font-extrabold text-green-700">
                {status?.riskText ?? "Low"}
              </span>
              <span className="text-[10px] font-bold text-gray-400 mt-1">
                {status?.riskScore ?? 14}/100
              </span>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-1000"
              style={{ transform: `rotate(${needleAngle}deg)` }}
            >
              <div className="w-1.5 h-20 bg-gray-800 rounded-full origin-bottom mb-20 shadow-md" />
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-center">
            <div>
              <p className="font-mono font-bold text-sm text-green-700">
                {status?.vs24h ?? "-4.2%"}
              </p>
              <p className="text-[10px] text-gray-400">vs 24h</p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div>
              <p className="font-mono font-bold text-sm text-gray-800">
                {status?.statusText ?? "Stable"}
              </p>
              <p className="text-[10px] text-gray-400">Status</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50/10 border border-red-100 p-5 rounded-2xl flex flex-col justify-between hover:bg-red-50/20 transition-all">
            <div className="flex justify-between items-start">
              <div className="bg-red-600 rounded-xl p-2 text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <span className="text-red-600 font-semibold text-xs font-mono">
                {status?.criticalAlertPct ?? "+12% surge"}
              </span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-red-900 mt-4">
                0{status?.criticalAlertCount ?? 3} Critical Alerts
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Immediate action required for suspected breaches.
              </p>
            </div>
          </div>

          <Card padded>
            <div className="flex justify-between items-start">
              <div className="bg-blue-50 rounded-xl p-2 text-blue-600 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">history_edu</span>
              </div>
              <span className="text-gray-400 font-semibold text-xs font-mono">Updated 2m ago</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 mt-4">
                {status?.pendingReviewsCount ?? 127} Pending Reviews
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Queue status for manual analyst intervention.
              </p>
            </div>
          </Card>

          <Card padded>
            <p className="text-gray-400 font-bold tracking-wider text-[11px] uppercase">
              Blocked Attempts
            </p>
            <h4 className="text-lg font-bold text-gray-900 mt-1">
              {status?.blockedAttempts ?? "4,829"}
            </h4>
          </Card>

          <Card padded>
            <p className="text-gray-400 font-bold tracking-wider text-[11px] uppercase">
              Auth Failure Rate
            </p>
            <h4 className="text-lg font-bold text-gray-900 mt-1">
              {status?.authFailureRate ?? "0.42%"}
            </h4>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <Card padded={false}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/fraud-admin/alerts", icon: "notifications_active", label: "Review Active Alerts", desc: `${status?.criticalAlertCount ?? 3} critical pending`, color: "bg-red-50 text-red-600" },
            { href: "/fraud-admin/transactions", icon: "flag", label: "Flagged Transactions", desc: "Filter by Critical & High risk", color: "bg-amber-50 text-amber-600" },
            { href: "/fraud-admin/audit-log", icon: "history_edu", label: "Security Audit Trail", desc: "Immutable operator log", color: "bg-blue-50 text-blue-600" },
          ].map((a) => (
            <Link key={a.label} href={a.href}>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}>
                  <span className="material-symbols-outlined text-[18px]">{a.icon}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{a.label}</p>
                  <p className="text-[10px] text-gray-400">{a.desc}</p>
                </div>
              </button>
            </Link>
          ))}
        </div>
      </Card>

      {/* Flagged Transactions */}
      <Card padded={false}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Recent Flagged Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">ID</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Timestamp</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Entity</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Amount</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Risk</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {flaggedTx?.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{tx.id}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{tx.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 font-bold text-xs border border-gray-200">
                        {tx.avatarLetters}
                      </div>
                      <p className="text-xs font-bold text-gray-800">{tx.entityName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{tx.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 font-bold text-xs ${tx.riskLevel === "Critical" ? "text-red-500" : "text-amber-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.riskLevel === "Critical" ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                      {tx.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={tx.status === "Flagged" ? "danger" : "info"}>{tx.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}