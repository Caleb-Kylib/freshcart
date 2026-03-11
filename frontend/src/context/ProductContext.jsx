import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const API_URL = '/api/products';

    // Fetch products from MongoDB on mount
    useEffect(() => {
        fetchProducts();
        fetchFeaturedProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try fetching from API
            const response = await fetch(API_URL);

            if (!response.ok) {
                // If API fails, fall back to local data
                console.warn('Backend API failed, falling back to local data');
                const localProducts = (await import('../data/products')).products;
                setProducts(localProducts || []);
                return;
            }

            const text = await response.text();
            if (!text) {
                throw new Error('Server returned an empty response.');
            }

            try {
                const data = JSON.parse(text);
                const apiProducts = data.products || [];

                // If API returns no products, use local data
                if (apiProducts.length === 0) {
                    const localProducts = (await import('../data/products')).products;
                    setProducts(localProducts || []);
                } else {
                    setProducts(apiProducts);
                }
            } catch (e) {
                console.error('JSON Parse Error:', e, 'Raw content:', text);
                throw new Error('Server returned invalid data format.');
            }
        } catch (error) {
            console.error('Error fetching products, using local fallback:', error);
            try {
                const localProducts = (await import('../data/products')).products;
                setProducts(localProducts || []);
            } catch (fallbackError) {
                setError(error.message === 'Failed to fetch'
                    ? 'Cannot connect to backend server and local fallback failed.'
                    : error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/featured`);
            if (response.ok) {
                const data = await response.json();
                setFeaturedProducts(data || []);
            }
        } catch (error) {
            console.error('Error fetching featured products:', error);
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
            featuredProducts,
            loading,
            error,
            addProduct,
            updateProduct,
            deleteProduct,
            updateStockAfterOrder,
            fetchProducts,
            fetchFeaturedProducts
        }}>
            {children}
        </ProductContext.Provider>
    );
};
