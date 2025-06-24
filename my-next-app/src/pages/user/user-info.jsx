import * as React from "react";
import Box from "@mui/material/Box";
import {
  Typography,
  Link,
  createTheme,
  ThemeProvider,
  IconButton,
} from "@mui/material";

import "../../css/userInfo.css";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import request from "../../utils/request";
import { useState } from "react";
import AddIcon from "@mui/icons-material/AddAPhoto";

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          marginBottom: "16px",
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#fff",
            "& fieldset": {
              borderColor: "#ccc",
            },
            "&:hover fieldset": {
              borderColor: "#888",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
            },
          },
        },
      },
    },
  },
});

export default function forgotPassword() {
  // 控制渲染：保证user存在
  const [user, setUser] = React.useState(null);
  const [loaded, setloaded] = React.useState(false);

  // 起始user值
  React.useEffect(() => {
    // 确保是在客户端运行
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      setloaded(true);
    }
  }, []);

  // 处理user变更时页面渲染
  // 1. 更新本地用户信息
  // 2. 加载avatar
  const [preview, setPreview] = useState(null);
  React.useEffect(() => {
    const fetctAvatar = async () => {
      try {
        // 获取对应avatar二进制文件
        const res = await request.get(
          `file/MinioDownloadByQuery/?filename=${user.avatar}`,
          { responseType: "blob" }
        );

        // 创建Blob URL预览图像
        const file = new File([res], user.avatar, { type: res.type });

        // 用FileReader生成base64预览
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } catch (e) {
        console.log(e);
      }
    };
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.avatar) {
        fetctAvatar();
      }
    }
  });

  // 上传图片
  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("upload file error");
      return;
    }
    // 构造 FormData
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await request.post("file/MinioUpload", formData, {
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      // console.log(res.data.filename);

      // 设置定时器防止过快获取文件
      setTimeout(() => {
        setUser((prev) => ({
          ...prev,
          avatar: "imgs/" + res.data.filename,
        }));
        localStorage.setItem("user", JSON.stringify(user));
      }, 1500);
    } catch (e) {
      console.log(e);
    }
  };

  // 更新用户信息
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleUserUpadte = async (data) => {
    // 创建新user实例
    const updatedUser = {
      ...user, // 当前旧 user
      name: data.name, // 覆盖新 name
    };

    //更新前端状态
    // 更新前端状态（异步，不影响逻辑）
    setUser(updatedUser);

    // 拿最新的User去update后端数据库
    try {
      const res = await request.patch("user/update", updatedUser);
      if (res.code === "200") {
        // console.log(res);
        alert("用户信息已成功更新！");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 控制渲染
  if (!loaded) return null;
  return (
    <Box className="css-BasicBox">
      <Paper
        className="css-UserInfoPaper"
        component="form"
        onSubmit={handleSubmit(handleUserUpadte)}
        noValidate
      >
        <Typography marginBottom={2}>更改用户信息</Typography>
        <Box
          sx={{
            textAlign: "center",
            mb: 2,
          }}
        >
          <IconButton
            component="label"
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              border: "1px dashed #8c939d",
              overflow: "hidden",
              position: "relative",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            {preview && user.avatar ? (
              <Avatar src={preview} sx={{ width: "100%", height: "100%" }} />
            ) : (
              <AddIcon sx={{ fontSize: 28, color: "#8c939d" }} />
            )}
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleAvatar}
            />
          </IconButton>
        </Box>
        <ThemeProvider theme={theme}>
          <TextField label="id" defaultValue={user.id} disabled></TextField>
          <TextField
            label="username"
            defaultValue={user.username}
            disabled
          ></TextField>
          <TextField
            label="name"
            defaultValue={user.name}
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          ></TextField>
          <TextField label="role" defaultValue={user.role} disabled></TextField>
        </ThemeProvider>
        <Button variant="contained" type="submit">
          Update
        </Button>
      </Paper>
    </Box>
  );
}
