"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getKycQueue, approveKyc, rejectKyc } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Badge from "@/components/shared/Badge";

const STATUS_BADGE: Record<string, "success" | "warning" | "danger"> = { Verified: "success", Pending: "warning", Rejected: "danger" };

export default function KYCQueuePage() {
  const queryClient = useQueryClient();
  const { data: queue, isLoading } = useQuery({ queryKey: ["kycQueue"], queryFn: getKycQueue });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const active = queue?.find((i) => i.id === selectedId) ?? queue?.[0];

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["kycQueue"] });

  const { mutate: doApprove, isPending: approving, error: approveErr } = useMutation({
    mutationFn: () => approveKyc(active!.id),
    onSuccess: () => { invalidate(); setSelectedId(null); },
  });

  const { mutate: doReject, isPending: rejecting, error: rejectErr } = useMutation({
    mutationFn: () => rejectKyc(active!.id, rejectReason),
    onSuccess: () => { invalidate(); setSelectedId(null); setRejectOpen(false); setRejectReason(""); },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="KYC Verification Queue" subtitle={`${queue?.length ?? 0} submissions awaiting review`} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Doc Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">Doc Number</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">Submitted</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading...</td></tr> : queue?.length ? queue.map((item) => {
                    const isActive = item.id === (selectedId ?? queue[0]?.id);
                    return (
                      <tr key={item.id} onClick={() => { setSelectedId(item.id); setRejectOpen(false); setRejectReason(""); }} className={`hover:bg-gray-50 cursor-pointer border-l-4 transition-all ${isActive ? "border-l-blue-600 bg-blue-50/20" : "border-l-transparent"}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs">{item.avatarCode}</div>
                            <div><div className="font-bold text-gray-800 text-sm">{item.name}</div><div className="text-[10px] text-gray-400">{item.email}</div></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-700">{item.documentType}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">{item.documentNumber}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">{item.submittedAt}</td>
                        <td className="px-6 py-4"><Badge variant={STATUS_BADGE[item.reviewStatus] ?? "neutral"}>{item.reviewStatus}</Badge></td>
                      </tr>
                    );
                  }) : <tr><td colSpan={5} className="p-8 text-center text-gray-400">Queue is empty</td></tr>}
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
                <Badge variant={STATUS_BADGE[active.reviewStatus] ?? "neutral"}>{active.reviewStatus}</Badge>
              </div>
              <div className="p-5 space-y-4">
                <div className="relative group cursor-zoom-in rounded-xl overflow-hidden border border-gray-200 aspect-[1.6/1]">
                  <img src={active.documentFrontUrl} alt="Document front" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold">Full Name</p><p className="text-sm font-bold text-gray-800">{active.name}</p></div>
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold">Document Type</p><p className="text-sm font-bold text-gray-800">{active.documentType}</p></div>
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold">Document No.</p><p className="text-sm font-bold text-gray-800">{active.documentNumber}</p></div>
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold">Submitted</p><p className="text-sm font-bold text-gray-800">{active.submittedAt}</p></div>
                  </div>

                  {active.rejectionReason && (
                    <div className="p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                      <p className="text-[9px] font-bold text-red-700 uppercase mb-1">Rejection Reason</p>
                      <p className="text-xs text-red-700">{active.rejectionReason}</p>
                    </div>
                  )}

                  {(approveErr || rejectErr) && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                      <p className="text-xs text-red-700">{((approveErr ?? rejectErr) as Error).message}</p>
                    </div>
                  )}

                  {active.reviewStatus === "Pending" && (
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        disabled={approving || rejecting}
                        onClick={() => doApprove()}
                        className="w-full bg-blue-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      >
                        {approving ? "Approving…" : "Approve Submission"}
                      </button>

                      {!rejectOpen ? (
                        <button
                          disabled={approving || rejecting}
                          onClick={() => setRejectOpen(true)}
                          className="w-full bg-white border border-red-200 text-red-600 font-bold text-xs py-3 rounded-xl hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                          Reject & Request New Info
                        </button>
                      ) : (
                        <div className="space-y-2 border border-red-200 rounded-xl p-3 bg-red-50/30">
                          <label className="block text-[10px] font-bold text-red-700 uppercase tracking-wider">
                            Rejection Reason <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            rows={3}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Explain why this submission is rejected…"
                            className="w-full text-xs border border-red-200 rounded-lg px-3 py-2 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                          <div className="flex gap-2">
                            <button
                              disabled={rejectReason.trim().length < 5 || rejecting}
                              onClick={() => doReject()}
                              className="flex-1 bg-red-600 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            >
                              {rejecting ? "Rejecting…" : "Confirm Reject"}
                            </button>
                            <button
                              onClick={() => { setRejectOpen(false); setRejectReason(""); }}
                              className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold text-xs py-2.5 rounded-lg hover:bg-gray-50 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400">Select a submission</div>}
        </aside>
      </div>
    </div>
  );
}
