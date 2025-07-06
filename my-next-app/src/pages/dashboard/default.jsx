import {
  Typography,
  Container,
  Grid,
  Divider,
  Card,
  Paper,
  CardContent,
  CardHeader,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import DashboardLayout from "..";
import { useState, useEffect } from "react";
import "../../css/defaultDashboard.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuIcon from "@mui/icons-material/Menu";
import request from "../../utils/request";

import dynamic from "next/dynamic";

const LinearChart = dynamic(() => import("../../components/LinearChart"), {
  ssr: false,
});

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
  // 获取user
  const [user, setUser] = useState(null);
  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
  }, []);

  // 获取公司数据
  const initialRows = [
    {
      // 这里要把字段转成company_code
      company_code: "C0",
      company_name: "Rodriguez, Figueroa and Sanchez",
      level: "1",
      country: "China",
      city: "Beijing",
      founded_year: "1994",
      annual_revenue: 1083726,
      employees: 2867,
    },
  ];
  const [rows, setRows] = useState(initialRows);
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    const fetchCompaniesRows = async () => {
      // console.log("fetched");
      try {
        const res = await request.get("company/findAll");
        if (res.code === "200") {
          // console.log(res);
          setRows(res.data);
          setFetched(true);
        }
      } catch (e) {
        alert(e);
      }
    };
    if (!fetched) fetchCompaniesRows();
  }, [fetched]);

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
      <Grid
        container
        spacing={3} // 等价于 24px 间距
        direction="row"
        alignItems="stretch"
        className="css_cardsAllGridsContainer"
      >
        <Grid className="css_cardsGrid">
          <InfoCard
            title={"Total Company"}
            number={rows ? rows.length : null}
            percentage={"+26%"}
            chipContent={"today"}
          />
        </Grid>
        <Grid className="css_cardsGrid">
          <InfoCard
            title={"Total revenue"}
            number={rows?.reduce(
              (sum, row) => sum + Number(row.annual_revenue || 0),
              0
            )}
            percentage={"+26%"}
            chipContent={"year"}
          />
        </Grid>
        <Grid className="css_cardsGrid">
          <InfoCard
            title={"Countries"}
            number={new Set(rows.map((row) => row.country)).size}
            percentage={"+26%"}
            chipContent={"history"}
          />
        </Grid>
        <Grid className="css_cardsGrid">
          <InfoCard
            title={"Cities"}
            number={new Set(rows.map((row) => row.city)).size}
            percentage={"+26%"}
            chipContent={"history"}
          />
        </Grid>
        <Grid className="css_cardsGrid">
          <InfoCard
            title={"Total Employees"}
            number={rows?.reduce(
              (sum, row) => sum + Number(row.employees || 0),
              0
            )}
            percentage={"+26%"}
            chipContent={"today"}
          />
        </Grid>
      </Grid>
      <Divider className="css_divider"></Divider>
      <Grid
        container
        spacing={3} // 等价于 24px 间距
        direction="row"
        alignItems="stretch"
        className="css_cardsAllGridsContainer"
      >
        <Grid className="css_chartGrid">
          <Card>
            <CardHeader
              title="Total revenue"
              titleTypographyProps={{
                className: "css_cardHeader",
              }}
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <LinearChart data={[3, 4, 6, 7, 8, 3, 9]} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

// Next.js 会在渲染前，调用这里的 getLayout
DefaultDashboard.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);
