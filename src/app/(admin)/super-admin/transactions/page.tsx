"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

export default function TransactionsPage() {
  const { data: txList, isLoading } = useQuery({ queryKey: ["transactions"], queryFn: getTransactions });

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Transactions Ledger" subtitle="Real-time status updates from clearing accounts" action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon="filter_list">Filter</Button>
          <Button variant="outline" size="sm" icon="download">Export CSV</Button>
        </div>
      } />

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Transaction ID</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Timestamp</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Entity</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Amount</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Risk</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-wider text-gray-400">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading...</td></tr> : txList?.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{tx.id}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{tx.timestamp}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 font-bold text-xs border border-gray-200">{tx.avatarLetters}</div><div><p className="text-xs font-bold text-gray-800">{tx.entityName}</p><p className="text-[10px] text-gray-400">{tx.entityId}</p></div></div></td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{tx.amount}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 font-bold text-xs ${tx.riskLevel === "Critical" ? "text-red-500" : tx.riskLevel === "High" ? "text-amber-500" : "text-gray-500"}`}><span className={`w-1.5 h-1.5 rounded-full ${tx.riskLevel === "Critical" ? "bg-red-500 animate-pulse" : tx.riskLevel === "High" ? "bg-amber-400" : "bg-gray-400"}`} />{tx.riskLevel} ({tx.riskScore})</span></td>
                  <td className="px-6 py-4"><Badge variant={tx.status === "Active" ? "info" : tx.status === "Flagged" ? "danger" : "neutral"}>{tx.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
