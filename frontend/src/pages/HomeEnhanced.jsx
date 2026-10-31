import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Star, Truck, ShieldCheck, Leaf, Package,
    ShoppingCart, MapPin, Tag, Sparkles, Mail, ChevronDown,
    Plus, Clock, Percent, Heart, ChevronRight, Zap, Timer, BadgeCheck
} from 'lucide-react';
import ProductCard from '../components/EnhancedProductCard';
import ProductCarousel from '../components/ProductCarousel';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { categories } from '../data/products';

// Import colorful components
import ColorfulHero from '../components/ColorfulHero';
import ColorfulCategories from '../components/ColorfulCategories';
import ColorfulTrustBanner from '../components/ColorfulTrustBanner';
import ColorfulSection, { ColorfulCard, ColorfulBanner, ColorfulFeature } from '../components/ColorfulSection';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ColorfulCard color="blue" className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none"
            >
                <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-800'}`}>
                    {question}
                </span>
                <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-gradient-to-r from-brand-vibrant-blue to-brand-smoothies text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                    <ChevronDown size={20} />
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {answer}
                </div>
            </div>
        </ColorfulCard>
    );
};

const HomeEnhanced = () => {
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-vibrant-teal/5 via-brand-vibrant-green/5 to-brand-vibrant-lime/5">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow rounded-2xl flex items-center justify-center animate-pulse">
                        <ShoppingCart className="text-white" size={32} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Loading FreshCart...</h3>
                        <p className="text-gray-500">Preparing your colorful shopping experience</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* ===== COLORFUL HERO SECTION ===== */}
            <ColorfulHero />

            {/* ===== COLORFUL TRUST BANNER ===== */}
            <ColorfulTrustBanner />

            {/* ===== COLORFUL CATEGORIES ===== */}
            <ColorfulCategories />

            {/* ===== FLASH SALE / DEALS COUNTDOWN ===== */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-vibrant-orange/5 via-brand-vibrant-yellow/5 to-brand-vibrant-coral/5" />
                
                <div className="container-custom relative z-10">
                    <ColorfulBanner>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                                    <Zap size={24} className="text-yellow-400 animate-pulse" />
                                    <span className="text-yellow-400 font-bold text-lg uppercase tracking-wider">⚡ FLASH SALE</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Weekend Super Deals</h2>
                                <p className="text-white/80 text-lg max-w-md">Up to 40% off on organic vegetables and fresh juices. Don't miss out! 🎉</p>
                            </div>

                            {/* Colorful Countdown */}
                            <div className="flex items-center gap-4">
                                {[
                                    { val: timeLeft.days, label: "Days", color: 'from-brand-vibrant-orange to-brand-vibrant-yellow' },
                                    { val: timeLeft.hours, label: "Hours", color: 'from-brand-vibrant-blue to-brand-smoothies' },
                                    { val: timeLeft.minutes, label: "Minutes", color: 'from-brand-vibrant-green to-brand-vibrant-lime' },
                                    { val: timeLeft.seconds, label: "Seconds", color: 'from-brand-primary to-brand-teal' },
                                ].map((unit, i) => (
                                    <div key={i} className="text-center">
                                        <div className={`bg-gradient-to-b ${unit.color} backdrop-blur-lg border border-white/20 rounded-2xl p-4 min-w-[80px] shadow-2xl`}>
                                            <span className="block text-3xl md:text-4xl font-black text-white">
                                                {String(unit.val).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <span className="text-white/80 text-xs font-bold uppercase tracking-wider mt-2 block">
                                            {unit.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/products"
                                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-bold px-10 py-4 rounded-2xl transition-all whitespace-nowrap shadow-2xl shadow-yellow-400/30 active:scale-95 transform hover:-translate-y-1"
                            >
                                🛒 Shop Flash Deals
                            </Link>
                        </div>
                    </ColorfulBanner>
                </div>
            </section>

            {/* ===== BEST SELLERS ===== */}
            {bestSellers.length > 0 && (
                <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                    <div className="container-custom">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow p-3 rounded-2xl shadow-lg">
                                    <Tag size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow">
                                            Best Sellers
                                        </span>
                                    </h2>
                                    <p className="text-gray-500 text-lg">Most loved by our customers ❤️</p>
                                </div>
                            </div>
                            <Link 
                                to="/products" 
                                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                            >
                                See All <ChevronRight size={18} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {bestSellers.slice(0, 4).map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== NEW ARRIVALS CAROUSEL ===== */}
            {newArrivals.length > 0 && (
                <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container-custom">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-r from-brand-vibrant-green to-brand-vibrant-lime p-3 rounded-2xl shadow-lg">
                                    <Sparkles size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-vibrant-green to-brand-vibrant-lime">
                                            Fresh Arrivals
                                        </span>
                                    </h2>
                                    <p className="text-gray-500 text-lg">Just added to our shelves 🌟</p>
                                </div>
                            </div>
                            <Link 
                                to="/products" 
                                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-brand-vibrant-green to-brand-vibrant-lime text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                            >
                                View All <ChevronRight size={18} />
                            </Link>
                        </div>
                        <ProductCarousel products={newArrivals} />
                    </div>
                </section>
            )}

            {/* ===== COLORFUL FEATURES ===== */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-teal to-brand-vibrant-blue">
                                Why Choose FreshCart?
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Experience grocery shopping reimagined with color, convenience, and care
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ColorfulFeature
                            icon="🚚"
                            title="Lightning Fast Delivery"
                            description="Same-day delivery across Nairobi. Freshness guaranteed from farm to door."
                            color="orange"
                        />
                        <ColorfulFeature
                            icon="🌿"
                            title="100% Organic & Fresh"
                            description="Directly sourced from certified local farms. No chemicals, just nature."
                            color="green"
                        />
                        <ColorfulFeature
                            icon="💚"
                            title="Eco-Friendly Packaging"
                            description="Sustainable packaging that cares for your food and our planet."
                            color="green"
                        />
                    </div>
                </div>
            </section>

            {/* ===== FAQ SECTION ===== */}
            <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-vibrant-blue to-brand-smoothies">
                                Frequently Asked Questions
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg">Everything you need to know about shopping with us</p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>

                    {/* Still have questions? */}
                    <div className="text-center mt-12">
                        <ColorfulCard color="blue" className="max-w-2xl mx-auto">
                            <div className="text-center p-8">
                                <Mail className="w-16 h-16 text-brand-vibrant-blue mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
                                <p className="text-gray-600 mb-6">Our team is here to help you with any questions about our products or delivery.</p>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-vibrant-blue to-brand-smoothies text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg transition-all"
                                >
                                    Contact Our Team
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </ColorfulCard>
                    </div>
                </div>
            </section>

            {/* ===== NEWSLETTER SIGNUP ===== */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-vibrant-green/10 via-brand-vibrant-lime/10 to-brand-primary/10" />
                
                <div className="container-custom relative z-10">
                    <ColorfulBanner
                        gradient="from-emerald-900 via-green-800 to-emerald-700"
                        bgColor="bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-700"
                    >
                        <div className="text-center">
                            <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Stay Fresh & Informed
                            </h2>
                            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                                Subscribe to our newsletter for weekly deals, recipes, and wellness tips delivered to your inbox.
                            </p>
                            
                            <form className="max-w-md mx-auto">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="flex-1 px-6 py-4 rounded-xl border-2 border-white/70 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-lime-300"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-lime-300 to-emerald-300 text-emerald-950 font-bold px-8 py-4 rounded-xl hover:from-lime-200 hover:to-emerald-200 hover:shadow-lg transition-all whitespace-nowrap"
                                    >
                                        Subscribe Now
                                    </button>
                                </div>
                                <p className="text-white/60 text-sm mt-4">
                                    By subscribing, you agree to our Privacy Policy. No spam, ever.
                                </p>
                            </form>
                        </div>
                    </ColorfulBanner>
                </div>
            </section>
        </div>
    );
};

export default HomeEnhanced;