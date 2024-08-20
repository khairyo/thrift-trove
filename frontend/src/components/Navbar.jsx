import React from 'react';
import { Link } from 'react-router-dom';
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
        <div className={styles.login}>
          Login
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
