import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';
import styles from './styles/Navbar.module.css';
import axios from 'axios';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      throw new Error("No token found in local storage");
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/account', {
        headers: {
          Authorization: token,
        },
      });
      setUserProfile(response.data.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleLoginClose = () => {
    setLoginDialogOpen(false);
  };

  const handleRegisterClose = () => {
    setRegisterDialogOpen(false);
  };

  const handleSwitchToRegister = () => {
    setLoginDialogOpen(false);
    setRegisterDialogOpen(true);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>ThriftTrove</Link>
          </div>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search products..."
            />
            <SearchIcon className={styles.searchIcon} />
          </div>

          {isLoggedIn && userProfile ? (
            <div className={styles.loggedInContainer}>
              <ShoppingCartIcon className={styles.cartIcon} />
              <img 
                src={userProfile.profile_picture || '/path/to/placeholder-image.png'} 
                alt="Profile" 
                className={styles.profileImage} 
                onError={(e) => e.target.src = '/images/blank_profile.jpg'} 
              />
            </div>
          ) : (
            <div className={styles.login} onClick={handleLoginClick}>
              Login
            </div>
          )}
        </div>
      </div>

      <LoginDialog 
        open={isLoginDialogOpen} 
        onClose={handleLoginClose} 
        onRegisterOpen={handleSwitchToRegister} 
      />

      <RegisterDialog 
        open={isRegisterDialogOpen} 
        onClose={handleRegisterClose} 
      />
    </nav>
  );
}

export default Navbar;
