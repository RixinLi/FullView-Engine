import {
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import DashboardLayout from "..";
import "../../css/table.css";

import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Collapse,
} from "@mui/material";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import request from "../../utils/request";
import CollapsibleDataGrid from "../../utils/CollapsibleDataGrid";

// 编辑操作菜单组件
const ActionMenu = ({ row, startRowEdit, handleRowDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const hanldeClose = () => setAnchorEl(null);

  const handleEdit = () => {
    startRowEdit(row);
    hanldeClose();
  };
  const handleDelete = () => {
    handleRowDelete(row);
    hanldeClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={hanldeClose}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="编辑" />
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="删除" />
        </MenuItem>
      </Menu>
    </>
  );
};
// 编辑Dialog组件
const EditDialog = ({ open, onClose, row, onSave }) => {
  // 建立form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // 自动更新form
  useEffect(() => {
    if (row) setForm(row);
    setErrors({});
  }, [row]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: !value.trim() }));
  };

  // 字段
  const textFields = [
    { label: "公司名", name: "company_name", required: true },
    { label: "等级", name: "level", required: true },
    { label: "国家", name: "country", required: true },
    { label: "城市", name: "city", required: true },
    { label: "创始日期", name: "founded_year", required: true },
    { label: "年盈利额", name: "annual_revenue", required: true },
    { label: "员工数量", name: "employees", required: true },
  ];

  return (
    // dialog设计 标题+内容+操作
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>编辑用户</DialogTitle>
      <DialogContent>
        {textFields.map((field) => (
          <TextField
            key={field.name}
            required={field.required}
            margin="dense"
            label={field.label}
            name={field.name}
            value={form[field.name] || ""}
            onChange={handleChange}
            error={errors[field.name]}
            helperText={errors[field.name] ? `${field.label}不能为空` : ""}
            fullWidth
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={() => onSave(form)}
          disabled={Object.values(errors).some((v) => v)}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default function CompaniesTable() {
  // 列表标题
  const columns = [
    // 额外列
    {
      field: "expand",
      headerName: "",
      width: 55,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        if (params.row.isSubRow) return null;
        const isExpanded = expandedRowIds.includes(params.row.company_code);
        return (
          <IconButton
            size="small"
            onClick={() => {
              setExpandedRowIds((prev) =>
                isExpanded
                  ? prev.filter(
                      (company_code) => company_code !== params.row.company_code
                    )
                  : [...prev, params.row.company_code]
              );
            }}
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        );
      },
    },
    // 主列
    {
      field: "company_name",
      headerName: "公司名",
      width: 300,
      renderCell: (params) => {
        if (params.row.isSubRow) {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center", // 垂直居中
                width: "100%", // 占满整个单元格
                height: "100%", // 占满整个单元格
              }}
            >
              <Typography variant="caption" fontSize={14}>
                城市: {params.row.city}
              </Typography>
            </Box>
          );
        }
        return params.value;
      },
    },
    {
      field: "level",
      headerName: "等级",
      width: 150,
      renderCell: (params) => {
        if (params.row.isSubRow) {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center", // 垂直居中
                width: "100%", // 占满整个单元格
                height: "100%", // 占满整个单元格
              }}
            >
              <Typography variant="caption" fontSize={14}>
                创立日期：{params.row.founded_year}
              </Typography>
            </Box>
          );
        }
        return params.value;
      },
    },
    {
      field: "country",
      headerName: "国家",
      width: 220,
      renderCell: (params) => {
        if (params.row.isSubRow) {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center", // 垂直居中
                width: "100%", // 占满整个单元格
                height: "100%", // 占满整个单元格
              }}
            >
              <Typography variant="caption" fontSize={14}>
                年盈利额：
                {params.row.annual_revenue}
              </Typography>
            </Box>
          );
        }
        return params.value;
      },
    },
    {
      field: "profitability",
      headerName: "盈利效率",
      description: "This column has a filter but is not sortable.",
      width: 200,
      renderCell: (params) => {
        // 你可以自定义显示
        if (params.row.isSubRow) {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center", // 垂直居中
                width: "100%", // 占满整个单元格
                height: "100%", // 占满整个单元格
              }}
            >
              <Typography variant="caption" fontSize={14}>
                员工数量：{params.row.employees}
              </Typography>
            </Box>
          );
        }
        const { annual_revenue, employees } = params.row;
        const profitability = annual_revenue / employees;
        const color = profitability >= 100 ? "green" : "red";
        return <span style={{ color }}>{profitability}</span>;
      },
    },
    {
      field: "actions",
      headerName: "操作",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        // 子行直接不渲染任何按钮
        if (params.row.isSubRow) {
          return null;
        }
        return (
          <ActionMenu
            row={params.row}
            startRowEdit={startRowEdit}
            handleRowDelete={handleDelete}
          />
        );
      },
    },
  ];

  // 基础测试行数据
  const initialRows = [
    {
      // 这里要把字段转成company_code
      company_code: "C0",
      company_name: "Rodriguez, Figueroa and Sanchez",
      level: "1",
      country: "China",
      city: "Beijing",
      founded_year: "1994",
      annual_revenue: 1083726,
      employees: 2867,
    },
  ];

  //分页模型
  const paginationModel = { page: 0, pageSize: 5 };

  // 动态行数据
  const [rows, setRows] = useState(initialRows);
  const [fetched, setFetched] = useState(false);

  // useEffect获取数据
  useEffect(() => {
    const fetchCompaniesRows = async () => {
      // console.log("fetched");
      try {
        const res = await request.get("company/findAll");
        if (res.code === "200") {
          // console.log(res);
          setRows(res.data);
          setFetched(true);
        }
      } catch (e) {
        alert(e);
      }
    };
    if (!fetched) fetchCompaniesRows();
  }, [fetched]);

  const startRowEdit = (row) => {
    setEditingRow(row);
    setEditOpen(true);
  };

  const handleDelete = async (row) => {
    try {
      const delRes = await request.delete(
        "company/deleteOne?company_code=" + row.company_code
      );
      if (delRes.code === "200") {
        setRows((prev) =>
          prev.filter((r) => r.company_code !== row.company_code)
        );
      }
    } catch (e) {
      alert(e);
    }
    setFetched(false);
  };

  const handleSave = async (updatedRow) => {
    try {
      const saveRes = await request.patch("company/updateOne", updatedRow);
      if (saveRes === "200") {
        setRows((prev) => {
          return prev.map((r) =>
            r.company_code === updatedRow.company_code ? updatedRow : r
          );
        });
      }
    } catch (e) {
      alert(e);
    }
    setFetched(false);
    setEditOpen(false);
  };

  // 控制dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // 扩展行生成逻辑
  const [expandedRowIds, setExpandedRowIds] = useState([]);
  const [enhancedRows, setEnhancedRows] = useState([]);

  useEffect(() => {
    setEnhancedRows(
      rows.flatMap((row) => {
        const expanded = expandedRowIds.includes(row.company_code);
        return expanded
          ? [
              row,
              {
                ...row,
                company_code: `${row.company_code}-detail`,
                isSubRow: true,
              },
            ]
          : [row];
      })
    );
  }, [rows, expandedRowIds]);

  return (
    <Box className="css-Box">
      <Paper>
        <DataGrid
          rows={enhancedRows}
          columns={columns}
          getRowId={(row) => row.company_code}
          getRowHeight={(params) => (params.model.isSubRow ? "auto" : null)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          // 子行不允许被选中（复选框变成 disabled）
          isRowSelectable={(params) => !params.row.isSubRow}
          disableSelectionOnClick
          className="css-DataGrid"
          getRowClassName={(params) =>
            // 同理给复选框列上一层父 row-class
            params.row.isSubRow ? "subrow-row" : ""
          }
          sx={{
            // 隐藏子行上的复选框（但占位）
            "& .subrow-row .MuiDataGrid-cellCheckbox, .subrow-cell .MuiDataGrid-cellContent":
              {
                visibility: "hidden",
              },
          }}
        />
        <EditDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          row={editingRow}
          onSave={handleSave}
        />
      </Paper>
    </Box>
  );
}

// Next.js 会在渲染前，调用这里的 getLayout
CompaniesTable.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
