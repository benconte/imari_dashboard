"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getKYCQueue } from "@/services";
import type { KYCSubmission } from "@/types";
import PageHeader from "@/components/shared/PageHeader";

export default function KYCQueuePage() {
  const { data: queue, isLoading } = useQuery({ queryKey: ["kycQueue"], queryFn: getKYCQueue });
  const [selectedId, setSelectedId] = useState<string>("KYC-001");
  const active = queue?.find((i) => i.id === selectedId) ?? queue?.[0];

  return (
    <div className="space-y-6">
      <PageHeader title="KYC Verification Queue" subtitle="14 pending submissions requiring manual review" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Doc Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">Submitted</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">Risk Score</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading...</td></tr> : queue?.map((item) => {
                    const isActive = item.id === selectedId;
                    return (
                      <tr key={item.id} onClick={() => setSelectedId(item.id)} className={`hover:bg-gray-50 cursor-pointer border-l-4 transition-all ${isActive ? "border-l-blue-600 bg-blue-50/20" : "border-l-transparent"}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs">{item.avatarCode}</div>
                            <div><div className="font-bold text-gray-800 text-sm">{item.name}</div><div className="text-[10px] text-gray-400">{item.email}</div></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-700">{item.docType}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">{item.submitDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${item.riskScore < 20 ? "text-emerald-700 bg-emerald-50" : item.riskScore < 50 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50"}`}>{item.riskScore}</span>
                            <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${item.riskScore < 20 ? "bg-emerald-600" : item.riskScore < 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.riskScore}%` }} /></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 sticky top-6 self-start">
          {active ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800">Document Preview</h3>
                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase">Active Review</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="relative group cursor-zoom-in rounded-xl overflow-hidden border border-gray-200 aspect-[1.6/1]">
                  <img src={active.idCardUrl} alt="ID card" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold">Full Name</p><p className="text-sm font-bold text-gray-800">{active.name}</p></div>
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold">Document No.</p><p className="text-sm font-bold text-gray-800">{active.docNo}</p></div>
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold">Expiry Date</p><p className="text-sm font-bold text-gray-800">{active.expiryDate}</p></div>
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold">Nationality</p><p className="text-sm font-bold text-gray-800">{active.nationality}</p></div>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/30 space-y-2">
                    <div className="flex items-center gap-2"><span className="material-symbols-outlined text-blue-600 text-base">verified_user</span><span className="text-[9px] font-bold text-blue-700 uppercase">Automated Check Results</span></div>
                    <ul className="text-xs space-y-2 font-bold text-gray-700">
                      <li className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>Face matching ({active.faceMatchPct}%)</li>
                      <li className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>Document authenticity verified</li>
                      <li className="flex items-center gap-2"><span className={`material-symbols-outlined text-base ${active.noAmlMatches ? "text-emerald-600" : "text-red-500"}`}>{active.noAmlMatches ? "check_circle" : "cancel"}</span>{active.noAmlMatches ? "No AML matches" : "Warning: PEP alert match"}</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <button className="w-full bg-blue-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-700 transition-all">Approve Submission</button>
                    <button className="w-full bg-white border border-red-200 text-red-600 font-bold text-xs py-3 rounded-xl hover:bg-red-50 transition-all">Reject & Request New Info</button>
                  </div>
                </div>
              </div>
            </div>
          ) : <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400">Select a submission</div>}
        </aside>
      </div>
    </div>
  );
}
