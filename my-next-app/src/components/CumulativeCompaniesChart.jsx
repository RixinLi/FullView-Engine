import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useMemo } from "react";
import { useRef, useEffect, useState, useLayoutEffect } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CumulativeCompaniesChart({
  companies = [],
  height = 400,
}) {
  // 构建[年->新增数]映射
  // 1) companies 未定义 或 不是数组，直接返回一个占位
  if (!Array.isArray(companies) || companies.length === 0) {
    return <div>Loading…</div>;
  }

  // 2. 计算 years & cumulative
  const { years, cumulative } = useMemo(() => {
    const map = {};
    companies.forEach(({ founded_year }) => {
      const y = Number(founded_year);
      map[y] = (map[y] || 0) + 1;
    });

    const yrs = Object.keys(map)
      .map(Number)
      .sort((a, b) => a - b);
    const cum = [];
    yrs.reduce((sum, y) => {
      const next = sum + map[y];
      cum.push(next);
      return next;
    }, 0);

    return { years: yrs, cumulative: cum };
  }, [companies]);

  // 3. 构建 options & series
  const series = useMemo(
    () => [{ name: "accumulated companies", data: cumulative }],
    [cumulative]
  );

  // 1. 生成 discrete 数组
  const discreteMarkers = [];
  for (let i = 0; i < cumulative.length; i += 10) {
    discreteMarkers.push({
      seriesIndex: 0,
      dataPointIndex: i,
      fillColor: "#6366F1",
      strokeColor: "#fff",
      size: 6,
    });
  }

  // 可选：末尾保证一个 marker
  const lastIdx = cumulative.length - 1;
  if (lastIdx % 10 !== 0) {
    discreteMarkers.push({
      seriesIndex: 0,
      dataPointIndex: lastIdx,
      fillColor: "#6366F1",
      strokeColor: "#fff",
      size: 6,
    });
  }

  const options = useMemo(
    () => ({
      chart: {
        id: "total-companies",
        type: "line",
        offsetX: 0,
        toolbar: { show: false },
        animations: { easing: "easeinout", speed: 600 },
        // events: {
        //   click: (_e, _ctx, { dataPointIndex }) => {
        //     const y = years[dataPointIndex];
        //     const c = cumulative[dataPointIndex];
        //     alert(`year ${y} accumulate ${c} companies`);
        //   },
        // },
      },
      xaxis: {
        categories: years,
        tickPlacement: "on",
        tickAmount: 12,
        // min: 0,
        // max: cumulative.length - 1,
      },
      yaxis: {
        labels: { formatter: (v) => v.toLocaleString() },
      },
      // stroke: { curve: "smooth", width: 2 },
      grid: {
        borderColor: "#eee",
        row: { colors: ["#f9f9f9", "transparent"] },
      },
      tooltip: { theme: "dark", y: { formatter: (v) => `${v}` } },
      markers: {
        size: 0,
        hover: { sizeOffset: 4 },
        discrete: discreteMarkers,
      },
    }),
    [years, cumulative]
  );

  return (
    // 使用box做限制
    <Box
      sx={{
        flex: 1,
        height: height,
        "& .apexcharts-canvas": {
          width: "100% !important",
          maxWidth: "none !important",
        },
      }}
    >
      {Array.isArray(companies) && (
        <Chart options={options} series={series} type="line" height="100%" />
      )}
    </Box>
  );
}
