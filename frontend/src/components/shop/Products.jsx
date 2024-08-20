import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; 
import Breadcrumb from '../Breadcrumb';
import Filters from './Filters'; 

// Import styles
import styles from './styles/Products.module.css'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

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
  };

  return (
    <div className={styles.container}>
      <Breadcrumb />
      <div className={styles.content}>
        <Filters onFilterChange={handleFilterChange} />
        <div className={styles.shopContainer}>
          <div className={styles.grid}>
            {filteredProducts.map(product => (
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
        </div>
      </div>
    </div>
  );
};

export default Products;
