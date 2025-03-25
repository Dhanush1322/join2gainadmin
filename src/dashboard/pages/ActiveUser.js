import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../css/ActiveUser.css';

function ActiveUser() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        fetch("http://localhost:5001/api/admin/user/all", {
            method: "GET",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2NhOGEzODEyMGI2ZGQ5N2RkYWU0MzUiLCJlbWFpbCI6Im11aGFtbWFkc2hvYWliMjgwM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJhdXRoVG9rZW4iOnRydWUsImlhdCI6MTc0MTU4OTg5MCwiZXhwIjoxODI3OTg5ODkwfQ.aXD4mCR8bkLKLP_AJpxkw0t-laVLxNCXMZGqtvfe32U"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.result && data.result.users.docs) {
                    setUsers(data.result.users.docs);
                }
            })
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    return (
        <div className="dashboard">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="dashboard-content">
                <Navbar toggleSidebar={toggleSidebar} />

                <div className="active-table-container">
                    <h3>Active Users</h3>
                    <TextField
                        label="Search by name"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        margin="normal"
                    />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>SL</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Email ID</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.filter(user =>
                                    user.name.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((user, index) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" size="small">
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="secondary" size="small" style={{ marginLeft: '10px' }}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default ActiveUser;
