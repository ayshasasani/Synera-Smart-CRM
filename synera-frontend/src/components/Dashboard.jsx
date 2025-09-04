import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [leadsData, setLeadsData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all leads
        const leadRes = await api.get("/leads/");
        const leads = leadRes.data;

        // Fetch all customers
        const custRes = await api.get("/customers/");
        const customers = custRes.data;

        // ------------------
        // Chart Data
        // ------------------
        const chartData = leads.map((lead) => ({
          title: lead.title || "Untitled",
          score: lead.score || 0,
        }));

        const statusCounts = {};
        leads.forEach((lead) => {
          const status = lead.status || "unknown";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        const pieData = Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
        }));

        const topCustomers = customers
          .map((c) => ({
            name: c.name,
            value: c.value || 0,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        // Dummy Revenue Data (replace with backend later)
        const revData = [
          { month: "Jan", revenue: 12000 },
          { month: "Feb", revenue: 15000 },
          { month: "Mar", revenue: 10000 },
          { month: "Apr", revenue: 18000 },
          { month: "May", revenue: 20000 },
        ];

        // ------------------
        // Follow-ups (filter high-score leads)
        // ------------------
        const followUpList = leads
          .filter((lead) => (lead.score || 0) >= 80 && !["won", "lost"].includes(lead.status))
          .map((lead) => ({
            id: lead.id,
            title: lead.title,
            score: lead.score,
            status: lead.status,
          }));

        // ------------------
        // Quick Stats
        // ------------------
        const statsData = {
          totalLeads: leads.length,
          totalCustomers: customers.length,
          wonLeads: leads.filter((l) => l.status === "won").length,
          highScoreLeads: leads.filter((l) => (l.score || 0) >= 80).length,
        };

        setLeadsData(chartData);
        setStatusData(pieData);
        setCustomerData(topCustomers);
        setFollowUps(followUpList);
        setRevenueData(revData);
        setStats(statsData);

        // Show notification if follow-ups exist
        if (followUpList.length > 0) {
          toast.warning(`⚡ ${followUpList.length} lead(s) need follow-up!`);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Synera Dashboard
      </Typography>

      {/* Quick Stats (Clickable Cards) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ bgcolor: "#f5f5f5", cursor: "pointer", "&:hover": { boxShadow: 6 } }}
            onClick={() => navigate("/leads")}
          >
            <CardContent>
              <Typography variant="h6">Total Leads</Typography>
              <Typography variant="h4">{stats.totalLeads}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ bgcolor: "#f5f5f5", cursor: "pointer", "&:hover": { boxShadow: 6 } }}
            onClick={() => navigate("/customers")}
          >
            <CardContent>
              <Typography variant="h6">Total Customers</Typography>
              <Typography variant="h4">{stats.totalCustomers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ bgcolor: "#f5f5f5", cursor: "pointer", "&:hover": { boxShadow: 6 } }}
            onClick={() => navigate("/leads?status=won")}
          >
            <CardContent>
              <Typography variant="h6">Won Leads</Typography>
              <Typography variant="h4">{stats.wonLeads}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ bgcolor: "#f5f5f5", cursor: "pointer", "&:hover": { boxShadow: 6 } }}
            onClick={() => navigate("/leads?priority=high")}
          >
            <CardContent>
              <Typography variant="h6">High Score Leads</Typography>
              <Typography variant="h4">{stats.highScoreLeads}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lead Score Bar Chart */}
      <Typography variant="h6" gutterBottom>
        Lead Scoring
      </Typography>
      <Box sx={{ width: "100%", height: 300, mb: 5 }}>
        <ResponsiveContainer>
          <BarChart data={leadsData}>
            <XAxis dataKey="title" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="score" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Lead Status Pie Chart */}
      <Typography variant="h6" gutterBottom>
        Lead Status Distribution
      </Typography>
      <Box sx={{ width: "100%", height: 300, mb: 5 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Top Customers */}
      <Typography variant="h6" gutterBottom>
        Top 5 Customers by Value
      </Typography>
      <Box sx={{ width: "100%", height: 300, mb: 5 }}>
        <ResponsiveContainer>
          <BarChart data={customerData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Revenue Trends */}
      <Typography variant="h6" gutterBottom>
        Revenue Trends
      </Typography>
      <Box sx={{ width: "100%", height: 300, mb: 5 }}>
        <ResponsiveContainer>
          <LineChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Follow-up Tasks */}
      <Typography variant="h6" gutterBottom>
        Follow-up Reminders
      </Typography>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lead Title</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {followUps.length > 0 ? (
              followUps.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.title}</TableCell>
                  <TableCell>{lead.score}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No follow-ups pending</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}

export default Dashboard;
