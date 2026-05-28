"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdmins, inviteAdmin, deleteAdmin } from "@/services";
import type { Admin } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";

export default function AdminManagementPage() {
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Admin["role"]>("SUPPORT");

  const { data: admins, isLoading } = useQuery({ queryKey: ["admins"], queryFn: getAdmins });
  const inviteMut = useMutation({ mutationFn: inviteAdmin, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admins"] }); setShowInvite(false); setName(""); setEmail(""); setRole("SUPPORT"); } });
  const deleteMut = useMutation({ mutationFn: deleteAdmin, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admins"] }) });

  const ROLE_BADGE: Record<string, "violet" | "success" | "info"> = { SUPER: "violet", FINANCIAL: "success", SUPPORT: "info" };

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Accounts" subtitle="Manage institutional access and permission tiers" action={<Button icon="person_add" onClick={() => setShowInvite(true)}>Invite Admin</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Admins</p><p className="text-3xl font-bold text-gray-900 mt-2">{admins?.length ?? 0}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Sessions</p><p className="text-3xl font-bold text-gray-900 mt-2">08</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm md:col-span-2"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">System Integrity</p><p className="text-xl font-bold text-gray-800 mt-2">99.98% Secure</p></div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Active</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading...</td></tr> : admins?.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={admin.avatar} alt="" referrerPolicy="no-referrer" className="h-10 w-10 rounded-full object-cover border border-gray-100" /><div><p className="font-bold text-gray-800 text-sm">{admin.name}</p><p className="text-[10px] text-gray-400">{admin.email}</p></div></div></td>
                  <td className="px-6 py-4"><Badge variant={ROLE_BADGE[admin.role] ?? "neutral"}>{admin.role}</Badge></td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-700">{admin.lastActive}</td>
                  <td className="px-6 py-4"><Badge variant={admin.status === "Active" ? "success" : "neutral"}>{admin.status}</Badge></td>
                  <td className="px-6 py-4 text-right"><button onClick={() => deleteMut.mutate(admin.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><span className="material-symbols-outlined text-[18px]">block</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Admin">
        <form onSubmit={(e) => { e.preventDefault(); if (name && email) inviteMut.mutate({ name, email, role }); }} className="space-y-4">
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Name</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1">Role</label><select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"><option value="SUPER">SUPER_ADMIN</option><option value="FINANCIAL">FINANCIAL_ADMIN</option><option value="SUPPORT">SUPPORT_ADMIN</option></select></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={inviteMut.isPending} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">{inviteMut.isPending ? "Inviting..." : "Send Invitation"}</button>
            <button type="button" onClick={() => setShowInvite(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
