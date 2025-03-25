import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";

function KycForm() {
  const [panFile, setPanFile] = useState(null);
  const [bankPassFile, setBankPassFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);

  const handlePanFileChange = (e) => {
    setPanFile(e.target.files[0]);
  };

  const handleBankPassFileChange = (e) => {
    setBankPassFile(e.target.files[0]);
  };

  const handleAadhaarFileChange = (e) => {
    setAadhaarFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("PAN File:", panFile);
    console.log("Bank Passbook File:", bankPassFile);
    console.log("Aadhaar File:", aadhaarFile);
    // Add your submission logic here
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 4, boxShadow: 2, borderRadius: 2, bgcolor: "#fff" }}>
        <Typography variant="h5" gutterBottom>
          KYC Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Upload PAN</Typography>
            <Button variant="outlined" component="label">
              Choose File
              <input type="file" hidden onChange={handlePanFileChange} />
            </Button>
            <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
              {panFile ? panFile.name : "No file chosen"}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Upload Bank Passbook</Typography>
            <Button variant="outlined" component="label">
              Choose File
              <input type="file" hidden onChange={handleBankPassFileChange} />
            </Button>
            <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
              {bankPassFile ? bankPassFile.name : "No file chosen"}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Upload Aadhar</Typography>
            <Button variant="outlined" component="label">
              Choose File
              <input type="file" hidden onChange={handleAadhaarFileChange} />
            </Button>
            <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
              {aadhaarFile ? aadhaarFile.name : "No file chosen"}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, background: "#1a1f36" }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default KycForm;
