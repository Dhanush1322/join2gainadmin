import React from "react";
import Swal from "sweetalert2";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function AddUserForm() {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email"),
    phone_no: Yup.string().required("Required"),
    date_of_birth: Yup.string(),
    address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    pan_number: Yup.string().required("Required"),
    aadhar_number: Yup.string().required("Required"),
    nominee_name: Yup.string().required("Required"),
    nominee_aadhar_number: Yup.string().required("Required"),
    nominee_relationship: Yup.string().required("Required"),
    agree: Yup.boolean().oneOf([true], "You must agree to the Terms and Conditions"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "male",
      email: "",
      phone_no: "",
      date_of_birth: "",
      address: "",
      city: "",
      state: "",
      pan_number: "",
      aadhar_number: "",
      nominee_name: "",
      nominee_aadhar_number: "",
      nominee_relationship: "",
      agree: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = { ...values };
      delete payload.agree; // remove checkbox from final payload
    
      try {
        const response = await axios.post(
          "https://jointogain.ap-1.evennode.com/api/admin/addUser",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        const { user_profile_id, password, _id } = response.data.data;
    
        // ✅ Store the _id in localStorage
        localStorage.setItem("userId", _id);
    
        Swal.fire({
          icon: "success",
          title: "User Added Successfully!",
          html: `
            <strong>User ID:</strong> ${user_profile_id}<br/>
            <strong>Password:</strong> ${password}<br/><br/>
            <span style="color: red;"><b>Please take a screenshot of this information for your records.</b></span>
          `,
          confirmButtonText: "OK"
        }).then(() => {
          // ✅ Redirect to AddKyc page
          navigate("/addkyc");
        });
        
        formik.resetForm();
      } catch (error) {
        console.error("Error adding user:", error);
    
        const message =
          error.response?.data?.message || "Failed to add user. Please try again.";
    
        Swal.fire("Failed", message, "error");
      }
    }
        });

  return (
    <Container maxWidth={false} disableGutters sx={{ mb: "30px", minHeight: "100vh" }}>
      <Box sx={{ width: "100%", p: 4, boxShadow: 3, borderRadius: 2, bgcolor: "#fff" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Add New User
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Name *" {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ mb: 2 }}
              />

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Gender *</FormLabel>
                <RadioGroup row {...formik.getFieldProps("gender")} name="gender">
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth label="Email" {...formik.getFieldProps("email")}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth label="Mobile Number *" {...formik.getFieldProps("phone_no")}
                error={formik.touched.phone_no && Boolean(formik.errors.phone_no)}
                helperText={formik.touched.phone_no && formik.errors.phone_no}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle1">Date of Birth</Typography>
              <TextField
                fullWidth type="date" {...formik.getFieldProps("date_of_birth")}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Address *" {...formik.getFieldProps("address")}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth label="City *" {...formik.getFieldProps("city")}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography variant="subtitle1">State *</Typography>
                <Select
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                >
                  <MenuItem value="WB">WB</MenuItem>
                  <MenuItem value="Karnataka">Karnataka</MenuItem>
                  <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                  <MenuItem value="Kerala">Kerala</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth label="Pan Number *" {...formik.getFieldProps("pan_number")}
                error={formik.touched.pan_number && Boolean(formik.errors.pan_number)}
                helperText={formik.touched.pan_number && formik.errors.pan_number}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth label="Aadhar Number *" {...formik.getFieldProps("aadhar_number")}
                error={formik.touched.aadhar_number && Boolean(formik.errors.aadhar_number)}
                helperText={formik.touched.aadhar_number && formik.errors.aadhar_number}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth label="Nominee Name *" {...formik.getFieldProps("nominee_name")}
                error={formik.touched.nominee_name && Boolean(formik.errors.nominee_name)}
                helperText={formik.touched.nominee_name && formik.errors.nominee_name}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth label="Nominee Aadhar Number *" {...formik.getFieldProps("nominee_aadhar_number")}
                error={formik.touched.nominee_aadhar_number && Boolean(formik.errors.nominee_aadhar_number)}
                helperText={formik.touched.nominee_aadhar_number && formik.errors.nominee_aadhar_number}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth label="Nominee Relationship *" {...formik.getFieldProps("nominee_relationship")}
                error={formik.touched.nominee_relationship && Boolean(formik.errors.nominee_relationship)}
                helperText={formik.touched.nominee_relationship && formik.errors.nominee_relationship}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                name="agree"
                checked={formik.values.agree}
                onChange={formik.handleChange}
              />
            }
            label="I hereby agree to Terms and Conditions"
          />
          {formik.touched.agree && formik.errors.agree && (
            <Typography color="error" variant="body2">
              {formik.errors.agree}
            </Typography>
          )}

          <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2, background: "#1a1f36" }}>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddUserForm;
