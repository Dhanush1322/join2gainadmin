import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { People, MonetizationOn, AccountBalanceWallet, Assignment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const DashboardMain = () => {
  const stats = [
    { title: "Investment Requests", link: "/InvestmentRequst", icon: <Assignment fontSize="large" />, color: "#f5ee24" },
    { title: "View Members", link: "/ViewMembers", icon: <People fontSize="large" />, color: "#f5ee24" },
    { title: "Withdraw Requests", link: "/WithdrawRequst", icon: <MonetizationOn fontSize="large" />, color: "#f5ee24" },
    { title: "Total Investments", count: "Rs. 5,34,00,000.00", icon: <AccountBalanceWallet fontSize="large" />, color: "#f5ee24" },
  ];

  const chartData = [
    { name: "Total Payout", amount: 5064750 },
    { name: "ROI Payout", amount: 3445000 },
    { name: "Affiliate Payout", amount: 1619750 },
  ];

  return (
    <div className="dashboard-main">
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            {stat.link ? (
              <Link to={stat.link} style={{ textDecoration: "none" }}>
                <Card sx={{ display: "flex", alignItems: "center", padding: 2, backgroundColor: "#004e99", color: "#ffb901", borderRadius: 3, boxShadow: 3 }}>
                  {stat.icon}
                  <CardContent>
                    <Typography variant="h6" sx={{ color: stat.color }}>{stat.title}</Typography>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card sx={{ display: "flex", alignItems: "center", padding: 2, backgroundColor: "#004e99", color: "#ffb901", borderRadius: 3, boxShadow: 3 }}>
                {stat.icon}
                <CardContent>
                  <Typography variant="h6" sx={{ color: stat.color }}>{stat.title}</Typography>
                  {stat.count && <Typography variant="h4" sx={{ color: stat.color }}>{stat.count}</Typography>}
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, backgroundColor: "#004e99", color: "#ffb901", borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#f5ee24" }}>Total Payout: Rs. 50,64,750.00</Typography>
              <Typography variant="body1" sx={{ color: "#f5ee24" }}>ROI Payout: Rs. 34,45,000.00</Typography>
              <Typography variant="body1" sx={{ color: "#f5ee24" }}>Affiliate Payout: Rs. 16,19,750.00</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, backgroundColor: "#fff", borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#004e99" }}>Payout Overview</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#004e99" barSize={40} radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardMain;
