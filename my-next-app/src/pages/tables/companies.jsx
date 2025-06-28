import { Typography } from "@mui/material";
import DashboardLayout from "..";

export default function CompaniesTable() {
  return <Typography>This is a CompaniesTable page</Typography>;
}

// Next.js 会在渲染前，调用这里的 getLayout
CompaniesTable.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
