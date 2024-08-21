import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; 
import { Button } from '@mui/material';

// import styles
import styles from './styles/HomeShop.module.css'; 
import { primaryButton } from '../styles/MuiStyles.js';

const HomeShop = () => {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/shop');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product/get-all-products');
        setProducts(response.data.data.slice(0, 6));

        // DEBUG
        console.log('Products:', response.data.data);
        console.log(typeof response.data.data);

      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.shopContainer}>
      <h1 className={styles.title}>Shop</h1>
      <div className={styles.grid}>
        {products.map(product => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImageContainer}>
              <img src={product.image} alt={product.name} className={styles.image} />
            </div>
            <div className={styles.productInfo}>
              <h2 className={styles.category}>{product.category}</h2>
              <h3 className={styles.productName}>{product.name}</h3>
              <div className={styles.priceCartContainer}>
                <p className={styles.price}>$ {product.price}</p>
                <button className={styles.addButton}>
                  <AddShoppingCartIcon className={styles.cartIcon} /> 
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button sx={{ ...primaryButton, marginTop: '50px', marginBottom: '20px' }} variant="contained" onClick={handleClick}>View all products</Button>
    </div>
  );
};

export default HomeShop;
