import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination,
  Typography, Box,
} from '@mui/material';

function ViewAllDownlineTable({ userId }) {
  const [data, setData] = useState([]);
  const [topUser, setTopUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchDownlineData = async (id) => {
    try {
      const response = await fetch(`https://jointogain.ap-1.evennode.com/api/user/getUser/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      const rootUser = result?.data?.data;
      setTopUser(rootUser);

      const flattenReferrals = (referrals, level = 1) => {
        let flattened = [];

        for (const referral of referrals) {
          referral.user_level = level;
          flattened.push(referral);

          if (referral.referrals?.length > 0) {
            flattened = flattened.concat(flattenReferrals(referral.referrals, level + 1));
          }
        }

        return flattened;
      };

      if (rootUser?.referrals?.length > 0) {
        const flattenedData = flattenReferrals(rootUser.referrals);
        setData(flattenedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching downline:', error);
      setData([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDownlineData(userId);
    }
  }, [userId]);

  const handleRowClick = (user) => {
    // When user is clicked, fetch their downline as new top-level user
    fetchDownlineData(user._id);
    setPage(0);
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
          {topUser ? `Referrals of ${topUser.name}` : 'Downline Members'}
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
              <TableCell>Activation Status</TableCell>
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
                  <TableRow
                    hover
                    key={row._id}
                    onClick={() => handleRowClick(row)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{row.user_profile_id}</TableCell>
                    <TableCell>{row.user_level}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {row.investment_info?.length > 0
                        ? row.investment_info.reduce((sum, inv) => sum + (inv.invest_amount || 0), 0).toLocaleString('en-IN')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{row.user_status === 'Inactive' ? 'Inactive' : 'Active'}</TableCell>
                  </TableRow>
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
