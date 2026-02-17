import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Leaf } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState(products.slice(0, 4));

    useEffect(() => {
        const savedProducts = JSON.parse(localStorage.getItem("adminProducts"));
        if (savedProducts && savedProducts.length > 0) {
            setFeaturedProducts(savedProducts.slice(0, 4));
        }
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center bg-gray-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                        alt="Fresh Market"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>

                <div className="container-custom relative z-10 pt-20">
                    <div className="max-w-2xl text-white">
                        <span className="bg-primary/20 text-primary-light border border-primary/30 py-1 px-3 rounded-full text-sm font-semibold mb-6 inline-block backdrop-blur-sm">
                            Same-day delivery in Nairobi
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Fresh Organic <br />
                            <span className="text-primary">Groceries</span> Daily
                        </h1>
                        <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                            We bring the farm to your doorstep. Experience the freshest fruits, vegetables, and juices Kenya has to offer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/products" className="btn-primary text-center">Shop Now</Link>
                            <Link to="/products?category=Offers" className="btn-secondary text-white border-white hover:bg-white hover:text-green-800 text-center">View Offers</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Banner */}
            <section className="bg-white py-12 border-b border-gray-100">
                <div className="container-custom grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex items-center gap-4 justify-center md:justify-start p-4 hover:shadow-lg rounded-xl transition-shadow cursor-default">
                        <div className="bg-green-100 p-4 rounded-full text-primary">
                            <Truck size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Fast Delivery</h3>
                            <p className="text-gray-500">Same day delivery in Nairobi</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-start p-4 hover:shadow-lg rounded-xl transition-shadow cursor-default">
                        <div className="bg-green-100 p-4 rounded-full text-primary">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Quality Guarantee</h3>
                            <p className="text-gray-500">100% money back guarantee</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-start p-4 hover:shadow-lg rounded-xl transition-shadow cursor-default">
                        <div className="bg-green-100 p-4 rounded-full text-primary">
                            <Leaf size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Organic & Fresh</h3>
                            <p className="text-gray-500">Sourced directly from farmers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 bg-light">
                <div className="container-custom">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-3 text-gray-900">Shop by Category</h2>
                            <p className="text-gray-500">Explore our wide range of fresh produce</p>
                        </div>
                        <Link to="/products" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat, index) => (
                            <Link to={`/products?category=${cat.name}`} key={index} className="group relative overflow-hidden rounded-2xl h-64 md:h-80 shadow-md">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                                    <h3 className="text-white text-xl font-bold group-hover:text-primary-light transition-colors">{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Best Sellers</h2>
                        <p className="text-gray-500">Hand-picked favorites that our customers love. Freshness guaranteed in every bite.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/products" className="btn-secondary inline-block">Shop All Products</Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-green-50">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">What Our Customers Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm relative">
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-600 mb-6 italic">"The vegetables are always fresh and crisp. Delivery to Kilimani was super fast. Highly recommended!"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                        <img src={`https://randomuser.me/api/portraits/thumb/women/${10 + i}.jpg`} alt="User" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Wanjiku K.</h4>
                                        <p className="text-xs text-gray-500">Verified Customer</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
