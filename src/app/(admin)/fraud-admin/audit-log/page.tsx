"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAudits } from "@/services";
import type { AuditLogItem } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import SearchBar from "@/components/shared/SearchBar";
import ExportButton from "@/components/shared/ExportButton";

const ROLE_BADGE: Record<string, "violet" | "success" | "info" | "neutral"> = {
  SUPER_ADMIN: "violet",
  FINANCIAL_ADMIN: "success",
  SUPPORT_ADMIN: "info",
  SYSTEM_API: "neutral",
};

const STATUS_BADGE: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  Success: "success",
  Warning: "warning",
  Blocked: "danger",
  Info: "neutral",
};

function Stat({ label, value, color = "text-gray-900" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-medium text-gray-800">{value}</span>
    </div>
  );
}

export default function FraudAdminAuditLogPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<AuditLogItem | null>(null);

  const { data: audits, isLoading } = useQuery({
    queryKey: ["audits"],
    queryFn: getAudits,
  });

  const filtered = (audits ?? []).filter((a) => {
    const matchSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.operator.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || a.role === roleFilter;
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Audit Trail"
        subtitle="Immutable operator action log with cryptographic hash verification"
        action={
         <ExportButton data={filtered} preset="audits" />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Stat label="Total Events" value={String(audits?.length ?? 0)} />
        <Stat label="Warnings" value={String(audits?.filter((a) => a.status === "Warning").length ?? 0)} color="text-amber-600" />
        <Stat label="Blocked" value={String(audits?.filter((a) => a.status === "Blocked").length ?? 0)} color="text-red-600" />
        <Stat label="System Actions" value={String(audits?.filter((a) => a.role === "SYSTEM_API").length ?? 0)} color="text-blue-600" />
      </div>

      <Card padded={false}>
        <div className="p-4 flex flex-col sm:flex-row items-center gap-3 border-b border-gray-100">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Filter by ID, operator, action..."
            className="flex-1 w-full"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Role:</span>
            {["ALL", "SUPER_ADMIN", "FINANCIAL_ADMIN", "SUPPORT_ADMIN", "SYSTEM_API"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  roleFilter === r ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {r === "ALL" ? "All" : r.replace("_", " ")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Status:</span>
            {["ALL", "Success", "Warning", "Blocked"].map((s) => (
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
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID / SHA</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Timestamp</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Operator</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Action</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">IP</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No audit entries match your filters.</td></tr>
              ) : (
                filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelected(a)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-blue-600">{a.id}</p>
                      <p className="font-mono text-[9px] text-gray-400">{a.sha}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{a.timestamp}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={a.avatar}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="h-7 w-7 rounded-full object-cover border border-gray-100"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800">{a.operator}</p>
                          <Badge variant={ROLE_BADGE[a.role] ?? "neutral"}>
                            {a.role.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700 max-w-xs truncate">{a.action}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{a.ip}</td>
                    <td className="px-6 py-4">
                      <Badge variant={STATUS_BADGE[a.status] ?? "neutral"}>{a.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail modal — read-only for fraud officer */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl border border-gray-100 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[9px] bg-blue-50 font-bold px-2.5 py-0.5 rounded text-blue-700">
                {selected.id}
              </span>
              <span className="font-mono text-[9px] bg-gray-50 font-bold px-2.5 py-0.5 rounded text-gray-500">
                SHA: {selected.sha}
              </span>
              <Badge variant={STATUS_BADGE[selected.status] ?? "neutral"}>{selected.status}</Badge>
            </div>

            <h3 className="text-lg font-bold text-gray-900">Audit Detail</h3>

            <div className="mt-4 space-y-3">
              <DetailRow label="Operator" value={selected.operator} />
              <DetailRow label="Role" value={selected.role.replace(/_/g, " ")} />
              <DetailRow label="Timestamp" value={selected.timestamp} />
              <DetailRow label="Source IP" value={selected.ip} />
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Action</h4>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm text-gray-700">
                  {selected.action}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}