import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ToastNotification';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user, token, loading } = useAuth();
    const { toastCart, toastSuccess, toastError, toastWarning } = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState(null);

    const cartStorageKey = user ? `cart:${user._id || user.id}` : null;

    useEffect(() => {
        if (loading) return;

        // Clean up old shared cart storage
        localStorage.removeItem('cart');

        if (!token || !cartStorageKey) {
            setCartItems([]);
            return;
        }

        try {
            const savedCart = localStorage.getItem(cartStorageKey);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
        } catch {
            localStorage.removeItem(cartStorageKey);
            setCartItems([]);
        }
    }, [cartStorageKey, loading, token]);

    useEffect(() => {
        if (!loading && token && cartStorageKey) {
            localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
        }
    }, [cartItems, cartStorageKey, loading, token]);

    const addToCart = useCallback(async (product, quantity = 1, showToast = true) => {
        const productId = product._id || product.id;
        const productName = product.name;

        // Check if product is already in cart
        const existingItem = cartItems.find(item => (item._id || item.id) === productId);
        
        // Visual feedback
        setIsUpdating(true);
        
        // Update local state first for immediate feedback
        setCartItems(prev => {
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                
                // Show warning if trying to add too many
                if (newQuantity > (product.stock || 999)) {
                    if (showToast) {
                        toastWarning(`Only ${product.stock || 'limited'} ${productName} in stock`);
                    }
                    return prev; // Don't update if exceeds stock
                }
                
                return prev.map(item =>
                    (item._id || item.id) === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }
            
            // Check stock for new items
            if (quantity > (product.stock || 999)) {
                if (showToast) {
                    toastWarning(`Only ${product.stock || 'limited'} ${productName} in stock`);
                }
                return prev;
            }
            
            return [...prev, { ...product, quantity }];
        });

        // Set last added item for undo functionality
        setLastAddedItem({ productId, productName, quantity });

        // Show success toast
        if (showToast) {
            if (existingItem) {
                toastSuccess(`Added ${quantity} more ${productName} to cart! (Total: ${existingItem.quantity + quantity})`, 3000);
            } else {
                toastCart(`${productName} added to cart!`, 3000);
            }
        }

        // Sync with backend if logged in
        if (token) {
            try {
                await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId,
                        quantity,
                        name: product.name,
                        price: product.price,
                        image: product.image
                    })
                });
            } catch (error) {
                console.error('Error syncing cart with backend:', error);
                toastError('Failed to sync cart with server. Changes saved locally.');
            }
        }

        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate([50]);
        }

        // Reset updating state
        setTimeout(() => setIsUpdating(false), 300);
    }, [cartItems, token, toastCart, toastSuccess, toastError, toastWarning]);

    const addItemsToCart = useCallback(async (productsToAdd) => {
        setIsUpdating(true);
        
        let addedCount = 0;
        for (const item of productsToAdd) {
            await addToCart(item.product, item.quantity || 1, false);
            addedCount += (item.quantity || 1);
        }
        
        toastSuccess(`Added ${addedCount} items to cart! 🎉`, 4000);
        setIsUpdating(false);
    }, [addToCart, toastSuccess]);

    const removeFromCart = useCallback((id, productName = 'Item') => {
        setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
        toastSuccess(`${productName} removed from cart`, 3000);
        
        if (navigator.vibrate) {
            navigator.vibrate([30]);
        }
    }, [toastSuccess]);

    const updateQuantity = useCallback((id, delta, productName = 'Item') => {
        setCartItems(prev =>
            prev.map(item => {
                if ((item._id || item.id) === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    
                    // Check stock if we have stock info
                    const productStock = item.stock || 999;
                    if (newQty > productStock) {
                        toastWarning(`Only ${productStock} ${productName} in stock`);
                        return item;
                    }
                    
                    // Show quantity update feedback
                    if (delta > 0) {
                        toastSuccess(`Added 1 more ${productName}`, 2000);
                    } else {
                        toastSuccess(`Removed 1 ${productName}`, 2000);
                    }
                    
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
        
        if (navigator.vibrate) {
            navigator.vibrate([20]);
        }
    }, [toastSuccess, toastWarning]);

    const clearCart = useCallback(() => {
        const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        setCartItems([]);
        toastSuccess(`Cart cleared! Removed ${itemCount} items`, 3000);
        
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }, [cartItems, toastSuccess]);

    const undoLastAdd = useCallback(() => {
        if (!lastAddedItem) return;
        
        const { productId, productName, quantity } = lastAddedItem;
        setCartItems(prev => {
            const item = prev.find(item => (item._id || item.id) === productId);
            if (!item) return prev;
            
            if (item.quantity <= quantity) {
                // Remove item completely
                return prev.filter(item => (item._id || item.id) !== productId);
            } else {
                // Reduce quantity
                return prev.map(item =>
                    (item._id || item.id) === productId
                        ? { ...item, quantity: item.quantity - quantity }
                        : item
                );
            }
        });
        
        toastSuccess(`Undo: Removed ${quantity} ${productName} from cart`, 3000);
        setLastAddedItem(null);
    }, [lastAddedItem, toastSuccess]);

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const itemCount = cartItems.length;

    // Calculate savings if we have original prices
    const savings = cartItems.reduce((acc, item) => {
        if (item.originalPrice) {
            return acc + (item.originalPrice - item.price) * item.quantity;
        }
        return acc;
    }, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            addItemsToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            undoLastAdd,
            cartTotal,
            cartCount,
            itemCount,
            savings,
            isUpdating,
            lastAddedItem
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for cart animations
export const useCartAnimation = () => {
    const [isAnimating, setIsAnimating] = useState(false);

    const animateAddToCart = (productId) => {
        setIsAnimating(true);
        
        // Create floating animation element
        const floatingElement = document.createElement('div');
        floatingElement.className = 'fixed z-[9999] text-2xl animate-float';
        floatingElement.textContent = '🛒';
        floatingElement.style.left = `${window.innerWidth - 100}px`;
        floatingElement.style.top = '100px';
        document.body.appendChild(floatingElement);
        
        // Remove after animation
        setTimeout(() => {
            floatingElement.remove();
            setIsAnimating(false);
        }, 1000);
        
        return true;
    };

    return { isAnimating, animateAddToCart };
};

export default CartContext;