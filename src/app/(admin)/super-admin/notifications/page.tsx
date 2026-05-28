"use client";

import { useState } from "react";
import { MOCK_BROADCASTS } from "@/mock";
import type { BroadcastMessage } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";
import Modal from "@/components/shared/Modal";

const STATUS_BADGE: Record<string, "success" | "warning" | "neutral"> = {
  Sent: "success",
  Scheduled: "warning",
  Draft: "neutral",
};

const MEDIUM_ICON: Record<string, string> = {
  Sms: "sms",
  Email: "mail",
  Webhook: "link",
  "Desktop Push": "notifications",
};

export default function NotificationsPage() {
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(MOCK_BROADCASTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCompose, setShowCompose] = useState(false);
  const [title, setTitle] = useState("");
  const [medium, setMedium] = useState<BroadcastMessage["medium"]>("Email");
  const [audience, setAudience] = useState("");

  const filtered = broadcasts.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.audience.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !audience) return;
    const newBroadcast: BroadcastMessage = {
      id: `BCST-${Math.floor(Math.random() * 900) + 100}`,
      title,
      medium,
      audience,
      status: "Scheduled",
      timestamp: new Date().toISOString(),
    };
    setBroadcasts((prev) => [newBroadcast, ...prev]);
    setShowCompose(false);
    setTitle("");
    setAudience("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Broadcast notification management"
        action={
          <Button icon="add" onClick={() => setShowCompose(true)}>
            New Broadcast
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Broadcasts</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{broadcasts.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sent</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{broadcasts.filter((b) => b.status === "Sent").length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scheduled</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{broadcasts.filter((b) => b.status === "Scheduled").length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drafts</p>
          <p className="text-3xl font-bold text-gray-500 mt-2">{broadcasts.filter((b) => b.status === "Draft").length}</p>
        </div>
      </div>

      <Card padded={false}>
        <div className="p-4 flex flex-col sm:flex-row items-center gap-3 border-b border-gray-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Search broadcasts..." className="flex-1 w-full" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Status:</span>
            {["ALL", "Sent", "Scheduled", "Draft"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === s ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {s === "ALL" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Title</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Medium</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Audience</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Timestamp</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-gray-800">{b.title}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{b.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-[16px]">{MEDIUM_ICON[b.medium] ?? "mail"}</span>
                      <span className="text-xs text-gray-600">{b.medium}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">{b.audience}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{b.timestamp}</td>
                  <td className="px-6 py-4">
                    <Badge variant={STATUS_BADGE[b.status] ?? "neutral"}>{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showCompose} onClose={() => setShowCompose(false)} title="New Broadcast">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Medium</label>
            <select
              value={medium}
              onChange={(e) => setMedium(e.target.value as BroadcastMessage["medium"])}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
            >
              <option value="Email">Email</option>
              <option value="Sms">SMS</option>
              <option value="Webhook">Webhook</option>
              <option value="Desktop Push">Desktop Push</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Audience</label>
            <input
              type="text"
              required
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
              placeholder="e.g. All Users, Super Admins"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">
              Schedule Broadcast
            </button>
            <button type="button" onClick={() => setShowCompose(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
