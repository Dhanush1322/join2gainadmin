import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const AddBankDetailsForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bankName: "",
    ifsc: "",
    branch: "",
    accountNumber: "",
  });

  useEffect(() => {
    if (userId && token) {
      axios
        .get(`https://jointogain.ap-1.evennode.com/api/user/getUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data?.data?.data) {
            const userData = response.data.data.data;
            setFormData({
              bankName: userData.bank_name || "",
              ifsc: userData.ifsc || "",
              branch: userData.branch || "",
              accountNumber: userData.ac_number || "",
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          setLoading(false);
        });
    } else {
      console.warn("Missing User ID or Token. Skipping API call.");
      setLoading(false);
    }
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const updatedData = {
    bank_name: formData.bankName,
    ifsc: formData.ifsc,
    branch: formData.branch,
    ac_number: formData.accountNumber,
  };

  axios
    .put(
      `https://jointogain.ap-1.evennode.com/api/user/updateUserProfile/${userId}`,
      updatedData,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      Swal.fire("Success!", "Bank details updated successfully.", "success").then(() => {
        navigate("/AddTopup"); // 👈 Change this path to your actual KYC route
      });
    })
    .catch(() => {
      Swal.fire("Error!", "Failed to update bank details.", "error");
    });
};

  if (loading) return <Typography align="center">Loading...</Typography>;

  return (
    <Container
      maxWidth="lg"
      style={{
        marginTop: "60px",
        marginLeft: isMobile ? "0px" : "250px",
        transition: "margin-left 0.3s ease-in-out",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Bank Information
            </Typography>
            <Grid container spacing={3}>
              {["bankName", "ifsc", "branch", "accountNumber"].map((field, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField
                    fullWidth
                    label={field.replace(/([A-Z])/g, " $1").trim()}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            Save Bank Details
          </Button>
        </Grid>
      </form>
    </Container>
  );
};

export default AddBankDetailsForm;
