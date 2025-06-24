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

  // 当user改变时更新localStorage
  React.useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  });

  // 上传图片
  const [preview, setPreview] = useState(null);
  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("upload file error");
      return;
    }
    const reader = new FileReader();

    // 构造 FormData
    const formData = new FormData();
    formData.append("file", file);
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      const res = await request.post("file/MinioUpload", formData, {
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      console.log(res.data.filename);
      setUser((prev) => ({
        ...prev,
        avatar: "imgs/" + res.data.filename,
      }));
      localStorage.setItem("user", JSON.stringify(user));
      // if (res.code === "200") {
      //   // 更新User和localStorage
      //   setUser((prev) => ({
      //     ...prev,
      //     avatar: res.data.filename,
      //   }));
      //   localStorage.setItem("user", JSON.stringify(user));
      // }
    } catch (e) {
      console.log(e);
    }
  };

  // 控制渲染
  if (!loaded) return null;
  return (
    <Box className="css-BasicBox">
      <Paper className="css-UserInfoPaper">
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
          <TextField label="name" defaultValue={user.name}></TextField>
          <TextField label="role" defaultValue={user.role} disabled></TextField>
        </ThemeProvider>
      </Paper>
    </Box>
  );
}
