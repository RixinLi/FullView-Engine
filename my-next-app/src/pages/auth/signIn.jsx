import * as React from "react";
import Box from "@mui/material/Box";
import { Typography, Link } from "@mui/material";
import "../../css/signIn.css";
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
import DashboardLayout from "..";

export function HeaderSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      className="css-HeaderSVG"
    >
      <path d="M30.83 9.388c-1.712-3.015-6.123-2.808-7.547.353l-3.077 6.837-4.762 10.578c-1.262 2.804.789 5.975 3.863 5.975h.078a4.24 4.24 0 0 0 3.87-2.511l7.76-17.415a4.24 4.24 0 0 0-.185-3.817M39.276 24.29l-.038-.066a5 5 0 0 0-.293-.453 4 4 0 0 0-.26-.325l-.028-.028a4 4 0 0 0-.267-.266q-.034-.032-.07-.063-.15-.132-.31-.248l-.044-.029a4 4 0 0 0-.302-.192l-.067-.038a4 4 0 0 0-.353-.173l-.047-.02a4 4 0 0 0-.346-.127l-.047-.015a4 4 0 0 0-.39-.1l-.038-.006a4 4 0 0 0-.396-.06h-.01q-.21-.02-.419-.02h-.022q-.424.002-.841.086-.004 0-.007.002a4.2 4.2 0 0 0-1.587.681 4.2 4.2 0 0 0-1.414 1.726l-1.17 2.6c-1.262 2.804.788 5.975 3.863 5.975h.079c1.12 0 2.17-.443 2.946-1.194l.032-.03q.06-.062.12-.126l.076-.082a5 5 0 0 0 .355-.464q.035-.053.07-.107.047-.078.092-.158.026-.044.05-.09.07-.128.128-.26l1.129-2.534a4.24 4.24 0 0 0-.174-3.796M15.95 13.205a4.24 4.24 0 0 0-.373-4.117l-.066-.09a5 5 0 0 0-.14-.188l-.081-.097a4 4 0 0 0-.39-.401l-.084-.075a4 4 0 0 0-.21-.166l-.045-.035a4 4 0 0 0-.267-.177q-.037-.022-.075-.043a4 4 0 0 0-.203-.112l-.101-.049a4 4 0 0 0-.492-.196l-.103-.034a5 5 0 0 0-.229-.06l-.073-.019a4 4 0 0 0-.308-.056l-.053-.007a4 4 0 0 0-.256-.026L12.3 7.25a4 4 0 0 0-.857.043l-.09.013a4.169 4.169 0 0 0-3.136 2.435L.379 27.155c-1.262 2.804.789 5.975 3.863 5.975h.079a4.24 4.24 0 0 0 3.87-2.511l5.655-12.691z"></path>
    </svg>
  );
}

export default function SignIn() {
  // 控制渲染：保证user存在
  const [user, setUser] = React.useState(null);
  const [loaded, setloaded] = React.useState(false);
  // 当有本地user缓存
  React.useEffect(() => {
    // 确保是在客户端运行
    const cachedUser = JSON.parse(localStorage.getItem("user"));
    if (cachedUser) {
      setUser(cachedUser);
    }
  }, []);

  // img
  const [avatar, setAvatar] = React.useState(null);

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
        reader.onloadend = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
      } catch (e) {
        console.log(e);
      }
    };

    if (user?.avatar) {
      fetctAvatar();
    }
  }, [user?.avatar]);

  // 默认开启

  //注册useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 注册handle函数
  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    // 发请求、跳转等
    try {
      const res = await request.post("auth/login", {
        username: data.email,
        password: data.password,
      });
      if (res.code === "200") {
        console.log("登录成功", res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.access_token);
        // 登陆后进去update界面
        window.location.href = "/";
      }
    } catch (error) {
      console.error("登录失败:", error);
    }
  };

  // 控制渲染节奏 保证预先加载成功
  return (
    <Box className="css-BasicBox">
      <HeaderSVG />
      <Paper
        className="css-SignInPaper"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {avatar && (
          <Avatar
            className="css-Avatar"
            alt="Remy Sharp"
            src={avatar}
            sx={{ width: 92, height: 92 }}
          />
        )}

        {user && (
          <Typography
            className="css-firstTypography"
            sx={{ fontSize: "1.5rem", fontWeight: 600 }}
          >
            Welcome back, {user.name}!
          </Typography>
        )}
        <Typography className="css-firstTypography" sx={{ marginBottom: 3 }}>
          Sign in to your account to continue
        </Typography>
        <TextField
          required
          label="Email Address"
          fullWidth
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ width: "100%", marginBottom: 2 }}
        />
        <TextField
          required
          label="Password"
          type="password"
          fullWidth
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Typography
          sx={{ fontSize: 12, color: "rgb(55, 111, 208);", marginBottom: 2 }}
        >
          <Link href="/auth/signUp" component={NextLink} underline="hover">
            Forgot password?
          </Link>
        </Typography>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Remember me"
          sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
        />
        <Button
          variant="contained"
          sx={{ width: "100%", marginBottom: 2 }}
          type="submit"
        >
          Sign in
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          Don't have an account yet?{" "}
          <Link
            href="/auth/signUp"
            component={NextLink}
            underline="hover"
            sx={{ color: "primary.main", fontWeight: 500 }}
          >
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

// Next.js 会在渲染前，调用这里的 getLayout
SignIn.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
