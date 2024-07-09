import React from 'react';
import { Button } from '@mui/material';

// import components
import Carousel from './Carousel';

// import styles
import styles from '../styles/WelcomeSection.module.css';
import { primaryButton } from '../styles/MuiStyles.js';

function WelcomeSection() {
  return (
    <div className={styles.welcomeSection}>
      <div className={styles.welcomeContent}>
        <h1>Welcome to <span className={styles.highlight}>ThriftTrove</span></h1>
        <h2>It's terrific to see you here.</h2>
        <p>
          At <span className={styles.highlight2}>ThriftTrove</span>, we believe in the joy of discovering unique treasures and giving pre-loved items a new home. Whether you're looking for a vintage gem, a trendy piece, or a one-of-a-kind find, we've got something special just for you. Dive into our collection and enjoy the thrill of thrifting from the comfort of your home.
        </p>
        <Button sx={primaryButton} variant="contained">Shop now</Button>
      </div>

      <div className={styles.carouselSection}>
        <h3>Check out what's trending</h3>
        <Carousel />
      </div>
    </div>
  );
}

export default WelcomeSection;
