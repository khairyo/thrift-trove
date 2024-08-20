import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Breadcrumb = () => {
  return (
    <Breadcrumbs 
      separator="/" 
      aria-label="breadcrumb"
      sx={{ color: 'var(--primary-color)', margin: '0 0 20px 0' }}
    >
      <Link
        underline="hover"
        color="inherit"
        href="/"
        sx={{ color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}
      >
        Home
      </Link>
      <Typography color="text.primary" sx={{ fontWeight: 'bold', color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}>
        Shop
      </Typography>
    </Breadcrumbs>
  );
};

export default Breadcrumb;
