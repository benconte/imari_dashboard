"use client";

import { cn } from "./cn";

type Status = "active" | "pending" | "flagged" | "frozen" | "failed" | "closed" | "escalated" | "under_review";

const STATUS_MAP: Record<Status, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending: { bg: "bg-amber-50 border-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  flagged: { bg: "bg-red-50 border-red-100", text: "text-red-700", dot: "bg-red-500" },
  frozen: { bg: "bg-gray-50 border-gray-200", text: "text-gray-500", dot: "bg-gray-400" },
  failed: { bg: "bg-red-50 border-red-100", text: "text-red-700", dot: "bg-red-500" },
  closed: { bg: "bg-gray-50 border-gray-200", text: "text-gray-500", dot: "bg-gray-400" },
  escalated: { bg: "bg-red-50 border-red-100", text: "text-red-700", dot: "bg-red-500" },
  under_review: { bg: "bg-amber-50 border-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border", s.bg, s.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {label ?? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </span>
  );
}
