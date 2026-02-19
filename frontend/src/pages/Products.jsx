import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/products';
import { Filter } from 'lucide-react';

const Products = () => {
    const { products } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
    const [displayProducts, setDisplayProducts] = useState(products);

    useEffect(() => {
        setDisplayProducts(products);
    }, [products]);

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        } else {
            setSelectedCategory('All');
        }
    }, [categoryParam]);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        if (cat === 'All') {
            setSearchParams({});
        } else {
            setSearchParams({ category: cat });
        }
    };

    // Combine default categories with any new ones from the database
    const dynamicCategories = [...new Set(products.map(p => p.category))];
    const allCategories = [...new Set([...categories.map(c => c.name), ...dynamicCategories])];

    const filteredProducts = selectedCategory === 'All'
        ? displayProducts
        : displayProducts.filter(p => p.category === selectedCategory);

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
                        <p className="text-gray-500">Fresh from the farm to your table</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 overflow-x-auto max-w-full no-scrollbar">
                        <button
                            onClick={() => handleCategoryChange('All')}
                            className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap transition-colors ${selectedCategory === 'All' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            All Items
                        </button>
                        {allCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-gray-400">No products found in this category.</h3>
                        <button onClick={() => handleCategoryChange('All')} className="mt-4 text-primary font-semibold hover:underline">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
