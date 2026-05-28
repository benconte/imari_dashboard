"use client";

import { cn } from "./cn";
import Badge from "./Badge";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaVariant?: "success" | "danger" | "neutral";
  icon?: string;
  className?: string;
}

export default function StatCard({ label, value, delta, deltaVariant = "success", icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between", className)}>
      <div className="flex justify-between items-start">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        {icon && (
          <div className="p-2 bg-gray-50 rounded-xl">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">{icon}</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
      {delta && (
        <Badge variant={deltaVariant} className="self-start mt-3">
          {delta}
        </Badge>
      )}
    </div>
  );
}
