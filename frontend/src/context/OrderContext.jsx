import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, user } = useAuth();

    const API_URL = 'http://localhost:5000/api/orders';

    useEffect(() => {
        if (token && user) {
            fetchOrders();
        } else {
            setOrders([]);
        }
    }, [token, user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // If admin, fetch all, otherwise fetch user's
            const endpoint = user?.role === 'admin' ? `${API_URL}/admin/all` : API_URL;
            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const placeOrder = async (orderData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(prev => [data, ...prev]);
                return { success: true, order: data };
            } else {
                throw new Error(data.message || 'Order failed');
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const updateOrderStatus = async (orderId, orderStatus) => {
        try {
            const response = await fetch(`${API_URL}/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderStatus })
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? data : o));
                return { success: true };
            } else {
                throw new Error(data.message || 'Update failed');
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    return (
        <OrderContext.Provider value={{ orders, loading, placeOrder, updateOrderStatus, fetchOrders }}>
            {children}
        </OrderContext.Provider>
    );
};
