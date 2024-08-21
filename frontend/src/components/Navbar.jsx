import React from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles/Navbar.module.css';

function Navbar() {
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
          <div className={styles.login}>
            Login
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
