import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Card, CardContent, Typography } from '@mui/material';
import Swal from 'sweetalert2';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://jointogain.ap-1.evennode.com/api/admin/loginAdmin', {
        email_id: email,
        password: password,
      }, {
        headers: { "Content-Type": "application/json" }
      });
  
      console.log("API Response:", response.data);
  
      if (response.data.status) {
        // Store token and user data in localStorage
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('id', response.data.data._id);

  
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/Dashboard');
        });
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error.message);
  
      Swal.fire({
        icon: 'error',
        title: 'Invalid Credentials',
        text: error.response?.data?.message || 'Please check your Email and Password',
      });
    }
  };
    return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, width: '100%', maxWidth: 400 }}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src='./img/logoo.png' alt="Admin" style={{ width: '100px' }} />
          </div>
          <Typography variant="h5" align="center" gutterBottom>
            Admin Login
          </Typography>
         
          <TextField
            fullWidth
            label="Email ID"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 ,background:'#99a637' }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AdminLogin;