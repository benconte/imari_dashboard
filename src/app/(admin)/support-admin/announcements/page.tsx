"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";

interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: "All Users" | "Verified Users" | "Suspended Users";
  status: "Published" | "Draft" | "Expired";
  createdAt: string;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: "ANN-001", title: "Scheduled Maintenance Window", message: "Platform maintenance is scheduled for June 1st, 2026 from 2:00 AM to 4:00 AM UTC. Services may be temporarily unavailable.", audience: "All Users", status: "Published", createdAt: "May 25, 2026" },
  { id: "ANN-002", title: "New Feature: Virtual Card Freezing", message: "Users can now instantly freeze and unfreeze their virtual cards from the app for enhanced security.", audience: "Verified Users", status: "Published", createdAt: "May 20, 2026" },
  { id: "ANN-003", title: "Updated Terms of Service", message: "Our terms of service have been updated. Please review the changes before June 15, 2026.", audience: "All Users", status: "Draft", createdAt: "May 18, 2026" },
];

const STATUS_BADGE: Record<string, "success" | "neutral" | "warning"> = { Published: "success", Draft: "neutral", Expired: "warning" };
const AUDIENCE_BADGE: Record<string, "info" | "success" | "danger"> = { "All Users": "info", "Verified Users": "success", "Suspended Users": "danger" };

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Announcement["audience"]>("All Users");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !message) return;
    const newAnn: Announcement = {
      id: `ANN-${String(announcements.length + 1).padStart(3, "0")}`,
      title,
      message,
      audience,
      status: "Draft",
      createdAt: "Just now",
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    setShowCreate(false);
    setTitle("");
    setMessage("");
  }

  function publish(id: string) {
    setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, status: "Published" as const } : a));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" subtitle="User-facing support announcements" action={<Button icon="add" onClick={() => setShowCreate(true)}>New Announcement</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p><p className="text-3xl font-bold text-gray-900 mt-2">{announcements.length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Published</p><p className="text-3xl font-bold text-green-600 mt-2">{announcements.filter((a) => a.status === "Published").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drafts</p><p className="text-3xl font-bold text-gray-500 mt-2">{announcements.filter((a) => a.status === "Draft").length}</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expired</p><p className="text-3xl font-bold text-amber-600 mt-2">{announcements.filter((a) => a.status === "Expired").length}</p></div>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id} padded>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-gray-400 font-mono">{ann.id}</span>
                  <Badge variant={STATUS_BADGE[ann.status] ?? "neutral"}>{ann.status}</Badge>
                  <Badge variant={AUDIENCE_BADGE[ann.audience] ?? "neutral"}>{ann.audience}</Badge>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{ann.title}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{ann.message}</p>
                <p className="text-[10px] text-gray-400 mt-2">Created: {ann.createdAt}</p>
              </div>
              <div className="shrink-0 ml-4">
                {ann.status === "Draft" ? (
                  <Button variant="primary" size="xs" onClick={() => publish(ann.id)}>Publish</Button>
                ) : ann.status === "Published" ? (
                  <Button variant="outline" size="xs" icon="edit">Edit</Button>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Announcement">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Message</label>
            <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Audience</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value as Announcement["audience"])} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50">
              <option value="All Users">All Users</option>
              <option value="Verified Users">Verified Users</option>
              <option value="Suspended Users">Suspended Users</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">Save as Draft</button>
            <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
