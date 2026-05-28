"use client";

import { cn } from "./cn";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "violet";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  danger: "bg-red-50 text-red-700 border-red-100",
  info: "bg-blue-50 text-blue-700 border-blue-100",
  neutral: "bg-gray-50 text-gray-500 border-gray-200",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ variant = "neutral", className, children }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border", VARIANT_STYLES[variant], className)}>
      {children}
    </span>
  );
}
