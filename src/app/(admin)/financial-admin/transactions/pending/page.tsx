"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

export default function PendingTransactionsPage() {
  const { data: txList, isLoading } = useQuery({ queryKey: ["transactions"], queryFn: getTransactions });
  const pending = (txList ?? []).filter((tx) => tx.status === "Pending" || tx.status === "Flagged");

  return (
    <div className="space-y-6">
      <PageHeader title="Pending Transactions" subtitle="Transactions awaiting processing" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p><p className="text-3xl font-bold text-amber-600 mt-2">{pending.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">High Risk</p><p className="text-3xl font-bold text-red-600 mt-2">{pending.filter((t) => t.riskLevel === "High" || t.riskLevel === "Critical").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Value</p><p className="text-3xl font-bold text-gray-900 mt-2">$47.7k</p></div>
      </div>

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Timestamp</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Entity</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Amount</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Risk</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading...</td></tr> : pending.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{tx.id}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{tx.timestamp}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 font-bold text-[10px] border border-gray-200">{tx.avatarLetters}</div><p className="text-xs font-bold text-gray-800">{tx.entityName}</p></div></td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{tx.amount}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center gap-1 font-bold text-xs ${tx.riskLevel === "Critical" ? "text-red-500" : "text-amber-500"}`}><span className={`w-1.5 h-1.5 rounded-full ${tx.riskLevel === "Critical" ? "bg-red-500 animate-pulse" : "bg-amber-400"}`} />{tx.riskLevel}</span></td>
                  <td className="px-6 py-4"><Badge variant={tx.status === "Flagged" ? "danger" : "warning"}>{tx.status}</Badge></td>
                  <td className="px-6 py-4 text-right"><Button variant="primary" size="xs" icon="check">Process</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
