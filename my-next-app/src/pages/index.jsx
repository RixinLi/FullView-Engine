import {
  Typography,
  Box,
  Drawer,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Button,
  Paper,
  Collapse,
  Grid,
  Input,
  Tooltip,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PagesIcon from "@mui/icons-material/Pages";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TableChartIcon from "@mui/icons-material/TableChart";
import SecurityIcon from "@mui/icons-material/Security";
import NextLink from "next/link";
import "../css/dashboard.css";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import path from "path";
import Inputs from "../utils/inputs";
import SearchInput from "../utils/inputs";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
const drawerWidth = 240;

//设计单个list里面的collapse
const CollapseSection = ({ title, Icon, children }) => {
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
  // header ToolBar的状态变更
  const [searchText, setSearchText] = useState("");
  const handleSearchSubmit = () => {
    alert("Current search: " + searchText);
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Paper className="css_leftPaper">
          <ListItemButton
            className="css_navHeader"
            component={NextLink}
            href={"/"}
          >
            <DashboardIcon />
            <Typography textAlign={"center"} sx={{ marginLeft: 2 }}>
              DashBoard
            </Typography>
          </ListItemButton>
          <List className="css_navList">
            <div>
              <Typography className="css_navListHeader">PAGES</Typography>

              <CollapseSection
                title={"Auth"}
                Icon={SecurityIcon}
                children={[{ label: "Sign In", path: "/auth/signIn" }]}
              />
              <CollapseSection
                title={"Tables"}
                Icon={TableChartIcon}
                children={[
                  { label: "User", path: "/tables/user" },
                  { label: "Companies", path: "/tables/companies" },
                ]}
              />
            </div>
            <div></div>
            <div></div>
          </List>
        </Paper>
      </Drawer>
      <Box sx={{ width: "100%" }}>
        <Toolbar
          sx={{
            display: "flex",
            height: "10%",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Grid sx={{ width: "20%" }}>
            <SearchInput
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSubmit={handleSearchSubmit}
            />
          </Grid>
          <Grid sx={{ flexGrow: 1, width: "100%" }}></Grid>
          <Grid sx={{ width: "20%" }}>
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

            <Button></Button>
          </Grid>
        </Toolbar>
        {/* 此处为根据按钮点击的页面跳转 并防止在此处作为子组件页面 */}
        {children}
      </Box>
    </Box>
  );
}
