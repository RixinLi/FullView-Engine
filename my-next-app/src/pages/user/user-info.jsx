import * as React from "react";
import Box from "@mui/material/Box";
import { Typography, Link } from "@mui/material";
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

export default function forgotPassword() {
  // 控制渲染：保证user存在
  const [user, setUser] = React.useState(null);
  const [loaded, setloaded] = React.useState(false);
  React.useEffect(() => {
    // 确保是在客户端运行
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      setloaded(true);
    }
  }, []);

  // 控制渲染
  if (!loaded) return null;
  return (
    <Box className="css-BasicBox">
      <Paper className="css-UserInfoPaper">
        <TextField sx={{ width: "100%" }}></TextField>
      </Paper>
    </Box>
  );
}
