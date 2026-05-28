"use client";

import { useState } from "react";
import { MOCK_KYC_QUEUE } from "@/mock";
import type { KYCSubmission } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";

export default function KYCQueuePage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<KYCSubmission | null>(null);
  const queue = MOCK_KYC_QUEUE;
  const filtered = queue.filter((k) => k.name.toLowerCase().includes(search.toLowerCase()) || k.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="KYC Queue" subtitle="Pending identity verification reviews" action={<Button variant="outline" size="sm" icon="filter_list">Filter</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p><p className="text-3xl font-bold text-amber-600 mt-2">{queue.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">High Risk</p><p className="text-3xl font-bold text-red-600 mt-2">{queue.filter((k) => k.riskScore > 40).length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Low Risk</p><p className="text-3xl font-bold text-green-600 mt-2">{queue.filter((k) => k.riskScore <= 40).length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Face Match</p><p className="text-3xl font-bold text-blue-600 mt-2">{Math.round(queue.reduce((s, k) => s + k.faceMatchPct, 0) / queue.length)}%</p></div>
      </div>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search KYC submissions..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Name</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Doc Type</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Risk Score</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Face Match</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">AML</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{k.id}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 font-bold text-[10px] border border-gray-200">{k.avatarCode}</div><div><p className="text-xs font-bold text-gray-800">{k.name}</p><p className="text-[10px] text-gray-400">{k.email}</p></div></div></td>
                  <td className="px-6 py-4"><p className="text-xs text-gray-700">{k.docType}</p><p className="text-[10px] text-gray-400 font-mono">{k.docNo}</p></td>
                  <td className="px-6 py-4"><span className={`font-bold text-xs ${k.riskScore > 40 ? "text-red-600" : "text-green-600"}`}>{k.riskScore}</span></td>
                  <td className="px-6 py-4"><span className={`font-bold text-xs ${k.faceMatchPct >= 95 ? "text-green-600" : "text-amber-600"}`}>{k.faceMatchPct}%</span></td>
                  <td className="px-6 py-4"><Badge variant={k.noAmlMatches ? "success" : "danger"}>{k.noAmlMatches ? "Clear" : "Hit"}</Badge></td>
                  <td className="px-6 py-4 text-right"><Button variant="primary" size="xs" onClick={() => setSelected(k)}>Review</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-gray-100 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900">KYC Review: {selected.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{selected.email} &middot; {selected.nationality}</p>
            <hr className="my-4 border-gray-100" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Document" value={`${selected.docType} (${selected.docNo})`} />
              <Detail label="Expiry" value={selected.expiryDate} />
              <Detail label="Risk Score" value={String(selected.riskScore)} />
              <Detail label="Face Match" value={`${selected.faceMatchPct}%`} />
              <Detail label="AML Check" value={selected.noAmlMatches ? "No Matches" : "FLAGGED"} />
              <Detail label="Submitted" value={selected.submitDate} />
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-colors">Approve</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors">Reject</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-medium text-gray-800 mt-0.5">{value}</p>
    </div>
  );
}
