import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; 
import Pagination from '@mui/material/Pagination'; 

import Breadcrumb from '../Breadcrumb';
import Filters from './Filters'; 
import useFetchAccid from '../../hooks/UseFetchAccid';

// Import styles
import styles from './styles/Products.module.css'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24; 

  const { accid, error } = useFetchAccid(); 
  const location = useLocation();  // Get the URL query params

  // Extract the search query from the URL
  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search); // Parse the URL for search query
    return params.get('search') || '';  // Return the search query or empty string if not present
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
        let response;
        if (accid) {
          response = await axios.get(`http://localhost:5000/api/product/get-all-other-products/${accid}`);
        } else {
          response = await axios.get('http://localhost:5000/api/product/get-all-products');
        }
        const allProducts = response.data.data;
        setProducts(allProducts);

        // Get the search query from the URL
        const searchQuery = getSearchQuery().toLowerCase();
        applyFilters(allProducts, activeFilters, searchQuery);
      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    fetchProducts();
  }, [accid, location.search]);

  const applyFilters = (allProducts, filters, searchQuery) => {
    let filtered = allProducts;

    if (filters.gender.men || filters.gender.women) {
      filtered = filtered.filter(product =>
        (filters.gender.men && product.category === 'Men') ||
        (filters.gender.women && product.category === 'Women')
      );
    }

    if (filters.clothingType.tops || filters.clothingType.bottoms) {
      filtered = filtered.filter(product =>
        (filters.clothingType.tops && product.type === 'Tops') ||
        (filters.clothingType.bottoms && product.type === 'Bottoms')
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); 
  };

  const [activeFilters, setActiveFilters] = useState({
    gender: { men: false, women: false },
    clothingType: { tops: false, bottoms: false },
  });

  const handleFilterChange = (genderFilters, clothingTypeFilters) => {
    const updatedFilters = { gender: genderFilters, clothingType: clothingTypeFilters };
    setActiveFilters(updatedFilters);

    const searchQuery = getSearchQuery().toLowerCase();
    applyFilters(products, updatedFilters, searchQuery);
  };

  // Pagination logic
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