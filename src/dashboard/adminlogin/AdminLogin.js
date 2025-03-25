import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Card, CardContent, Typography } from '@mui/material';
import Swal from 'sweetalert2';

function AdminLogin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const validUserId = "admin";
    const validPassword = "password123";
  
    if (userId === validUserId && password === validPassword) {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        confirmButtonText: 'OK' // This ensures an OK button appears
      }).then(() => {
        navigate('/Dashboard');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Credentials',
        text: 'Please check your User ID and Password'
      });
    }
  };
  
  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, width: '100%', maxWidth: 400 }}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src='../../img/join.png' style={{ width: '100px' }} />
          </div>
          <Typography variant="h5" align="center" gutterBottom>
            Admin Login
          </Typography>
         
          <TextField
            fullWidth
            label="User ID"
            variant="outlined"
            margin="normal"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
            sx={{ mt: 2 ,background:'#99a637'}}
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
