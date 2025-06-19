import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Typography,
  TextField,
  Stack,
  CircularProgress,
  Box
} from "@mui/material";
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewMembersForm() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://jointogain.ap-1.evennode.com/api/user/getUsers");
      if (response.data.Status) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(term) ||
      user.user_profile_id?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`https://jointogain.ap-1.evennode.com/api/user/deleteMember/${userId}`);
        if (response.data.Status) {
          setUsers(prev => prev.filter(user => user._id !== userId));
          Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        } else {
          Swal.fire('Failed!', 'Failed to delete the user.', 'error');
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Mobile", "Total Investment", "Join Date"];
    const rows = filteredUsers.map(user => {
      const totalInvestment = user.investment_info
        ? user.investment_info.reduce((acc, inv) => acc + (inv.invest_amount || 0), 0)
        : 0;
      return [
        user.user_profile_id,
        user.name,
        user.phone_no,
        totalInvestment,
        new Date(user.createdAt).toLocaleDateString("en-GB")
      ];
    });

    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "members_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>View Members</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by Name or User ID"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button variant="contained" color="success" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Userid</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Total Investment</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Profile</TableCell>
                  <TableCell>Downline</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const totalInvestment = row.investment_info
                    ? row.investment_info.reduce((acc, inv) => acc + (inv.invest_amount || 0), 0)
                    : 0;

                  return (
                    <TableRow key={row._id}>
                      <TableCell>{row.user_profile_id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.phone_no}</TableCell>
                      <TableCell>{row.user_profile_id}</TableCell>
                      <TableCell>{row.password}</TableCell>
                      <TableCell>
                        <Button variant="contained" size="small" onClick={() => navigate(`/ViewPlan/${row._id}`)}>
                          View
                        </Button>
                      </TableCell>
                      <TableCell>Rs. {totalInvestment}</TableCell>
                      <TableCell>{new Date(row.createdAt).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell>
                        <Button variant="contained" size="small" onClick={() => navigate(`/VieAllProfile/${row._id}`)}>
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="secondary" size="small" onClick={() => navigate(`/ViewAllDownline/${row._id}`)}>
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="error" size="small" onClick={() => handleDelete(row._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );
}

export default ViewMembersForm;
