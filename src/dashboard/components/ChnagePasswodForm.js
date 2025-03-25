import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

function ChangePasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2NhOGEzODEyMGI2ZGQ5N2RkYWU0MzUiLCJlbWFpbCI6Im11aGFtbWFkc2hvYWliMjgwM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJhdXRoVG9rZW4iOnRydWUsImlhdCI6MTc0MTU4OTg5MCwiZXhwIjoxODI3OTg5ODkwfQ.aXD4mCR8bkLKLP_AJpxkw0t-laVLxNCXMZGqtvfe32U"; // Replace with actual token retrieval logic

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Za-z]/, "Password must contain at least one letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axios.post(
          "http://localhost:5001/api/admin/change-password",
          {
            email: values.email,
            password: values.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password changed successfully!",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
        });
      }
      setSubmitting(false);
    },
  });

  return (
    <Container maxWidth="sm" sx={{ ml: { xs: 0, md: 32 } }}>
      <Card sx={{ boxShadow: 3, borderRadius: 3, mt: 10, mb: 10, p: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Change Password
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Email ID"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              variant="outlined"
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              required
            />
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              variant="outlined"
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              variant="outlined"
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: "#070534", "&:hover": { backgroundColor: "#050422" } }}
              disabled={formik.isSubmitting}
            >
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChangePasswordForm;
