import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography
} from '@mui/material';

function RankTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get('http://jointogain.ap-1.evennode.com/api/user/getUsers')
      .then((response) => {
        if (response.data.Status) {
          const filtered = response.data.data.filter(
            (user) =>
              user.user_rank_info &&
              user.user_rank_info.length > 0 &&
              user.user_rank_info[0].rank_of_user !== 'Default Rank'
          );
          setUsers(filtered);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Rank Table
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="rank table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>SL</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.user_profile_id}</TableCell>
                  <TableCell>{user.user_rank_info[0].rank_of_user}</TableCell>
                  <TableCell>
                    {new Date(user.user_rank_info[0].rank_update_date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No ranked users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default RankTable;
