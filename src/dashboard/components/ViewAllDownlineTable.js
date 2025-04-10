import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
} from '@mui/material';

function ViewAllDownlineTable({ userId }) {
  const [data, setData] = useState([]); // Holds the referral data
  const [selectedUser, setSelectedUser] = useState(null); // Stores the clicked user
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);



  // Fetch referral data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://jointogain.ap-1.evennode.com/api/user/getUser/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
           
          },
        });

        const result = await response.json();
        console.log(result); // Log the response to check the structure of the data

        // Check if the result and the referrals field exist
        if (result?.data?.data?.referrals) {
          setData(result.data.data.referrals);
        } else {
          console.error('Referrals not found in the response data');
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]); // Fetch data whenever the userId prop changes

  // Handle row click to show details of the clicked user's referrals
  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box mb={2}>
        <Typography variant="h6" component="div">
          {selectedUser ? `Referrals of ${selectedUser.name}` : 'Downline Members'}
        </Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Investment (Rs)</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Activation Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No data available</TableCell>
              </TableRow>
            ) : (
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <React.Fragment key={row._id}>
                    {/* Main Row */}
                    <TableRow
                      hover
                      onClick={() => handleRowClick(row)} // Click event to load referrals
                      style={{ cursor: "pointer", background: selectedUser?._id === row._id ? "#f0f8ff" : "inherit" }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.user_profile_id}</TableCell>
                      <TableCell>{row.user_level || 'N/A'}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.investment_info.length > 0 ? row.investment_info[0].invest_amount.toLocaleString() : 'N/A'}</TableCell>
                      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{row.user_status === 'Inactive' ? 'Inactive' : 'Active'}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}

export default ViewAllDownlineTable;
