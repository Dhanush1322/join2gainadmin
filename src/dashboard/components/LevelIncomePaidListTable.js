import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, TablePagination, Chip, Button,
  CircularProgress, Box, TextField
} from '@mui/material';
import { saveAs } from 'file-saver';

const LevelIncomePaidListTable = () => {
  const [referralPayouts, setReferralPayouts] = useState([]);
  const [filteredPayouts, setFilteredPayouts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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

          const approvedPayouts = user.referral_payouts.filter(p => p.status === "Approved");

          approvedPayouts.forEach(payout => {
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
              };
            } catch (err) {
              console.error("Error fetching payout amount:", err);
              return { ...base, userId: user_id, userName };
            }
          })
        );

        const nonZeroPayouts = enrichedPayouts.filter(p => p.amount > 0);
        setReferralPayouts(nonZeroPayouts);
        setFilteredPayouts(nonZeroPayouts);
      } catch (error) {
        console.error("Failed to fetch payouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      setFilteredPayouts(referralPayouts);
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999); // include full day

    const filtered = referralPayouts.filter(p => {
      const payoutDate = new Date(p.payout_date);
      return payoutDate >= from && payoutDate <= to;
    });

    setFilteredPayouts(filtered);
    setPage(0);
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['User Name', 'Payout Date', 'Amount', 'Status'],
      ...filteredPayouts.map(p =>
        [p.userName, new Date(p.payout_date).toLocaleDateString(), p.amount, p.status]
      )
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'LevelIncomePayouts.csv');
  };

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        All Users – Level Income Payouts
      </Typography>

      {/* Filter Section */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <TextField
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <Button variant="contained" onClick={handleFilter}>Filter</Button>
        <Button variant="outlined" onClick={handleExportCSV}>Export CSV</Button>
      </Box>

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
              {filteredPayouts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payout, index) => (
                  <TableRow key={payout._id || index}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{payout.userName || "N/A"}</TableCell>
                    <TableCell>{new Date(payout.payout_date).toLocaleDateString()}</TableCell>
                    <TableCell>₹ {payout.amount}</TableCell>
                    <TableCell>
                      <Chip label="Approved" color="warning" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredPayouts.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default LevelIncomePaidListTable;
