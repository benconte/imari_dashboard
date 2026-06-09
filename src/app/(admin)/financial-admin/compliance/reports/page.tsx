"use client";

import { useQuery } from "@tanstack/react-query";
import { getComplianceAudits } from "@/services";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

const RESULT_BADGE: Record<string, "success" | "danger" | "warning"> = { Passed: "success", Flagged: "danger", "Pending Action": "warning" };

export default function ComplianceReportsPage() {
  const { data: audits = [], isLoading } = useQuery({ queryKey: ["complianceAudits"], queryFn: getComplianceAudits });

  return (
    <div className="space-y-6">
      <PageHeader title="Compliance Reports" subtitle="Financial report history" action={<Button variant="outline" size="sm" icon="download">Export All</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-sm text-gray-400 col-span-full text-center py-8">Loading reports...</p>
        ) : audits.map((a) => (
          <Card key={a.id} padded className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-gray-400 font-mono">{a.id}</span>
              <Badge variant={RESULT_BADGE[a.result] ?? "neutral"}>{a.result}</Badge>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">{a.category}</h4>
            <p className="text-xs text-gray-500 leading-relaxed flex-1">{a.details}</p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
              <span className="text-[10px] text-gray-400">{a.executor}</span>
              <span className="text-[10px] text-gray-400">{a.timestamp}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
