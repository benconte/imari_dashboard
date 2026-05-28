"use client";

import { useState } from "react";
import { MOCK_TICKETS } from "@/mock";
import type { Ticket } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";

const PRIORITY_BADGE: Record<string, "danger" | "warning" | "neutral"> = { Critical: "danger", High: "warning", Low: "neutral" };
const STATUS_BADGE: Record<string, "info" | "warning" | "danger" | "neutral"> = { Open: "info", Pending: "warning", Escalated: "danger", Closed: "neutral" };

export default function TicketsPage() {
  const [tickets] = useState(MOCK_TICKETS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Ticket | null>(null);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Tickets" subtitle="Support ticket management" action={<Button icon="add">New Ticket</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Open</p><p className="text-3xl font-bold text-blue-600 mt-2">{tickets.filter((t) => t.status === "Open").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Escalated</p><p className="text-3xl font-bold text-red-600 mt-2">{tickets.filter((t) => t.status === "Escalated").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Closed</p><p className="text-3xl font-bold text-green-600 mt-2">{tickets.filter((t) => t.status === "Closed").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p><p className="text-3xl font-bold text-gray-900 mt-2">{tickets.length}</p></div>
      </div>

      <Card padded={false}>
        <div className="p-4 flex flex-col sm:flex-row items-center gap-3 border-b border-gray-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tickets..." className="flex-1 w-full" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Status:</span>
            {["ALL", "Open", "Pending", "Escalated", "Closed"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${statusFilter === s ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"}`}>{s === "ALL" ? "All" : s}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">User</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Subject</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Priority</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{t.id}</td>
                  <td className="px-6 py-4"><div><p className="text-xs font-bold text-gray-800">{t.user}</p><p className="text-[10px] text-gray-400">{t.email}</p></div></td>
                  <td className="px-6 py-4 text-xs text-gray-700 max-w-xs truncate">{t.subject}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{t.category}</td>
                  <td className="px-6 py-4"><Badge variant={PRIORITY_BADGE[t.priority] ?? "neutral"}>{t.priority}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={STATUS_BADGE[t.status] ?? "neutral"}>{t.status}</Badge></td>
                  <td className="px-6 py-4 text-right"><Button variant="outline" size="xs" onClick={() => setSelected(t)}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-gray-100 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[9px] bg-blue-50 font-bold px-2.5 py-0.5 rounded text-blue-700">{selected.id}</span>
              <Badge variant={PRIORITY_BADGE[selected.priority] ?? "neutral"}>{selected.priority}</Badge>
              <Badge variant={STATUS_BADGE[selected.status] ?? "neutral"}>{selected.status}</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{selected.subject}</h3>
            <p className="text-xs text-gray-500 mt-1">{selected.user} &middot; {selected.category} &middot; {selected.createdDate}</p>
            <hr className="my-4 border-gray-100" />
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selected.messages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-xl ${msg.sender === "user" ? "bg-gray-50 border border-gray-100" : "bg-blue-50 border border-blue-100"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">{msg.sender}</span>
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-xs text-gray-700">{msg.text}</p>
                </div>
              ))}
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">Reply</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors">Escalate</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
