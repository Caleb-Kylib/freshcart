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
    const [searchTerm, setSearchTerm] = useState('');

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

    // Memoized filtered and shuffled products
    const filteredProducts = React.useMemo(() => {
        let result = products;

        // Apply Category Filter
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Apply Search Filter
        if (searchTerm) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply Shuffle ONLY for 'All' items without active search
        if (selectedCategory === 'All' && !searchTerm) {
            result = [...result]; // Clone to avoid mutation
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
        }
        return result;
    }, [products, selectedCategory, searchTerm]);

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Our Harvest</h1>
                        <p className="text-gray-500 text-lg font-medium">Sustainably grown, hand-picked, and delivered with love from the farm to your table.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full lg:w-96 relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search fruits, smoothies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-[2rem] shadow-xl shadow-gray-200/50 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-gray-800"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-12 flex items-center gap-4">
                    <div className="flex bg-white p-2 rounded-[1.5rem] shadow-lg shadow-gray-100 border border-gray-100 overflow-x-auto max-w-full no-scrollbar">
                        <button
                            onClick={() => handleCategoryChange('All')}
                            className={`px-8 py-3 rounded-xl font-black text-sm whitespace-nowrap transition-all duration-300 ${selectedCategory === 'All' ? 'bg-primary text-white shadow-xl shadow-emerald-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            All Items
                        </button>
                        {allCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-8 py-3 rounded-xl font-black text-sm whitespace-nowrap transition-all duration-300 ${selectedCategory === cat ? 'bg-primary text-white shadow-xl shadow-emerald-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
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
