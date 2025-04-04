import React, { useState, useEffect } from "react";
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
import axios from "axios";

function KycApprovedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [kycData, setKycData] = useState([]);
  const recordsPerPage = 5;

  useEffect(() => {
    axios.get("http://jointogain.ap-1.evennode.com/api/user/getUsers")
      .then(response => {
        if (response.data.Status) {
          setKycData(response.data.data);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = kycData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(kycData.length / recordsPerPage);

  const handleView = (filePath) => {
    if (!filePath || filePath.trim() === "") return;
    setDialogContent(`http://jointogain.ap-1.evennode.com/api/user/downloadAadharFile/${filePath}`);
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
              <TableCell>Date of Birth</TableCell>
              <TableCell>PAN</TableCell>
              <TableCell>AADHAR</TableCell>
              <TableCell>Bank Passbook</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record, index) => (
              <TableRow key={record._id}>
                <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                <TableCell>{record.user_profile_id}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{new Date(record.date_of_birth).toLocaleDateString()}</TableCell>
                <TableCell>
                  {record.uploaded_pan_file && (
                    <Button onClick={() => handleView(record.uploaded_pan_file)}>View</Button>
                  )}
                </TableCell>
                <TableCell>
                  {record.uploaded_aadher_file && (
                    <Button onClick={() => handleView(record.uploaded_aadher_file)}>View</Button>
                  )}
                </TableCell>
                <TableCell>
                  {record.uploaded_bank_passbook_file && (
                    <Button onClick={() => handleView(record.uploaded_bank_passbook_file)}>View</Button>
                  )}
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
          {dialogContent && <img src={dialogContent} alt="Document" style={{ width: "100%" }} />}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default KycApprovedTable;
