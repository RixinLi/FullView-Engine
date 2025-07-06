import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useMemo } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CumulativeCompaniesChart({ companies = [] }) {
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
    () => [{ name: "累计公司数", data: cumulative }],
    [cumulative]
  );

  const options = useMemo(
    () => ({
      chart: {
        id: "total-companies",
        toolbar: { show: false },
        animations: { easing: "easeinout", speed: 800 },
        events: {
          click: (_e, _ctx, { dataPointIndex }) => {
            const y = years[dataPointIndex];
            const c = cumulative[dataPointIndex];
            alert(`年份 ${y} 累计 ${c} 家公司`);
          },
        },
      },
      xaxis: {
        categories: years,
        title: { text: "year" },
        tickPlacement: "on",
        tickAmount: 20,
      },
      yaxis: {
        labels: { formatter: (v) => v.toLocaleString() },
        title: { text: "Total Companies" },
      },
      // stroke: { curve: "smooth", width: 2 },
      grid: {
        borderColor: "#eee",
        row: { colors: ["#f9f9f9", "transparent"] },
      },
      tooltip: { theme: "dark", y: { formatter: (v) => `${v} 家` } },
      markers: {
        size: 0,
        hover: { sizeOffset: 4 },
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: cumulative.length - 1,
            fillColor: "#6366F1",
            strokeColor: "#fff",
            size: 6,
          },
        ],
      },
      // responsive: [
      //   {
      //     breakpoint: 600,
      //     options: { markers: { size: 3 } },
      //   },
      // ],
    }),
    [years, cumulative]
  );

  return (
    // 使用box做限制
    <Box sx={{ height: 400 }}>
      {Array.isArray(companies) && (
        <Chart options={options} series={series} type="line" height="100%" />
      )}
    </Box>
  );
}
