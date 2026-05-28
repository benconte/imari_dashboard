"use client";

import { MOCK_COMPLIANCE_AUDITS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import { useState } from "react";

const RESULT_BADGE: Record<string, "success" | "danger" | "warning"> = { Passed: "success", Flagged: "danger", "Pending Action": "warning" };
const CATEGORY_BADGE: Record<string, "info" | "warning" | "neutral"> = { "AML Check": "info", "Liquidity Audit": "warning", "Rule Update": "neutral", "Access Revocation": "neutral" };

export default function CompliancePage() {
  const [search, setSearch] = useState("");
  const audits = MOCK_COMPLIANCE_AUDITS;
  const filtered = audits.filter((a) => a.category.toLowerCase().includes(search.toLowerCase()) || a.executor.toLowerCase().includes(search.toLowerCase()) || a.details.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Compliance" subtitle="Compliance monitoring & reports" action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon="download">Export Report</Button>
          <Button variant="outline" size="sm" icon="gpp_maybe">Run Scan</Button>
        </div>
      } />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Audits</p><p className="text-3xl font-bold text-gray-900 mt-2">{audits.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Passed</p><p className="text-3xl font-bold text-green-600 mt-2">{audits.filter((a) => a.result === "Passed").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Flagged</p><p className="text-3xl font-bold text-red-600 mt-2">{audits.filter((a) => a.result === "Flagged").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AML Checks</p><p className="text-3xl font-bold text-blue-600 mt-2">{audits.filter((a) => a.category === "AML Check").length}</p></div>
      </div>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search audits..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Executor</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Details</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Result</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Timestamp</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{a.id}</td>
                  <td className="px-6 py-4"><Badge variant={CATEGORY_BADGE[a.category] ?? "neutral"}>{a.category}</Badge></td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-800">{a.executor}</td>
                  <td className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate">{a.details}</td>
                  <td className="px-6 py-4"><Badge variant={RESULT_BADGE[a.result] ?? "neutral"}>{a.result}</Badge></td>
                  <td className="px-6 py-4 text-xs text-gray-400">{a.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
