import React, { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function CollapsibleDataGrid({
  rows,
  mainFields,
  detailFields,
}) {
  // 记录哪些行被展开
  const [expandedIds, setExpandedIds] = useState([]);

  // 1. 扁平化数据：如果某行被展开，就在它后面插入一个 detail 行
  const flatRows = useMemo(() => {
    return rows.flatMap((r) => {
      const isOpen = expandedIds.includes(r.id);
      // 主行：isDetailRow: false
      const base = { ...r, isDetailRow: false };
      if (!isOpen) return [base];

      // 详情行：id + '-detail' 保证唯一；isDetailRow: true
      const detail = {
        ...r,
        id: `${r.id}-detail`,
        isDetailRow: true,
      };
      return [base, detail];
    });
  }, [rows, expandedIds]);

  // 2. 动态生成 columns
  const columns = useMemo(() => {
    const cols = mainFields.map((field) => ({
      field,
      headerName: field,
      flex: 1,
      // 如果是 detail 行，让这一列跨满所有 main + expand 列
      colSpan: (params) =>
        params.row?.isDetailRow ? mainFields.length + 1 : 1,
      renderCell: (params) => {
        if (params.row?.isDetailRow) {
          // detail 行：一次性渲染所有 detailFields
          return (
            <Box sx={{ p: 1, bgcolor: "#f9f9f9", borderRadius: 1 }}>
              <Typography variant="subtitle2">详情</Typography>
              {detailFields.map((f) => (
                <Typography key={f} variant="body2">
                  {f}: {String(params.row[f] ?? "—")}
                </Typography>
              ))}
            </Box>
          );
        }
        // 主行：正常显示字段值
        return String(params.value);
      },
    }));

    // 最后一列：展开/收起 按钮
    cols.push({
      field: "__expand__",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        if (params.row.isDetailRow) return null;
        const id = params.row.id;
        const open = expandedIds.includes(id);
        return (
          <IconButton
            size="small"
            onClick={() =>
              setExpandedIds((prev) =>
                open ? prev.filter((x) => x !== id) : [...prev, id]
              )
            }
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        );
      },
    });

    return cols;
  }, [mainFields, detailFields, expandedIds]);

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={flatRows}
        columns={columns}
        getRowId={(row) => row.id}
        // detail 行高度随内容撑开，主行保持默认
        getRowHeight={(params) => (params.model.isDetailRow ? "auto" : null)}
        checkboxSelection
        disableSelectionOnClick
        hideFooterSelectedRowCount
      />
    </Box>
  );
}
