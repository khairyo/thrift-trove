import React, { useEffect, useState } from 'react';
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
