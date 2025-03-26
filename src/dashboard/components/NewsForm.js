import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";

function NewsForm() {
  const [displayFor, setDisplayFor] = useState("All");
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [newsData, setNewsData] = useState([
    { id: 1, displayFor: "All", description: "Congratulations Goa Achievers", status: "Active" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const totalPages = Math.ceil(newsData.length / recordsPerPage);

  const handleSubmit = () => {
    const newEntry = {
      id: newsData.length + 1,
      displayFor,
      description,
      status: "Active",
    };
    setNewsData([...newsData, newEntry]);
    setDescription("");
    setUserId("");
    setDisplayFor("All");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const currentRecords = newsData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <h2>Add News</h2>
      <FormControl fullWidth sx={{ mb: 2 }}>
        
        <Select
          value={displayFor}
          onChange={(e) => setDisplayFor(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Individual">Individual</MenuItem>
        </Select>
      </FormControl>

      {displayFor === "Individual" && (
        <TextField
          fullWidth
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>

      <h2>News List</h2>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Display For</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((news, index) => (
              <TableRow key={news.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{news.displayFor}</TableCell>
                <TableCell>{news.description}</TableCell>
                <TableCell>{news.status}</TableCell>
                <TableCell>
                  <Button variant="contained" color="warning" size="small">Edit</Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="error" size="small">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
      />
    </Paper>
  );
}

export default NewsForm;
