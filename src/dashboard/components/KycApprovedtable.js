import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

function KycApprovedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const recordsPerPage = 5;

  const kycData = [
    { id: 1, username: "G100001", name: "Join2Gain", date: "03/Jan/2025 03:38 PM", pan: "View", aadhar: "View", bank: "View", status: "Approved" },
    { id: 2, username: "G584288", name: "SANKAPPA CHATRAD", date: "12/Feb/2025 03:32 PM", pan: "View", aadhar: "", bank: "", status: "Approved" },
  ];

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = kycData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(kycData.length / recordsPerPage);

  const handleStatusToggle = (id) => {
    const updatedData = kycData.map((item) =>
      item.id === id ? { ...item, status: item.status === "Approved" ? "Rejected" : "Approved" } : item
    );
    console.log(updatedData);
  };

  const handleView = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
        <h3>KYC Details</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>PAN/CR</TableCell>
              <TableCell>AADHAR</TableCell>
              <TableCell>Bank Passbook</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                <TableCell>{record.username}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  {record.pan && <Button onClick={() => handleView("PAN Details")}>View</Button>}
                </TableCell>
                <TableCell>
                  {record.aadhar && <Button onClick={() => handleView("Aadhar Details")}>View</Button>}
                </TableCell>
                <TableCell>
                  {record.bank && <Button onClick={() => handleView("Bank Passbook Details")}>View</Button>}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="contained"
                    color={record.status === "Approved" ? "success" : "error"}
                    onClick={() => handleStatusToggle(record.id)}
                  >
                    {record.status}
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
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>View Document</DialogTitle>
        <DialogContent>
          {dialogContent}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default KycApprovedTable;
