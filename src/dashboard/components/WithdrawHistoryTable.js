import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, Dialog, DialogContent, TextField, Stack
} from "@mui/material";
import { CSVLink } from "react-csv"; // Install this via `npm install react-csv`

const WithdrawHistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [withdrawData, setWithdrawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const recordsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await axios.get("https://jointogain.ap-1.evennode.com/api/user/getUsers");
      const formattedData = response.data.data.flatMap((user) =>
        user.investment_info?.flatMap((investment) => {
          const approvedPayoutsCount = investment.roi_payout_status?.filter(payout => payout.status === "Approved").length || 0;
          const remainingMonths = (investment.invest_duration_in_month || 0) - approvedPayoutsCount;

          return investment.roi_payout_status?.some((payout) => payout.status === "Approved")
            ? [{
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
              dateObj: investment.invest_confirm_date ? new Date(investment.invest_confirm_date) : null,
              date: investment.invest_confirm_date ? new Date(investment.invest_confirm_date).toLocaleDateString() : "N/A",
              payoutDate: new Date(investment.roi_payout_status.find((p) => p.status === "Approved").payout_date).toLocaleDateString(),
              bankImage: user.bankImage,
            }]
            : [];
        })
      );
      setWithdrawData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      Swal.fire("Oops!", "Please select both From and To dates.", "warning");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const filtered = withdrawData.filter(
      (item) => item.dateObj && item.dateObj >= from && item.dateObj <= to
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilteredData(withdrawData);
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <h3>Withdraw Request List</h3>
      <br />
      {/* Filter Inputs */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <TextField
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleFilter}>Filter</Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>Reset</Button>
        {filteredData.length > 0 && (
          <CSVLink
            filename="withdraw_history.csv"
            data={filteredData}
            headers={[
              { label: "Name", key: "name" },
              { label: "Invested Amount", key: "investedamount" },
              { label: "Investment Type", key: "invest_type" },
              { label: "Investment Duration", key: "invest_duration_in_month" },
              { label: "Remaining Month", key: "remainingmonth" },
              { label: "Available Credit", key: "availableCredit" },
              { label: "Amount Requested", key: "amountReq" },
              { label: "TDS", key: "tds" },
              { label: "S.C", key: "sc" },
              { label: "Net Pay", key: "netPay" },
              { label: "Date", key: "date" },
              { label: "Payout Date", key: "payoutDate" }
            ]}
            className="btn btn-success"
          >
            <Button variant="contained" color="success">Download CSV</Button>
          </CSVLink>
        )}
      </Stack>

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
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record, index) => (
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
                <TableCell style={{ color: "green", fontWeight: "bold" }}>Approved</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {selectedImage && <img src={selectedImage} alt="Bank Proof" style={{ width: "100%", maxHeight: "500px" }} />}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default WithdrawHistoryTable;
