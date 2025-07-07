import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useMemo } from "react";
import { useRef, useEffect, useState, useLayoutEffect } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CompaniesLevelChart({ companies = [], height = 200 }) {
  // 构建[年->新增数]映射
  // 1) companies 未定义 或 不是数组，直接返回一个占位
  if (!Array.isArray(companies) || companies.length === 0) {
    return <div>Loading…</div>;
  }

  // 2. 计算 years & cumulative
  const levelMap = useMemo(() => {
    const levelMap = {};
    companies.forEach(({ level }) => {
      const y = "Level " + Number(level);
      levelMap[y] = (levelMap[y] || 0) + 1;
    });

    return levelMap;
  }, [companies]);

  // 扇区名称
  const labels = useMemo(
    () => Object.keys(levelMap).sort((a, b) => a - b), // 可选：按 level 排序
    [levelMap]
  );

  // 对应每个扇区的数值
  const series = useMemo(
    () => labels.map((level) => levelMap[level]),
    [labels, levelMap]
  );

  const options = useMemo(
    () => ({
      chart: { type: "donut" },
      labels, // 来自上一步
      legend: { position: "right" },
      colors: ["#1976d2", "#9c27b0", "#ffa000", "#4caf50", "#f44336"],
    }),
    [labels, series]
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
        <Chart options={options} series={series} type="donut" height="100%" />
      )}
    </Box>
  );
}
