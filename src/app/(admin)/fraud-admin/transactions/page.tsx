"use client";

// Transactions view scoped to the Fraud Officer.
// Pre-filtered to show only Flagged and high-risk transactions.
// The officer can review details and flag/freeze — they cannot
// approve settlements or process pending transactions (that's Financial Admin).

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";

export default function FraudAdminTransactionsPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const { data: txList, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  // Fraud Officer only sees Flagged transactions + Critical/High risk ones.
  // This is the key scoping difference from the full transactions page.
  const relevantTx = (txList ?? []).filter(
    (tx) =>
      tx.status === "Flagged" ||
      tx.riskLevel === "Critical" ||
      tx.riskLevel === "High"
  );

  const filtered = relevantTx.filter((tx) => {
    const matchSearch =
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.entityName.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "ALL" || tx.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const criticalCount = relevantTx.filter((t) => t.riskLevel === "Critical").length;
  const highCount = relevantTx.filter((t) => t.riskLevel === "High").length;
  const flaggedCount = relevantTx.filter((t) => t.status === "Flagged").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flagged Transactions"
        subtitle="High-risk & flagged transactions requiring fraud review"
        action={
          <Button variant="outline" size="sm" icon="download">
            Export CSV
          </Button>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Critical Risk</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{criticalCount}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">High Risk</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{highCount}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Flagged</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{flaggedCount}</p>
        </div>
      </div>

      {/* Table */}
      <Card padded={false}>
        <div className="p-4 flex flex-col sm:flex-row items-center gap-3 border-b border-gray-100">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by ID or entity..."
            className="flex-1 w-full"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Risk:</span>
            {["ALL", "Critical", "High"].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  riskFilter === r ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {r === "ALL" ? "All" : r}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Timestamp</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Entity</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Amount</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Type</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Risk Score</th>
                <th className="px-6 py-3.5 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No flagged transactions found.</td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{tx.id}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">{tx.timestamp}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 font-bold text-[10px] border border-gray-200">
                          {tx.avatarLetters}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{tx.entityName}</p>
                          <p className="text-[10px] text-gray-400">{tx.entityId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{tx.amount}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{tx.type ?? "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 font-bold text-xs ${
                          tx.riskLevel === "Critical"
                            ? "text-red-500"
                            : tx.riskLevel === "High"
                            ? "text-amber-500"
                            : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tx.riskLevel === "Critical"
                              ? "bg-red-500 animate-pulse"
                              : tx.riskLevel === "High"
                              ? "bg-amber-400"
                              : "bg-gray-400"
                          }`}
                        />
                        {tx.riskLevel} ({tx.riskScore}/100)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          tx.status === "Active"
                            ? "info"
                            : tx.status === "Flagged"
                            ? "danger"
                            : "neutral"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}