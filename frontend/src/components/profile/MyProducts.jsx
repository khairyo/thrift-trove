import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from '@mui/material/Pagination'; 

import Breadcrumb from '../Breadcrumb';

// Import styles
import styles from './styles/MyProducts.module.css'; 

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24; 
  const [accid, setAccid] = useState(null);

  // Gets JWT from local storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAccid(token);
    } else {
      throw new Error("No token found in local storage");
    }
  }, []);

  // Pass in JWT to get user data from database -> return user's accid
  const fetchAccid = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/account', {
        headers: {
          Authorization: token,
        },
      });
      setAccid(parseInt(response.data.data.accid, 10)); // Convert to integer

      // DEBUG - delete later
      console.log("User profile:", response.data.data);
      console.log(typeof response.data.data.accid);

    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  // Fetch products from database where JWT accid = "products" db table uploader_id
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/get-all-products-by-acc/${accid}`);
        setProducts(response.data.data);
  
        console.log("Products:", response.data.data); // For debugging
      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };
  
    if (accid) {
      fetchProducts();
    }
  }, [accid]);  

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className={styles.container}>
      <Breadcrumb />
      <div className={styles.content}>
        <div className={styles.shopContainer}>
          <div className={styles.grid}>
            {products.map(product => (

              <Link to={`/my-product/${product.id}`} key={product.id} className={styles.productCard}>
                <div className={styles.productImageContainer}>
                  <img src={product.image} alt={product.name} className={styles.image} />
                </div>
                <div className={styles.productInfo}>
                  <h2 className={styles.category}>{product.category}</h2>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.priceCartContainer}>
                    <p className={styles.price}>$ {product.price}</p>
                  </div>
                </div>
              </Link>
              
            ))}
          </div>
          <Pagination 
            count={Math.ceil(products.length / productsPerPage)} 
            page={currentPage} 
            onChange={handlePageChange} 
            sx={{ 
              marginTop: '50px', 
              display: 'flex', 
              justifyContent: 'center', 
              marginRight: '20%', 
              '& .Mui-selected': {
                backgroundColor: 'var(--primary-color)',
                color: '#fff', 
                '&:hover': {
                  backgroundColor: 'var(--primary-color)',
                  color: '#fff', 
                },
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
