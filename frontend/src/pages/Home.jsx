import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Leaf, Package, ShoppingCart, MapPin, Tag, Sparkles, Mail, ChevronDown, Plus, Minus, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { categories } from '../data/products';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`group border-b border-emerald-100 transition-all duration-300 ${isOpen ? 'bg-emerald-50/30' : 'hover:bg-emerald-50/10'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-emerald-700' : 'text-gray-800'}`}>
                    {question}
                </span>
                <div className={`p-2 rounded-full transition-all duration-500 ${isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-emerald-100 text-emerald-600'}`}>
                    <ChevronDown size={20} />
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 text-gray-600 font-medium leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const { products, loading, error } = useProducts();
    const { addToCart, addItemsToCart } = useCart();
    const [bestSellers, setBestSellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);

    const handleAddRecipeBundle = async () => {
        // Find matching products or use mock data if not found
        const bundleItems = [
            { name: 'Blueberries', price: 450, image: '/products/Blueberries.jpg' },
            { name: 'Strawberries', price: 350, image: '/products/strawberries.jpg' },
            { name: 'Greek Yogurt', price: 600, image: '/products/yogurt.jpg' },
            { name: 'Raw Honey', price: 850, image: '/products/honey.jpg' },
            { name: 'Chia Seeds', price: 400, image: '/products/chiaseeds.jpg' },
            { name: 'Rolled Oats', price: 550, image: '/products/oats.jpg' }
        ];

        const productsToAdd = bundleItems.map(item => ({
            product: products.find(p => p.name.includes(item.name)) || { ...item, _id: `bundle-${item.name.toLowerCase()}` },
            quantity: 1
        }));

        await addItemsToCart(productsToAdd);
        alert('Recipe bundle added to your cart!');
    };

    const handleAddBundle = async (bundle) => {
        // Mock a few products for the bundle
        const productsToAdd = [
            {
                product: {
                    _id: `bundle-${bundle.name.toLowerCase().replace(/\s+/g, '-')}`,
                    name: bundle.name,
                    price: parseInt(bundle.price.replace(',', '')),
                    image: bundle.image
                },
                quantity: 1
            }
        ];
        await addItemsToCart(productsToAdd);
        alert(`${bundle.name} added to your cart!`);
    };

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

    const faqs = [
        {
            question: "How fast is the delivery in Nairobi?",
            answer: "We offer same-day delivery for all orders placed before 12:00 PM. Orders placed later are delivered the following morning. We cover Kilimani, Westlands, Karen, and most major residential areas."
        },
        {
            question: "Are your products strictly organic?",
            answer: "Yes! We source directly from certified local farmers who use sustainable and organic farming practices. Every item is hand-picked and quality-checked before being packed."
        },
        {
            question: "What payment methods do you accept?",
            answer: "Currently, we prioritize M-Pesa for its convenience and speed. You can pay directly during checkout using our integrated M-Pesa prompt."
        },
        {
            question: "Can I return fresh produce if I'm not satisfied?",
            answer: "Absolutely. We have a 'Freshness Guarantee'. If any item doesn't meet your expectations upon delivery, you can return it immediately with the rider for a full refund or replacement."
        }
    ];

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


            {/* About Platform Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Image Container */}
                        <div className="relative group order-2 lg:order-1">
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-100 rounded-full blur-3xl group-hover:bg-emerald-200 transition-all duration-700"></div>
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/40 transition-all duration-700"></div>

                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700">
                                <img
                                    src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2574&auto=format&fit=crop"
                                    alt="Fresh Produce Nairobi"
                                    className="w-full h-[600px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>

                                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/50">
                                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
                                        <Leaf size={28} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-lg leading-tight">100% Farm Fresh</p>
                                        <p className="text-sm font-medium text-gray-500">Harvested & Delivered Daily</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Text Content */}
                        <div className="relative z-10 order-1 lg:order-2">
                            <span className="bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-[0.3em] mb-6 px-5 py-2 rounded-full inline-block shadow-sm">
                                About FreshCart Kenya
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                                Supplying Health <br />
                                <span className="text-emerald-600 italic">to Your Home</span>
                            </h2>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-8 leading-relaxed border-l-4 border-emerald-500 pl-6">
                                Buy Fruits & Veggies From Our Online Grocery Delivery in Nairobi
                            </h3>

                            <div className="space-y-6 text-gray-600">
                                <p className="text-lg leading-relaxed">
                                    Our grocery delivery in Nairobi services indulges you in the vibrant flavours and nutritional goodness of our exquisite selection of fruits and vegetables at <span className="font-bold text-gray-900">FreshCart Kenya</span>. From succulent seasonal fruits bursting with sweetness to crisp, farm-fresh vegetables teeming with vitamins and minerals, our products embody the essence of wholesome goodness.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Sourced directly from local farmers who share our dedication to quality and sustainability, each item in our inventory is handpicked at the peak of freshness to ensure unparalleled taste and nutritional value. Whether you’re craving the juiciest of oranges, the crunchiest of carrots, or the richest of avocados, we have a bounty of nature’s finest offerings waiting to elevate your culinary adventures.
                                </p>
                                <p className="text-lg leading-relaxed font-bold text-emerald-900 italic">
                                    Explore our diverse range of fruits and veggies and discover the joy of nourishing your body with the freshest produce Nairobi has to offer.
                                </p>
                            </div>

                            <div className="mt-12 flex flex-wrap items-center gap-8">
                                <Link to="/products" className="group flex items-center gap-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-200 active:scale-95">
                                    Shop the Harvest <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </Link>

                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[22, 34, 45, 67].map((id) => (
                                            <div key={id} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-xl">
                                                <img src={`https://randomuser.me/api/portraits/thumb/men/${id}.jpg`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 leading-none mb-1">2.4k+ Reviews</p>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
            <section className="py-24 bg-gray-50/50">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="bg-primary/10 text-primary font-black text-xs uppercase tracking-[0.3em] mb-4 px-5 py-2 rounded-full inline-block shadow-sm">
                            Our Collections
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mt-4">Shop by Category</h2>
                        <p className="text-gray-500 mt-4 text-lg">Indulge in our handpicked selections of fresh produce, delivered straight from the farm.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {categories.map((cat, index) => (
                            <Link
                                to={`/products?category=${cat.name}`}
                                key={index}
                                className="group relative h-[450px] overflow-hidden rounded-[2.5rem] shadow-xl shadow-gray-200/50 transition-all duration-700 hover:-translate-y-2"
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

                                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-white text-3xl font-black mb-3 group-hover:text-primary-light transition-colors">{cat.name}</h3>
                                        <p className="text-gray-300 font-medium mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 italic">
                                            {cat.description || "Discover our premium selection."}
                                        </p>
                                        <div className="flex items-center gap-2 text-primary-light font-black uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                            Explore Now <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform hover:scale-110">
                                    <Plus size={24} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>



            {/* Recipe Spotlight */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container-custom">
                    <div className="bg-emerald-900 rounded-[4rem] overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                            <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[120%] bg-white blur-[120px] rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                            <div className="p-12 md:p-20 text-white relative z-10">
                                <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 py-1 px-4 rounded-full text-xs font-bold mb-6 inline-block uppercase tracking-[0.2em] backdrop-blur-sm">
                                    Recipe of the Week
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                                    Morning Energy <br />
                                    <span className="text-emerald-400 italic">Berry Blast Bowl</span>
                                </h2>
                                <p className="text-emerald-100 text-lg mb-10 max-w-lg leading-relaxed">
                                    Start your day with a powerful punch of antioxidants and fiber. This refreshing bowl uses the freshest berries from our seasonal harvest.
                                </p>

                                <div className="space-y-6 mb-12">
                                    <h4 className="font-bold flex items-center gap-2 text-emerald-200 uppercase tracking-widest text-sm">
                                        <Package size={18} /> Ingredients in this box:
                                    </h4>
                                    <ul className="grid grid-cols-2 gap-4">
                                        {['Organic Blueberries', 'Fresh Strawberries', 'Greek Yogurt', 'Raw Honey', 'Organic Chia Seeds', 'Rolled Oats'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-emerald-50/80 font-medium">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={handleAddRecipeBundle}
                                    className="group flex items-center gap-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                                >
                                    Add Bundle to Cart <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                            <div className="h-full min-h-[500px] relative">
                                <img
                                    src="/products/recipe.jpg"
                                    alt="Berry Blast Bowl"
                                    className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-l from-transparent via-transparent to-emerald-900 lg:w-1/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Error Message */}
            {error && (
                <div className="container-custom mt-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-[2rem] flex flex-col items-center text-center gap-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <div>
                            <h3 className="text-xl font-bold mb-1">Connection Issue</h3>
                            <p className="font-medium">{error}</p>
                            <p className="text-sm mt-3 opacity-70 italic font-mono">Tip: Check if your MongoDB Atlas IP Whitelist includes your current IP address.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Sustainability & Impact Counter */}
            <section className="py-20 bg-emerald-50/50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-8 rounded-[3rem] bg-white shadow-xl shadow-emerald-100/50 border border-emerald-50 transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <Leaf size={32} />
                            </div>
                            <h3 className="text-4xl font-black text-emerald-900 mb-2">50+</h3>
                            <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Local Farmers Supported</p>
                        </div>
                        <div className="p-8 rounded-[3rem] bg-white shadow-xl shadow-emerald-100/50 border border-emerald-50 transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-4xl font-black text-emerald-900 mb-2">0%</h3>
                            <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Plastic Packaging Goal</p>
                        </div>
                        <div className="p-8 rounded-[3rem] bg-white shadow-xl shadow-emerald-100/50 border border-emerald-50 transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <Star size={32} />
                            </div>
                            <h3 className="text-4xl font-black text-emerald-900 mb-2">100%</h3>
                            <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Organic Certified</p>
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

            {/* Curated Bundles */}
            <section className="py-24 bg-gray-50">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl">
                            <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-4 block">Quick Shopping</span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">Curated Lifestyle Bundles</h2>
                        </div>
                        <p className="text-gray-500 font-medium max-w-sm">Hand-picked combinations for specific health goals and household needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                name: "Detox Smoothie Box",
                                price: "2,450",
                                items: "12 Items",
                                image: "/products/gingershots.jpg",
                                tag: "Bestseller"
                            },
                            {
                                name: "Family Veggie Staple",
                                price: "3,800",
                                items: "18 Items",
                                image: "/products/vegetables.jpg",
                                tag: "Value"
                            },
                            {
                                name: "Fruit Fiesta Pack",
                                price: "1,950",
                                items: "10 Items",
                                image: "/products/wildberries.jpg",
                                tag: "Seasonal"
                            }
                        ].map((bundle, i) => (
                            <div key={i} className="group bg-white rounded-[3rem] p-4 shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-primary/20 transition-all duration-500">
                                <div className="relative h-72 rounded-[2.5rem] overflow-hidden mb-8">
                                    <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-lg border border-white">
                                        {bundle.tag}
                                    </div>
                                </div>
                                <div className="px-6 pb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">{bundle.name}</h3>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">KES</span>
                                            <span className="text-2xl font-black text-primary">{bundle.price}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm font-bold mb-8 flex items-center gap-2">
                                        <Package size={16} className="text-primary" /> {bundle.items} included
                                    </p>
                                    <button
                                        onClick={() => handleAddBundle(bundle)}
                                        className="w-full bg-gray-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-primary transition-all shadow-lg active:scale-95"
                                    >
                                        Add Bundle to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
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

            {/* Farm-to-Table Timeline */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">Our Journey</span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">Farm to Table Sourcing</h2>
                        <p className="text-gray-500 mt-6 text-lg font-medium leading-relaxed">We've spent years perfecting our logistics to ensure your food is literally harvested and delivered within hours.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-100 -translate-y-1/2"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {[
                                {
                                    time: "06:00 AM",
                                    title: "Daily Harvest",
                                    desc: "Our farmers harvest the freshest produce at the crack of dawn when nutrients are at their peak.",
                                    icon: <Leaf size={40} />,
                                    color: "bg-emerald-500"
                                },
                                {
                                    time: "09:00 AM",
                                    title: "Quality Check",
                                    desc: "Every item is hand-inspected at our Nairobi hub. If it's not perfect, it doesn't leave.",
                                    icon: <ShieldCheck size={40} />,
                                    color: "bg-emerald-600"
                                },
                                {
                                    time: "01:00 PM",
                                    title: "Prime Delivery",
                                    desc: "Our fleet of eco-friendly bikes delivers your order directly to your kitchen door.",
                                    icon: <Truck size={40} />,
                                    color: "bg-emerald-700"
                                }
                            ].map((step, i) => (
                                <div key={i} className="relative group text-center flex flex-col items-center">
                                    <div className={`w-24 h-24 ${step.color} text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl relative z-10 transform group-hover:rotate-12 transition-transform duration-500 shadow-emerald-200`}>
                                        {step.icon}
                                    </div>
                                    <div className="bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                                        {step.time}
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed max-w-xs">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Help Center</span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight italic">Frequently Asked Questions</h2>
                            <p className="text-gray-500 mt-4 text-lg">Everything you need to know about FreshCart deliveries and quality.</p>
                        </div>

                        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-100 border border-emerald-50">
                            {faqs.map((faq, idx) => (
                                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

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

            {/* Blog Section */}
            <section className="py-24 bg-white">
                <div className="container-custom">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Wellness Corner</span>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Latest from our Blog</h2>
                        </div>
                        <Link to="/blog" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all group">
                            Explore all articles <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                id: 1,
                                title: "The Benefits of Organic Produce: Why It Matters",
                                excerpt: "Discover why switching to organic fruits and vegetables can significantly improve your well-being.",
                                image: "/products/vegetables.jpg",
                                date: "Mar 5, 2026"
                            },
                            {
                                id: 2,
                                title: "Top 5 Superfoods for Better Heart Health",
                                excerpt: "Learn which five superfoods are scientifically proven to support cardiovascular health.",
                                image: "/products/Blueberries.jpg",
                                date: "Mar 4, 2026"
                            },
                            {
                                id: 3,
                                title: "Maintaining a Balanced Diet in a Busy Lifestyle",
                                excerpt: "Actionable advice on how to eat healthily even when you're short on time.",
                                image: "/products/berry-blast.jpg",
                                date: "Mar 3, 2026"
                            }
                        ].map((post) => (
                            <Link key={post.id} to={`/blog/${post.id}`} className="group block">
                                <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-lg shadow-emerald-50">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 border border-gray-100">
                                        {post.date}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </Link>
                        ))}
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


            {/* Community Gallery */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-4 block">#FreshCartKenya</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Join Our Fresh Community</h2>
                        <p className="text-gray-400 font-medium leading-relaxed">Tag us on Instagram for a chance to be featured and win weekly shopping vouchers.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 h-[600px]">
                        {[
                            { img: "/products/strawberryjuice.jpg", span: "row-span-2 col-span-2" },
                            { img: "/products/mango.jpg", span: "row-span-1 col-span-1" },
                            { img: "/products/cloves.jpg", span: "row-span-1 col-span-2" },
                            { img: "/products/lettuce.jpg", span: "row-span-1 col-span-1" },
                            { img: "/products/passionjuice.jpg", span: "row-span-1 col-span-1" },
                            { img: "/products/dragonfruit.jpg", span: "row-span-1 col-span-2" }
                        ].map((item, i) => (
                            <div key={i} className={`relative overflow-hidden group rounded-[2rem] ${item.span}`}>
                                <img src={item.img} alt="Community Member" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" />
                                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                                    <div className="text-center flex flex-col items-center">
                                        <Star size={32} className="text-white animate-bounce" />
                                        <p className="font-black text-sm uppercase tracking-widest mt-2">View Post</p>
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
