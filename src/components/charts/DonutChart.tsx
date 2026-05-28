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
  return (
    <div className={className}>
      <Chart options={options} series={series} type="donut" height={height} width={width} />
    </div>
  );
}
