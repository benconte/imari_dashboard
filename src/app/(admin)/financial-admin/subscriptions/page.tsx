"use client";

import { MOCK_PLANS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

const STATUS_BADGE: Record<string, "success" | "warning" | "neutral"> = { Active: "success", Legacy: "warning", Unavailable: "neutral" };

export default function SubscriptionsPage() {
  const plans = MOCK_PLANS;
  const totalMrr = plans.reduce((s, p) => s + p.mrrRate * p.subscribersCount, 0);
  const totalSubs = plans.reduce((s, p) => s + p.subscribersCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" subtitle="Subscription intelligence dashboard" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total MRR</p><p className="text-3xl font-bold text-gray-900 mt-2">${(totalMrr / 1000).toFixed(0)}k</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subscribers</p><p className="text-3xl font-bold text-blue-600 mt-2">{totalSubs}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Plans</p><p className="text-3xl font-bold text-green-600 mt-2">{plans.filter((p) => p.status === "Active").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg ARPU</p><p className="text-3xl font-bold text-gray-900 mt-2">${(totalMrr / totalSubs).toFixed(0)}</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((p) => (
          <Card key={p.id} padded className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-900">{p.name}</h4>
              <Badge variant={STATUS_BADGE[p.status] ?? "neutral"}>{p.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">MRR Rate</p><p className="text-lg font-bold text-gray-900">${p.mrrRate.toLocaleString()}/mo</p></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Subscribers</p><p className="text-lg font-bold text-blue-600">{p.subscribersCount}</p></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Revenue</p><p className="text-lg font-bold text-green-600">${(p.mrrRate * p.subscribersCount).toLocaleString()}</p></div>
            </div>
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50 leading-relaxed">{p.features}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
