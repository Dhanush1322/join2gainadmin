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
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = localStorage.getItem("adminToken");
  const adminId = localStorage.getItem("id"); // Make sure this is set in localStorage

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Za-z]/, "Must contain at least one letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm your new password"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.patch(
          `https://jointogain.ap-1.evennode.com/api/admin/editAdminPassword/${adminId}`,
          {
            oldPassword: values.oldPassword,
            newPassword: values.password,
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
          text: response.data.message || "Password updated successfully!",
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
              label="Old Password"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              variant="outlined"
              error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
              helperText={formik.touched.oldPassword && formik.errors.oldPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type={showNewPassword ? "text" : "password"}
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
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
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
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
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
