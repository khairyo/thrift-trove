import React from 'react';

const StripeCancel = () => {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90vh',
      textAlign: 'center',
      borderTop: '3px solid #FE5A2A', 
    },
    text: {
      fontFamily: 'var(--font-family-text)', 
      fontSize: '20px',
      color: 'black',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>
        Order Cancelled.<br />
        You have not been charged.
      </h1>
    </div>
  );
};

export default StripeCancel;