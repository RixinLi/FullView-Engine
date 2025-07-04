import { Typography, Container, Grid, Divider } from "@mui/material";
import DashboardLayout from "..";
import "../../css/defaultDashboard.css";
import { useState, useEffect } from "react";

export default function DefaultDashboard() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
  }, []);
  return (
    <Container className="css_container">
      <Grid container>
        <Grid>
          <Typography variant="h3" className="css_typoH3">
            Default Dashboard
          </Typography>
          <Typography variant="h6" className="css_typoH6">
            Welcome back, {user && user.name}! We've missed you. 👋
          </Typography>
        </Grid>
      </Grid>
      <Divider className="css_divider"></Divider>
    </Container>
  );
}

// Next.js 会在渲染前，调用这里的 getLayout
DefaultDashboard.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);
