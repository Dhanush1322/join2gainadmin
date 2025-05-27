import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid
} from "@mui/material";
import {
  People,
  MonetizationOn,
  AccountBalanceWallet,
  Assignment
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import axios from "axios";

const DashboardMain = () => {
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [roiPayout, setRoiPayout] = useState(0);
  const [affiliatePayout, setAffiliatePayout] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://jointogain.ap-1.evennode.com/api/user/getUsers");
        if (response.data.Status) {
          const users = response.data.data;

          let totalInvestmentAmount = 0;
          let totalRoiPayout = 0;
          let totalAffiliatePayout = 0;

          users.forEach(user => {
            // Total Investments
            if (user.investment_info && Array.isArray(user.investment_info)) {
              user.investment_info.forEach(investment => {
                if (investment.investment_status === "Approved") {
                  totalInvestmentAmount += investment.invest_amount || 0;
                }

                // ROI Payout
                if (investment.roi_payout_status && Array.isArray(investment.roi_payout_status)) {
                  const hasApprovedPayout = investment.roi_payout_status.some(
                    payout => payout.status === "Approved"
                  );
                  if (hasApprovedPayout && investment.net_amount_per_month) {
                    totalRoiPayout += investment.net_amount_per_month;
                  }
                }
              });
            }

            // Affiliate Payout
            if (user.referrals && Array.isArray(user.referrals)) {
              user.referrals.forEach(referral => {
                if (referral.referral_payouts && Array.isArray(referral.referral_payouts)) {
                  referral.referral_payouts.forEach(payout => {
                    if (payout.status === "Approved" && payout.amount) {
                      totalAffiliatePayout += payout.amount;
                    }
                  });
                }
              });
            }
          });

          // Set state
          setTotalInvestments(totalInvestmentAmount);
          setRoiPayout(totalRoiPayout);
          setAffiliatePayout(totalAffiliatePayout);
          setTotalPayout(totalRoiPayout + totalAffiliatePayout);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  const stats = [
    {
      title: "Investment Requests",
      link: "/InvestmentRequst",
      icon: <Assignment fontSize="large" />,
      color: "#f5ee24"
    },
    {
      title: "View Members",
      link: "/ViewMembers",
      icon: <People fontSize="large" />,
      color: "#f5ee24"
    },
    {
      title: "Withdraw Requests",
      link: "/WithdrawRequst",
      icon: <MonetizationOn fontSize="large" />,
      color: "#f5ee24"
    },

    {
      title: "Total Investments",
      count: `Rs. ${totalInvestments.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      ,
      icon: <AccountBalanceWallet fontSize="large" />,
      color: "#f5ee24"
    }
    ,
    {
      title: "Rank",

      link: "/Rank",
      icon: <AccountBalanceWallet fontSize="large" />,
      color: "#f5ee24"
    }
  ];

  const chartData = [
    { name: "Total Payout", amount: totalPayout },
    { name: "ROI Payout", amount: roiPayout },
    { name: "Affiliate Payout", amount: affiliatePayout }
  ];

  return (
    <div className="dashboard-main">
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            {stat.link ? (
              <Link to={stat.link} style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    backgroundColor: "#004e99",
                    color: "#ffb901",
                    borderRadius: 3,
                    boxShadow: 3
                  }}
                >
                  {stat.icon}
                  <CardContent>
                    <Typography variant="h6" sx={{ color: stat.color }}>
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                  backgroundColor: "#004e99",
                  color: "#ffb901",
                  borderRadius: 3,
                  boxShadow: 3
                }}
              >
                {stat.icon}
                <CardContent>
                  <Typography variant="h6" sx={{ color: stat.color }}>
                    {stat.title}
                  </Typography>
                  {stat.count && (
                    <Typography variant="h4" sx={{ color: stat.color }}>
                      {stat.count}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              padding: 2,
              backgroundColor: "#004e99",
              color: "#ffb901",
              borderRadius: 3,
              boxShadow: 3
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#f5ee24" }}>
                Total Payout: Rs. {totalPayout.toLocaleString()}.00
              </Typography>
              <Typography variant="body1" sx={{ color: "#f5ee24" }}>
                ROI Payout: Rs. {roiPayout.toLocaleString()}.00
              </Typography>
              <Typography variant="body1" sx={{ color: "#f5ee24" }}>
                Affiliate Payout: Rs. {affiliatePayout.toLocaleString()}.00
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </div>
  );
};

export default DashboardMain;
