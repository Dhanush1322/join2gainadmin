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
  CircularProgress,
  Box,
} from "@mui/material";

function InvestmentHistoryTable() {
  const [investmentData, setInvestmentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch("https://jointogain.ap-1.evennode.com/api/user/getAllUsersTopUp")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.Status && Array.isArray(data.users)) {
          const formattedData = data.users.flatMap((user) =>
            user.investment_info?.map((investment, index) => {
              const approvedPayouts = investment.roi_payout_status?.filter(
                (payout) => payout.status === "Approved"
              ).length || 0;

              const roiLeft =
                (investment.invest_duration_in_month || 0) - approvedPayouts;

              const status = (investment.investment_status || "N/A").trim();

              return {
                id: index + 1,
                username: user.email || "N/A",
                name: user.name || "N/A",
                investDateRaw: investment.invest_apply_date || null,
                investDate: investment.invest_apply_date
                  ? new Date(investment.invest_apply_date).toLocaleDateString()
                  : "N/A",
                amount: investment.invest_amount || 0,
                status,
                roiLeft: roiLeft >= 0 ? roiLeft : 0,
                investment_type: investment.invest_type,
                invest_duration_in_month: investment.invest_duration_in_month,
              };
            }) || []
          );

          formattedData.sort(
            (a, b) => new Date(b.investDateRaw) - new Date(a.investDateRaw)
          );

          const filteredData = formattedData.filter(
            (record) =>
              record.status === "Approved" || record.status === "Rejected"
          );

          setInvestmentData(filteredData);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
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
        label="Search by Email"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                {currentRecords.length > 0 ? (
                  currentRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                      <TableCell>{record.username}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.investDate}</TableCell>
                      <TableCell>{record.investment_type}</TableCell>
                      <TableCell>₹{record.amount.toLocaleString()}</TableCell>
                      <TableCell
                        style={{
                          color:
                            record.status === "Approved"
                              ? "green"
                              : record.status === "Rejected"
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={totalPages || 1}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
          />
        </>
      )}
    </Paper>
  );
}

export default InvestmentHistoryTable;
