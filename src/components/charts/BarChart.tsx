"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BarChartProps {
  options: any;
  series: any;
  height?: number | string;
  className?: string;
}

export default function BarChart({ options, series, height = "100%", className }: BarChartProps) {
  const safeSeries = Array.isArray(series) ? series : [];
  const safeOptions = options && typeof options === "object" ? options : {};

  if (!safeOptions || Object.keys(safeOptions).length === 0 || safeSeries.length === 0) {
    return <div className={className} style={{ minHeight: typeof height === "number" ? height : undefined }} />;
  }

  return (
    <div className={className}>
      <Chart key={JSON.stringify({ type: "bar", h: height })} options={safeOptions} series={safeSeries} type="bar" height={height} />
    </div>
  );
}


