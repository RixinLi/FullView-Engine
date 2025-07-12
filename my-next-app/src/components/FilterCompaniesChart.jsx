import React, { useRef, useEffect, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";
import "../css/filterCompaniesChart.css";
import * as d3 from "d3";
import request from "../utils/request";
import {
  Box,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";

// 直接作图的组件
function ColumnChart({
  data,
  height = 300,
  margin = { top: 20, right: 20, bottom: 30, left: 40 },
}) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [containerWidth, setContainerWidth] = useState(0);

  // 监听容器宽度
  useEffect(() => {
    const update = () => setContainerWidth(wrapperRef.current.clientWidth);
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!containerWidth || !data.length) return;

    // 1. 测量最长标签宽度
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = "12px sans-serif"; // 与 SVG 中文本样式对应
    const maxLabelWidth = d3.max(
      data,
      (d) => ctx.measureText(d.category).width
    );

    // 2. 最小柱宽 + 间距
    const barMinWidth = maxLabelWidth + 10;

    // 3. 真实图表宽度，超出时可滚动
    const chartWidth = Math.max(
      containerWidth,
      data.length * barMinWidth + margin.left + margin.right
    );
    const innerW = chartWidth - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    // 4. 绘图
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", chartWidth).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // x, y 轴刻度
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, innerW])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([innerH, 0]);

    // X 轴：不旋转，强制 nowrap
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("white-space", "nowrap");

    // Y 轴
    g.append("g").call(d3.axisLeft(y));

    // 柱状图
    g.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.category))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerH - y(d.value))
      .attr("fill", "steelblue");
  }, [data, containerWidth, height, margin]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height, overflowX: "auto" }}>
      <svg ref={svgRef} />
    </div>
  );
}

// filter和dimension的组件

// 普通下拉组件
function SingleSelect({ label, value, options, onChange }) {
  return (
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={onChange}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// 多选下拉组件
function MultiSelect({ label, value, options, onChange }) {
  return (
    <FormControl sx={{ minWidth: 180 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        label={label}
        value={value}
        onChange={onChange}
        renderValue={(selected) => selected.join(", ")}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// 搜索/提示选择组件
function SearchSelect({ label, value, options, onChange }) {
  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value}
      onChange={(e, newVal) => onChange(newVal)}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      sx={{ minWidth: 200 }}
    />
  );
}

export default function FilterCompaniesChart({ allCompaniesRows }) {
  // 遍历 allCompaniesRow，建立 country, city, level 的集合
  const countrySet = new Set();
  const citySet = new Set();
  const levelSet = new Set();
  if (Array.isArray(allCompaniesRows)) {
    allCompaniesRows.forEach((row) => {
      if (row.country) countrySet.add(row.country);
      if (row.city) citySet.add(row.city);
      if (row.level !== undefined) levelSet.add(row.level);
    });
  }

  const countryOptions = Array.from(countrySet)
    .map((c) => ({
      value: c,
      label: c,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const cityOptions = Array.from(citySet)
    .map((c) => ({ value: c, label: c }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const levelOptions = Array.from(levelSet)
    .map((l) => ({
      value: l,
      label: `Level ${l}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const dummyData = [
    { category: "A", value: 30 },
    { category: "B", value: 80 },
  ];

  const [data, setData] = useState(dummyData);

  // 在这上面弄一个fileter Bar
  // 先是dimension
  // const [dimension, setDimension] = useState("country");
  // 直接整合为requestForm
  const [requestForm, setRequestFrom] = useState({
    dimension: "country",
    filter: { level: [], country: [], city: [] },
  });

  // 表单更新
  const handleDimensionChange = (e) =>
    setRequestFrom((s) => ({ ...s, dimension: e.target.value }));
  const handleFilterChange = (field) => (eOrVal) => {
    // 这里的实现存在疑问
    const val = eOrVal?.target?.value ?? eOrVal;
    setRequestFrom((s) => ({
      ...s,
      filter: { ...s.filter, [field]: val },
    }));
  };

  useEffect(() => {
    const fetchCompaniesRows = async () => {
      try {
        // 直接放入requestForm
        const res = await request.post("company/findFilter", requestForm);
        if (res.code === "200") {
          const rows = res.data.data;
          const chartData = Object.entries(rows)
            .map(([category, items]) => ({
              category,
              value: items.length,
            }))
            .sort((a, b) => a.category.localeCompare(b.category));
          setData(chartData);
        }
      } catch (e) {
        alert(e);
      }
    };
    if (requestForm) {
      fetchCompaniesRows();
    }
  }, [requestForm]);

  return (
    <Box p={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <SingleSelect
          label="Dimension"
          value={requestForm.dimension}
          options={[
            { value: "city", label: "City" },
            { value: "country", label: "Country" },
            { value: "level", label: "Level" },
          ]}
          onChange={handleDimensionChange}
        />

        <MultiSelect
          label="Level"
          value={requestForm.filter.level}
          options={levelOptions}
          onChange={handleFilterChange("level")}
        />
        <MultiSelect
          label="Country"
          value={requestForm.filter.country}
          options={countryOptions}
          onChange={handleFilterChange("country")}
        />
        <MultiSelect
          label="City"
          value={requestForm.filter.city}
          options={cityOptions}
          onChange={handleFilterChange("city")}
        />

        <Button
          variant="contained"
          onClick={() => {
            /* 可另附手动触发 */
            setRequestFrom((s) => ({
              dimension: "country",
              filter: { level: [], country: [], city: [] },
            }));
          }}
        >
          reset
        </Button>
      </Stack>
      <ColumnChart data={data} />
    </Box>
  );
}
