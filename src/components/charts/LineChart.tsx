"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LineChartProps {
  options: any;
  series: any;
  height?: number | string;
  className?: string;
}

export default function LineChart({ options, series, height = "100%", className }: LineChartProps) {
  return (
    <div className={className}>
      <Chart options={options} series={series} type="line" height={height} />
    </div>
  );
}
