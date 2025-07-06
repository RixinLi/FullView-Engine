import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LinearChart = ({ data, width = 600, height = 300 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // 1. 选择并清空 SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 2. 定义内边距与绘图区大小
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    // 3. 创建刻度尺
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerW]); // 线性比例尺：连续定量映射到像素

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([innerH, 0]);

    // 4. 添加分组 g，并移动到内边距起点
    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 5. 绘制坐标轴
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale));
    g.append("g").call(d3.axisLeft(yScale));

    // 6. 定义折线生成器
    const lineGenerator = d3
      .line()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    // 7. 绘制折线路径
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    // 8. 绘制数据点
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (_, i) => xScale(i))
      .attr("cy", (d) => yScale(d))
      .attr("r", 4)
      .attr("fill", "#69b3a2");
  }, [data, width, height]);

  return <svg ref={svgRef} />;
};

export default LinearChart;
