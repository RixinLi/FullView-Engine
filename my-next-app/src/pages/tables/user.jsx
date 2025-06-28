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
import "../../css/userTable.css";

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

  // 自动更新form
  useEffect(() => {
    if (row) setForm(row);
  }, [row]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    // dialog设计 标题+内容+操作
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>编辑用户</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="姓名"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="邮箱"
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="职位"
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          select
          margin="dense"
          label="状态"
          name="status"
          value={form.status || ""}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="PENDING">PENDING</MenuItem>
          <MenuItem value="APPROVED">APPROVED</MenuItem>
          <MenuItem value="REJECTED">REJECTED</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={() => onSave(form)}>保存</Button>
      </DialogActions>
    </Dialog>
  );
};

// 分页模型
const paginationModel = { page: 0, pageSize: 5 };

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

  // 动态行数据
  const [rows, setRows] = useState(initialRows);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const startRowEdit = (row) => {
    setEditingRow(row);
    setEditOpen(true);
  };

  const handleDelete = (row) => {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleSave = (updatedRow) => {
    setRows((prev) => {
      return prev.map((r) => (r.id === updatedRow.id ? updatedRow : r));
    });
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
