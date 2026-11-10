import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ToastNotification';

const CartContext = createContext(null);

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
    return ctx;
};

export const CartProvider = ({ children }) => {
    const { user, token, loading } = useAuth();
    const { toastCart, toastSuccess, toastError, toastWarning } = useToast();

    const [cartItems,    setCartItems]    = useState([]);
    const [isUpdating,   setIsUpdating]   = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState(null);

    const cartStorageKey = user ? `cart:${user._id || user.id}` : null;

    // ── Hydrate from localStorage ────────────────────────────────────────────
    useEffect(() => {
        if (loading) return;

        // Remove legacy shared key so carts don't leak between accounts
        localStorage.removeItem('cart');

        if (!token || !cartStorageKey) { setCartItems([]); return; }

        try {
            const saved = localStorage.getItem(cartStorageKey);
            setCartItems(saved ? JSON.parse(saved) : []);
        } catch {
            localStorage.removeItem(cartStorageKey);
            setCartItems([]);
        }
    }, [cartStorageKey, loading, token]);

    // ── Persist to localStorage ──────────────────────────────────────────────
    useEffect(() => {
        if (!loading && token && cartStorageKey) {
            localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
        }
    }, [cartItems, cartStorageKey, loading, token]);

    // ── addToCart ────────────────────────────────────────────────────────────
    const addToCart = useCallback(async (product, quantity = 1, showToastMsg = true) => {
        const productId   = product._id || product.id;
        const productName = product.name;
        const maxStock    = product.stock ?? 999;

        setIsUpdating(true);

        setCartItems(prev => {
            const existing = prev.find(item => (item._id || item.id) === productId);
            if (existing) {
                const newQty = existing.quantity + quantity;
                if (newQty > maxStock) {
                    if (showToastMsg) toastWarning(`Only ${maxStock} "${productName}" in stock`);
                    return prev;
                }
                return prev.map(item =>
                    (item._id || item.id) === productId
                        ? { ...item, quantity: newQty }
                        : item
                );
            }
            if (quantity > maxStock) {
                if (showToastMsg) toastWarning(`Only ${maxStock} "${productName}" in stock`);
                return prev;
            }
            return [...prev, { ...product, quantity }];
        });

        setLastAddedItem({ productId, productName, quantity });

        if (showToastMsg) {
            const existing = cartItems.find(item => (item._id || item.id) === productId);
            if (existing) {
                toastSuccess(`Added ${quantity} more "${productName}" to cart`, 3000);
            } else {
                toastCart(`"${productName}" added to cart!`, 3500);
            }
        }

        // Sync with backend
        if (token) {
            try {
                await fetch('/api/cart', {
                    method:  'POST',
                    headers: {
                        'Content-Type':  'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        productId,
                        quantity,
                        name:  product.name,
                        price: product.price,
                        image: product.image,
                    }),
                });
            } catch {
                toastError('Cart not synced with server — changes saved locally.');
            }
        }

        if (navigator.vibrate) navigator.vibrate([40]);
        setTimeout(() => setIsUpdating(false), 300);
    }, [cartItems, token, toastCart, toastSuccess, toastError, toastWarning]);

    // ── addItemsToCart ───────────────────────────────────────────────────────
    const addItemsToCart = useCallback(async (productsToAdd) => {
        setIsUpdating(true);
        let count = 0;
        for (const item of productsToAdd) {
            await addToCart(item.product, item.quantity || 1, false);
            count += item.quantity || 1;
        }
        toastSuccess(`Added ${count} items to your cart 🎉`, 4000);
        setIsUpdating(false);
    }, [addToCart, toastSuccess]);

    // ── removeFromCart ───────────────────────────────────────────────────────
    const removeFromCart = useCallback((id, productName = 'Item') => {
        setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
        toastSuccess(`"${productName}" removed from cart`, 3000);
        if (navigator.vibrate) navigator.vibrate([30]);
    }, [toastSuccess]);

    // ── updateQuantity ───────────────────────────────────────────────────────
    const updateQuantity = useCallback((id, delta, productName = 'Item') => {
        setCartItems(prev =>
            prev.map(item => {
                if ((item._id || item.id) !== id) return item;
                const newQty   = Math.max(1, item.quantity + delta);
                const maxStock = item.stock ?? 999;
                if (newQty > maxStock) {
                    toastWarning(`Only ${maxStock} "${productName}" in stock`);
                    return item;
                }
                return { ...item, quantity: newQty };
            })
        );
        if (navigator.vibrate) navigator.vibrate([20]);
    }, [toastWarning]);

    // ── clearCart ────────────────────────────────────────────────────────────
    const clearCart = useCallback(() => {
        const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        setCartItems([]);
        toastSuccess(`Cart cleared — ${count} item${count !== 1 ? 's' : ''} removed`, 3000);
        if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    }, [cartItems, toastSuccess]);

    // ── undoLastAdd ──────────────────────────────────────────────────────────
    const undoLastAdd = useCallback(() => {
        if (!lastAddedItem) return;
        const { productId, productName, quantity } = lastAddedItem;
        setCartItems(prev => {
            const item = prev.find(i => (i._id || i.id) === productId);
            if (!item) return prev;
            if (item.quantity <= quantity) {
                return prev.filter(i => (i._id || i.id) !== productId);
            }
            return prev.map(i =>
                (i._id || i.id) === productId
                    ? { ...i, quantity: i.quantity - quantity }
                    : i
            );
        });
        toastSuccess(`Undo: removed "${productName}" from cart`, 3000);
        setLastAddedItem(null);
    }, [lastAddedItem, toastSuccess]);

    // ── Derived values ───────────────────────────────────────────────────────
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const itemCount = cartItems.length;
    const savings   = cartItems.reduce((acc, item) =>
        item.originalPrice
            ? acc + (item.originalPrice - item.price) * item.quantity
            : acc, 0);

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
            lastAddedItem,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
