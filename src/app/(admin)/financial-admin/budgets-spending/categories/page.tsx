"use client";

import { MOCK_CATEGORY_LIMITS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import { useState } from "react";
import ExportButton from "@/components/shared/ExportButton";

function getPercentColor(pct: number) { return pct >= 90 ? "text-red-600" : pct >= 70 ? "text-amber-600" : "text-blue-600"; }
function getBarColor(pct: number) { return pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-blue-600"; }

export default function BudgetCategoriesPage() {
  const [search, setSearch] = useState("");
  const categories = MOCK_CATEGORY_LIMITS;
  const filtered = categories.filter((c) => c.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Budget Categories" subtitle="Expense category rules & limits" action={<ExportButton data={filtered}  />} />

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search categories..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Allocated</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Spent</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Utilization</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Unallocated</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Owner</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><p className="text-xs font-bold text-gray-800">{c.category}</p><p className="text-[10px] text-gray-400 font-mono">{c.id}</p></td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{c.allocated}</td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-700">{c.spent}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-20 bg-gray-100 h-2 rounded-full"><div className={`h-full rounded-full ${getBarColor(c.percent)}`} style={{ width: `${Math.min(c.percent, 100)}%` }} /></div><span className={`font-mono text-xs font-bold ${getPercentColor(c.percent)}`}>{c.percent}%</span></div></td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{c.unallocated}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{c.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
