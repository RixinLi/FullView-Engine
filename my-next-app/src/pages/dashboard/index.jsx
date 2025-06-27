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
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PagesIcon from "@mui/icons-material/Pages";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TableChartIcon from "@mui/icons-material/TableChart";
import "../../css/dashboard.css";
import { useState } from "react";
const drawerWidth = 240;

//设计单个list里面的collapse
const CollapseSection = ({ title, Icon, Children }) => {
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
          {Children &&
            Children.map((text) => (
              <ListItem key={text}>
                <ListItemButton
                  sx={{
                    p: "8px 16px 8px 48px", // 上右下左
                  }}
                >
                  <Typography className="css_navListChildrenButtonTypo">
                    {text}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default function dashboard() {
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
          <ListItemButton className="css_navHeader">
            <InboxIcon></InboxIcon>
            <Typography textAlign={"center"}>Navigation Bar</Typography>
          </ListItemButton>
          <List className="css_navList">
            <div>
              <Typography className="css_navListHeader">PAGES</Typography>
              <CollapseSection
                title={"Dashboard"}
                Icon={DashboardIcon}
                Children={["Default", "Analytics", "SaaS"]}
              />
              <CollapseSection
                title={"Pages"}
                Icon={PagesIcon}
                Children={[
                  "Profile",
                  "Settings",
                  "Pricing",
                  "Chat",
                  "Blank Page",
                ]}
              />
              <CollapseSection
                title={"Tables"}
                Icon={TableChartIcon}
                Children={["Users", "Companies"]}
              />
            </div>
            <div></div>
            <div></div>
          </List>
        </Paper>
      </Drawer>
      <Box sx={{ width: "100%" }}>
        <Grid
          container
          spacing={2}
          sx={{
            height: "10%",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Grid size={8}>hello</Grid>
          <Grid size={4}> world</Grid>
        </Grid>
      </Box>
    </Box>
  );
}
