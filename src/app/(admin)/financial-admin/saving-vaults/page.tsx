"use client";

import { useQuery } from "@tanstack/react-query";
import { getVaults } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import ExportButton from "@/components/shared/ExportButton";

const STATUS_BADGE: Record<string, "success" | "warning" | "info" | "neutral"> = { ACTIVE: "success", LOCKED: "warning", COMPLETED: "info", CANCELLED: "neutral" };

export default function SavingVaultsPage() {
  const { data: vaults = [], isLoading } = useQuery({ queryKey: ["vaults"], queryFn: getVaults });
  const totalBalance = vaults.reduce((s, v) => s + v.balance, 0);
  const totalGoal = vaults.reduce((s, v) => s + v.goal, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Savings Vaults" subtitle="Vault activity & savings performance" action={<ExportButton data={vaults} />} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Balance</p><p className="text-3xl font-bold text-gray-900 mt-2">${(totalBalance / 1000000).toFixed(1)}M</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Vaults</p><p className="text-3xl font-bold text-green-600 mt-2">{vaults.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Locked Vaults</p><p className="text-3xl font-bold text-blue-600 mt-2">{vaults.filter((v) => v.isLocked).length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Goal Completion</p><p className="text-3xl font-bold text-amber-600 mt-2">{totalGoal > 0 ? Math.round((totalBalance / totalGoal) * 100) : 0}%</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-sm text-gray-400 col-span-full text-center py-8">Loading vaults...</p>
        ) : vaults.map((v) => (
          <Card key={v.id} padded className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-gray-400 font-mono">{v.id}</span>
              <Badge variant={STATUS_BADGE[v.status] ?? "neutral"}>{v.status}</Badge>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">{v.name}</h4>
            <p className="text-[10px] text-gray-400 mb-4">Owner: {v.owner}</p>

            <div className="space-y-3 flex-1">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-gray-400">Balance</span>
                  <span className="text-sm font-bold text-gray-900">${(v.balance / 1000000).toFixed(2)}M</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${v.goal > 0 ? Math.min((v.balance / v.goal) * 100, 100) : 0}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">of ${(v.goal / 1000000).toFixed(1)}M goal</p>
              </div>

              <div className="flex justify-between py-1.5 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Currency</span>
                <span className="text-xs font-bold text-gray-700">{v.currency}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
