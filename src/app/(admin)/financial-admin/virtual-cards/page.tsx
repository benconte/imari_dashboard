"use client";

import { useState } from "react";
import { MOCK_VIRTUAL_CARDS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

const STATUS_BADGE: Record<string, "success" | "danger"> = { Active: "success", Frozen: "danger" };

export default function VirtualCardsPage() {
  const [cards] = useState(MOCK_VIRTUAL_CARDS);

  return (
    <div className="space-y-6">
      <PageHeader title="Virtual Cards" subtitle="Card status, limits & activity" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Cards</p><p className="text-3xl font-bold text-gray-900 mt-2">{cards.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active</p><p className="text-3xl font-bold text-green-600 mt-2">{cards.filter((c) => c.status === "Active").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frozen</p><p className="text-3xl font-bold text-red-600 mt-2">{cards.filter((c) => c.status === "Frozen").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly Spend</p><p className="text-3xl font-bold text-blue-600 mt-2">$314k</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.id} padded className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">credit_card</span>
                <span className="text-xs font-bold text-gray-400 font-mono">{card.id}</span>
              </div>
              <Badge variant={STATUS_BADGE[card.status] ?? "neutral"}>{card.status}</Badge>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 mb-4 text-white">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold opacity-60">{card.type}</span>
                <span className="text-[10px] font-bold opacity-60">{card.org}</span>
              </div>
              <p className="font-mono text-sm font-bold tracking-widest mb-3">{card.pan}</p>
              <div className="flex justify-between items-end">
                <div><p className="text-[9px] opacity-50 uppercase">Expires</p><p className="font-mono text-xs">{card.expiry}</p></div>
                <div><p className="text-[9px] opacity-50 uppercase">CVV</p><p className="font-mono text-xs">{card.cvv}</p></div>
                <div className="text-right"><p className="text-[9px] opacity-50 uppercase">Holder</p><p className="text-xs font-semibold">{card.holder}</p></div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-[10px] font-bold text-gray-400 uppercase">Daily Limit</span><span className="text-xs font-bold text-gray-900">{card.dailyLimit}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-[10px] font-bold text-gray-400 uppercase">Spent This Month</span><span className="text-xs font-bold text-blue-600">{card.spentThisMonth}</span></div>
              <div className="flex justify-between py-1.5"><span className="text-[10px] font-bold text-gray-400 uppercase">Issued</span><span className="text-xs text-gray-500">{card.issuedDate}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
