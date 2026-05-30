"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DonutChartProps {
  options: any;
  series: any;
  height?: number | string;
  width?: number | string;
  className?: string;
}

export default function DonutChart({ options, series, height = "100%", width, className }: DonutChartProps) {
  const safeSeries = Array.isArray(series) ? series : [];
  const safeOptions = options && typeof options === "object" ? options : {};

  if (!safeOptions || Object.keys(safeOptions).length === 0 || safeSeries.length === 0) {
    return <div className={className} style={{ minHeight: typeof height === "number" ? height : undefined }} />;
  }

  return (
    <div className={className}>
      <Chart
        key={JSON.stringify({ type: "donut", h: height, w: width })}
        options={safeOptions}
        series={safeSeries}
        type="donut"
        height={height}
        width={width}
      />
    </div>
  );
}

