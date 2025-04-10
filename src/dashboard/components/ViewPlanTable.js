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

function ViewPlanTable({ userId }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://jointogain.ap-1.evennode.com/api/user/getTopUp/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();

        if (result.investment_info && result.investment_info.length > 0) {
          const formattedData = result.investment_info.map((item, index) => {
            const approvedPayouts = item.roi_payout_status.filter(payout => payout.status === 'Approved').length;
            const roiLeft = item.invest_duration_in_month - approvedPayouts;

            return {
              sNo: index + 1,
              requestDate: new Date(item.invest_apply_date).toLocaleDateString(),
              approvedDate: item.invest_confirm_date ? new Date(item.invest_confirm_date).toLocaleDateString() : 'Pending',
              investment: item.invest_amount,
              investment_type: item.invest_type,
              invest_duration_in_month: item.invest_duration_in_month,
              status: item.invest_confirm_date ? 'Active' : 'Pending',
              roiLeft: roiLeft,
            };
          });

          setData(formattedData);
        } else {
          console.log('No investment data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Box mb={2}>
        <Typography variant="h6" component="div">
          My Investments
        </Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Approved Date</TableCell>
              <TableCell>Invest Type</TableCell>
              <TableCell>Investment (Rs)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Invest Duration </TableCell>
              <TableCell>ROI Left</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.sNo}>
                <TableCell>{row.sNo}</TableCell>
                <TableCell>{row.requestDate}</TableCell>
                <TableCell>{row.approvedDate}</TableCell>
                <TableCell>{row.investment_type}</TableCell>
                <TableCell>{row.investment.toLocaleString()}</TableCell>
                <TableCell
                  style={{
                    color:
                      row.status === 'Approved' ? 'blue' :
                      row.status === 'Reject' ? 'red' :
                      row.status === 'Active' ? 'green' :
                      row.status === 'Pending' ? 'orange' : 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {row.status}
                </TableCell>
                <TableCell>{row.invest_duration_in_month}</TableCell>
                <TableCell>{row.roiLeft}</TableCell>
              </TableRow>
            ))}
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

export default ViewPlanTable;