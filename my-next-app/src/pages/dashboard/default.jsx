import {
  Typography,
  Container,
  Grid,
  Divider,
  Card,
  Paper,
  CardContent,
  Box,
  Chip,
} from "@mui/material";
import DashboardLayout from "..";
import { useState, useEffect } from "react";
import "../../css/defaultDashboard.css";

function InfoCard({ title, percentage, number, chipContent }) {
  return (
    <Card>
      <CardContent className="css_cardsContent">
        <Typography variant="h6" className="css_cardTitle">
          {title}
        </Typography>
        <Typography variant="h3" className="css_cardNumber">
          <Box sx={{ fontWeight: 400 }}>{number}</Box>
        </Typography>
        <Typography variant="subtitle2" className="css_cardBottom">
          <span
            style={{
              color: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              padding: "2px",
              borderRadius: "3px",
              marginRight: "8px",
            }}
          >
            {percentage}
          </span>{" "}
          Since last month
        </Typography>
        <Chip className="css_cardChip" label={chipContent}></Chip>
      </CardContent>
    </Card>
  );
}

export default function DefaultDashboard() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
  }, []);
  return (
    <Container className="css_topContainer">
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
      <Grid container className="css_cardsGridContainer">
        <InfoCard
          title={"Sales Today"}
          number={2.532}
          percentage={"+26%"}
          chipContent={"today"}
        />

        <InfoCard
          title={"Sales Today"}
          number={2.532}
          percentage={"+26%"}
          chipContent={"today"}
        />

        <InfoCard
          title={"Sales Today"}
          number={2.532}
          percentage={"+26%"}
          chipContent={"today"}
        />

        <InfoCard
          title={"Sales Today"}
          number={2.532}
          percentage={"+26%"}
          chipContent={"today"}
        />
      </Grid>
    </Container>
  );
}

// Next.js 会在渲染前，调用这里的 getLayout
DefaultDashboard.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);
