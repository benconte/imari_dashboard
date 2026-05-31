"use client";
 
import { useState, useRef, useEffect } from "react";
import {
  exportToCSV,
  exportToPDF,
  EXPORT_PRESETS,
  ExportColumn,
} from "@/lib/export";   // adjust path if needed
import { cn } from "./cn"; // adjust path if needed
 
type PresetKey = keyof typeof EXPORT_PRESETS;
 
interface ExportButtonProps {
  /** The array of row objects to export */
  // Export is schema-agnostic; we only access row[col.key] at runtime.
  data: unknown[];






  /** Use a built-in preset (quickest way) */
  preset?: PresetKey;
  /** Override/provide columns manually */
  columns?: ExportColumn[];
  /** Override filename (no extension) */
  filename?: string;
  /** Override PDF heading */
  title?: string;
  /** Which formats to show. Defaults to ["csv", "pdf"] */
  formats?: ("csv" | "pdf")[];
  /** Optional extra CSS classes on the trigger button */
  className?: string;
  /** Label on the trigger button */
  label?: string;
}
 
export default function ExportButton({
  data,
  preset,
  columns,
  filename,
  title,
  formats = ["csv", "pdf"],
  className,
  label = "Export",
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"csv" | "pdf" | null>(null);
  const ref = useRef<HTMLDivElement>(null);
 
  // Resolve columns + filename from preset or props
  const resolvedColumns: ExportColumn[] =
    columns ?? (preset ? EXPORT_PRESETS[preset].columns : []);
  const resolvedFilename =
    filename ?? (preset ? EXPORT_PRESETS[preset].filename : "imari-export");
  const resolvedTitle =
    title ?? (preset ? EXPORT_PRESETS[preset].title : resolvedFilename);
 
  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  async function handleExport(format: "csv" | "pdf") {
    if (!resolvedColumns.length) {
      console.warn("ExportButton: no columns defined");
      return;
    }
    setLoading(format);
    setOpen(false);
 
    // Small delay so UI can show loading state before blocking work
    await new Promise((r) => setTimeout(r, 80));
 
    try {
      const safeData = data as Record<string, unknown>[];
      if (format === "csv") {
        exportToCSV(safeData, resolvedColumns, resolvedFilename);
      } else {
        exportToPDF(safeData, resolvedColumns, resolvedFilename, resolvedTitle);
      }

    } finally {
      setLoading(null);
    }
  }
 
  // Single-format shortcut — no dropdown needed
  if (formats.length === 1) {
    const fmt = formats[0];
    return (
      <button
        onClick={() => handleExport(fmt)}
        disabled={loading !== null}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 bg-white border border-gray-200",
          "text-gray-700 hover:bg-gray-50 shadow-sm font-semibold transition-colors",
          "cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          "px-3.5 py-1.5 text-xs rounded-xl",
          className
        )}
      >
        {loading === fmt ? (
          <SpinnerIcon />
        ) : (
          <DownloadIcon />
        )}
        {loading === fmt ? "Exporting…" : `${label} ${fmt.toUpperCase()}`}
      </button>
    );
  }
 
  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading !== null}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 bg-white border border-gray-200",
          "text-gray-700 hover:bg-gray-50 shadow-sm font-semibold transition-colors",
          "cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          "px-3.5 py-1.5 text-xs rounded-xl",
          className
        )}
      >
        {loading ? <SpinnerIcon /> : <DownloadIcon />}
        {loading ? "Exporting…" : label}
        {!loading && <ChevronIcon open={open} />}
      </button>
 
      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">
          <p className="px-3 pt-2.5 pb-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Download as
          </p>
          {formats.includes("csv") && (
            <button
              onClick={() => handleExport("csv")}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CSVIcon />
              CSV Spreadsheet
            </button>
          )}
          {formats.includes("pdf") && (
            <button
              onClick={() => handleExport("pdf")}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <PDFIcon />
              PDF Report
            </button>
          )}
          <div className="px-3 py-2 border-t border-gray-50">
            <p className="text-[9px] text-gray-400">
      {Array.isArray(data) ? data.length : 0} row{Array.isArray(data) && data.length !== 1 ? "s" : ""} · {resolvedColumns.length} columns
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
 
// ── Icons ─────────────────────────────────────────────────────────────────────
 
function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}
 
function SpinnerIcon() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
 
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className={cn("w-3 h-3 transition-transform duration-150", open && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
 
function CSVIcon() {
  return (
    <span className="w-5 h-5 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[8px] font-extrabold text-emerald-700 leading-none">
      CSV
    </span>
  );
}
 
function PDFIcon() {
  return (
    <span className="w-5 h-5 rounded bg-red-50 border border-red-100 flex items-center justify-center text-[8px] font-extrabold text-red-600 leading-none">
      PDF
    </span>
  );
}
