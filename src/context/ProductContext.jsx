import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('adminProducts');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) return parsed;
        }

        // If nothing in localStorage, use initial data with default stock/desc
        const refinedInitial = initialProducts.map(p => ({
            ...p,
            stock: p.stock || 20,
            description: p.description || "Fresh produce from farm.",
            unit: p.unit || "kg",
            soldCount: p.soldCount || 0
        }));
        localStorage.setItem('adminProducts', JSON.stringify(refinedInitial));
        return refinedInitial;
    });

    useEffect(() => {
        localStorage.setItem('adminProducts', JSON.stringify(products));
    }, [products]);

    const addProduct = (product) => {
        setProducts(prev => [product, ...prev]);
    };

    const updateProduct = (updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const updateStockAfterOrder = (items) => {
        setProducts(prev => prev.map(p => {
            const itemInOrder = items.find(item => item.id === p.id);
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
            addProduct,
            updateProduct,
            deleteProduct,
            updateStockAfterOrder
        }}>
            {children}
        </ProductContext.Provider>
    );
};
