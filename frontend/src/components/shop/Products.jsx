import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; 
import Pagination from '@mui/material/Pagination'; 

import Breadcrumb from '../Breadcrumb';
import Filters from './Filters'; 

// Import styles
import styles from './styles/Products.module.css'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24; 

  const [accid, setAccid] = useState(null);

  // Gets JTW from local storage
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
      setAccid(response.data.data.accid);

      // DEBUG - delete later
      console.log("User profile:", response.data.data);

    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  // Add item to cart
  const addToCart = async (productId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart/create', {
        accid: accid,
        productid: productId
      });
      if (response.status === 200) {
        console.log("Item added to cart:", response.data.data[0]);
      } else {
        console.error("Failed to add item to cart:", response.data.msg);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
    }
  };

  // Fetch all products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product/get-all-products');
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);

      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (genderFilters, clothingTypeFilters) => {
    let filtered = products;

    if (genderFilters.men || genderFilters.women) {
      filtered = filtered.filter(product =>
        (genderFilters.men && product.category === 'Men') ||
        (genderFilters.women && product.category === 'Women')
      );
    }

    if (clothingTypeFilters.tops || clothingTypeFilters.bottoms) {
      filtered = filtered.filter(product =>
        (clothingTypeFilters.tops && product.type === 'Tops') ||
        (clothingTypeFilters.bottoms && product.type === 'Bottoms')
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); 
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className={styles.container}>
      <Breadcrumb />
      <div className={styles.content}>
        <Filters onFilterChange={handleFilterChange} />
        <div className={styles.shopContainer}>
          <div className={styles.grid}>
            {currentProducts.map(product => (

              <Link to={`/product/${product.id}`} key={product.id} className={styles.productCard}>
                <div className={styles.productImageContainer}>
                  <img src={product.image} alt={product.name} className={styles.image} />
                </div>
                <div className={styles.productInfo}>
                  <h2 className={styles.category}>{product.category}</h2>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.priceCartContainer}>
                    <p className={styles.price}>$ {product.price}</p>
                    <button 
                      className={styles.addButton} 
                      onClick={(e) => {
                        e.preventDefault(); // Prevents the navigation
                        addToCart(product.id);
                      }}
                    >
                      <AddShoppingCartIcon className={styles.cartIcon} /> 
                    </button>
                  </div>
                </div>
              </Link>
              
            ))}
          </div>
          <Pagination 
            count={Math.ceil(filteredProducts.length / productsPerPage)} 
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

export default Products;
