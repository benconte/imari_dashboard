"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateKYCStatus } from "@/services";
import type { User } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import Modal from "@/components/shared/Modal";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [filterTab, setFilterTab] = useState<"All" | "Verified" | "Pending" | "Suspended">("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const { data: users, isLoading } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const statusMutation = useMutation({ mutationFn: ({ id, status }: { id: string; status: User["kycStatus"] }) => updateKYCStatus(id, status), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }) });

  const filtered = users?.filter((u) => {
    const matchTab = filterTab === "All" || u.kycStatus === filterTab;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Users" subtitle="Manage platform users" action={<Button icon="person_add" onClick={() => setShowAdd(true)}>Add User</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Active Users" value="9,842" delta="+12%" icon="person" />
        <StatCard label="KYC Pending" value="156" delta="Action Req." deltaVariant="danger" icon="history_edu" />
        <StatCard label="Wallet Total" value="$4.2M" delta="USD" deltaVariant="neutral" icon="account_balance_wallet" />
        <StatCard label="System Status" value="99.98%" delta="Healthy" deltaVariant="success" icon="gpp_good" />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-4 border-b border-gray-200 overflow-x-auto">
          {(["All", "Verified", "Pending", "Suspended"] as const).map((tab) => (
            <button key={tab} onClick={() => setFilterTab(tab)} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${filterTab === tab ? "text-blue-600 border-blue-600" : "text-gray-400 border-transparent hover:text-gray-600"}`}>{tab}</button>
          ))}
        </div>
        <div className="flex-1" />
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email..." className="w-full sm:w-64" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Wallet Balance</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">KYC Status</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Join Date</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">Loading...</td></tr>
              ) : filtered?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover bg-gray-50 shrink-0 border border-gray-100" />
                      <div><div className="font-bold text-gray-800 text-sm">{user.name}</div><div className="text-[10px] text-gray-400 font-mono">{user.email}</div></div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-bold text-gray-900 font-mono">{user.walletBalance}</td>
                  <td className="p-4 text-center">
                    <Badge variant={user.kycStatus === "Verified" ? "success" : user.kycStatus === "Pending" ? "warning" : "danger"}>{user.kycStatus}</Badge>
                  </td>
                  <td className="p-4 text-xs font-semibold text-gray-500">{user.joinDate}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => statusMutation.mutate({ id: user.id, status: "Verified" })} className="p-1 text-gray-400 hover:text-emerald-600 rounded transition-colors" title="Verify"><span className="material-symbols-outlined text-[18px]">verified</span></button>
                      <button onClick={() => statusMutation.mutate({ id: user.id, status: "Suspended" })} className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors" title="Suspend"><span className="material-symbols-outlined text-[18px]">block</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New User">
        <form onSubmit={(e) => { e.preventDefault(); if (newName && newEmail) { setShowAdd(false); setNewName(""); setNewEmail(""); } }} className="space-y-4">
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label><input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-500" /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label><input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-500" /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">Submit</button>
            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
