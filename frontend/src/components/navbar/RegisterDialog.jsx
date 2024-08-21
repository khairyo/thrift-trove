import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const RegisterDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/account/create', {
        username,
        accemail: email,
        accpass: password,
      });

      console.log("Account created for user: ", email);

      if (response.status === 201) {
        onClose(); // Close the dialog if account is successfully created
      } else if (response.status === 409) {
        setError('Account already exists');
      } else {
        setError('Failed to create an account'+ response.data.msg);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('Account already exists');
      } else if (err.response && err.response.status === 404) {
        setError('Failed to create an account');
      } else {
        setError('An unexpected error occurred: ' + err.message);
      }
    }
  };

  const commonTextFieldStyles = () => ({
    marginBottom: '16px',
    width: '100%',
    '& .MuiInputBase-root': {
      fontFamily: 'var(--font-family-text)',
    },
    '& .MuiInputLabel-root': {
      fontFamily: 'var(--font-family-text)',
      color: 'gray',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'gray',
      },
      '&:hover fieldset': {
        borderColor: 'gray',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'gray',
      },
    },
    '& .Mui-focused': {
      color: 'gray',
    },
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: '20px',
          padding: '10px 10px 5px 10px',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', color: 'black', fontFamily: 'var(--font-family)', fontWeight: 'bold' }}>
        Register a new account
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            ...commonTextFieldStyles(),
            marginTop: '16px', 
          }}
        />
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            ...commonTextFieldStyles(), 
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            ...commonTextFieldStyles(), 
          }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleRegister}
            sx={{
              fontFamily: 'var(--font-family-text)',
              backgroundColor: 'var(--primary-color)',
              fontSize: '14px',
              color: 'white',
              textTransform: 'none',
              borderRadius: '5px',
              '&:hover': {
                backgroundColor: 'white',
                color: 'var(--primary-color)',
                border: '1px solid var(--primary-color)',
              },
            }}
          >
            Register
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
