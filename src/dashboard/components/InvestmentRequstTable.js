import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, Typography } from "@mui/material";

function InvestmentRequestTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  const investmentData = [
    { id: 1, plan: "Gold", amount: "₹50,000", utr: "UTR12345", image: "image1.jpg" },
    { id: 2, plan: "Silver", amount: "₹30,000", utr: "UTR67890", image: "image2.jpg" },
    { id: 3, plan: "Platinum", amount: "₹1,00,000", utr: "UTR54321", image: "image3.jpg" },
    { id: 4, plan: "Diamond", amount: "₹2,00,000", utr: "UTR98765", image: "image4.jpg" },
    { id: 5, plan: "Gold", amount: "₹75,000", utr: "UTR45678", image: "image5.jpg" },
    { id: 6, plan: "Silver", amount: "₹25,000", utr: "UTR11223", image: "image6.jpg" },
  ];

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = investmentData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(investmentData.length / recordsPerPage);

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        Investment Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo</TableCell>
              <TableCell>Investment Plan</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>UTR No.</TableCell>
              <TableCell>Proof</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                <TableCell>{record.plan}</TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>{record.utr}</TableCell>
                <TableCell>
                  <img src={record.image} alt="Proof" style={{ height: 40, width: 40, objectFit: "cover" }} />
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
