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
} from "@mui/material";
import Swal from "sweetalert2";

function InvestmentRequestTable() {
  const [investmentData, setInvestmentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [statusData, setStatusData] = useState({});

  useEffect(() => {
    fetch("http://jointogain.ap-1.evennode.com/api/user/getAllUsersTopUp")
      .then((response) => response.json())
      .then((data) => {
        console.log("Full API Response:", data);

        if (!data || !data.Status) {
          console.error("Invalid API response:", data);
          return;
        }

        if (!data.users || !Array.isArray(data.users)) {
          console.error("Users data is missing or not an array:", data.users);
          return;
        }

        const investments = data.users.flatMap((user) =>
          user.investment_info?.map((invest) => ({
            invest_type: invest.invest_type,
            invest_amount: invest.invest_amount,
            utr_no: invest.utr_no,
            uploaded_proof_file: invest.uploaded_proof_file,
            id: invest._id, // Unique ID
            investment_status: invest.investment_status || " ",
          })) || []
        );

        // ✅ Filter only "Pending" investments
        const pendingInvestments = investments.filter(
          (invest) => invest.investment_status === " "
        );

        console.log("Filtered Pending Investments:", pendingInvestments);
        setInvestmentData(pendingInvestments);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setStatusData((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleSubmit = (id) => {
    const selectedStatus = statusData[id] || "Pending";
  
    fetch(`http://jointogain.ap-1.evennode.com/api/admin/addTopUPApprovedRejected/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ investment_status: selectedStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            title: selectedStatus === "Approved" ? "Approved " : "Rejected ",
            text: `Investment request has been ${selectedStatus.toLowerCase()} successfully!`,
            icon: "success", // ✅ Always success icon
            confirmButtonColor: "#3085d6",
          });
  
          setInvestmentData((prevData) =>
            prevData.filter((investment) => investment.id !== id)
          );
        } else {
          Swal.fire({
            title: "Success",
            text: data.message || "Status updated successfully!",
            icon: "success", // ✅ Always success icon
            confirmButtonColor: "#3085d6",
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo</TableCell>
              <TableCell>Investment Type</TableCell>
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
                <TableCell>{record.invest_type}</TableCell>
                <TableCell>₹{record.invest_amount.toLocaleString()}</TableCell>
                <TableCell>{record.utr_no}</TableCell>
                <TableCell>
                  <a href={record.uploaded_proof_file} target="_blank" rel="noopener noreferrer">
                    View Proof
                  </a>
                </TableCell>
                <TableCell>
                  <Select
                    value={statusData[record.id] || "Pending"}
                    onChange={(event) => handleStatusChange(record.id, event.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approve</MenuItem>
                    <MenuItem value="Rejected">Reject</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleSubmit(record.id)}>
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
    </Paper>
  );
}

export default InvestmentRequestTable;
