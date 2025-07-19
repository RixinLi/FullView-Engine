import React, { useRef, useEffect, useState, useMemo } from "react";
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

    // ② 立即初始化 focus + view
    let focus = root;
    let view = [root.x, root.y, root.r * 2];

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
      .attr("pointer-events", (d) => (d.children ? null : "none"));

    // 使用 d3-tip 显示 tooltip
    const tip = d3Tip()
      .attr("class", "d3-tip")
      .style("background", "#222")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "4px")
      .style("font", "12px sans-serif")
      .html((event, d) => `<strong>${d.data.name}</strong>`);

    svg.call(tip);

    // 记录当前 focus 节点
    let currentFocus = focus;

    // 所有节点都可点击，但只允许 zoom 到当前 focus 的直接子节点（一级子节点），否则只高亮和显示 tip
    function updateNodeEvents() {
      node.on("mouseover", null).on("mouseout", null).on("click", null);

      node
        .on("mouseover", function (event, d) {
          // 只允许 hover 当前 focus 的直接子节点
          if (d.parent === currentFocus) {
            d3.select(this).attr("stroke", "#000");
            tip.show(event, d, this);
          }
        })
        .on("mouseout", function (event, d) {
          if (d.parent === currentFocus) {
            d3.select(this).attr("stroke", null);
            tip.hide(event, d, this);
          }
        })
        .on("click", function (event, d) {
          // 只允许 zoom 到当前 focus 的直接子节点
          if (d.parent === currentFocus && d.children) {
            zoom(event, d);
            event.stopPropagation();
          }
          // 其它节点点击只高亮和显示 tip，不做 zoom
        })
        .attr("pointer-events", function (d) {
          // 只允许当前 focus 的直接子节点可交互，其它节点禁用 pointer
          return d.parent === currentFocus ? "all" : "none";
        });
    }

    updateNodeEvents();

    // 点击空白处回到根节点
    svg.on("click", (event) => {
      if (focus !== root) {
        // 清除所有节点的 hover 效果和 tip
        node.attr("stroke", null);
        tip.hide();
        zoom(event, root);
      }
    });

    // 缩放布局调整
    function zoomTo(v) {
      const k = width / v[2];
      view = v;
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
      currentFocus = d;

      const transition = svg
        .transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return (t) => zoomTo(i(t));
        });

      // 动画结束后更新 hover/click 事件
      transition.on("end", updateNodeEvents);
    }

    // 初始聚焦
    zoomTo(view);
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
  // 将 allCompaniesRows 数组转为 { company_code: rowObj } 的 Map
  const allCompaniesRowsMap = useMemo(() => {
    if (!allCompaniesRows) return {};
    const map = {};
    allCompaniesRows.forEach((row) => {
      map[row.company_code] = row;
    });
    return map;
  }, [allCompaniesRows]);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchCompaniesRelationship = async () => {
      try {
        // 直接放入requestForm
        const res = await request.get("company/findAllRelationship");
        if (res.code === "200") {
          const rows = res.data;
          // console.log(rows);

          // 1. 取根节点（或直接 rows[0]）
          const rootNode = rows.find((r) => r.parent === null) || rows[0];

          // 2. 递归映射 code → name，并可选地给叶子节点赋 value
          const mapNode = (node) => ({
            name: allCompaniesRowsMap[node.code]?.company_name || node.code,
            value: node.children.length === 0 ? 1 : undefined, // 可选：统一 1
            children: node.children.map(mapNode),
          });

          setData(mapNode(rootNode));
        }
      } catch (e) {
        alert(e);
      }
    };
    if (allCompaniesRowsMap) {
      fetchCompaniesRelationship();
    }
  }, [allCompaniesRowsMap]);

  return (
    <Box sx={{ paddingLeft: "10%", paddingRight: "10%" }}>
      {data && <ZoomableChart data={data} />}
    </Box>
  );
}
