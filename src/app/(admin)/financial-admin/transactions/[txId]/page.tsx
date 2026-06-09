"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFinancialTransactions, reverseTransaction, flagTransaction } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

export default function TransactionDetailPage({ params }: { params: Promise<{ txId: string }> }) {
  const { txId } = use(params);
  const queryClient = useQueryClient();
  const { data: txList } = useQuery({ queryKey: ["financialTransactions"], queryFn: getFinancialTransactions });
  const tx = txList?.find((t) => t.id === txId);

  const [flagOpen, setFlagOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagScore, setFlagScore] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["financialTransactions"] });

  const { mutate: doReverse, isPending: reversing, error: reverseErr, isSuccess: reversed } = useMutation({
    mutationFn: () => reverseTransaction(txId),
    onSuccess: invalidate,
  });

  const { mutate: doFlag, isPending: flagging, error: flagErr, isSuccess: flagged } = useMutation({
    mutationFn: () => flagTransaction(txId, flagReason, flagScore ? Number(flagScore) : undefined),
    onSuccess: () => { invalidate(); setFlagOpen(false); setFlagReason(""); setFlagScore(""); },
  });

  const canReverse = tx && ["Active", "Pending"].includes(tx.status);
  const canFlag = tx && tx.status !== "Flagged";

  if (!tx) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transaction Not Found" />
        <Card padded><p className="text-gray-500 text-sm">Transaction {txId} could not be found.</p></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Transaction ${tx.id}`} subtitle={tx.timestamp} action={
        <Button variant="outline" size="sm" icon="download">Export</Button>
      } />

      {(reverseErr || flagErr) && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl">
          {((reverseErr ?? flagErr) as Error).message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8" padded>
          <div className="space-y-4">
            <DetailRow label="Transaction ID" value={tx.id} />
            <DetailRow label="Timestamp" value={tx.timestamp} />
            <DetailRow label="Entity" value={`${tx.entityName} (${tx.entityId})`} />
            <DetailRow label="Amount" value={tx.amount} />
            <DetailRow label="Type" value={tx.type ?? "N/A"} />
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Level</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${tx.riskLevel === "Critical" ? "bg-red-500" : tx.riskLevel === "High" ? "bg-amber-400" : "bg-gray-400"}`} />
                <span className="text-xs font-bold text-gray-800">{tx.riskLevel} ({tx.riskScore}/100)</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
              <Badge variant={tx.status === "Active" ? "info" : tx.status === "Flagged" ? "danger" : "neutral"}>{tx.status}</Badge>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-4 space-y-6">
          <Card padded>
            <h4 className="text-sm font-bold text-gray-900 mb-3">Risk Assessment</h4>
            <div className="w-full bg-gray-100 h-3 rounded-full mb-2">
              <div className={`h-full rounded-full ${tx.riskScore > 70 ? "bg-red-500" : tx.riskScore > 40 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${tx.riskScore}%` }} />
            </div>
            <p className="text-xs text-gray-500">Risk Score: {tx.riskScore}/100</p>
          </Card>

          <Card padded>
            <h4 className="text-sm font-bold text-gray-900 mb-3">Actions</h4>
            <div className="space-y-2">
              {reversed ? (
                <div className="text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-3 py-2 rounded-lg">Transaction marked as reversed.</div>
              ) : (
                <Button
                  variant="primary" size="sm" icon="undo" className="w-full"
                  disabled={!canReverse || reversing}
                  onClick={() => doReverse()}
                >
                  {reversing ? "Reversing…" : "Reverse Transaction"}
                </Button>
              )}

              {flagged ? (
                <div className="text-xs text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">Transaction flagged as suspicious.</div>
              ) : (
                <Button
                  variant="danger" size="sm" icon="flag" className="w-full"
                  disabled={!canFlag || flagging}
                  onClick={() => setFlagOpen((o) => !o)}
                >
                  Flag as Suspicious
                </Button>
              )}
            </div>

            {flagOpen && !flagged && (
              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reason <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Describe the suspicious activity…"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Override Risk Score (0–100, optional)</label>
                <input
                  type="number" min={0} max={100}
                  value={flagScore}
                  onChange={(e) => setFlagScore(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="danger" size="sm" className="flex-1 justify-center"
                    disabled={!flagReason.trim() || flagging}
                    onClick={() => doFlag()}
                  >
                    {flagging ? "Flagging…" : "Submit Flag"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 justify-center" onClick={() => setFlagOpen(false)}>Cancel</Button>
                </div>
                {flagErr && <p className="text-[10px] text-red-600">{(flagErr as Error).message}</p>}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-medium text-gray-800">{value}</span>
    </div>
  );
}
