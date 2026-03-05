import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = async (product, quantity = 1) => {
        const productId = product._id || product.id;
        
        // Update local state first for immediate feedback
        setCartItems(prev => {
            const existing = prev.find(item => (item._id || item.id) === productId);
            if (existing) {
                return prev.map(item =>
                    (item._id || item.id) === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });

        // Sync with backend if logged in
        const token = localStorage.getItem('token');
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
            }
        }
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev =>
            prev.map(item => {
                if ((item._id || item.id) === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
