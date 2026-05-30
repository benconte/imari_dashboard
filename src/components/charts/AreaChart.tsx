"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AreaChartProps {
  options: any;
  series: any;
  height?: number | string;
  className?: string;
}

export default function AreaChart({ options, series, height = "100%", className }: AreaChartProps) {
  const safeSeries = Array.isArray(series) ? series : [];
  const safeOptions = options && typeof options === "object" ? options : {};

  // Prevent ApexCharts from initializing with missing/empty config during React mount.
  if (!safeOptions || Object.keys(safeOptions).length === 0 || safeSeries.length === 0) {
    return <div className={className} style={{ minHeight: typeof height === "number" ? height : undefined }} />;
  }

  return (
    <div className={className}>
      <Chart key={JSON.stringify({ type: "area", h: height })} options={safeOptions} series={safeSeries} type="area" height={height} />
    </div>
  );
}

