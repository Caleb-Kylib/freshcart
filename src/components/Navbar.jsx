import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Menu, X, Search, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isAdminPath || isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="container-custom flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                    <span className="bg-primary text-white p-1 rounded-lg shadow-sm">FC</span>
                    <span className={`transition-colors ${!isAdminPath && !isScrolled ? 'text-white' : 'text-gray-800'}`}>FreshCart</span>
                    <span className={`transition-colors font-medium ${!isAdminPath && !isScrolled ? 'text-white/80' : 'text-primary'}`}>Kenya</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {!isAdminPath ? (
                        <>
                            <Link to="/" className={`font-medium transition-colors ${location.pathname === '/' ? 'text-primary' : (!isScrolled ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-primary')}`}>Home</Link>
                            <Link to="/products" className={`font-medium transition-colors ${location.pathname === '/products' ? 'text-primary' : (!isScrolled ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-primary')}`}>Shop</Link>
                            <Link to="/products?category=Fruits" className={`font-medium transition-colors ${!isScrolled ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-primary'}`}>Fruits</Link>

                            {user?.role === 'admin' && (
                                <Link to="/admin" className="font-bold text-green-700 bg-white shadow-sm px-4 py-1.5 rounded-full hover:bg-green-50 transition-all border border-green-100">Dashboard</Link>
                            )}
                        </>
                    ) : (
                        <Link to="/" className="text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:text-green-800 transition-all bg-green-50 px-3 py-1 rounded-lg border border-green-100">Back to Storefront</Link>
                    )}
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-2">
                    {!isAdminPath && (
                        <>
                            <button className={`hidden sm:block p-2 transition-colors ${!isScrolled ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-primary'}`}>
                                <Search size={22} />
                            </button>

                            <Link to="/cart" className={`relative p-2 transition-colors ${!isScrolled ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-primary'}`}>
                                <ShoppingBag size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 h-5 w-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <div className={`h-6 w-[1px] mx-2 hidden sm:block ${!isScrolled ? 'bg-white/20' : 'bg-gray-200'}`}></div>
                        </>
                    )}

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex flex-col items-end leading-none">
                                <span className={`text-sm font-bold ${!isAdminPath && !isScrolled ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-tighter ${!isAdminPath && !isScrolled ? 'text-white/60' : 'text-gray-500'}`}>{user.role}</span>
                            </div>

                            {/* Role-based Logout Button */}
                            {user.role === 'admin' ? (
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-2"
                                    title="Admin Logout"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden lg:inline">Logout</span>
                                </button>
                            ) : (
                                <button
                                    onClick={logout}
                                    className={`px-4 py-2 flex items-center gap-2 transition-colors rounded-xl font-bold text-xs ${!isScrolled ? 'text-white bg-white/10 hover:bg-white/20' : 'text-gray-600 bg-gray-100 hover:text-red-500 hover:bg-red-50'}`}
                                    title="Customer Logout"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${!isAdminPath && !isScrolled ? 'bg-white text-gray-900 shadow-xl' : 'bg-gray-900 text-white shadow-lg shadow-gray-200'}`}
                        >
                            <User size={18} />
                            <span className="hidden sm:inline">Sign In</span>
                        </Link>
                    )}

                    <button
                        className={`md:hidden p-2 transition-colors ${!isAdminPath && !isScrolled ? 'text-white' : 'text-gray-600'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl py-6 px-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300">
                    <Link to="/" className="text-gray-900 font-bold py-2 border-b border-gray-100 flex justify-between items-center">
                        Home <span className="text-primary tracking-tighter text-[10px] uppercase">Explore</span>
                    </Link>
                    <Link to="/products" className="text-gray-900 font-bold py-2 border-b border-gray-100 flex justify-between items-center">
                        Shop All <span className="text-primary tracking-tighter text-[10px] uppercase">Groceries</span>
                    </Link>
                    <div className="grid grid-cols-2 gap-2 py-2">
                        <Link to="/products?category=Fruits" className="bg-gray-50 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">Fruits</Link>
                        <Link to="/products?category=Vegetables" className="bg-gray-50 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">Vegetables</Link>
                    </div>

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="bg-green-600 text-white p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs shadow-lg shadow-green-100">
                            Go to Admin Dashboard
                        </Link>
                    )}

                    {user && (
                        <button onClick={logout} className="text-red-500 font-black py-4 border-t border-gray-100 text-center uppercase tracking-widest text-[10px]">
                            Logout of Account
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
