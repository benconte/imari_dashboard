"use client";

import { cn } from "./cn";
import type { LucideIcon } from "lucide-react";

// Lazy import at runtime to avoid SSR / bundle issues in some setups
const lucide = require("lucide-react") as Record<string, LucideIcon>;

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize = "xs" | "sm" | "md";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Icon identifier.
   * - If it matches an export from lucide-react, that Lucide icon will be rendered.
   * - Otherwise it falls back to Material Symbols using the same string.
   */
  icon?: string;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
  outline: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm",
  ghost: "text-gray-600 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-[10px] rounded-lg",
  sm: "px-3.5 py-1.5 text-xs rounded-xl",
  md: "px-5 py-2.5 text-sm rounded-xl",
};

function RenderIcon({ icon, size }: { icon: string; size: ButtonSize }) {
  const Lucide = lucide?.[icon] as LucideIcon | undefined;
  if (Lucide) {
    return <Lucide className="w-4 h-4" strokeWidth={2} aria-hidden="true" />;
  }

  // Material Symbols fallback
  const fontSize = size === "xs" ? 16 : 16;
  return (
    <span
      className="material-symbols-outlined text-[16px]"
      style={{ fontSize }}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

export default function Button({ variant = "primary", size = "sm", icon, children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
      {...props}
    >
      {icon ? <RenderIcon icon={icon} size={size} /> : null}
      {children}
    </button>
  );
}

