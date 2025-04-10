
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, TablePagination, Chip, Button, CircularProgress, Box
} from '@mui/material';

const LevelIncomePaidListTable = () => {
  const [referralPayouts, setReferralPayouts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch(`https://jointogain.ap-1.evennode.com/api/user/getUsers`);
        const data = await res.json();

        if (!data.Status || !Array.isArray(data.data)) {
          setLoading(false);
          return;
        }

        const payoutsToFetch = [];

        for (const user of data.data) {
          if (!user.referral_payouts) continue;

          const pendingPayouts = user.referral_payouts.filter(p => p.status === "Approved");

          pendingPayouts.forEach(payout => {
            payoutsToFetch.push({
              user_id: user._id,
              investment_id: payout.investment_id,
              referral_payout_id: payout._id,
              base: payout,
              userName: user.name,
            });
          });
        }

        const enrichedPayouts = await Promise.all(
          payoutsToFetch.map(async ({ user_id, investment_id, referral_payout_id, base, userName }) => {
            try {
              const res = await fetch("https://jointogain.ap-1.evennode.com/api/user/getReferralPayoutAmountOfInvestment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, investment_id, referral_payout_id }),
              });
              const result = await res.json();
              return {
                ...base,
                amount: result.amount || base.amount,
                userId: user_id,
                userName,
                referrals: base.referrals,
              };
            } catch (err) {
              console.error("Error fetching payout amount:", err);
              return { ...base, userId: user_id, userName };
            }
          })
        );

        // Filter out entries with amount 0
        const nonZeroPayouts = enrichedPayouts.filter(p => p.amount > 0);

        setReferralPayouts(nonZeroPayouts);
      } catch (error) {
        console.error("Failed to fetch payouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 
  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        All Users – Level Income Payouts
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell><strong>S.N</strong></TableCell>
                <TableCell><strong>User Name</strong></TableCell>
                <TableCell><strong>Payout Date</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              
              </TableRow>
            </TableHead>
            <TableBody>
              {referralPayouts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payout, index) => {
                  const payoutId = payout._id;

                  return (
                    <TableRow key={payoutId || index}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{payout.userName || "N/A"}</TableCell>
                      <TableCell>{new Date(payout.payout_date).toLocaleDateString()}</TableCell>
                      <TableCell>₹ {payout.amount}</TableCell>
                      <TableCell>
                        <Chip label="Approved" color="warning" variant="outlined" />
                      </TableCell>
                     
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={referralPayouts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default LevelIncomePaidListTable;
