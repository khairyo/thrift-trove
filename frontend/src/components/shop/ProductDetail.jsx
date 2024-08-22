import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading...</p>; // Show a loading message while fetching the product
  }

  return (
    <div className={styles.productDetailContainer}>
      <div className={styles.productImageContainer}>
        <img src={product.image} alt={product.name} className={styles.image} />
      </div>
      <div className={styles.productInfoContainer}>
        <h2 className={styles.category}>{product.category}</h2>
        <h1 className={styles.productName}>{product.name}</h1>
        <p className={styles.price}>{product.price}</p>
        <p className={styles.description}>{product.description}</p>
        <button className={styles.addToCartButton}>
          <span className={styles.cartIcon}>🛒</span> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
