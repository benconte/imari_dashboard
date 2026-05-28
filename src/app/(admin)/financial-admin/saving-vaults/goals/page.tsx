"use client";

import { MOCK_VAULTS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

const STATUS_BADGE: Record<string, "success" | "warning" | "info"> = { "Active Lock": "success", "Liquid Rebalancing": "warning", Accumulating: "info" };

export default function GoalsPage() {
  const vaults = MOCK_VAULTS;

  return (
    <div className="space-y-6">
      <PageHeader title="Goals" subtitle="Goal completion & milestones" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Goals</p><p className="text-3xl font-bold text-gray-900 mt-2">{vaults.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Completion</p><p className="text-3xl font-bold text-blue-600 mt-2">{Math.round(vaults.reduce((s, v) => s + (v.balance / v.goal) * 100, 0) / vaults.length)}%</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">On Track</p><p className="text-3xl font-bold text-green-600 mt-2">{vaults.filter((v) => v.balance / v.goal >= 0.7).length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Remaining</p><p className="text-3xl font-bold text-amber-600 mt-2">${((vaults.reduce((s, v) => s + v.goal - v.balance, 0)) / 1000000).toFixed(1)}M</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaults.map((v) => {
          const pct = Math.round((v.balance / v.goal) * 100);
          return (
            <Card key={v.id} padded>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-900">{v.name}</h4>
                <Badge variant={STATUS_BADGE[v.status] ?? "neutral"}>{v.status}</Badge>
              </div>
              <div className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-lg font-bold text-gray-900">${(v.balance / 1000000).toFixed(2)}M</span>
                  <span className="text-xs text-gray-400">of ${(v.goal / 1000000).toFixed(1)}M</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <p className="text-xs font-bold text-blue-600 mt-1">{pct}% complete</p>
              </div>
              <div className="flex justify-between py-1.5 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">APY</span>
                <span className="text-xs font-bold text-green-600">{v.apy}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Category</span>
                <span className="text-xs text-gray-600">{v.category}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
