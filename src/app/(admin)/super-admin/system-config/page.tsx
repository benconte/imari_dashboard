"use client";

import { useState } from "react";
import { MOCK_CONFIG_TOGGLES, MOCK_CORRIDORS } from "@/mock";
import type { ConfigToggle } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

const CATEGORY_COLORS: Record<string, string> = {
  Security: "bg-red-50 text-red-700 border-red-100",
  System: "bg-blue-50 text-blue-700 border-blue-100",
  Verification: "bg-green-50 text-green-700 border-green-100",
};

const CORRIDOR_STATUS: Record<string, "success" | "warning" | "danger"> = {
  Nominal: "success",
  "High Load": "warning",
  "Stalled Queue": "danger",
};

export default function SystemConfigPage() {
  const [toggles, setToggles] = useState<ConfigToggle[]>(MOCK_CONFIG_TOGGLES);
  const corridors = MOCK_CORRIDORS;

  function toggleConfig(id: string) {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Config"
        subtitle="Platform settings & integrations"
        action={<Button variant="outline" size="sm" icon="history">View Changelog</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padded>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">settings</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Active Configs</p>
              <p className="text-xs text-gray-400">{toggles.filter((t) => t.enabled).length} of {toggles.length} enabled</p>
            </div>
          </div>
        </Card>
        <Card padded>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <span className="material-symbols-outlined text-green-600 text-[20px]">swap_horiz</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Active Corridors</p>
              <p className="text-xs text-gray-400">{corridors.filter((c) => c.status === "Nominal").length} of {corridors.length} nominal</p>
            </div>
          </div>
        </Card>
        <Card padded>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">gpp_maybe</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Security Rules</p>
              <p className="text-xs text-gray-400">{toggles.filter((t) => t.category === "Security" && t.enabled).length} enforced</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Feature Toggles</h3>
          <p className="text-xs text-gray-400 mt-0.5">Control platform-wide feature flags and security rules</p>
        </div>
        <div className="divide-y divide-gray-50">
          {toggles.map((t) => (
            <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex-1 min-w-0 mr-6">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${CATEGORY_COLORS[t.category] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                    {t.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
              </div>
              <button
                onClick={() => toggleConfig(t.id)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                  t.enabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    t.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card padded={false}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Payment Corridors</h3>
          <p className="text-xs text-gray-400 mt-0.5">Settlement network status and throughput</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Corridor</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Inflow 24h</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Outflow 24h</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Latency</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {corridors.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-gray-800">{c.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{c.id}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-green-600">${(c.inflow24h / 1000000).toFixed(1)}M</td>
                  <td className="px-6 py-4 font-mono text-xs text-red-500">${(c.outflow24h / 1000000).toFixed(1)}M</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{c.latencyMin >= 60 ? `${(c.latencyMin / 60).toFixed(0)}h` : `${c.latencyMin}m`}</td>
                  <td className="px-6 py-4">
                    <Badge variant={CORRIDOR_STATUS[c.status] ?? "neutral"}>{c.status}</Badge>
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
