import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';

const LoginDialog = ({ open, onClose, onRegisterOpen }) => {
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
        Login to <span style={{ color: 'var(--primary-color)', fontStyle: 'italic' }}>ThriftTrove</span>
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Email"
          variant="outlined"
          sx={{
            ...commonTextFieldStyles(),
            marginTop: '16px',
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          sx={{
            ...commonTextFieldStyles(),
          }}
        />

        {/* Register new account / Take me in */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              onClose();  
              onRegisterOpen();  
            }}
            sx={{ 
              color: 'gray', 
              fontFamily: 'var(--font-family-text)',
              marginBottom: '20px',
              marginTop: '-10px',
              textAlign: 'right',
              textDecorationColor: 'gray',  // Change the underline color to gray
              '&:hover': {
                color: 'black',
                textDecorationColor: 'black',  // Keep underline gray on hover
              },
            }}
          >
            New here? Register a new account
          </Link>
          <Button
            variant="contained"
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
              width: 'auto'
            }}
          >
            Take me in!
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
