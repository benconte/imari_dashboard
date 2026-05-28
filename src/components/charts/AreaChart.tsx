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
  return (
    <div className={className}>
      <Chart options={options} series={series} type="area" height={height} />
    </div>
  );
}
