"use client";

import { useState } from "react";
import { MOCK_CATEGORY_LIMITS } from "@/mock";
import type { CategoryLimit } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import Modal from "@/components/shared/Modal";

function getPercentColor(pct: number): string {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-blue-600";
}

function getPercentTextColor(pct: number): string {
  if (pct >= 90) return "text-red-600";
  if (pct >= 70) return "text-amber-600";
  return "text-blue-600";
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryLimit[]>(MOCK_CATEGORY_LIMITS);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [newAllocated, setNewAllocated] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const filtered = categories.filter(
    (c) =>
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.owner.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newCat || !newAllocated) return;
    const newEntry: CategoryLimit = {
      id: `BC-${Math.floor(Math.random() * 90) + 10}`,
      category: newCat,
      allocated: newAllocated,
      spent: "$0",
      percent: 0,
      unallocated: newAllocated,
      owner: newOwner || "Unassigned",
    };
    setCategories((prev) => [newEntry, ...prev]);
    setShowCreate(false);
    setNewCat("");
    setNewAllocated("");
    setNewOwner("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Categories"
        subtitle="Budget allocation and category rules"
        action={<Button icon="add" onClick={() => setShowCreate(true)}>Add Category</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Categories</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{categories.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Over Budget (90%+)</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{categories.filter((c) => c.percent >= 90).length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Healthy</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{categories.filter((c) => c.percent < 70).length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Utilization</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{Math.round(categories.reduce((s, c) => s + c.percent, 0) / categories.length)}%</p>
        </div>
      </div>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Allocated</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Spent</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Utilization</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Unallocated</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-gray-800">{c.category}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{c.id}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{c.allocated}</td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-700">{c.spent}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-100 h-2 rounded-full">
                        <div className={`h-full rounded-full ${getPercentColor(c.percent)}`} style={{ width: `${Math.min(c.percent, 100)}%` }} />
                      </div>
                      <span className={`font-mono text-xs font-bold ${getPercentTextColor(c.percent)}`}>{c.percent}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{c.unallocated}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{c.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Category">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category Name</label>
            <input
              type="text"
              required
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Allocated Budget</label>
            <input
              type="text"
              required
              value={newAllocated}
              onChange={(e) => setNewAllocated(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
              placeholder="e.g. $500,000"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Owner</label>
            <input
              type="text"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
              placeholder="e.g. Finance Dept"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">
              Add Category
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
