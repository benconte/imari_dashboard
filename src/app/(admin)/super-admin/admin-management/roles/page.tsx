"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";

export default function RolesPage() {
  const [permissions, setPermissions] = useState([
    { key: "perm_card", label: "Issue & Revoke Virtual Cards", super: true, financial: true, support: false },
    { key: "perm_kyc", label: "Approve & Override KYC Submissions", super: true, financial: true, support: false },
    { key: "perm_nodes", label: "Revoke Operator Node Session Tokens", super: true, financial: false, support: false },
    { key: "perm_disputes", label: "Settle Chargebacks & Credit Disputes", super: true, financial: false, support: true },
    { key: "perm_configs", label: "Configure Global Switches via SysConfig", super: true, financial: false, support: false },
  ]);

  const toggle = (role: "super" | "financial" | "support", index: number) => {
    setPermissions((prev) => prev.map((p, i) => i === index ? { ...p, [role]: !p[role as keyof typeof p] } : p));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" subtitle="Audit and toggle institutional privileges across system roles" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padded><span className="inline-block px-2.5 py-0.5 bg-violet-50 text-violet-700 font-bold text-[10px] rounded border border-violet-100 uppercase">SUPER_ADMIN</span><p className="text-xs text-gray-500 mt-3 leading-relaxed">Unrestricted root clearance. Global parameters, credentials, ledger nodes, integrations.</p></Card>
        <Card padded><span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded border border-emerald-100 uppercase">FINANCIAL_ADMIN</span><p className="text-xs text-gray-500 mt-3 leading-relaxed">Treasury & ledger routing. Reserve balances, virtual cards, compliance, sweep protocols.</p></Card>
        <Card padded><span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded border border-blue-100 uppercase">SUPPORT_ADMIN</span><p className="text-xs text-gray-500 mt-3 leading-relaxed">Operational resolution. Priority tickets, dispute investigations, announcements.</p></Card>
      </div>

      <Card padded={false}>
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50"><h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Dynamic Capability Matrix</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capability</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">SUPER_ADMIN</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">FINANCIAL_ADMIN</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">SUPPORT_ADMIN</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {permissions.map((p, idx) => (
                <tr key={p.key} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-800">{p.label}</td>
                  {(["super", "financial", "support"] as const).map((role) => (
                    <td key={role} className="px-6 py-4 text-center">
                      <button onClick={() => toggle(role, idx)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${p[role] ? "text-blue-600 hover:bg-blue-50" : "text-gray-300 hover:bg-gray-50"}`}>
                        <span className="material-symbols-outlined font-bold text-[20px]">{p[role] ? "check_circle" : "cancel"}</span>
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50/40 border-t border-gray-100 text-right">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-sm transition-colors cursor-pointer">Deploy Policy Matrix</button>
        </div>
      </Card>
    </div>
  );
}
