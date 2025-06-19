import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Pagination, Dialog, DialogContent, Skeleton, Box
} from "@mui/material";

const WithdrawRequestTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [withdrawData, setWithdrawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://jointogain.ap-1.evennode.com/api/user/getUsers");

      const today = new Date().toLocaleDateString();
      const formattedData = response.data.data.flatMap((user) =>
        user.investment_info?.flatMap((investment) => {
          const pendingPayout = investment.roi_payout_status?.find((payout) => payout.status === "Pending");
          if (!pendingPayout) return [];

          const payoutDate = new Date(pendingPayout.payout_date).toLocaleDateString();
          if (payoutDate !== today) return [];

          const approvedPayoutsCount = investment.roi_payout_status?.filter(payout => payout.status === "Approved").length || 0;
          const remainingMonths = (investment.invest_duration_in_month || 0) - approvedPayoutsCount;

          return [{
            userID: user.user_profile_id,
            name: user.name,
            id: user._id,
            availableCredit: (investment.capital_amount || 0) + (investment.profit_amount || 0),
            amountReq: investment.net_amount_per_month || 0,
            tds: investment.tds_deduction_amount || 0,
            sc: investment.sc_deduction_amount || 0,
            investmentid: investment._id || 0,
            investedamount: investment.invest_amount || 0,
            invest_type: investment.invest_type || 0,
            netPay: investment.net_amount_per_month || 0,
            invest_duration_in_month: investment.invest_duration_in_month || 0,
            remainingmonth: remainingMonths,
            date: investment.invest_confirm_date ? new Date(investment.invest_confirm_date).toLocaleDateString() : "N/A",
            payoutDate,
            bankImage: user.uploaded_bank_passbook_file,
          }];
        })
      );

      setWithdrawData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSend = async (id, investmentid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this withdrawal request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post("https://jointogain.ap-1.evennode.com/api/admin/withdrowApprovedRejected", {
            userId: id,
            investmentId: investmentid,
            status: "Approved",
          });

          if (response.status) {
            Swal.fire("Approved!", "Withdrawal request approved successfully.", "success");
            fetchData();
          } else {
            Swal.fire("Error!", "Failed to approve withdrawal!", "error");
          }
        } catch (error) {
          console.error("Error approving withdrawal:", error);
          Swal.fire("Oops!", "Something went wrong!", "error");
        }
      }
    });
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = withdrawData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(withdrawData.length / recordsPerPage);

  const handleOpen = (imageName) => {
    const imageUrl = `https://jointogain.ap-1.evennode.com/api/user/downloadBankPassbookFile?fileUrl=${imageName}`;
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <h3>Withdraw Request List</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Invested Amount</TableCell>
              <TableCell>Investment Type</TableCell>
              <TableCell>Investment Duration</TableCell>
              <TableCell>Remaining Month</TableCell>
              <TableCell>Available Credit</TableCell>
              <TableCell>Amount Req</TableCell>
              <TableCell>TDS</TableCell>
              <TableCell>S.C</TableCell>
              <TableCell>NetPay (Rs)</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payout Date</TableCell>
              <TableCell>Bank Details</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(recordsPerPage)].map((_, index) => (
                <TableRow key={index}>
                  {Array(15).fill().map((_, idx) => (
                    <TableCell key={idx}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <TableRow key={`${record.userID}-${index}`}>
                  <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.investedamount}</TableCell>
                  <TableCell>{record.invest_type}</TableCell>
                  <TableCell style={{ color: "green", fontWeight: "bold" }}>{record.invest_duration_in_month}</TableCell>
                  <TableCell style={{ color: "red", fontWeight: "bold" }}>{record.remainingmonth}</TableCell>
                  <TableCell>{record.availableCredit}</TableCell>
                  <TableCell>{record.amountReq}</TableCell>
                  <TableCell>{record.tds}</TableCell>
                  <TableCell>{record.sc}</TableCell>
                  <TableCell>{record.netPay}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.payoutDate}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" size="small" onClick={() => handleOpen(record.bankImage)}>
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleSend(record.id, record.investmentid)}
                    >
                      Send
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={15} align="center">No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {selectedImage && (
            <img src={selectedImage} alt="Bank Proof" style={{ width: "100%", maxHeight: "500px" }} />
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default WithdrawRequestTable;
