"use client";

import { useState } from "react";
import { MOCK_VAULTS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

const STATUS_BADGE: Record<string, "success" | "warning" | "info"> = { "Active Lock": "success", "Liquid Rebalancing": "warning", Accumulating: "info" };

export default function SavingVaultsPage() {
  const [vaults] = useState(MOCK_VAULTS);
  const totalBalance = vaults.reduce((s, v) => s + v.balance, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Savings Vaults" subtitle="Vault activity & savings performance" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Balance</p><p className="text-3xl font-bold text-gray-900 mt-2">${(totalBalance / 1000000).toFixed(1)}M</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Vaults</p><p className="text-3xl font-bold text-green-600 mt-2">{vaults.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg APY</p><p className="text-3xl font-bold text-blue-600 mt-2">{(vaults.reduce((s, v) => s + v.apy, 0) / vaults.length).toFixed(2)}%</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Goal Completion</p><p className="text-3xl font-bold text-amber-600 mt-2">{Math.round(vaults.reduce((s, v) => s + v.balance, 0) / vaults.reduce((s, v) => s + v.goal, 0) * 100)}%</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaults.map((v) => (
          <Card key={v.id} padded className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-gray-400 font-mono">{v.id}</span>
              <Badge variant={STATUS_BADGE[v.status] ?? "neutral"}>{v.status}</Badge>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">{v.name}</h4>
            <span className="inline-block px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded border border-gray-200 mb-4">{v.category}</span>

            <div className="space-y-3 flex-1">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-gray-400">Balance</span>
                  <span className="text-sm font-bold text-gray-900">${(v.balance / 1000000).toFixed(2)}M</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min((v.balance / v.goal) * 100, 100)}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">of ${(v.goal / 1000000).toFixed(1)}M goal</p>
              </div>

              <div className="flex justify-between py-1.5 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">APY</span>
                <span className="text-xs font-bold text-green-600">{v.apy}%</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Recent Deposits</p>
              {v.deposits.map((d) => (
                <div key={d.id} className="flex justify-between items-center py-1">
                  <div><p className="text-[10px] text-gray-600">{d.source}</p><p className="text-[9px] text-gray-400">{d.date}</p></div>
                  <span className="text-xs font-bold text-green-600">${(d.amount / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
