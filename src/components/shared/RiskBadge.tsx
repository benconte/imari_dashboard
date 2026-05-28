"use client";

import { cn } from "./cn";

type Risk = "low" | "medium" | "high" | "critical";

const RISK_MAP: Record<Risk, string> = {
  low: "bg-gray-50 text-gray-600 border-gray-200",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  high: "bg-orange-50 text-orange-700 border-orange-100",
  critical: "bg-red-50 text-red-700 border-red-100",
};

interface RiskBadgeProps {
  level: Risk;
  score?: number;
  className?: string;
}

export default function RiskBadge({ level, score, className }: RiskBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border uppercase", RISK_MAP[level], className)}>
      {level} {score !== undefined && `(${score})`}
    </span>
  );
}
