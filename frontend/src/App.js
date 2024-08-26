import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import components
import Navbar from './components/navbar/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './ScrollToTop'; 

// import pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import MyProductsPage from './pages/MyProducts';
import MyProductDetail from './pages/MyProductDetail';

// import css
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/my-shop" element={<MyProductsPage />} />
          <Route path="/my-product/:id" element={<MyProductDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
