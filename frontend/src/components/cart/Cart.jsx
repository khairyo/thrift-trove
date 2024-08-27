import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumb from '../Breadcrumb';
import Pagination from '@mui/material/Pagination';

import useFetchAccid from '../../hooks/UseFetchAccid';
import styles from './styles/Cart.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryFee] = useState(5.00);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 7; 

  const { accid, error } = useFetchAccid();
  if (accid) {
    console.log("accid:", accid);
  } 
  // DEBUG: add error handling here

  // Fetch cart items using accid
  useEffect(() => {
    const fetchCartItems = async () => {  
      try {
        const response = await axios.get('http://localhost:5000/api/cart/get-all-cartitems', {
          params: { accid: accid }
        });
        setCartItems(response.data.data);
      } catch (error) {
        console.error('Error fetching cart items:', error.message);
      }
    };
  
    fetchCartItems();
  }, [accid]);
  
  // Fetch product details using productid
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cartItems.length === 0) return; 
  
      try {
        const productDetailsArray = await Promise.all(
          cartItems.map(async (item) => {
            const productResponse = await axios.get(`http://localhost:5000/api/product/${item.productid}`);
            return { ...item, ...productResponse.data };
          })
        );
  
        setProductDetails(productDetailsArray);

        // DEBUG
        console.log('Product details:', productDetailsArray);
      } catch (error) {
        console.error('Error fetching product details:', error.message);
      }
    };
  
    fetchProductDetails();
  }, [cartItems]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productDetails.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let subtotal = 0;
      currentProducts.forEach(product => {
        subtotal += Number(product.price.slice(4));
      });
      setSubtotal(subtotal.toFixed(2));  
      setTotalPrice((subtotal + deliveryFee).toFixed(2)); 
    };
    calculateTotalPrice();
  }, [currentProducts, deliveryFee]);

  const handlePageChange = (event, value) => {   // Handle page change for pagination
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  // Delete item from cart
  const handleDeleteItem = async (cartitemid) => {
    try {
      await axios.delete('http://localhost:5000/api/cart/delete', {
        data: { cartitemid, accid: accid }
      });
  
      // Filter out the deleted item from both productDetails and cartItems
      setProductDetails(productDetails.filter(item => item.cartitemid !== cartitemid));
      setCartItems(cartItems.filter(item => item.cartitemid !== cartitemid));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Handle checkout: Redirect to Stripe Checkout
  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/payments/create-checkout-session', {
        amount: totalPrice,
        currency: 'sgd',
        cartItems: productDetails.map(item => ({
          name: item.name,
          price: item.price.slice(4),
        })),
      });
  
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.mainContent}>
        <Breadcrumb />
        <div className={styles.cartAndSummary}>
          <div className={styles.cartItems}>
            {currentProducts.map(item => (
              <div key={item.cartitemid} className={styles.cartItem}>
                <img src={item.image} alt={item.productname} className={styles.cartImage} />
                <div className={styles.itemDetails}>
                  <h2>{item.name}</h2>
                  <p>$ {item.price}</p>
                </div>
                <DeleteIcon
                  onClick={() => handleDeleteItem(item.cartitemid)}
                  className={styles.deleteIcon}
                />
              </div>
            ))}
            <div className={styles.pagination}>
              <Pagination
                count={Math.ceil(productDetails.length / productsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  marginTop: '50px',
                  display: 'flex',
                  justifyContent: 'center',
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
          <div className={styles.cartSummary}>
            <p>Sub-total: $ {subtotal}</p>
            <p>Delivery Fee: $ {deliveryFee.toFixed(2)}</p>
            <h2>Total: $ {totalPrice}</h2>
            <Button
              variant="contained"
              sx={{
                fontFamily: 'var(--font-family-text)',
                backgroundColor: 'white',
                fontSize: '14px',
                color: 'var(--primary-color)',
                textTransform: 'none',
                borderRadius: '5px',
                fontWeight: '600',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'var(--primary-color)',
                },
              }}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;