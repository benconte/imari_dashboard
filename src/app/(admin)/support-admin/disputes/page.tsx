"use client";

import { useState } from "react";
import { MOCK_DISPUTES } from "@/mock";
import type { Dispute } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";

const STATUS_BADGE: Record<string, "warning" | "success" | "neutral"> = { "Under Review": "warning", "Allowed (Refunded)": "success", Dismissed: "neutral" };

export default function DisputesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Dispute | null>(null);
  const disputes = MOCK_DISPUTES;
  const filtered = disputes.filter((d) => d.id.toLowerCase().includes(search.toLowerCase()) || d.cardholder.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Disputes" subtitle="Transaction dispute resolution" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p><p className="text-3xl font-bold text-gray-900 mt-2">{disputes.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Under Review</p><p className="text-3xl font-bold text-amber-600 mt-2">{disputes.filter((d) => d.status === "Under Review").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Refunded</p><p className="text-3xl font-bold text-green-600 mt-2">{disputes.filter((d) => d.status === "Allowed (Refunded)").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dismissed</p><p className="text-3xl font-bold text-gray-500 mt-2">{disputes.filter((d) => d.status === "Dismissed").length}</p></div>
      </div>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search disputes..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Cardholder</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Amount</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Reason</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Date</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><p className="font-mono text-xs font-bold text-blue-600">{d.id}</p><p className="text-[10px] text-gray-400 font-mono">{d.txId}</p></td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-800">{d.cardholder}</td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{d.amount}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{d.reason}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{d.dateFlagged}</td>
                  <td className="px-6 py-4"><Badge variant={STATUS_BADGE[d.status] ?? "neutral"}>{d.status}</Badge></td>
                  <td className="px-6 py-4 text-right"><Button variant="outline" size="xs" onClick={() => setSelected(d)}>Review</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg border border-gray-100 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold text-blue-600">{selected.id}</span>
              <Badge variant={STATUS_BADGE[selected.status] ?? "neutral"}>{selected.status}</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{selected.reason}</h3>
            <p className="text-xs text-gray-500 mt-1">{selected.cardholder} &middot; {selected.amount} &middot; TX: {selected.txId}</p>
            <hr className="my-4 border-gray-100" />
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Evidence</p>
              <p className="text-xs text-gray-700">{selected.evidenceAttachedString}</p>
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-colors">Allow & Refund</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
