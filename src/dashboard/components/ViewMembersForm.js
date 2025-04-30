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
} from "@mui/material";
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewMembersForm() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Fetch user data from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://jointogain.ap-1.evennode.com/api/user/getUsers");
      if (response.data.Status) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
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
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
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
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>View Members</Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Total Investment</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Downline</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const totalInvestmentForUser = row.investment_info
                ? row.investment_info.reduce((acc, inv) => acc + (inv.invest_amount || 0), 0)
                : 0;

              return (
                <TableRow key={row._id}>
                  <TableCell>{row.user_profile_id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone_no}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => navigate(`/ViewPlan/${row._id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>Rs. {totalInvestmentForUser}</TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => navigate(`/VieAllProfile/${row._id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained"
                      color="secondary" 
                      size="small"
                      onClick={() => navigate(`/ViewAllDownline/${row._id}`)} 
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained"
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(row._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default ViewMembersForm;
