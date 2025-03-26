import React, { useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const recordsPerPage = 5;

  const investmentData = [
    { id: "G973513", name: "UJJAPPA NINGAPPA HEDIYAL", date: "25/Mar/2025", amount: 100000, status: "Active", roiLeft: 20 },
    { id: "G724114", name: "Ramesh R Savnur", date: "25/Mar/2025", amount: 150000, status: "Active", roiLeft: 20 },
    { id: "G627613", name: "VEENA BHEEMANANDA", date: "25/Mar/2025", amount: 200000, status: "Active", roiLeft: 20 },
    { id: "G924934", name: "Fakkirappa Channappa Gudageri", date: "25/Mar/2025", amount: 100000, status: "Active", roiLeft: 20 },
    { id: "G423855", name: "Sangeetha Mruthunjaya Kubasad", date: "25/Mar/2025", amount: 50000, status: "Active", roiLeft: 20 },
    { id: "G337173", name: "LOKESHA G", date: "25/Mar/2025", amount: 100000, status: "Active", roiLeft: 20 },
  ];

  const filteredData = investmentData.filter((record) => record.id.includes(searchTerm));
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
        label="Search by User ID"
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
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Invest Date</TableCell>
              <TableCell>Investment (Rs)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>ROI Left</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>{record.status}</TableCell>
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