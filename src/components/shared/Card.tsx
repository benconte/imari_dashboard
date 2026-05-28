"use client";

import { cn } from "./cn";

interface CardProps {
  title?: string;
  subtitle?: string;
  padded?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Card({ title, subtitle, padded = true, className, children }: CardProps) {
  return (
    <div className={cn("bg-white border border-gray-100 rounded-2xl shadow-sm", padded && "p-6", className)}>
      {(title || subtitle) && (
        <div className={cn("mb-4", padded && "pb-4 border-b border-gray-100")}>
          {title && <h3 className="text-sm font-bold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
