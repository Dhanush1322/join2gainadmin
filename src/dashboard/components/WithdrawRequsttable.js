import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, Dialog, DialogContent } from "@mui/material";

const WithdrawRequestTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const recordsPerPage = 5;
  
  const withdrawData = [
    { id: "G975665", name: "K S SHRUTI", credit: 94950, amount: 94950, tds: 0, sc: 0, netPay: 94950, date: "21-Mar-2025", bankImage: "bank1.jpg" },
    { id: "G933928", name: "PUSHPA MANJUNATH PISHE", credit: 8550, amount: 8550, tds: 0, sc: 0, netPay: 8550, date: "21-Mar-2025", bankImage: "bank2.jpg" },
    { id: "G344971", name: "LAVANYA LOKANATH DHARPAWAR", credit: 4050, amount: 4050, tds: 0, sc: 0, netPay: 4050, date: "21-Mar-2025", bankImage: "bank3.jpg" },
    { id: "G831658", name: "MAHESH MANKANI", credit: 2700, amount: 2700, tds: 0, sc: 0, netPay: 2700, date: "21-Mar-2025", bankImage: "bank4.jpg" },
    { id: "G458912", name: "SHRUTHI CHANNAD", credit: 10350, amount: 10350, tds: 0, sc: 0, netPay: 10350, date: "21-Mar-2025", bankImage: "bank5.jpg" },
  ];

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = withdrawData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(withdrawData.length / recordsPerPage);

  const handleOpen = (image) => {
    setSelectedImage(image);
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
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Available Credit</TableCell>
              <TableCell>Amount Req</TableCell>
              <TableCell>TDS</TableCell>
              <TableCell>S.C</TableCell>
              <TableCell>NetPay (Rs)</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Bank Details</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.credit}</TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>{record.tds.toFixed(2)}</TableCell>
                <TableCell>{record.sc.toFixed(2)}</TableCell>
                <TableCell>{record.netPay}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" size="small" onClick={() => handleOpen(record.bankImage)}>
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button variant="contained" color="success" size="small">Send</Button>
                    <Button variant="contained" color="error" size="small">Remove</Button>
                  </div>
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
      
      {/* Dialog for Viewing Bank Image */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {selectedImage && <img src={selectedImage} alt="Bank Proof" style={{ width: "100%", maxHeight: "500px" }} />}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default WithdrawRequestTable;
