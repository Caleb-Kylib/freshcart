import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Star, Truck, ShieldCheck, Leaf, Package,
    ShoppingCart, MapPin, Tag, Sparkles, Mail, ChevronDown,
    Plus, Clock, Percent, Heart, ChevronRight, Zap, Timer, BadgeCheck
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { categories } from '../data/products';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`border border-gray-100 rounded-2xl mb-3 transition-all duration-300 ${isOpen ? 'bg-emerald-50/50 shadow-sm' : 'hover:border-emerald-200'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
                <span className={`font-semibold transition-colors ${isOpen ? 'text-emerald-700' : 'text-gray-800'}`}>
                    {question}
                </span>
                <div className={`p-1.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                    <ChevronDown size={16} />
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const { products, loading, error } = useProducts();
    const { addToCart } = useCart();
    const [bestSellers, setBestSellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [fruitBaskets, setFruitBaskets] = useState([]);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (products && products.length > 0) {
            const sortedBySales = [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
            setBestSellers(sortedBySales.slice(0, 8));

            const sortedByNew = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNewArrivals(sortedByNew.slice(0, 8));

            const bundles = products.filter(p => p.category === 'Lifestyle Bundles');
            setFruitBaskets(bundles.length > 0 ? bundles.slice(0, 3) : []);
        }
    }, [products]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const sunday = new Date();
            const daysUntilSunday = now.getDay() === 0 ? 0 : 7 - now.getDay();
            sunday.setDate(now.getDate() + daysUntilSunday);
            sunday.setHours(23, 59, 59, 999);

            const difference = sunday.getTime() - now.getTime();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
        <div className="min-h-screen bg-white">
            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/products/grocery-section.jpg"
                        alt="Fresh Market"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/30" />
                </div>

                <div className="container-custom relative z-10 pt-28 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="text-white">
                            {/* Promo badge */}
                            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                                <Zap size={16} className="text-yellow-400" />
                                Free delivery on orders above KES 2,000
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-6">
                                Fresh Groceries<br />
                                Delivered to Your<br />
                                <span className="text-emerald-400">Door in Hours</span>
                            </h1>

                            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                                Shop from Nairobi's freshest selection of organic fruits, vegetables, juices, and more. Farm-picked daily, delivered same-day.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-4 mb-10">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/30 hover:shadow-xl active:scale-[0.98]"
                                >
                                    <ShoppingCart size={20} />
                                    Start Shopping
                                </Link>
                                <Link
                                    to="/products?category=Fruits"
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl border border-white/20 backdrop-blur-sm transition-all"
                                >
                                    Today's Deals
                                    <ArrowRight size={18} />
                                </Link>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-emerald-400" />
                                    Same-day delivery
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-emerald-400" />
                                    Freshness guaranteed
                                </div>
                                <div className="flex items-center gap-2">
                                    <Leaf size={16} className="text-emerald-400" />
                                    100% organic
                                </div>
                            </div>
                        </div>

                        {/* Right: Featured deal card */}
                        <div className="hidden lg:block">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">HOT DEAL</span>
                                    <span className="text-gray-300 text-sm">Ends Sunday</span>
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-2">Weekend Super Saver</h3>
                                <p className="text-gray-300 mb-6">Up to 30% off on fresh vegetables and cold-pressed juices</p>

                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {[
                                        { img: "/products/carrots.jpg", name: "Carrots", price: "120" },
                                        { img: "/products/Broccoligreen.jpg", name: "Broccoli", price: "250" },
                                        { img: "/products/cucumber.jpg", name: "Cucumber", price: "80" },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                                            <img src={item.img} alt={item.name} className="w-full h-16 object-cover rounded-lg mb-2" />
                                            <p className="text-white text-xs font-semibold">{item.name}</p>
                                            <p className="text-emerald-400 text-xs font-bold">KES {item.price}</p>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    to="/products?category=Vegetables"
                                    className="block text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    Shop Vegetables
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TRUST / DELIVERY BANNER ===== */}
            <section className="bg-emerald-700 py-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMjAgMjBtLTEgMGEgMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-30"></div>
                <div className="container-custom relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Truck size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Free Delivery</p>
                                <p className="text-emerald-100 text-xs">Orders over KES 2,000</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Timer size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Same-Day Delivery</p>
                                <p className="text-emerald-100 text-xs">Order before 12 PM</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Freshness Guarantee</p>
                                <p className="text-emerald-100 text-xs">Or your money back</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <BadgeCheck size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Certified Organic</p>
                                <p className="text-emerald-100 text-xs">From local farms</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SHOP BY CATEGORY ===== */}
            <section className="py-14 bg-gray-50">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
                            <p className="text-gray-500 mt-1">Browse our fresh aisles</p>
                        </div>
                        <Link to="/products" className="hidden sm:flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                            View All <ChevronRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat, index) => (
                            <Link
                                to={`/products?category=${cat.name}`}
                                key={index}
                                className="group flex flex-col items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-4 ring-gray-50 group-hover:ring-emerald-100 transition-all">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-800 text-sm text-center group-hover:text-emerald-700 transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1 text-center line-clamp-1">{cat.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FLASH SALE / DEALS COUNTDOWN ===== */}
            <section className="py-12 bg-white">
                <div className="container-custom">
                    <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-white">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap size={20} className="text-yellow-400" />
                                    <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Flash Sale</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-2">Weekend Super Deals</h2>
                                <p className="text-emerald-200 max-w-md">Up to 30% off on organic vegetables and fresh juices. Don't miss out!</p>
                            </div>

                            {/* Countdown */}
                            <div className="flex items-center gap-3">
                                {[
                                    { val: timeLeft.days, label: "Days" },
                                    { val: timeLeft.hours, label: "Hrs" },
                                    { val: timeLeft.minutes, label: "Min" },
                                    { val: timeLeft.seconds, label: "Sec" },
                                ].map((unit, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-3 text-center min-w-[70px]">
                                        <span className="block text-2xl md:text-3xl font-black text-white">{String(unit.val).padStart(2, '0')}</span>
                                        <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">{unit.label}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/products"
                                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all whitespace-nowrap shadow-lg shadow-yellow-400/20 active:scale-95"
                            >
                                Shop Deals
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BEST SELLERS ===== */}
            {bestSellers.length > 0 && (
                <section className="py-14 bg-white">
                    <div className="container-custom">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100 p-2.5 rounded-xl">
                                    <Tag size={22} className="text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best Sellers</h2>
                                    <p className="text-gray-500 text-sm">Most loved by our customers</p>
                                </div>
                            </div>
                            <Link to="/products" className="hidden sm:flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                                See All <ChevronRight size={18} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {bestSellers.slice(0, 4).map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== NEW ARRIVALS CAROUSEL ===== */}
            {newArrivals.length > 0 && (
                <section className="py-14 bg-gray-50">
                    <div className="container-custom">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-100 p-2.5 rounded-xl">
                                    <Sparkles size={22} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Fresh Arrivals</h2>
                                    <p className="text-gray-500 text-sm">Just added to our shelves</p>
                                </div>
                            </div>
                            <Link to="/products" className="hidden sm:flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                                View All <ChevronRight size={18} />
                            </Link>
                        </div>
                        <ProductCarousel products={newArrivals} />
                    </div>
                </section>
            )}

            {/* ===== PROMOTIONAL BANNER (Recipe/Bundle) ===== */}
            <section className="py-14 bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left banner */}
                        <div className="relative rounded-3xl overflow-hidden h-[320px] group">
                            <img
                                src="/products/gingershots.jpg"
                                alt="Immunity Shots"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
                            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center">
                                <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-2">Wellness Bundle</span>
                                <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 max-w-xs">Immunity Ginger Shot Kit</h3>
                                <p className="text-gray-300 text-sm mb-6 max-w-xs">Everything you need for a week of natural immunity-boosting shots.</p>
                                <Link
                                    to="/products?category=Lifestyle+Bundles"
                                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl w-fit transition-all"
                                >
                                    Shop Bundles <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>

                        {/* Right banner */}
                        <div className="relative rounded-3xl overflow-hidden h-[320px] group">
                            <img
                                src="/products/fruit-basket.jpg"
                                alt="Fruit Basket"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
                            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center">
                                <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2">This Week's Pick</span>
                                <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 max-w-xs">Premium Fruit Baskets</h3>
                                <p className="text-gray-300 text-sm mb-6 max-w-xs">Seasonal fruit boxes packed fresh for gifting or home enjoyment.</p>
                                <Link
                                    to="/products?category=Fruits"
                                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl w-fit transition-all"
                                >
                                    Shop Fruits <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== LIFESTYLE BUNDLES ===== */}
            <section className="py-14 bg-gray-50">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2.5 rounded-xl">
                                <Package size={22} className="text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Lifestyle Bundles</h2>
                                <p className="text-gray-500 text-sm">Curated packs for your health goals</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {fruitBaskets.length > 0 ? (
                            fruitBaskets.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))
                        ) : (
                            [
                                { name: "Detox Smoothie Box", price: 2450, unit: "box", image: "/products/gingershots.jpg", category: "Lifestyle Bundles", _id: "basket-1" },
                                { name: "Family Veggie Staple", price: 3800, unit: "box", image: "/products/vegetables.jpg", category: "Lifestyle Bundles", _id: "basket-2" },
                                { name: "Fruit Fiesta Pack", price: 1950, unit: "box", image: "/products/wildberries.jpg", category: "Lifestyle Bundles", _id: "basket-3" }
                            ].map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
                        <p className="text-gray-500">Get fresh groceries in 3 simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                icon: <ShoppingCart size={28} />,
                                title: "Browse & Add to Cart",
                                desc: "Explore our wide range of fresh organic produce and add items to your cart.",
                                step: "01",
                                color: "bg-emerald-50 text-emerald-600"
                            },
                            {
                                icon: <Tag size={28} />,
                                title: "Pay with M-Pesa",
                                desc: "Quick, secure checkout with M-Pesa. Just confirm on your phone.",
                                step: "02",
                                color: "bg-blue-50 text-blue-600"
                            },
                            {
                                icon: <Truck size={28} />,
                                title: "We Deliver Fresh",
                                desc: "Same-day delivery right to your doorstep. Freshness guaranteed.",
                                step: "03",
                                color: "bg-orange-50 text-orange-600"
                            }
                        ].map((step, i) => (
                            <div key={i} className="text-center relative">
                                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                                    {step.icon}
                                </div>
                                <span className="absolute top-0 right-1/4 text-5xl font-black text-gray-100">{step.step}</span>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed relative z-10">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FARM TO TABLE ===== */}
            <section className="py-16 bg-emerald-50/50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-3 block">Our Promise</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                From Local Farms<br />
                                to Your Kitchen
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                We work directly with over 50 certified organic farmers across Kenya. Every item is harvested fresh each morning and quality-checked at our Nairobi hub before being dispatched to your home.
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { time: "6:00 AM", text: "Produce harvested at peak freshness" },
                                    { time: "9:00 AM", text: "Quality inspection at our Nairobi hub" },
                                    { time: "By 1:00 PM", text: "Delivered fresh to your door" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg min-w-[80px] text-center">
                                            {item.time}
                                        </div>
                                        <p className="text-gray-700 font-medium">{item.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-black text-emerald-700">50+</p>
                                    <p className="text-xs text-gray-500 font-semibold">Local Farms</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200"></div>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-emerald-700">100%</p>
                                    <p className="text-xs text-gray-500 font-semibold">Organic</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200"></div>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-emerald-700">2.4k+</p>
                                    <p className="text-xs text-gray-500 font-semibold">Happy Customers</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-emerald-100">
                                <img
                                    src="/products/grocery-fridge.jpg"
                                    alt="Fresh Produce"
                                    className="w-full h-[500px] object-cover"
                                />
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 p-2.5 rounded-xl">
                                        <Leaf size={24} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">100% Farm Fresh</p>
                                        <p className="text-xs text-gray-500">Harvested daily</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== DELIVERY AREAS ===== */}
            <section className="py-14 bg-white">
                <div className="container-custom">
                    <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div>
                                <span className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-3 block">Delivery Coverage</span>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">We Deliver Across Nairobi</h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Same-day delivery available for orders placed before 12 PM. We cover most residential areas in the city.
                                </p>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {['Kilimani', 'Westlands', 'Lavington', 'Kileleshwa', 'Karen', 'Langata', 'Runda', 'Muthaiga'].map((area) => (
                                        <div key={area} className="flex items-center gap-2 text-gray-700 text-sm">
                                            <MapPin size={14} className="text-emerald-600 shrink-0" />
                                            <span>{area}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/products" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all">
                                    Start Shopping <ArrowRight size={16} />
                                </Link>
                            </div>
                            <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden">
                                <img
                                    src="/products/shopping-cart.jpg"
                                    alt="Nairobi Delivery"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-emerald-900/20 flex items-center justify-center">
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center gap-3">
                                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 animate-bounce">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Nairobi, Kenya</p>
                                            <p className="text-xs text-gray-500">Same-day delivery</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-16 bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
                        <p className="text-gray-500">Trusted by thousands of Nairobi families</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: "Wanjiku K.", area: "Kilimani", text: "The vegetables are always fresh and crisp. Same-day delivery is a game changer for busy weekdays!" },
                            { name: "Brian M.", area: "Westlands", text: "I love the fruit baskets for gifting. Quality is consistently excellent and the packaging is beautiful." },
                            { name: "Amina H.", area: "Lavington", text: "Finally, a grocery delivery that actually delivers organic produce. My family only shops here now." }
                        ].map((review, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-600 mb-5 leading-relaxed">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <span className="text-emerald-700 font-bold text-sm">{review.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                                        <p className="text-xs text-gray-500">{review.area} Customer</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
                            <p className="text-gray-500">Everything you need to know about our service</p>
                        </div>

                        <div>
                            {faqs.map((faq, idx) => (
                                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BLOG PREVIEW ===== */}
            <section className="py-14 bg-gray-50">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">From Our Blog</h2>
                            <p className="text-gray-500 mt-1">Tips for healthy living</p>
                        </div>
                        <Link to="/blog" className="hidden sm:flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                            All Articles <ChevronRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                id: 1,
                                title: "The Benefits of Organic Produce",
                                excerpt: "Discover why switching to organic can improve your well-being.",
                                image: "/products/vegetables.jpg",
                                date: "Mar 5, 2026"
                            },
                            {
                                id: 2,
                                title: "Top 5 Superfoods for Heart Health",
                                excerpt: "Five foods scientifically proven to support cardiovascular health.",
                                image: "/products/Blueberries.jpg",
                                date: "Mar 4, 2026"
                            },
                            {
                                id: 3,
                                title: "Balanced Diet in a Busy Lifestyle",
                                excerpt: "Eat healthily even when you're short on time.",
                                image: "/products/berry-blast.jpg",
                                date: "Mar 3, 2026"
                            }
                        ].map((post) => (
                            <Link key={post.id} to={`/blog/${post.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700">
                                        {post.date}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== NEWSLETTER ===== */}
            <section className="py-16 bg-emerald-800">
                <div className="container-custom text-center max-w-2xl mx-auto">
                    <div className="bg-emerald-700/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-5">
                        <Mail size={24} className="text-emerald-200" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Get 10% Off Your First Order</h2>
                    <p className="text-emerald-200 mb-8">Subscribe for exclusive offers, fresh arrival alerts, and healthy recipes.</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                        />
                        <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3.5 rounded-xl transition-colors whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-xs text-emerald-400 mt-3">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </section>

            {/* ===== ERROR MESSAGE ===== */}
            {error && (
                <div className="container-custom py-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-center gap-4">
                        <div className="bg-red-100 p-2 rounded-xl shrink-0">
                            <ShieldCheck size={24} className="text-red-500" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Connection Issue</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
