import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import axios from 'axios';

function AwardAchieversTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [awardRows, setAwardRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://jointogain.ap-1.evennode.com/api/user/getAllUsersRewards')
      .then((response) => {
        const data = response.data?.data || [];

        // Flatten rewards for table
        const processed = data.flatMap((user) =>
          (user.rewards || []).map((reward) => ({
            user_profile_id: user.user_profile_id,
            name: user.name,
            reward_name: reward.reward_name,
            reward_achieved_date: reward.reward_achieved_date,
          }))
        );

        setAwardRows(processed);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Award Achievers</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SNo</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Award</TableCell>
                  <TableCell>Achieved Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {awardRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{row.user_profile_id || 'N/A'}</TableCell>
                      <TableCell>{row.name || 'N/A'}</TableCell>
                      <TableCell>{row.reward_name || 'N/A'}</TableCell>
                      <TableCell>
                        {row.reward_achieved_date
                          ? new Date(row.reward_achieved_date).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={awardRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
}

export default AwardAchieversTable;
