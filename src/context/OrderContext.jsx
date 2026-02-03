import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('adminOrders');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('adminOrders', JSON.stringify(orders));
    }, [orders]);

    // Cross-tab sync
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'adminOrders') {
                setOrders(JSON.parse(e.newValue || '[]'));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const placeOrder = (orderData) => {
        const newOrder = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
            ...orderData,
            createdAt: new Date().toISOString(),
            orderStatus: 'Pending',
            paymentStatus: 'Paid' // Simulated success
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    };

    return (
        <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
};
