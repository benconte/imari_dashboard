"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import ExportButton from "@/components/shared/ExportButton";

interface Report {
  id: string;
  title: string;
  type: "Compliance" | "Financial" | "Audit" | "Risk";
  period: string;
  generatedAt: string;
  status: "Ready" | "Processing" | "Archived";
}

const REPORTS: Report[] = [
  { id: "RPT-001", title: "Monthly Transaction Summary", type: "Financial", period: "May 2026", generatedAt: "May 26, 2026", status: "Ready" },
  { id: "RPT-002", title: "AML Compliance Scan Results", type: "Compliance", period: "May 2026", generatedAt: "May 25, 2026", status: "Ready" },
  { id: "RPT-003", title: "Liquidity Reserve Audit", type: "Audit", period: "Q2 2026", generatedAt: "May 24, 2026", status: "Ready" },
  { id: "RPT-004", title: "Risk Exposure Assessment", type: "Risk", period: "May 2026", generatedAt: "May 23, 2026", status: "Ready" },
  { id: "RPT-005", title: "Quarterly Financial Review", type: "Financial", period: "Q2 2026", generatedAt: "Processing...", status: "Processing" },
  { id: "RPT-006", title: "Annual Compliance Report 2025", type: "Compliance", period: "2025", generatedAt: "Jan 15, 2026", status: "Archived" },
];

const TYPE_BADGE: Record<string, "info" | "success" | "warning" | "danger"> = { Compliance: "success", Financial: "info", Audit: "warning", Risk: "danger" };
const STATUS_BADGE: Record<string, "success" | "warning" | "neutral"> = { Ready: "success", Processing: "warning", Archived: "neutral" };

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const filtered = REPORTS.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Financial report history" action={<Button icon="add">Generate Report</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Reports</p><p className="text-3xl font-bold text-gray-900 mt-2">{REPORTS.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ready</p><p className="text-3xl font-bold text-green-600 mt-2">{REPORTS.filter((r) => r.status === "Ready").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Processing</p><p className="text-3xl font-bold text-amber-600 mt-2">{REPORTS.filter((r) => r.status === "Processing").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Archived</p><p className="text-3xl font-bold text-gray-500 mt-2">{REPORTS.filter((r) => r.status === "Archived").length}</p></div>
      </div>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search reports..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Title</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Type</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Period</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Generated</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{r.id}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-800">{r.title}</td>
                  <td className="px-6 py-4"><Badge variant={TYPE_BADGE[r.type] ?? "neutral"}>{r.type}</Badge></td>
                  <td className="px-6 py-4 text-xs text-gray-600">{r.period}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{r.generatedAt}</td>
                  <td className="px-6 py-4"><Badge variant={STATUS_BADGE[r.status] ?? "neutral"}>{r.status}</Badge></td>
                  <td className="px-6 py-4 text-right">
                    {r.status === "Ready" ? (
                      <ExportButton data={filtered}  />
                    ) : r.status === "Processing" ? (
                      <span className="text-[10px] text-amber-600 font-bold">Generating...</span>
                    ) : (
                      <Button variant="ghost" size="xs" icon="visibility">View</Button>
                    )}
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
