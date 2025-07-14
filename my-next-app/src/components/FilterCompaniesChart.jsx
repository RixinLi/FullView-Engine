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
  Checkbox,
  Typography,
  Slider,
} from "@mui/material";
import d3Tip from "d3-tip";

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

    // 1. 初始化tip
    const tip = d3Tip()
      .attr("class", "d3-tip")
      .offset([-5, 0])
      .html((d) => `<strong>${d.category}</strong>: ${d.value}`);

    // 2. 在 svg 中挂载tip
    svg.call(tip);

    // 柱状图
    g.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.category))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerH - y(d.value))
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        // 把 datum 和当前元素传给 show
        tip.show(d, this);
      })
      .on("mouseout", function (event, d) {
        tip.hide(d, this);
      });
  }, [data, containerWidth, height, margin]);

  // 让下方的 scroll bar 不遮挡 x 轴标签：给 svg 增加底部 padding/margin
  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        // height: height + 32, // 增加高度让 x 轴标签和滚动条不重叠
        overflowX: "auto",
        overflowY: "hidden", // 禁止垂直滚动
        // paddingBottom: 32, // 给底部留空间，避免滚动条遮挡 x 轴标签
        boxSizing: "border-box",
      }}
    >
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
  const [search, setSearch] = useState("");
  // 过滤 options
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormControl sx={{ minWidth: 180, maxWidth: 240 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        label={label}
        value={value}
        onChange={onChange}
        renderValue={(selected) =>
          options
            .filter((opt) => selected.includes(opt.value))
            .map((opt) => opt.label)
            .join(", ")
        }
        MenuProps={{
          PaperProps: {
            style: { maxHeight: 300 },
          },
          MenuListProps: {
            style: { maxHeight: 260, overflowY: "auto" },
          },
        }}
      >
        {/* 用 Box 放搜索框，不会被视为选项 */}
        <Box sx={{ px: 2, py: 1 }}>
          <TextField
            placeholder={`search ${label}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            // 禁止回车和点击冒泡，避免触发选中
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
        {filteredOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Checkbox checked={value.indexOf(opt.value) > -1} />
              {opt.label}
            </Stack>
          </MenuItem>
        ))}
        {filteredOptions.length === 0 && <MenuItem disabled>无匹配项</MenuItem>}
      </Select>
    </FormControl>
  );
}

// slider+输入框用于min,max的输入
function RangeSlider({
  label = "范围选择",
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  unit = "", // 可选单位，如 "$" 或 "人"
}) {
  const handleSliderChange = (_, newValue) => {
    onChange({ min: newValue[0], max: newValue[1] });
  };

  const handleInputChange = (key) => (e) => {
    const newVal = Number(e.target.value);
    onChange({
      min: key === "min" ? newVal : value.min,
      max: key === "max" ? newVal : value.max,
    });
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
        {label}
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label={`min ${unit}`}
          type="number"
          value={value.min}
          onChange={handleInputChange("min")}
          fullWidth
        />
        <TextField
          label={`max ${unit}`}
          type="number"
          value={value.max}
          onChange={handleInputChange("max")}
          fullWidth
        />
      </Box>

      <Slider
        value={[value.min, value.max]}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={min}
        max={max}
        step={step}
      />
    </Box>
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

  // 这里麻烦根据allCompaniesRows来生成

  const dummyData = [
    { category: "A", value: 30 },
    { category: "B", value: 80 },
  ];

  const [data, setData] = useState(dummyData);

  // 在这上面弄一个fileter Bar
  // 先是dimension
  // const [dimension, setDimension] = useState("country");
  // 直接整合为requestForm
  // 1. 先给 state 设成 null 或半初始化
  const [requestForm, setRequestForm] = useState(null);
  const [foundedYearMin, setFoundedYearMin] = useState(0);
  const [foundedYearMax, setFoundedYearMax] = useState(0);
  const [annualRevenueMin, setAnnualRevenueMin] = useState(0);
  const [annualRevenueMax, setAnnualRevenueMax] = useState(0);
  const [employeesMin, setEmployeesMin] = useState(0);
  const [employeesMax, setEmployeesMax] = useState(0);

  // 2. 数据变化后，补全 state
  useEffect(() => {
    if (!allCompaniesRows?.length) return;

    let aMin = Infinity,
      aMax = -Infinity;
    let eMin = Infinity,
      eMax = -Infinity;
    let yMin = Infinity,
      yMax = -Infinity;

    allCompaniesRows.forEach((row) => {
      aMin = Math.min(aMin, Number(row.annual_revenue));
      aMax = Math.max(aMax, Number(row.annual_revenue));
      eMin = Math.min(eMin, row.employees);
      eMax = Math.max(eMax, row.employees);
      yMin = Math.min(yMin, row.founded_year);
      yMax = Math.max(yMax, row.founded_year);
    });

    // 给一个兜底
    if (aMin === Infinity) aMin = aMax = 0;
    if (eMin === Infinity) eMin = eMax = 0;
    if (yMin === Infinity) yMin = yMax = 0;

    setFoundedYearMin(yMin);
    setFoundedYearMax(yMax);
    setAnnualRevenueMin(aMin);
    setAnnualRevenueMax(aMax);
    setEmployeesMin(eMin);
    setEmployeesMax(eMax);

    setRequestForm({
      dimension: "country",
      filter: {
        level: [],
        country: [],
        city: [],
        founded_year: { start: yMin, end: yMax },
        annual_revenue: { min: aMin, max: aMax },
        employees: { min: eMin, max: eMax },
      },
    });
  }, [allCompaniesRows]);

  // 表单更新
  const handleDimensionChange = (e) =>
    setRequestForm((s) => ({ ...s, dimension: e.target.value }));
  const handleFilterChange = (field) => (eOrVal) => {
    // 这里的实现存在疑问
    const val = eOrVal?.target?.value ?? eOrVal;
    setRequestForm((s) => ({
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
          // 保证 chartData 至少有一个空数据项，避免图表崩溃
          if (!rows || Object.keys(rows).length === 0) {
            setData([{ category: "None Data", value: 0 }]);
          } else {
            const chartData = Object.entries(rows)
              .map(([category, items]) => ({
                category,
                value: items.length,
              }))
              .sort((a, b) => a.category.localeCompare(b.category));
            setData(chartData);
          }
        }
      } catch (e) {
        alert(e);
      }
    };
    if (requestForm) {
      fetchCompaniesRows();
    }
  }, [requestForm]);

  // 3. 渲染时注意 requestForm 可能为 null
  if (!requestForm) return <div>Loading…</div>;
  // 映射 founded_year 的字段为 min/max
  const foundedYearValue = {
    min: requestForm.filter.founded_year.start,
    max: requestForm.filter.founded_year.end,
  };
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
            setRequestForm((s) => ({
              dimension: "country",
              filter: {
                level: [],
                country: [],
                city: [],
                founded_year: { start: foundedYearMin, end: foundedYearMax },
                annual_revenue: {
                  min: annualRevenueMin,
                  max: annualRevenueMax,
                },
                employees: { min: employeesMin, max: employeesMax },
              },
            }));
          }}
        >
          reset
        </Button>
      </Stack>
      <Box my={2} /> {/* 添加垂直间距 */}
      <Stack direction="row" spacing={2} alignItems="center">
        <RangeSlider
          label="annual_revenue"
          min={annualRevenueMin}
          max={annualRevenueMax}
          step={1000}
          unit="$"
          value={requestForm.filter.annual_revenue}
          onChange={(newVal) =>
            setRequestForm((prev) => ({
              ...prev,
              filter: {
                ...prev.filter,
                annual_revenue: newVal,
              },
            }))
          }
        />
        <RangeSlider
          label="founded_year"
          min={foundedYearMin}
          max={foundedYearMax}
          step={1}
          unit="year"
          value={foundedYearValue}
          onChange={(newVal) =>
            setRequestForm((prev) => ({
              ...prev,
              filter: {
                ...prev.filter,
                founded_year: {
                  start: newVal.min,
                  end: newVal.max,
                },
              },
            }))
          }
        />
        <RangeSlider
          label="employees"
          min={employeesMin}
          max={employeesMax}
          step={100}
          unit="$"
          value={requestForm.filter.employees}
          onChange={(newVal) =>
            setRequestForm((prev) => ({
              ...prev,
              filter: {
                ...prev.filter,
                employees: newVal,
              },
            }))
          }
        />
      </Stack>
      <Box flexGrow={1}>
        <ColumnChart data={data} />
      </Box>
    </Box>
  );
}
