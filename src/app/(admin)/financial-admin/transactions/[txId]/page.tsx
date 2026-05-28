"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

export default function TransactionDetailPage({ params }: { params: Promise<{ txId: string }> }) {
  const { txId } = use(params);
  const { data: txList } = useQuery({ queryKey: ["transactions"], queryFn: getTransactions });
  const tx = txList?.find((t) => t.id === txId);

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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon="download">Export</Button>
          <Button variant="outline" size="sm" icon="flag">Flag</Button>
        </div>
      } />

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
              <Button variant="primary" size="sm" icon="check" className="w-full">Approve</Button>
              <Button variant="danger" size="sm" icon="block" className="w-full">Freeze</Button>
              <Button variant="outline" size="sm" icon="history" className="w-full">View History</Button>
            </div>
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
