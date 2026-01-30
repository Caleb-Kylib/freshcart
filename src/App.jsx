import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// User pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Admin pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public User Routes with Navbar + Footer */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen font-sans text-gray-800">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* Admin Routes (no Navbar/Footer) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
