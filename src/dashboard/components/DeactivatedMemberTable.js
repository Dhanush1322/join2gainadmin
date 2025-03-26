
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from "@mui/material";

const membersData = [
  { id: "G973513", name: "UJJAPPA NINGAPPA HEDIYAL", mobile: "9880837276", plan: "Monthly", investment: 100000, joinDate: "25/Mar/2025" },
  { id: "G724114", name: "Ramesh R Savnur", mobile: "8453755500", plan: "Monthly", investment: 150000, joinDate: "25/Mar/2025" },
  { id: "G627613", name: "VEENA BHEEMANANDA", mobile: "9844814252", plan: "Monthly", investment: 200000, joinDate: "25/Mar/2025" },
  { id: "G924934", name: "Fakkirappa Channappa Gudageri", mobile: "9980240195", plan: "Monthly", investment: 100000, joinDate: "25/Mar/2025" },
  { id: "G423855", name: "Sangeetha Mruthunjaya Kubasad", mobile: "8951276656", plan: "Monthly", investment: 50000, joinDate: "25/Mar/2025" },
  // Add remaining data here...
];

function DeactivatedMemberTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
       <h3>Deactivated Members</h3>
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
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membersData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.mobile}</TableCell>
                <TableCell>{row.plan}</TableCell>
                <TableCell>{row.investment}</TableCell>
                <TableCell>{row.joinDate}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" size="small">View</Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" size="small">View</Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="error" size="small">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={membersData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default DeactivatedMemberTable;
