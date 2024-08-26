import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Breadcrumb = () => {
  const location = useLocation();
  
  // Get the pathnames by splitting the URL path
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs 
      separator="/" 
      aria-label="breadcrumb"
      sx={{ color: 'var(--primary-color)', margin: '10px 0 30px 0' }}
    >
      <Link
        underline="hover"
        color="inherit"
        component={RouterLink}
        to="/"
        sx={{ color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}
      >
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography 
            key={to} 
            color="text.primary" 
            sx={{ fontWeight: 'bold', color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}
          >
            {capitalize(value)}
          </Typography>
        ) : (
          <Link
            key={to}
            underline="hover"
            color="inherit"
            component={RouterLink}
            to={to}
            sx={{ color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}
          >
            {capitalize(value)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

// Helper function to capitalize the first letter of each breadcrumb item
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export default Breadcrumb;