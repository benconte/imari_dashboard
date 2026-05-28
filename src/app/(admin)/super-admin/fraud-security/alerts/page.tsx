"use client";

import { useState } from "react";
import { MOCK_ALERTS } from "@/mock";
import type { AlertItem } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Badge from "@/components/shared/Badge";
import Card from "@/components/shared/Card";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [selected, setSelected] = useState<AlertItem | null>(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const filtered = alerts.filter((a) => {
    const matchSearch = a.id.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()) || a.target.toLowerCase().includes(search.toLowerCase());
    const matchSev = severityFilter === "ALL" || a.severity === severityFilter;
    return matchSearch && matchSev;
  });

  const handleUpdate = (id: string, newStatus: AlertItem["status"]) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: newStatus } : null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Active Surveillance Alerts" subtitle="Real-time threat pipeline and analyst clearing overrides" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-red-50/10 border border-red-100 p-5 rounded-2xl"><p className="text-[10px] text-red-700 font-bold uppercase">Unresolved</p><h2 className="text-3xl font-bold text-red-600 mt-1">{alerts.filter((a) => a.status === "Pending Analyst" || a.status === "Under Investigation").length}</h2></div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm"><p className="text-[10px] text-gray-400 font-bold uppercase">Total Evaluated</p><h2 className="text-3xl font-bold text-gray-900 mt-1">{alerts.length}</h2></div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm"><p className="text-[10px] text-gray-400 font-bold uppercase">Investigating</p><h2 className="text-3xl font-bold text-blue-600 mt-1">{alerts.filter((a) => a.status === "Under Investigation").length}</h2></div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm"><p className="text-[10px] text-gray-400 font-bold uppercase">Cleared</p><h2 className="text-3xl font-bold text-emerald-600 mt-1">{alerts.filter((a) => a.status === "Resolved" || a.status === "Dismissed").length}</h2></div>
      </div>

      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1"><span className="material-symbols-outlined absolute left-3 top-2 text-gray-400 text-[18px]">search</span><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by ID, type, target..." className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-50" /></div>
        <div className="flex items-center gap-2"><span className="text-[10px] font-bold text-gray-400 uppercase">Severity:</span>{["ALL", "Critical", "High", "Medium", "Low"].map((s) => (<button key={s} onClick={() => setSeverityFilter(s)} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${severityFilter === s ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"}`}>{s}</button>))}</div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th><th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Type</th><th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Target</th><th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-center">Severity</th><th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th><th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Action</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((alt) => (
                <tr key={alt.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{alt.id}</td>
                  <td className="px-6 py-4"><p className="text-xs font-bold text-gray-800">{alt.type}</p><p className="text-[9px] text-gray-400 font-mono">{alt.timestamp}</p></td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-700">{alt.target}</td>
                  <td className="px-6 py-4 text-center"><Badge variant={alt.severity === "Critical" ? "danger" : alt.severity === "High" ? "warning" : "neutral"}>{alt.severity}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={alt.status === "Pending Analyst" ? "danger" : alt.status === "Under Investigation" ? "warning" : alt.status === "Escalated" ? "violet" : "neutral"}>{alt.status}</Badge></td>
                  <td className="px-6 py-4 text-right"><button onClick={() => setSelected(alt)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer">Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-gray-100 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><span className="font-mono text-[9px] bg-blue-50 font-bold px-2.5 py-0.5 rounded text-blue-700">ID: {selected.id}</span><Badge variant={selected.severity === "Critical" ? "danger" : "warning"}>{selected.severity}</Badge></div>
            <h3 className="text-lg font-bold text-gray-900">{selected.type}</h3>
            <p className="text-xs text-gray-400 mt-1">Target: <span className="text-blue-600 font-bold">{selected.target}</span> at {selected.timestamp}</p>
            <hr className="my-4 border-gray-100" />
            <div className="space-y-4">
              <div><h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">IP & UserAgent</h4><div className="bg-gray-50 border border-gray-100 rounded-xl p-3 font-mono text-[11px] text-gray-600"><p>IP: {selected.ip}</p><p className="mt-1">UA: {selected.userAgent}</p></div></div>
              <div><h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payload</h4><pre className="bg-gray-900 text-blue-200 border border-gray-800 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-40 whitespace-pre-wrap">{selected.payload}</pre></div>
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button onClick={() => { handleUpdate(selected.id, "Resolved"); setSelected(null); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer">Resolve</button>
              <button onClick={() => { handleUpdate(selected.id, "Under Investigation"); setSelected(null); }} className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer">Investigate</button>
              <button onClick={() => { handleUpdate(selected.id, "Escalated"); setSelected(null); }} className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer">Escalate</button>
              <button onClick={() => { handleUpdate(selected.id, "Dismissed"); setSelected(null); }} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
