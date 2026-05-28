"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";

interface FailedTx {
  id: string;
  timestamp: string;
  entity: string;
  amount: string;
  reason: string;
  retryable: boolean;
}

const FAILED_TXS: FailedTx[] = [
  { id: "TX-ERR-001", timestamp: "May 26, 2026 08:15 AM", entity: "Robert Taylor", amount: "$2,400.00", reason: "Insufficient corridor liquidity", retryable: true },
  { id: "TX-ERR-002", timestamp: "May 25, 2026 11:30 PM", entity: "Elena Rostova", amount: "€1,200.00", reason: "SWIFT network timeout", retryable: true },
  { id: "TX-ERR-003", timestamp: "May 25, 2026 03:45 PM", entity: "Marcus Aurelius", amount: "$150.00", reason: "KYC verification expired", retryable: false },
];

export default function FailedTransactionsPage() {
  const [search, setSearch] = useState("");
  const filtered = FAILED_TXS.filter((t) => t.id.toLowerCase().includes(search.toLowerCase()) || t.entity.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Failed Transactions" subtitle="Failed transactions & recovery queue" action={<Button variant="outline" size="sm" icon="replay">Retry All</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Failed</p><p className="text-3xl font-bold text-red-600 mt-2">{FAILED_TXS.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Retryable</p><p className="text-3xl font-bold text-amber-600 mt-2">{FAILED_TXS.filter((t) => t.retryable).length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Value</p><p className="text-3xl font-bold text-gray-900 mt-2">$3.75k</p></div>
      </div>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100"><SearchBar value={search} onChange={setSearch} placeholder="Search failed transactions..." /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Timestamp</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Entity</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Amount</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Reason</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{tx.id}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{tx.timestamp}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-800">{tx.entity}</td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{tx.amount}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{tx.reason}</td>
                  <td className="px-6 py-4"><Badge variant={tx.retryable ? "warning" : "danger"}>{tx.retryable ? "Retryable" : "Blocked"}</Badge></td>
                  <td className="px-6 py-4 text-right">
                    {tx.retryable && <Button variant="outline" size="xs" icon="replay">Retry</Button>}
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
