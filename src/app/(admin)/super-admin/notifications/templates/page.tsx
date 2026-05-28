"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";

interface Template {
  id: string;
  name: string;
  medium: "Email" | "Sms" | "Webhook" | "Push";
  subject?: string;
  body: string;
  variables: string[];
  lastEdited: string;
}

const INITIAL_TEMPLATES: Template[] = [
  {
    id: "TPL-001",
    name: "KYC Approval Confirmation",
    medium: "Email",
    subject: "Your KYC Has Been Approved",
    body: "Hello {{userName}}, your identity verification has been approved. You now have full access to all platform features.",
    variables: ["userName"],
    lastEdited: "May 25, 2026",
  },
  {
    id: "TPL-002",
    name: "Transaction Alert",
    medium: "Sms",
    body: "Imari: {{amount}} {{direction}} on your account ending {{last4}}. If unauthorized, contact support immediately.",
    variables: ["amount", "direction", "last4"],
    lastEdited: "May 20, 2026",
  },
  {
    id: "TPL-003",
    name: "Maintenance Notice",
    medium: "Email",
    subject: "Scheduled Maintenance Window",
    body: "Dear {{clientName}}, our systems will undergo scheduled maintenance on {{date}} from {{startTime}} to {{endTime}} UTC. Services may be briefly unavailable.",
    variables: ["clientName", "date", "startTime", "endTime"],
    lastEdited: "May 18, 2026",
  },
  {
    id: "TPL-004",
    name: "Webhook Event Payload",
    medium: "Webhook",
    body: '{"event": "{{eventType}}", "txId": "{{txId}}", "status": "{{status}}", "timestamp": "{{timestamp}}"}',
    variables: ["eventType", "txId", "status", "timestamp"],
    lastEdited: "May 15, 2026",
  },
];

const MEDIUM_BADGE: Record<string, "info" | "success" | "neutral" | "warning"> = {
  Email: "info",
  Sms: "success",
  Webhook: "neutral",
  Push: "warning",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [selected, setSelected] = useState<Template | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [editName, setEditName] = useState("");
  const [editMedium, setEditMedium] = useState<Template["medium"]>("Email");

  function openCreate() {
    setEditName("");
    setEditBody("");
    setEditMedium("Email");
    setShowCreate(true);
  }

  function openEdit(t: Template) {
    setEditName(t.name);
    setEditBody(t.body);
    setEditMedium(t.medium);
    setSelected(t);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editName || !editBody) return;
    if (selected) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === selected.id
            ? { ...t, name: editName, body: editBody, medium: editMedium, lastEdited: "Just now" }
            : t
        )
      );
      setSelected(null);
    } else {
      const newT: Template = {
        id: `TPL-${Math.floor(Math.random() * 900) + 100}`,
        name: editName,
        medium: editMedium,
        body: editBody,
        variables: [...editBody.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]),
        lastEdited: "Just now",
      };
      setTemplates((prev) => [newT, ...prev]);
      setShowCreate(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Templates"
        subtitle="Template editor for broadcast messages"
        action={<Button icon="add" onClick={openCreate}>New Template</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((t) => (
          <Card key={t.id} padded className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant={MEDIUM_BADGE[t.medium] ?? "neutral"}>{t.medium}</Badge>
                <span className="text-[10px] text-gray-400 font-mono">{t.id}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-900">{t.name}</h4>
              {t.subject && <p className="text-xs text-gray-500 mt-1">Subject: {t.subject}</p>}
              <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{t.body}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
              <div className="flex gap-1 flex-wrap">
                {t.variables.map((v) => (
                  <span key={v} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded border border-blue-100">
                    {v}
                  </span>
                ))}
              </div>
              <Button variant="ghost" size="xs" icon="edit" onClick={() => openEdit(t)}>
                Edit
              </Button>
            </div>
            <p className="text-[10px] text-gray-300 mt-2">Last edited: {t.lastEdited}</p>
          </Card>
        ))}
      </div>

      <Modal
        open={showCreate || !!selected}
        onClose={() => {
          setShowCreate(false);
          setSelected(null);
        }}
        title={selected ? "Edit Template" : "New Template"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Name</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Medium</label>
            <select
              value={editMedium}
              onChange={(e) => setEditMedium(e.target.value as Template["medium"])}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50"
            >
              <option value="Email">Email</option>
              <option value="Sms">SMS</option>
              <option value="Webhook">Webhook</option>
              <option value="Push">Push</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Body</label>
            <textarea
              required
              rows={6}
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50 font-mono"
              placeholder="Use {{variableName}} for dynamic fields"
            />
            <p className="text-[10px] text-gray-400 mt-1">Use {"{{"}variable{"}}"} syntax for dynamic content</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">
              {selected ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                setSelected(null);
              }}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
