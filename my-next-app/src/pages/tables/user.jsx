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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import request from "../../utils/request";

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
    { label: "姓名", name: "name", required: true },
    { label: "邮箱", name: "email", required: true },
    { label: "职位", name: "title", required: true },
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
        <TextField
          required
          select
          margin="dense"
          label="状态"
          name="status"
          value={form.status || ""}
          onChange={handleChange}
          error={errors.status}
          helperText={errors.status ? "状态不能为空" : ""}
          fullWidth
        >
          <MenuItem value="PENDING">PENDING</MenuItem>
          <MenuItem value="APPROVED">APPROVED</MenuItem>
          <MenuItem value="REJECTED">REJECTED</MenuItem>
        </TextField>
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

export default function UserTable() {
  // 列表标题
  const columns = [
    { field: "username", headerName: "用户名", width: 170 },
    { field: "name", headerName: "姓名", width: 170 },
    { field: "avatar", headerName: "头像", width: 130 },
    { field: "email", headerName: "邮箱", width: 200 },
    { field: "title", headerName: "职位", width: 130 },
    {
      field: "status",
      headerName: "状态",
      description: "This column has a filter but is not sortable.",
      sortable: false,
      width: 120,
      filterable: true, // ✅ 开启过滤
      type: "singleSelect", // ✅ 使用下拉选择过滤器
      valueOptions: ["PENDING", "APPROVED", "REJECTED"], // 可选状态
      renderCell: (params) => {
        // 你可以自定义显示
        const status = params.value;
        const color =
          status === "PENDING"
            ? "orange"
            : status === "APPROVED"
            ? "green"
            : "red";
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      field: "actions",
      headerName: "操作",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionMenu
          row={params.row}
          startRowEdit={startRowEdit}
          handleRowDelete={handleDelete}
        />
      ),
    },
  ];

  // 基础测试行数据
  const initialRows = [
    {
      id: "5e476ac0f07a48358eb26152bac2870b",
      username: "lrxlouis123",
      name: "lrxlouis123",
      title: "CEO",
      email: "lrxlouis123@google.com",
      status: "APPROVED",
    },
  ];

  //分页模型
  const paginationModel = { page: 0, pageSize: 5 };

  // 动态行数据
  const [rows, setRows] = useState(initialRows);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchUserRows = async () => {
      // console.log("getting");
      try {
        const res = await request.get("user/findAll");
        if (res.code === "200") {
          setRows(res.data);
          setFetched(true);
        }
      } catch (e) {
        alert(e);
      }
    };
    if (!fetched) fetchUserRows();
  }, [fetched]);

  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const startRowEdit = (row) => {
    setEditingRow(row);
    setEditOpen(true);
  };

  const handleDelete = async (row) => {
    try {
      const delRes = await request.delete("user/delete?id=" + row.id);
      if (delRes.code === "200") {
        setRows((prev) => prev.filter((r) => r.id !== row.id));
      }
    } catch (e) {
      alert(e);
    }
    setFetched(false);
  };

  const handleSave = async (updatedRow) => {
    try {
      const saveRes = await request.patch("user/update", updatedRow);
      if (saveRes === "200") {
        setRows((prev) => {
          return prev.map((r) => (r.id === updatedRow.id ? updatedRow : r));
        });
      }
    } catch (e) {
      alert(e);
    }
    setFetched(false);
    setEditOpen(false);
  };

  return (
    <Box className="css-Box">
      <Paper>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          className="css-DataGrid"
          sx={{ border: 0 }}
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
UserTable.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
