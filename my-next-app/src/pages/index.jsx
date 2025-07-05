import {
  Typography,
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  Button,
  Paper,
  Collapse,
  Grid,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TableChartIcon from "@mui/icons-material/TableChart";
import SecurityIcon from "@mui/icons-material/Security";
import NextLink from "next/link";
import "../css/dashboard.css";
import { useState, useEffect } from "react";
import SearchInput from "../utils/inputs";
import MenuIcon from "@mui/icons-material/Menu";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import request from "../utils/request";
import useResponsive from "../utils/useResponsive";
import { HeaderSVG } from "./auth/signIn";

const drawerWidth = 240;

//设计单个list里面的collapse
const CollapseSection = ({ title, Icon, children, drawerToggle }) => {
  // smDown 获取
  const { smDown } = useResponsive();
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ mb: 2 }}>
      <ListItemButton
        className="css_navListButton"
        onClick={() => setOpen(!open)}
      >
        {Icon && <Icon />}
        <Typography className="css_navListButtonTypo">{title}</Typography>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open}>
        <List>
          {children &&
            children.map(({ label, path }) => (
              <ListItem key={path} disablePadding>
                <ListItemButton
                  component={NextLink}
                  href={path}
                  sx={{
                    p: "8px 16px 8px 48px", // 上右下左
                  }}
                  onClick={() => {
                    if (smDown && typeof drawerToggle === "function")
                      drawerToggle();
                  }}
                >
                  <Typography className="css_navListChildrenButtonTypo">
                    {label}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default function DashboardLayout({ children }) {
  // smDown 获取
  const { smDown, shortHeight } = useResponsive();

  // Drawer特性随smDown改变
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerToggle = () => setDrawerOpen((prev) => !prev);
  useEffect(() => {
    if (smDown) setDrawerOpen(false);
  }, [smDown]);

  // header ToolBar searchText的状态变更
  const [searchText, setSearchText] = useState("");
  const handleSearchSubmit = () => {
    alert("Current search: " + searchText);
  };

  function ToolBarUserMenu({ avatar }) {
    // 经典的anchor组合 负责操控额外的menu组件
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
      setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Button onClick={handleClick}>
          {avatar && <Avatar src={avatar} />}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleClose}>Information</MenuItem>
          <MenuItem onClick={handleClose}>Setting</MenuItem>
          <MenuItem onClick={handleClose}>Sign Out</MenuItem>
        </Menu>
      </>
    );
  }
  // avatar
  const [user, setUser] = useState(null);
  useEffect(() => {
    // 确保是在客户端运行
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
  }, []);
  const [avatar, setAvatar] = useState(null);
  useEffect(() => {
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

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "calc(var(--vh, 1vh) * 100)", // 真正填满可视高度
      }}
    >
      <Drawer
        variant={smDown ? "temporary" : "permanent"}
        anchor="left"
        open={smDown ? drawerOpen : true}
        onClose={drawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            position: smDown ? "fixed" : "relative",
            width: drawerWidth,
            height: "calc(var(--vh, 1vh) * 100)",
            boxSizing: "border-box",
            overflowY: "auto",
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Chrome & Safari
            },
          },
        }}
      >
        <Paper className="css_leftPaper">
          <ListItemButton
            className="css_navHeader"
            component={NextLink}
            href={"/"}
            sx={{ height: "auto", maxHeight: "64px", marginBottom: 2 }}
          >
            <HeaderSVG />
            <Typography sx={{ marginLeft: 2, fontSize: 20, fontWeight: 50 }}>
              Navgation
            </Typography>
          </ListItemButton>
          <Divider></Divider>
          <List className="css_navList">
            <div>
              <CollapseSection
                title={"Dashbaord"}
                Icon={DashboardIcon}
                children={[
                  {
                    label: "default",
                    path: "/dashboard/default",
                  },
                ]}
                drawerToggle={drawerToggle}
              />
              <CollapseSection
                title={"Auth"}
                Icon={SecurityIcon}
                children={[
                  {
                    label: "Sign In",
                    path: "/auth/signIn",
                  },
                ]}
                drawerToggle={drawerToggle}
              />
              <CollapseSection
                title={"Tables"}
                Icon={TableChartIcon}
                children={[
                  { label: "User", path: "/tables/user" },
                  {
                    label: "Companies",
                    path: "/tables/companies",
                  },
                ]}
                drawerToggle={drawerToggle}
              />
            </div>
            <div></div>
            <div></div>
          </List>
        </Paper>
      </Drawer>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "auto",
          overflow: "visible",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            px: 1.5,
            borderBottom: "1px solid #ccc",
            minHeight: 0,
            height: "auto",
            overflow: "visible",
          }}
        >
          <Grid sx={{ width: "20%" }}>
            {smDown && (
              <IconButton onClick={drawerToggle} sx={{ m: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            {!smDown && (
              <SearchInput
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSubmit={handleSearchSubmit}
              />
            )}
          </Grid>
          <Grid sx={{ flexGrow: 1, minWidth: 64 }}></Grid>
          <Grid
            container
            spacing={1}
            wrap="wrap"
            sx={{
              flexShrink: 0,
              justifyContent: "flex-end",
              "& button": {
                minWidth: 48,
              },
            }}
          >
            <Tooltip title="Messages">
              <Button>
                <MessageIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Notifications">
              <Button>
                <NotificationsIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Account">
              <ToolBarUserMenu avatar={avatar} />
            </Tooltip>
          </Grid>
        </Toolbar>
        {/* 此处为根据按钮点击的页面跳转 并防止在此处作为子组件页面 */}
        <Paper
          className="css_childrenPageStyle"
          sx={{
            flex: 1,
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
}
