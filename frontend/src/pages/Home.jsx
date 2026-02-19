import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Leaf, Package, ShoppingCart, MapPin, Tag, Sparkles, Mail } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/products';

const Home = () => {
    const { products, loading } = useProducts();
    const [bestSellers, setBestSellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            // Sort by soldCount for Best Sellers
            const sortedBySales = [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
            setBestSellers(sortedBySales.slice(0, 4));

            // Sort by createdAt for New Arrivals (newest first)
            const sortedByNew = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNewArrivals(sortedByNew.slice(0, 8));
        }
    }, [products]);

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
                            <Link to="/products?category=Juices" className="btn-secondary text-white border-white hover:bg-white hover:text-green-800 text-center">View Juices</Link>
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

            {/* How to Order */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-500">Get your fresh groceries in 3 simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative connection-line">
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <Package size={40} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Browse Products</h3>
                            <p className="text-gray-500">Explore our wide range of fresh organic produce and add to cart.</p>
                        </div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <ShoppingCart size={40} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Place Order</h3>
                            <p className="text-gray-500">Confirm your items and choose your preferred payment method.</p>
                        </div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <Truck size={40} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Fast Delivery</h3>
                            <p className="text-gray-500">We deliver your fresh groceries right to your doorstep.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals Carousel */}
            {newArrivals.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container-custom">
                        <div className="flex items-center gap-2 mb-8">
                            <Sparkles className="text-yellow-500" />
                            <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
                        </div>
                        <ProductCarousel products={newArrivals} />
                    </div>
                </section>
            )}

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

            {/* Seasonal Offers */}
            <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-yellow-400 blur-3xl"></div>
                </div>
                <div className="container-custom relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <span className="bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-sm mb-4 inline-block">Limited Time Offer</span>
                        <h2 className="text-4xl font-bold mb-4">Weekend Super Sale!</h2>
                        <p className="text-emerald-100 text-lg mb-6">Get up to 30% off on all organic vegetables and fresh juices. Offer valid until Sunday.</p>
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center min-w-[80px]">
                                <span className="block text-2xl font-bold">02</span>
                                <span className="text-xs text-emerald-200 uppercase">Days</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center min-w-[80px]">
                                <span className="block text-2xl font-bold">14</span>
                                <span className="text-xs text-emerald-200 uppercase">Hours</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center min-w-[80px]">
                                <span className="block text-2xl font-bold">35</span>
                                <span className="text-xs text-emerald-200 uppercase">Mins</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block relative">
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                            alt="Offer"
                            className="w-80 h-80 object-cover rounded-full border-8 border-white/10 shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-yellow-900 font-black text-xl p-6 rounded-full shadow-lg rotate-12">
                            30% <br /> OFF
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products (Best Sellers) */}
            {bestSellers.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container-custom">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Best Sellers</h2>
                            <p className="text-gray-500">Hand-picked favorites that our customers love. Freshness guaranteed in every bite.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {bestSellers.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link to="/products" className="btn-secondary inline-block">Shop All Products</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Partner Farms */}
            <section className="py-16 bg-stone-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partner Farms</h2>
                        <p className="text-gray-500">We source directly from trusted local farmers to ensure maximum freshness.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {['GreenFields', 'OrganicValley', 'NatureFresh', 'HighlandGrowers', 'SunnyHarvest'].map((farm) => (
                            <div key={farm} className="text-2xl font-black text-gray-400 flex items-center gap-2">
                                <Leaf size={24} /> {farm}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delivery Areas */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">We Deliver To You</span>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Delivery Areas in Nairobi</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                We currently cover most residential areas in Nairobi. Check our delivery zone map to see if we deliver to your doorstep. Same-day delivery available for orders placed before 12 PM.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {['Kilimani', 'Westlands', 'Lavington', 'Kileleshwa', 'Karen', 'Langata', 'Runda', 'Muthaiga'].map((area) => (
                                    <div key={area} className="flex items-center gap-2 text-gray-700">
                                        <MapPin size={18} className="text-primary" />
                                        <span>{area}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/delivery-info" className="btn-primary mt-8 inline-block">Check Full Coverage</Link>
                        </div>
                        <div className="bg-gray-100 rounded-2xl h-96 w-full relative overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop"
                                alt="Nairobi Map"
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full text-primary animate-bounce">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Nairobi, Kenya</p>
                                        <p className="text-xs text-gray-500">Headquarters</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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


            {/* Newsletter Signup */}
            <section className="py-20 bg-emerald-900 text-white">
                <div className="container-custom text-center max-w-3xl mx-auto">
                    <div className="bg-emerald-800/50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 10% Off Your First Order</h2>
                    <p className="text-emerald-100 mb-8 text-lg">Subscribe to our newsletter and get exclusive offers, fresh arrival alerts, and healthy recipes delivered to your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <button className="bg-yellow-400 text-yellow-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-colors">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-xs text-emerald-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </section>
        </div >
    );
};

export default Home;
