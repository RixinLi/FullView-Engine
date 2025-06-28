import { Typography } from "@mui/material";
import DashboardLayout from "..";

export default function UserTable() {
  return <Typography>This is a UserTable page</Typography>;
}

// Next.js 会在渲染前，调用这里的 getLayout
UserTable.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
