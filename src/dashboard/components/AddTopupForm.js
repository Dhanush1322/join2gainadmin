import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
function AddTopupForm() {
  const [formData, setFormData] = useState({
    selectPlan: "",
    amount: "",
    utrNo: "",
    proof: null,
    investDuration: "",
  });

  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate(); // initialize
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "proof") {
      setFormData({ ...formData, proof: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { selectPlan, amount, utrNo, proof, investDuration } = formData;
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("invest_type", selectPlan);
      formDataToSend.append("utr_no", utrNo);
      formDataToSend.append("invest_amount", amount);
      formDataToSend.append("file", proof);
      if (selectPlan === "long term") {
        if (!investDuration || isNaN(investDuration) || investDuration <= 0) {
          Swal.fire({ icon: "error", title: "Invalid Duration" });
          return;
        }
        formDataToSend.append("invest_duration_in_month", investDuration);
      }
  
      const response = await fetch(
        `https://jointogain.ap-1.evennode.com/api/user/addTopUp/${userId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        }
      );
  
      const responseBody = await response.json();
  
      if (response.ok) {
        // ✅ Auto-approve investment
        const updatedUserRes = await fetch(
          `https://jointogain.ap-1.evennode.com/api/user/getUser/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedUserData = await updatedUserRes.json();
        const updatedUser = updatedUserData?.data?.data;
        const latestInvestment = updatedUser?.investment_info?.slice(-1)[0];
  
        if (latestInvestment && latestInvestment._id) {
          await fetch(
            `https://jointogain.ap-1.evennode.com/api/admin/addTopUPApprovedRejected/${latestInvestment._id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ investment_status: "Approved" }),
            }
          );
        }
  
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Form submitted and approved successfully!",
        }).then(() => {
          setFormData({
            selectPlan: "",
            amount: "",
            utrNo: "",
            proof: null,
            investDuration: "",
          });
          navigate("/adduser");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseBody.error || "An error occurred",
        });
      }
    } catch (error) {
      console.error("Request failed:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Check your connection and try again.",
      });
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 4,
          boxShadow: 2,
          borderRadius: 2,
          bgcolor: "#fff",
          mt: 5,
        }}
      >
        <Typography variant="h5" gutterBottom>
         My Investment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="select-plan-label">Select Plan</InputLabel>
              <Select
                labelId="select-plan-label"
                id="select-plan"
                name="selectPlan"
                value={formData.selectPlan}
                label="Select Plan"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="long term">Long Term</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="UTR No."
              name="utrNo"
              value={formData.utrNo}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" component="label">
              Attach Proof
              <input type="file" name="proof" hidden onChange={handleChange} />
            </Button>
            {formData.proof && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {formData.proof.name}
              </Typography>
            )}
          </Box>

          {formData.selectPlan === "long term" && (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Investment Duration (Months)"
                name="investDuration"
                value={formData.investDuration}
                onChange={handleChange}
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ background: "#1a1f36" }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddTopupForm;

