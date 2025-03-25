import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { People, ShoppingCart, AccountBalanceWallet, Star, MonetizationOn } from "@mui/icons-material";
import "./DashboardMain.css";

const DashboardMain = () => {
  const stats = [
    { title: "Total Users", count: 3000, icon: <People fontSize="large" />, color: "#f5ee24" },
   { title: "ROI Income", count: "Rs. 10,000.00", icon: <MonetizationOn fontSize="large" />, color: "#f5ee24" },
    { title: "Level Income", count: "Rs. 49,000.00", icon: <MonetizationOn fontSize="large" />, color: "#f5ee24" },
     { title: "Total Earning", count: "Rs. 59,000.00", icon: <AccountBalanceWallet fontSize="large" />, color: "#f5ee24" },
    { title: "My Investment", count: "Rs. 1,000,000", icon: <AccountBalanceWallet fontSize="large" />, color: "#f5ee24" },
    { title: "Direct Referrals", count: 10, icon: <People fontSize="large" />, color: "#f5ee24" },
    { title: "Total Withdrawals", count: "Rs. 0.0", icon: <AccountBalanceWallet fontSize="large" />, color: "#f5ee24" },
    { title: "Rank", count: "Gold", icon: <Star fontSize="large" />, color: "#f5ee24" }
  ];

  return (
    <div className="dashboard-main">
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                backgroundColor: "#004e99",
                color: "#ffb901",
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              {stat.icon}
              <CardContent>
                <Typography variant="h6" sx={{ color: stat.color }}>{stat.title}</Typography>
                <Typography variant="h4" sx={{ color: stat.color }}>{stat.count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DashboardMain;