import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog'; // Import the RegisterDialog component
import styles from './styles/Navbar.module.css';

function Navbar() {
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleLoginClose = () => {
    setLoginDialogOpen(false);
  };

  // const handleRegisterOpen = () => {
  //   setRegisterDialogOpen(true);
  // };

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
          <div className={styles.login} onClick={handleLoginClick}>
            Login
          </div>
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
