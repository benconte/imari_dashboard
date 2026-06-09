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

  // ApexCharts queues its entry animations via recursive requestAnimationFrame
  // calls. If the chart unmounts (e.g. navigating away) mid-animation, destroy()
  // nulls its internal element wrappers but the queued frame still runs and
  // throws "Cannot read properties of null (reading 'node')". Disabling
  // animations removes that race.
  const chartOptions = {
    ...safeOptions,
    chart: { ...(safeOptions.chart ?? {}), animations: { ...(safeOptions.chart?.animations ?? {}), enabled: false } },
  };

  return (
    <div className={className}>
      <Chart
        key={JSON.stringify({ type: "donut", h: height, w: width })}
        options={chartOptions}
        series={safeSeries}
        type="donut"
        height={height}
        width={width}
      />
    </div>
  );
}

