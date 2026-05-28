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
  return (
    <div className={className}>
      <Chart options={options} series={series} type="bar" height={height} />
    </div>
  );
}
