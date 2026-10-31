import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Menu, X, Search, User, LogOut, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAdminPath = location.pathname.startsWith('/admin');

    // Unified visibility logic
    const isFloating = isHomePage && !isScrolled;
    const navBackground = isFloating ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100';
    const textColor = isFloating ? 'text-white' : 'text-gray-800';
    const logoColor = isFloating ? 'text-white' : 'text-primary';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <nav className={`fixed w-full z-[100] transition-all duration-500 ${isFloating ? 'py-6' : 'py-4'} ${navBackground}`}>
            <div className="container-custom flex justify-between items-center">
                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-3 group focus:outline-none">
                    <div className="relative">
                        <div className="bg-primary p-2 rounded-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                            <ShoppingBag className="text-white" size={24} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                        <span className={`block text-xl font-black tracking-tight ${logoColor} transition-colors duration-300`}>FreshCart</span>
                        <span className={`block text-[10px] font-black uppercase tracking-[0.3em] opacity-60 ${textColor}`}>Kenya</span>
                    </div>
                </Link>

                {/* Main Navigation (Hidden in Admin) */}
                {!isAdminPath && (
                    <div className="hidden lg:flex items-center space-x-1">
                        {[
                            { name: 'Home', path: '/', color: 'from-brand-vibrant-blue to-brand-smoothies' },
                            { name: 'Shop', path: '/products', color: 'from-brand-vibrant-orange to-brand-vibrant-yellow' },
                            { name: 'Fruits', path: '/products?category=Fruits', color: 'from-brand-fruits to-brand-vibrant-orange' },
                            { name: 'Vegetables', path: '/products?category=Vegetables', color: 'from-brand-vegetables to-brand-teal' },
                            { name: 'Herbs', path: '/products?category=Herbs', color: 'from-brand-herbs to-brand-vibrant-green' },
                            { name: 'Smoothies', path: '/products?category=Smoothies', color: 'from-brand-smoothies to-brand-vibrant-blue' },
                            { name: 'Blog', path: '/blog', color: 'from-brand-vibrant-green to-brand-vibrant-lime' },
                            { name: 'Contact', path: '/contact', color: 'from-brand-vibrant-coral to-brand-vibrant-amber' },
                        ].map((link) => {
                            const isActive = location.pathname + location.search === link.path ||
                                (link.path === '/products' && location.pathname === '/products' && !location.search);

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg ${isActive ? `bg-gradient-to-r ${link.color} text-white shadow-lg` : `${textColor} hover:bg-gradient-to-r ${link.color} hover:text-white bg-white/10 backdrop-blur-sm`}`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {!isAdminPath && (
                        <div className="flex items-center">
                            <button className={`p-2.5 rounded-full transition-all hover:bg-gray-100/10 ${textColor}`}>
                                <Search size={20} />
                            </button>

                            <Link to="/cart" className="relative group">
                                <div className={`p-2.5 rounded-full transition-all group-hover:bg-primary/10 ${textColor} group-hover:text-primary`}>
                                    <ShoppingBag size={22} />
                                </div>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:scale-125">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    )}

                    {user ? (
                        <div className="flex items-center gap-4 pl-4 border-l border-gray-200/20">
                            <div className="hidden sm:flex flex-col items-end leading-none">
                                <span className={`text-sm font-black ${textColor}`}>{user.name}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{user.role}</span>
                            </div>

                            <button
                                onClick={logout}
                                className={`flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs transition-all active:scale-95 ${isAdminPath ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm' : `${textColor} bg-white/10 hover:bg-rose-50 hover:text-rose-600`}`}
                                title="Exit Account"
                            >
                                <LogOut size={18} />
                                <span className="hidden md:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all active:scale-95 shadow-xl ${isFloating ? 'bg-white text-gray-900 hover:shadow-2xl hover:-translate-y-1' : 'bg-primary text-white hover:bg-emerald-700'}`}
                        >
                            <User size={18} />
                            <span>Sign In</span>
                        </Link>
                    )}

                    <button
                        className={`lg:hidden p-2 rounded-xl border transition-all ${isFloating ? 'border-white/20 text-white' : 'border-gray-100 text-gray-600'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Creative Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-4 right-4 bg-white rounded-[2rem] shadow-2xl mt-4 p-8 border border-gray-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid gap-3">
                        {[
                            { name: '🏠 Home', path: '/', color: 'bg-gradient-to-r from-brand-vibrant-blue to-brand-smoothies' },
                            { name: '🛍️ Product Catalog', path: '/products', color: 'bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow' },
                            { name: '🍎 Fruits', path: '/products?category=Fruits', color: 'bg-gradient-to-r from-brand-fruits to-brand-vibrant-orange' },
                            { name: '🥦 Vegetables', path: '/products?category=Vegetables', color: 'bg-gradient-to-r from-brand-vegetables to-brand-teal' },
                            { name: '🌿 Herbs', path: '/products?category=Herbs', color: 'bg-gradient-to-r from-brand-herbs to-brand-vibrant-green' },
                            { name: '🥤 Smoothies', path: '/products?category=Smoothies', color: 'bg-gradient-to-r from-brand-smoothies to-brand-vibrant-blue' },
                            { name: '📚 Wellness Blog', path: '/blog', color: 'bg-gradient-to-r from-brand-vibrant-green to-brand-vibrant-lime' },
                            { name: '📞 Contact Us', path: '/contact', color: 'bg-gradient-to-r from-brand-vibrant-coral to-brand-vibrant-amber' },
                        ].map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center justify-between p-5 rounded-2xl text-gray-900 font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${link.color}`}
                            >
                                <span className="text-white font-bold">{link.name}</span>
                                <ArrowRight size={18} className="text-white opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="mt-8 flex items-center justify-center p-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-200">
                            Enter Admin Dashboard
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
