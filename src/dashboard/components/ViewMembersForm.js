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
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function ViewMembersForm() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://jointogain.ap-1.evennode.com/api/user/getUsers");
        if (response.data.Status) {
          const usersData = response.data.data;
          setUsers(usersData);

          // Calculate total investment amount across all users
          const total = usersData.reduce((sum, user) => {
            const userInvestmentTotal = user.investment_info
              ? user.investment_info.reduce((acc, inv) => acc + (inv.invest_amount || 0), 0)
              : 0;
            return sum + userInvestmentTotal;
          }, 0);

          setTotalInvestment(total);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

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
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const totalInvestmentForUser = row.investment_info
                ? row.investment_info.reduce((acc, inv) => acc + (inv.invest_amount || 0), 0)
                : 0;

              return (
                <TableRow key={index}>
                  <TableCell>{row.user_profile_id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone_no}</TableCell>
                  
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => navigate(`/ViewPlan/${row._id}`)} // Navigate to /ViewPlan with _id
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
                      onClick={() => navigate(`/VieAllProfile/${row._id}`)} // Navigate to /ViewPlan with _id
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
