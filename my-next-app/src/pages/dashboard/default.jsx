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
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Tabs,
  Tab,
} from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import DashboardLayout from "..";
import { useState, useEffect } from "react";
import "../../css/defaultDashboard.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuIcon from "@mui/icons-material/Menu";
import request from "../../utils/request";
import CumulativeCompaniesChart from "../../components/CumulativeCompaniesChart";
import CompaniesLevelChart from "../../components/CompaniesLevelChart";
import FilterCompaniesChart from "../../components/FilterCompaniesChart";
import CompaniesRelationshipChart from "../../components/CompaniesRelationshipChart";

function InfoCard({ title, percentage, number, chipContent }) {
  function formatNumber(num) {
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  }
  return (
    <Card>
      <CardContent className="css_cardsContent">
        <Typography variant="h6" className="css_cardTitle">
          {title}
        </Typography>
        <Typography variant="h3" className="css_cardNumber">
          <Box sx={{ fontWeight: 400 }}>{formatNumber(number)}</Box>
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
  const [rows, setRows] = useState([]);
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

  const [levelTableRows, setLevelTableRows] = useState([]);
  useEffect(() => {
    const map = {};
    if (rows) {
      rows.forEach(({ level, annual_revenue, company_name }) => {
        if (!map[Number(level)]) {
          map[Number(level)] = {
            level,
            number: 1,
            top_revenue: annual_revenue,
            top_company: company_name,
          };
        } else {
          map[Number(level)].number += 1;
          if (annual_revenue > map[Number(level)].top_revenue) {
            map[Number(level)].top_revenue = annual_revenue;
            map[Number(level)].top_company = company_name;
          }
        }
      });
      setLevelTableRows(Object.values(map));
    }
  }, [rows]);

  // tabs用来区分不同的图组件
  const [tabValue, setTabValue] = useState("0");
  const [visibleTab, setVisibleTab] = useState("0");

  const handleTabChange = (_, newVal) => {
    setTabValue(newVal);
    setTimeout(() => setVisibleTab(newVal), 150);
  };

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
            title={"Country"}
            number={new Set(rows.map((row) => row.country)).size}
            percentage={"+26%"}
            chipContent={"history"}
          />
        </Grid>
        <Grid className="css_cardsGrid">
          <InfoCard
            title={"City"}
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
              title="Company Number"
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
              {rows && <CumulativeCompaniesChart companies={rows} />}
            </CardContent>
          </Card>
        </Grid>

        <Grid className="css_chartGrid">
          <Card>
            <CardHeader
              title="Company Level"
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
              {rows && <CompaniesLevelChart companies={rows} />}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company level</TableCell>
                    <TableCell align="right">Number</TableCell>
                    <TableCell align="right">Top Company</TableCell>
                    <TableCell align="right">Top Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {levelTableRows.map((row) => (
                    <TableRow
                      key={row.level}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.level}
                      </TableCell>
                      <TableCell align="right">{row.number}</TableCell>
                      <TableCell align="right">{row.top_company}</TableCell>
                      <TableCell align="right">{row.top_revenue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
        <Grid className="css_columnChartGrid">
          <Card>
            {/* 1. 包裹 TabContext，value 必须是 string */}
            <TabContext value={tabValue}>
              {/* 2. 用 TabList+Tab 替代 MUI core 的 Tabs */}
              <TabList onChange={handleTabChange}>
                <Tab label="Filter Chart" value="0" />
                <Tab label="Relationship Chart" value="1" />
              </TabList>

              <CardHeader
                title={
                  tabValue === "0" ? "Company Number" : "Company Relationship"
                }
              />

              <CardContent>
                {/* 3. TabPanel 里的 value 要与 Tab 一致 */}
                <TabPanel value="0" sx={{ p: 0 }}>
                  <FilterCompaniesChart allCompaniesRows={rows} />
                </TabPanel>
                <TabPanel value="1" sx={{ p: 0 }}>
                  <CompaniesRelationshipChart allCompaniesRows={rows} />
                </TabPanel>
              </CardContent>
            </TabContext>
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
