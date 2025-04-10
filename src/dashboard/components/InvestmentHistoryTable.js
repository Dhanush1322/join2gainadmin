import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Pagination,
  Typography,
} from "@mui/material";

function InvestmentHistoryTable() {
  const [investmentData, setInvestmentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const recordsPerPage = 10;

  useEffect(() => {
    fetch("https://jointogain.ap-1.evennode.com/api/user/getAllUsersTopUp")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // Debugging

        if (data && data.Status && Array.isArray(data.users)) {
          const formattedData = data.users.flatMap((user) =>
            user.investment_info?.map((investment, index) => {
              const approvedPayouts = investment.roi_payout_status?.filter(
                (payout) => payout.status === "Approved"
              ).length || 0;
              const roiLeft =
                (investment.invest_duration_in_month || 0) - approvedPayouts;

              return {
                id: index + 1,
                username: user.email || "N/A",
                name: user.name || "N/A",
                investDate: investment.invest_apply_date
                  ? new Date(investment.invest_apply_date).toLocaleDateString()
                  : "N/A",
                amount: investment.invest_amount || 0,
                status: investment.investment_status || "N/A",
                roiLeft: roiLeft >= 0 ? roiLeft : 0, // Ensuring ROI Left doesn't go negative
                investment_type: investment.invest_type,
                invest_duration_in_month: investment.invest_duration_in_month,
              };
            }) || []
          );

          // **Filter Only Approved and Rejected**
          const filteredData = formattedData.filter(
            (record) => record.status === "Approved" || record.status === "Reject"
          );

          console.log("Filtered Data:", filteredData); // Debugging
          setInvestmentData(filteredData);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredData = investmentData.filter((record) =>
    record.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        Investment History
      </Typography>
      <TextField
        label="Search by Username"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Invest Date</TableCell>
              <TableCell>Investment Type</TableCell>
              <TableCell>Investment (Rs)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Investment Duration (Months)</TableCell>
              <TableCell>ROI Left (Months)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                <TableCell>{record.username}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.investDate}</TableCell>
                <TableCell>{record.investment_type}</TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell
                  style={{
                    color:
                      record.status === "Approved"
                        ? "green"
                        : record.status === "Pending"
                        ? "orange"
                        : record.status === "Reject"
                        ? "red"
                        : "black",
                    fontWeight: "bold",
                  }}
                >
                  {record.status}
                </TableCell>
                <TableCell>{record.invest_duration_in_month}</TableCell>
                <TableCell>{record.roiLeft}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages || 1}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
      />
    </Paper>
  );
}

export default InvestmentHistoryTable;
