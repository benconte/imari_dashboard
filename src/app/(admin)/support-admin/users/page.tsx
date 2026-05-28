"use client";

import { useState } from "react";
import { MOCK_USERS } from "@/mock";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";

const KYC_BADGE: Record<string, "success" | "warning" | "danger"> = { Verified: "success", Pending: "warning", Suspended: "danger" };

export default function SupportUsersPage() {
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("ALL");
  const users = MOCK_USERS;

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase());
    const matchKyc = kycFilter === "ALL" || u.kycStatus === kycFilter;
    return matchSearch && matchKyc;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Users" subtitle="Manage platform users" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p><p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verified</p><p className="text-3xl font-bold text-green-600 mt-2">{users.filter((u) => u.kycStatus === "Verified").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p><p className="text-3xl font-bold text-amber-600 mt-2">{users.filter((u) => u.kycStatus === "Pending").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suspended</p><p className="text-3xl font-bold text-red-600 mt-2">{users.filter((u) => u.kycStatus === "Suspended").length}</p></div>
      </div>

      <Card padded={false}>
        <div className="p-4 flex flex-col sm:flex-row items-center gap-3 border-b border-gray-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Search users..." className="flex-1 w-full" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">KYC:</span>
            {["ALL", "Verified", "Pending", "Suspended"].map((s) => (
              <button key={s} onClick={() => setKycFilter(s)} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${kycFilter === s ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"}`}>{s === "ALL" ? "All" : s}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">User</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Wallet Balance</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">KYC Status</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Join Date</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={u.avatar} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full object-cover border border-gray-100" /><div><p className="text-xs font-bold text-gray-800">{u.name}</p><p className="text-[10px] text-gray-400">{u.email}</p></div></div></td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{u.walletBalance}</td>
                  <td className="px-6 py-4"><Badge variant={KYC_BADGE[u.kycStatus] ?? "neutral"}>{u.kycStatus}</Badge></td>
                  <td className="px-6 py-4 text-xs text-gray-400">{u.joinDate}</td>
                  <td className="px-6 py-4 text-right"><Button variant="outline" size="xs" icon="visibility">View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
