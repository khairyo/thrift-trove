import React from 'react';
import styles from './styles/Footer.module.css';
import { FaEnvelope, FaPhone, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerContent}>
          <h2>CONTACT <span className={styles.highlight}>US</span></h2>
          <p>We'd <span className={styles.highlight}>love</span> to hear from you!</p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.envelope} />
              <span>thrift_trove@gmail.com</span>
            </div>
            <div className={styles.contactItem}>
              <FaPhone className={styles.phone} />
              <span>+65 XXXX XXXX</span>
            </div>
            <div className={styles.contactItem}>
              <FaXTwitter className={styles.xTwitter} />
              <span>@thriftTrove</span>
            </div>
            <div className={styles.contactItem}>
              <FaInstagram className={styles.instagram} />
              <span>@theRealThriftTrove</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>ThriftTrove @ all rights reserved 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
