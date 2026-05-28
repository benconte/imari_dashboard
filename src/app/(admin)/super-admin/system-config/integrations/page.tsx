"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

interface Integration {
  id: string;
  name: string;
  provider: string;
  type: "Payment" | "Identity" | "Communication" | "Analytics";
  status: "Connected" | "Degraded" | "Disconnected";
  lastSync: string;
  apiKeyMasked: string;
  webhookUrl?: string;
}

const INTEGRATIONS: Integration[] = [
  { id: "INT-001", name: "Stripe Payment Gateway", provider: "Stripe", type: "Payment", status: "Connected", lastSync: "2m ago", apiKeyMasked: "sk_live_•••••••••••4242", webhookUrl: "https://api.imari.com/webhooks/stripe" },
  { id: "INT-002", name: "Visa Direct Rail", provider: "Visa", type: "Payment", status: "Connected", lastSync: "5m ago", apiKeyMasked: "visa_key_••••••••8812" },
  { id: "INT-003", name: "Jumio KYC Engine", provider: "Jumio", type: "Identity", status: "Connected", lastSync: "12m ago", apiKeyMasked: "jumio_••••••••••3091", webhookUrl: "https://api.imari.com/webhooks/jumio" },
  { id: "INT-004", name: "Chainalysis AML", provider: "Chainalysis", type: "Identity", status: "Degraded", lastSync: "45m ago", apiKeyMasked: "chain_••••••••••7710" },
  { id: "INT-005", name: "Twilio SMS API", provider: "Twilio", type: "Communication", status: "Connected", lastSync: "1m ago", apiKeyMasked: "twilio_••••••••5502" },
  { id: "INT-006", name: "SendGrid Email", provider: "SendGrid", type: "Communication", status: "Connected", lastSync: "3m ago", apiKeyMasked: "sg_•••••••••••1198" },
  { id: "INT-007", name: "Mixpanel Analytics", provider: "Mixpanel", type: "Analytics", status: "Disconnected", lastSync: "2d ago", apiKeyMasked: "mp_••••••••••6643" },
];

const STATUS_BADGE: Record<string, "success" | "warning" | "danger"> = {
  Connected: "success",
  Degraded: "warning",
  Disconnected: "danger",
};

const TYPE_ICON: Record<string, string> = {
  Payment: "credit_card",
  Identity: "verified_user",
  Communication: "forum",
  Analytics: "monitoring",
};

export default function IntegrationsPage() {
  const [integrations] = useState<Integration[]>(INTEGRATIONS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        subtitle="External API connection status"
        action={<Button variant="outline" size="sm" icon="sync">Refresh All</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{integrations.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Connected</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{integrations.filter((i) => i.status === "Connected").length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Degraded</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{integrations.filter((i) => i.status === "Degraded").length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Disconnected</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{integrations.filter((i) => i.status === "Disconnected").length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((int) => (
          <Card key={int.id} padded className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  int.status === "Connected" ? "bg-green-50" : int.status === "Degraded" ? "bg-amber-50" : "bg-red-50"
                }`}>
                  <span className={`material-symbols-outlined text-[20px] ${
                    int.status === "Connected" ? "text-green-600" : int.status === "Degraded" ? "text-amber-600" : "text-red-600"
                  }`}>
                    {TYPE_ICON[int.type] ?? "extension"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{int.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{int.provider}</p>
                </div>
              </div>
              <Badge variant={STATUS_BADGE[int.status] ?? "neutral"}>{int.status}</Badge>
            </div>

            <div className="space-y-2 mt-2 flex-1">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Type</span>
                <span className="text-xs text-gray-700">{int.type}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Last Sync</span>
                <span className="text-xs text-gray-700">{int.lastSync}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">API Key</span>
                <span className="text-xs text-gray-500 font-mono truncate ml-2">{int.apiKeyMasked}</span>
              </div>
              {int.webhookUrl && (
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Webhook</span>
                  <span className="text-xs text-blue-600 font-mono truncate ml-2">{int.webhookUrl}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
              <Button variant="outline" size="xs" icon="sync" className="flex-1">
                Reconnect
              </Button>
              <Button variant="ghost" size="xs" icon="settings" className="flex-1">
                Config
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
