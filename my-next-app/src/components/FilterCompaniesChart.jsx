import React, { useRef, useEffect, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";
import "../css/filterCompaniesChart.css";
import * as d3 from "d3";
import request from "../utils/request";

function ColumnChart({
  data,
  width = 600,
  height = 400,
  margin = { top: 20, right: 20, bottom: 30, left: 40 },
}) {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 1. 只有浏览器里，才测量并绑定 resize
  useEffect(() => {
    function updateSize() {
      setDimensions({
        width: svgRef.current.parentElement.clientWidth,
        height: svgRef.current.parentElement.clientHeight,
      });
    }

    window.addEventListener("resize", updateSize);
    updateSize(); // 初始调用一次

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 2. 绘图逻辑也在 effect 里，dimensions 改变时触发
  useEffect(() => {
    if (dimensions.width === 0) return; // SSR 或未测量前跳过

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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

    // 轴
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x));
    g.append("g").call(d3.axisLeft(y));

    // 柱
    g.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.category))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerH - y(d.value))
      .attr("fill", "steelblue");
  }, [data, dimensions]);

  // SSR 时 dimensions.width=0，先渲染个空占位
  return (
    <div style={{ width: "100%", height: 300 }}>
      <svg ref={svgRef} />
    </div>
  );
}

export default function FilterCompaniesChart() {
  const dummyData = [
    { category: "A", value: 30 },
    { category: "B", value: 80 },
    { category: "C", value: 45 },
    { category: "D", value: 60 },
    { category: "E", value: 20 },
    { category: "F", value: 90 },
    { category: "G", value: 50 },
  ];

  const [data, setData] = useState(dummyData);

  // 在这上面弄一个fileter Bar
  // 先是dimension
  const [dimension, setDimension] = useState("country");

  useEffect(() => {
    const fetchCompaniesRows = async () => {
      console.log("fetching");
      try {
        const res = await request.post("company/findFilter", {
          dimension: dimension, // 维度：city
          // filter: { level: [1, 2, 3] }, // 过滤条件
        });
        if (res.code === "200") {
          const rows = res.data.data;
          console.log(rows);
          const chartData = Object.entries(rows).map(([category, items]) => ({
            category,
            value: items.length,
          }));
          setData(chartData);
        }
      } catch (e) {
        alert(e);
      }
    };
    if (dimension) {
      fetchCompaniesRows();
    }
  }, [dimension]);

  // useEffect(() => {
  //   const fetchCompaniesRows = async () => {
  //     // console.log("fetched");
  //     try {
  //       const res = await request.get("company/findAll");
  //       if (res.code === "200") {
  //         // console.log(res);
  //         setRows(res.data);
  //         setFetched(true);
  //       }
  //     } catch (e) {
  //       alert(e);
  //     }
  //   };
  //   if (!fetched) fetchCompaniesRows();
  // }, [fetched]);

  return <ColumnChart data={data} />;
}
