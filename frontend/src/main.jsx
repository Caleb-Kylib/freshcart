import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ToastProvider from './components/ToastNotification';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { CartProvider } from './context/EnhancedCartContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/*
        Provider order matters:
        1. ToastProvider  — must be outermost so CartProvider can call useToast()
        2. AuthProvider   — everything needs auth state
        3. ProductProvider
        4. OrderProvider
        5. CartProvider   — calls useToast(), so ToastProvider must already be in tree
      */}
      <ToastProvider>
        <AuthProvider>
          <ProductProvider>
            <OrderProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </OrderProvider>
          </ProductProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
