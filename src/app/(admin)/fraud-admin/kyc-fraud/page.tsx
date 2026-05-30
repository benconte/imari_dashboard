"use client";

// KYC view scoped to the Fraud Officer.
// Unlike the full KYC queue (which Financial Admin uses for all submissions),
// this view pre-filters to only show:
//   - Submissions with AML hits (noAmlMatches === false)
//   - Submissions with a risk score above 40
// The officer can review these high-risk submissions and flag them
// for rejection, but final approval/rejection should be confirmed
// by Financial Admin or Super Admin.

import { useState } from "react";
import { MOCK_KYC_QUEUE } from "@/mock";
import type { KYCSubmission } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import SearchBar from "@/components/shared/SearchBar";

export default function FraudAdminKYCRiskPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<KYCSubmission | null>(null);

  // Only high-risk submissions are relevant to the Fraud Officer
  const riskQueue = MOCK_KYC_QUEUE.filter(
    (k) => k.riskScore > 40 || !k.noAmlMatches
  );

  const filtered = riskQueue.filter(
    (k) =>
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.email.toLowerCase().includes(search.toLowerCase())
  );

  const amlHits = riskQueue.filter((k) => !k.noAmlMatches).length;
  const highRisk = riskQueue.filter((k) => k.riskScore > 40).length;
  const avgFaceMatch = riskQueue.length
    ? Math.round(riskQueue.reduce((s, k) => s + k.faceMatchPct, 0) / riskQueue.length)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="High-Risk KYC Submissions"
        subtitle="AML hits and elevated risk score submissions requiring fraud review"
        action={
          <Button variant="outline" size="sm" icon="filter_list">
            Filter
          </Button>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Risk Queue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{riskQueue.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AML Hits</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{amlHits}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">High Risk Score</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{highRisk}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Face Match</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{avgFaceMatch}%</p>
        </div>
      </div>

      {/* Table */}
      <Card padded={false}>
        <div className="p-4 border-b border-gray-100">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search submissions..."
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">ID</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Name</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Doc Type</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Risk Score</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Face Match</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">AML</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No high-risk submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{k.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 font-bold text-[10px] border border-gray-200">
                          {k.avatarCode}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{k.name}</p>
                          <p className="text-[10px] text-gray-400">{k.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-700">{k.docType}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{k.docNo}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold text-xs ${
                          k.riskScore > 40 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {k.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold text-xs ${
                          k.faceMatchPct >= 95 ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        {k.faceMatchPct}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={k.noAmlMatches ? "success" : "danger"}>
                        {k.noAmlMatches ? "Clear" : "HIT"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="primary" size="xs" onClick={() => setSelected(k)}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl border border-gray-100 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900">KYC Risk Review: {selected.name}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {selected.email} · {selected.nationality}
            </p>

            {/* AML warning banner */}
            {!selected.noAmlMatches && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600 text-[20px]">gpp_bad</span>
                <p className="text-xs font-bold text-red-700">
                  AML / PEP watchlist match detected. Escalate before any approval.
                </p>
              </div>
            )}

            <hr className="my-4 border-gray-100" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Document", value: `${selected.docType} (${selected.docNo})` },
                { label: "Expiry", value: selected.expiryDate },
                { label: "Risk Score", value: String(selected.riskScore) },
                { label: "Face Match", value: `${selected.faceMatchPct}%` },
                { label: "AML Check", value: selected.noAmlMatches ? "No Matches" : "⚠ FLAGGED" },
                { label: "Submitted", value: selected.submitDate },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                  <p className={`text-xs font-medium mt-0.5 ${label === "AML Check" && !selected.noAmlMatches ? "text-red-600 font-bold" : "text-gray-800"}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4 border-gray-100" />

            {/* Fraud Officer actions: flag for rejection or escalate — no direct approve */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Flag for Rejection
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Escalate to Super Admin
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              Fraud Officers cannot directly approve KYC submissions. Use escalation for borderline cases.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}