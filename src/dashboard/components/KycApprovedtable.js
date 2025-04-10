import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box
} from "@mui/material";
import Swal from "sweetalert2";

function KycApprovedTable() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    fetch("https://jointogain.ap-1.evennode.com/api/user/getUsers")
      .then((res) => res.json())
      .then((data) => {
        if (data.Status) {
          setUsers(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (fileUrl) => {
    if (!fileUrl || fileUrl.trim() === "") return;
    setDialogContent(fileUrl);
    setOpenDialog(true);
  };

  const getFileUrl = (type, fileName) => {
    const baseUrls = {
      aadhar: "https://jointogain.ap-1.evennode.com/api/user/downloadAadharFile/",
      pan: "https://jointogain.ap-1.evennode.com/api/user/downloadPanFile/",
      bank: "https://jointogain.ap-1.evennode.com/api/user/downloadBankPassbookFile/",
    };
    return `${baseUrls[type]}${fileName}`;
  };

  const handleKycStatus = (userId, status) => {
    Swal.fire({
      title: `Are you sure you want to ${status.toLowerCase()} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: status === "Approved" ? "#28a745" : "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://jointogain.ap-1.evennode.com/api/admin/kycApprovedRejected/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kyc_status: status }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.data.Status) {
              fetchUsers(); // Refresh data
              Swal.fire({
                title: `User ${status} successfully!`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              Swal.fire("Error", `Failed to ${status.toLowerCase()} user.`, "error");
            }
          })
          .catch((err) => {
            console.error(`${status} error:`, err);
            Swal.fire("Error", `Error updating status to ${status}.`, "error");
          });
      }
    });
  };

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h4" gutterBottom>
        All Users with KYC Documents
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>KYC Documents</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .filter(
                  (user) =>
                    user.kyc_status?.trim() === "" ||
                    user.kyc_status?.trim() === "Rejected" ||
                    user.kyc_status?.trim() === "Pending"
                )
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.kyc_status || "Pending"}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {user.uploaded_aadher_file?.trim() !== "" && (
                          <Button
                            variant="outlined"
                            onClick={() =>
                              handleView(getFileUrl("aadhar", user.uploaded_aadher_file))
                            }
                          >
                            View Aadhar
                          </Button>
                        )}
                        {user.uploaded_pan_file?.trim() !== "" && (
                          <Button
                            variant="outlined"
                            onClick={() =>
                              handleView(getFileUrl("pan", user.uploaded_pan_file))
                            }
                          >
                            View PAN
                          </Button>
                        )}
                        {user.uploaded_bank_passbook_file?.trim() !== "" && (
                          <Button
                            variant="outlined"
                            onClick={() =>
                              handleView(
                                getFileUrl("bank", user.uploaded_bank_passbook_file)
                              )
                            }
                          >
                            View Passbook
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleKycStatus(user._id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleKycStatus(user._id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>View Document</DialogTitle>
        <DialogContent>
          {dialogContent && (
            <img
              src={dialogContent}
              alt="Document"
              style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default KycApprovedTable;
