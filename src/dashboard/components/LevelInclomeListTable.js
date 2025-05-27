import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, TablePagination, Chip, Button,
  CircularProgress, Box, Dialog, DialogTitle, DialogContent
} from '@mui/material';

const LevelIncomeListTable = () => {
  const [referralPayouts, setReferralPayouts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

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

        // const today = new Date();
        const today = new Date("2025-07-02"); // YYYY-MM-DD format
        today.setHours(0, 0, 0, 0); // strip time
        for (const user of data.data) {
          if (!user.referral_payouts) continue;

          const pendingPayouts = user.referral_payouts.filter(p => {
            if (p.status !== "Pending") return false;
            const payoutDate = new Date(p.payout_date);
            payoutDate.setHours(0, 0, 0, 0);
            return payoutDate <= today;
          });

          pendingPayouts.forEach(payout => {
            let fromUserName = "N/A";

            // Find matching referral and investment from user's referral data
            if (Array.isArray(user.referrals)) {
              for (const referral of user.referrals) {
                if (Array.isArray(referral.investment_info)) {
                  const match = referral.investment_info.find(info => info._id === payout.investment_id);
                  if (match) {
                    fromUserName = referral.name || "N/A";
                    break;
                  }
                }
              }
            }

            payoutsToFetch.push({
              user_id: user._id,
              bank: user.uploaded_bank_passbook_file,
              investment_id: payout.investment_id,
              referral_payout_id: payout._id,
              base: payout,
              userName: user.name,
              fromUserName: fromUserName,
              bankImage: user.uploaded_bank_passbook_file
            });
          });
        }

        const enrichedPayouts = await Promise.all(
          payoutsToFetch.map(async ({ user_id, investment_id, referral_payout_id, base, userName, fromUserName, bankImage }) => {
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
                fromUserName,
                referrals: base.referrals,
                bankImage,
                investment_id,
              };
            } catch (err) {
              console.error("Error fetching payout amount:", err);
              return {
                ...base,
                userId: user_id,
                userName,
                fromUserName,
                bankImage,
                investment_id,
              };
            }
          })
        );

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

  const handleApprove = async (userId, payoutId, investment_id) => {
    try {
      const res = await fetch('https://jointogain.ap-1.evennode.com/api/admin/referralPayoutsApprovedRejected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          payoutId,
          investment_id,
          status: "Approved"
        })
      });

      const data = await res.json();
      if (data.Status) {
        alert("Payout approved successfully!");
        setReferralPayouts(prev => prev.filter(p => p._id !== payoutId));
      } else {
        alert("Approval failed!");
      }
    } catch (error) {
      console.error("Error approving payout:", error);
    }
  };

  const handleOpen = (imageName) => {
    const imageUrl = `https://jointogain.ap-1.evennode.com/api/user/downloadBankPassbookFile/${imageName}`;
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
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
                <TableCell><strong>From User Name</strong></TableCell>
                <TableCell><strong>Payout Date</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Bank Image</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {referralPayouts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payout, index) => (
                  <TableRow key={payout._id || index}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{payout.userName || "N/A"}</TableCell>
                    <TableCell>{payout.fromUserName || "N/A"}</TableCell>
                    <TableCell>{new Date(payout.payout_date).toLocaleDateString()}</TableCell>
                    <TableCell>₹ {payout.amount}</TableCell>
                    <TableCell>
                      <Chip label="Pending" color="warning" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpen(payout.bankImage)}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleApprove(payout.userId, payout._id, payout.investment_id)}
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Bank Passbook Image</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Bank Passbook"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LevelIncomeListTable;
