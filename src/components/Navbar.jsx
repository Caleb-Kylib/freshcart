import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
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
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="container-custom flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                    <span className="bg-primary text-white p-1 rounded-lg">FC</span>
                    FreshCart<span className="text-gray-800">Kenya</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {!isAdminPath ? (
                        <>
                            <Link to="/" className={`font-medium hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-gray-600'}`}>Home</Link>
                            <Link to="/products" className={`font-medium hover:text-primary transition-colors ${location.pathname === '/products' ? 'text-primary' : 'text-gray-600'}`}>Shop</Link>
                            <Link to="/products?category=Fruits" className="font-medium text-gray-600 hover:text-primary transition-colors">Fruits</Link>
                            <Link to="/products?category=Vegetables" className="font-medium text-gray-600 hover:text-primary transition-colors">Vegetables</Link>
                        </>
                    ) : (
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Management Console</span>
                    )}
                    <Link to="/admin" className="font-medium text-green-700 bg-green-50 px-4 py-1.5 rounded-full hover:bg-green-100 transition-colors border border-green-100">Admin</Link>
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-4">
                    {!isAdminPath && (
                        <>
                            <button className="hidden md:block p-2 text-gray-600 hover:text-primary transition-colors">
                                <Search size={22} />
                            </button>

                            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                                <ShoppingBag size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}

                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4">
                    <Link to="/" className="text-gray-800 font-medium py-2 border-b border-gray-100">Home</Link>
                    <Link to="/products" className="text-gray-800 font-medium py-2 border-b border-gray-100">Shop All</Link>
                    <Link to="/products?category=Fruits" className="text-gray-800 font-medium py-2 border-b border-gray-100">Fruits</Link>
                    <Link to="/products?category=Vegetables" className="text-gray-800 font-medium py-2 border-b border-gray-100">Vegetables</Link>
                    <Link to="/products?category=Juices" className="text-gray-800 font-medium py-2">Juices</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
