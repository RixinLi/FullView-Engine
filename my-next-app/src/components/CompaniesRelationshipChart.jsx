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

function ZoomableChart({ data, width = 600, height = 600 }) {
  const wrapperRef = useRef();
  const [containerWidth, setContainerWidth] = useState(0);

  // 画图
  const svgRef = useRef(null);
  useEffect(() => {
    if (!data) return;

    // 创建打包布局
    const pack = d3.pack().size([width, height]).padding(3);

    // 构造层次数据
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => b.value - a.value);
    pack(root);

    // 配色比例尺
    const color = d3
      .scaleLinear()
      .domain([0, root.height])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    // 选中 SVG 容器，清空旧节点
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("max-width", "100%")
      .style("height", "auto")
      .style("background", color(0))
      .style("cursor", "pointer");
    svg.selectAll("*").remove();

    // 绘制圆圈节点
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
      .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
      .attr("pointer-events", (d) => (d.children ? null : "none"))
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#000");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", null);
      })
      .on("click", (event, d) => {
        if (focus !== d) {
          zoom(event, d);
          event.stopPropagation();
        }
      });

    // 添加文字标签
    const label = svg
      .append("g")
      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .text((d) => d.data.name);

    // 点击空白处回到根节点
    svg.on("click", (event) => zoom(event, root));
    let focus = root;
    let view;

    // 初始聚焦
    zoomTo([root.x, root.y, root.r * 2]);

    // 缩放布局调整
    function zoomTo(v) {
      const k = width / v[2];
      view = v;
      label.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );
      node
        .attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        )
        .attr("r", (d) => d.r * k);
    }

    // 缩放过渡动画
    function zoom(event, d) {
      const focus0 = focus;
      focus = d;

      const transition = svg
        .transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return (t) => zoomTo(i(t));
        });

      label
        .filter(function (d) {
          // 这里的 this 就是真正的 <text> DOM 元素
          const isInline = d3.select(this).style("display") === "inline";
          return d.parent === focus || isInline;
        })
        .transition(transition)
        .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
        .on("start", function (d) {
          if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
          if (d.parent !== focus) this.style.display = "none";
        });
    }
  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      // 不要将 width/height 作为属性写死到这里，留给外部 CSS
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

export default function CompaniesRelationshipChart({ allCompaniesRows }) {
  // 这里麻烦根据allCompaniesRows来生成

  const [data, setData] = useState({ name: "root", children: [] });

  useEffect(() => {
    const fetchCompaniesRelationship = async () => {
      try {
        // 直接放入requestForm
        const res = await request.get("company/findAllRelationship");
        if (res.code === "200") {
          const rows = res.data;
          console.log(rows);

          // 1. 取根节点（或直接 rows[0]）
          const rootNode = rows.find((r) => r.parent === null) || rows[0];

          // 2. 递归映射 code → name，并可选地给叶子节点赋 value
          const mapNode = (node) => ({
            name: node.code,
            value: node.children.length === 0 ? 1 : undefined, // 可选：统一 1
            children: node.children.map(mapNode),
          });

          setData(mapNode(rootNode));
        }
      } catch (e) {
        alert(e);
      }
    };
    if (allCompaniesRows) {
      fetchCompaniesRelationship();
    }
  }, [allCompaniesRows]);

  return (
    <Box sx={{ paddingLeft: "10%", paddingRight: "10%" }}>
      <ZoomableChart data={data} />
    </Box>
  );
}
