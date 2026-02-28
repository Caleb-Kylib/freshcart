import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const API_URL = '/api/products';

    // Fetch products from MongoDB on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(API_URL);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error fetching products');
            }
            const data = await response.json();
            // Backend returns { products, totalPages, currentPage }
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message === 'Failed to fetch'
                ? 'Cannot connect to backend server. Please ensure the backend is running on port 5000.'
                : error.message);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (productData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            const newProduct = await response.json();
            if (response.ok) {
                setProducts(prev => [newProduct, ...prev]);
                return { success: true };
            } else {
                throw new Error(newProduct.message || 'Failed to add product');
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const updateProduct = async (updatedData) => {
        try {
            const id = updatedData._id || updatedData.id;
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });
            const result = await response.json();
            if (response.ok) {
                setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? result : p));
                return { success: true };
            } else {
                throw new Error(result.message || 'Failed to update product');
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setProducts(prev => prev.filter(p => (p._id !== id && p.id !== id)));
                return { success: true };
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete product');
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const updateStockAfterOrder = async (items) => {
        // This could be a backend batch update or handled by order creation in backend
        // For now, we update local state to reflect the order
        setProducts(prev => prev.map(p => {
            const itemInOrder = items.find(item => (item._id === p._id || item.id === p.id));
            if (itemInOrder) {
                return {
                    ...p,
                    stock: Math.max(0, p.stock - itemInOrder.quantity),
                    soldCount: (p.soldCount || 0) + itemInOrder.quantity
                };
            }
            return p;
        }));
    };

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            error,
            addProduct,
            updateProduct,
            deleteProduct,
            updateStockAfterOrder,
            fetchProducts
        }}>
            {children}
        </ProductContext.Provider>
    );
};
