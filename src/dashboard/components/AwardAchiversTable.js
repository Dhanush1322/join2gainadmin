import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';

function AwardAchieversTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const awards = [
    { SNo: 1, Username: 'G925616', Name: 'MRUTHYUNJAYA VEERAPPA KUBASAD', Award: 'Mobile', AchievedDate: '3/26/2025' },
    { SNo: 2, Username: 'G375625', Name: 'Naveenkumar F Mulagund', Award: 'Mobile', AchievedDate: '3/21/2025' },
    { SNo: 3, Username: 'G224469', Name: 'N S UMESH', Award: 'Laptop / India Trip', AchievedDate: '3/21/2025' },
    { SNo: 4, Username: 'G143959', Name: 'SHASHIKANTH K B', Award: 'Laptop / India Trip', AchievedDate: '3/21/2025' },
    { SNo: 5, Username: 'G129968', Name: 'ASHOK KUMAR P', Award: 'Mobile', AchievedDate: '3/21/2025' },
    { SNo: 6, Username: 'G898355', Name: 'Ramesh S Mathad', Award: 'Bike / World Trip', AchievedDate: '3/20/2025' },
    { SNo: 7, Username: 'G279248', Name: 'SHANTHAPPA HIRANNANAVAR', Award: 'Mobile', AchievedDate: '3/20/2025' },
    { SNo: 8, Username: 'G632933', Name: 'KARABASAPPA VEERAPPA BIDARI', Award: 'Laptop / India Trip', AchievedDate: '3/16/2025' },
    { SNo: 9, Username: 'G632933', Name: 'KARABASAPPA VEERAPPA BIDARI', Award: 'Mobile', AchievedDate: '3/16/2025' }
  ];

  return (
    <div>
     
      <TableContainer component={Paper}>
      <h3>Award Achievers</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Award</TableCell>
              <TableCell>Achieved Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {awards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.SNo}>
                <TableCell>{row.SNo}</TableCell>
                <TableCell>{row.Username}</TableCell>
                <TableCell>{row.Name}</TableCell>
                <TableCell>{row.Award}</TableCell>
                <TableCell>{row.AchievedDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={awards.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default AwardAchieversTable;
