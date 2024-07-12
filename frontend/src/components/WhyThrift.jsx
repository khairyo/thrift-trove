import React from 'react';
import styles from '../styles/WhyThrift.module.css';

const WhyThrift = () => {
  return (
    <section className={styles.whyThriftSection}>
      <h2 className={styles.title}>Why should I thrift?</h2>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <img src="/images/sustainable-products.png" alt="Sustainable Products" className={styles.icon} />
          <h3 className={styles.title2}>Sustainable Products</h3>
          <p>Explore our carefully curated selection of sustainable products, each designed to reduce your carbon footprint.</p>
        </div>
        <div className={styles.card}>
          <img src="/images/eco-friendly-choices.png" alt="Eco-Friendly Choices" className={styles.icon} />
          <h3 className={styles.title2}>Eco-Friendly Choices</h3>
          <p>Make conscious choices with our eco-friendly products, knowing that your purchases promote ethical sourcing and responsible manufacturing practices.</p>
        </div>
        <div className={styles.card}>
          <img src="/images/high-quality-selection.png" alt="High-Quality Selection" className={styles.icon} />
          <h3 className={styles.title2}>High-Quality Selection</h3>
          <p>Invest in long-lasting and reliable products that meet our stringent quality standards, ensuring your satisfaction and the longevity of your purchases.</p>
        </div>
        <div className={styles.card}>
          <img src="/images/sustainable-packaging.png" alt="Sustainable Packaging" className={styles.icon} />
          <h3 className={styles.title2}>Sustainable Packaging</h3>
          <p>Our sustainable packaging ensures that your orders arrive safely while minimizing their impact on the planet.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyThrift;
