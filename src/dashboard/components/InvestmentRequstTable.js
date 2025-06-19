import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Typography,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";

function InvestmentRequestTable() {
  const [investmentData, setInvestmentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [statusData, setStatusData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchInvestmentData = () => {
    setLoading(true);
    fetch("https://jointogain.ap-1.evennode.com/api/user/getAllUsersTopUp")
      .then((response) => response.json())
      .then((data) => {
        if (!data?.Status || !Array.isArray(data.users)) {
          console.error("Invalid data", data);
          return;
        }

        const investments = data.users.flatMap((user) =>
          user.investment_info?.map((invest) => ({
            invest_type: invest.invest_type,
            invest_amount: invest.invest_amount,
            utr_no: invest.utr_no,
            uploaded_proof_file: invest.uploaded_proof_file,
            id: invest._id,
            investment_status: invest.investment_status || " ",
            name: user.name,
            date: invest.invest_apply_date,
          })) || []
        );

        const pendingInvestments = investments
          .filter((invest) => invest.investment_status === " ")
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setInvestmentData(pendingInvestments);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvestmentData();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setStatusData((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleSubmit = (id) => {
    const selectedStatus = statusData[id];

    if (!selectedStatus) {
      Swal.fire({
        title: "Error",
        text: "Please select a status before submitting.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    fetch(`https://jointogain.ap-1.evennode.com/api/admin/addTopUPApprovedRejected/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ investment_status: selectedStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === "Success") {
          Swal.fire({
            title: selectedStatus === "Approved" ? "Approved" : "Rejected",
            text: data.message || `Investment request has been ${selectedStatus.toLowerCase()} successfully!`,
            icon: "success",
            confirmButtonColor: "#3085d6",
          }).then(() => {
            fetchInvestmentData();
          });
        } else {
          Swal.fire({
            title: "Update Failed",
            text: data.message || "Status update failed!",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        Swal.fire({
          title: "Error",
          text: "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      });
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = investmentData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(investmentData.length / recordsPerPage);

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        Investment Requests (Pending)
      </Typography>

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
                  <TableCell>Name</TableCell>
                  <TableCell>Investment Type</TableCell>
                  <TableCell>Investment Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>UTR No.</TableCell>
                  <TableCell>Proof</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRecords.map((record, index) => (
                  <TableRow key={record.id || index}>
                    <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.invest_type}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleString("en-IN")}</TableCell>
                    <TableCell>₹{record.invest_amount.toLocaleString()}</TableCell>
                    <TableCell>{record.utr_no}</TableCell>
                    <TableCell>
                      {record.uploaded_proof_file ? (
                        <a
                          href={`https://jointogain.ap-1.evennode.com/api/user/downloadTopupFile?fileUrl=${record.uploaded_proof_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`https://jointogain.ap-1.evennode.com/api/user/downloadTopupFile?fileUrl=${record.uploaded_proof_file}`}
                            alt="Proof"
                            style={{ width: "100px", height: "auto", borderRadius: "5px" }}
                          />
                        </a>
                      ) : (
                        "No file"
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={statusData[record.id] || ""}
                        onChange={(event) => handleStatusChange(record.id, event.target.value)}
                        sx={{ minWidth: 120 }}
                        displayEmpty
                      >
                        <MenuItem disabled value="">
                          Select Status
                        </MenuItem>
                        <MenuItem value="Approved">Approve</MenuItem>
                        <MenuItem value="Rejected">Reject</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmit(record.id)}
                      >
                        Submit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
          />
        </>
      )}
    </Paper>
  );
}

export default InvestmentRequestTable;
