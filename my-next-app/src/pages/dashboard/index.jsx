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
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import "../../css/dashboard.css";
import { blue } from "@mui/material/colors";

const drawerWidth = 240;
export default function dashboard() {
  return (
    <Box>
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
          <Button></Button>
        </Paper>
        {/* <Toolbar />
        <Divider />
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Drawer>
    </Box>
  );
}
