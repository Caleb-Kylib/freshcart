import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/EnhancedCartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Menu, X, Search, User, LogOut, ArrowRight } from 'lucide-react';

// Each link carries its own safe, complete Tailwind colour classes
const NAV_LINKS = [
  { name: 'Home',       path: '/',                             active: 'bg-blue-600',   hover: 'hover:bg-blue-600' },
  { name: 'Shop',       path: '/products',                     active: 'bg-orange-500', hover: 'hover:bg-orange-500' },
  { name: 'Fruits',     path: '/products?category=Fruits',     active: 'bg-orange-400', hover: 'hover:bg-orange-400' },
  { name: 'Vegetables', path: '/products?category=Vegetables', active: 'bg-teal-600',   hover: 'hover:bg-teal-600' },
  { name: 'Herbs',      path: '/products?category=Herbs',      active: 'bg-purple-600', hover: 'hover:bg-purple-600' },
  { name: 'Smoothies',  path: '/products?category=Smoothies',  active: 'bg-cyan-600',   hover: 'hover:bg-cyan-600' },
  { name: 'Blog',       path: '/blog',                         active: 'bg-emerald-600',hover: 'hover:bg-emerald-600' },
  { name: 'Contact',    path: '/contact',                      active: 'bg-rose-500',   hover: 'hover:bg-rose-500' },
];

const MOBILE_LINKS = [
  { name: '🏠 Home',             path: '/',                             bg: 'bg-blue-600' },
  { name: '🛍️ Product Catalog',  path: '/products',                     bg: 'bg-orange-500' },
  { name: '🍎 Fruits',            path: '/products?category=Fruits',     bg: 'bg-orange-400' },
  { name: '🥦 Vegetables',        path: '/products?category=Vegetables', bg: 'bg-teal-600' },
  { name: '🌿 Herbs',             path: '/products?category=Herbs',      bg: 'bg-purple-600' },
  { name: '🥤 Smoothies',         path: '/products?category=Smoothies',  bg: 'bg-cyan-600' },
  { name: '📚 Wellness Blog',     path: '/blog',                         bg: 'bg-emerald-600' },
  { name: '📞 Contact Us',        path: '/contact',                      bg: 'bg-rose-500' },
];

const Navbar = () => {
  const [isScrolled,       setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isHomePage  = location.pathname === '/';
  const isAdminPath = location.pathname.startsWith('/admin');
  const isFloating  = isHomePage && !isScrolled;

  const navBg    = isFloating ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100';
  const textColor = isFloating ? 'text-white' : 'text-gray-800';
  const logoColor = isFloating ? 'text-white' : 'text-primary';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${isFloating ? 'py-6' : 'py-4'} ${navBg}`}>
      <div className="container-custom flex justify-between items-center">

        {/* ── Logo ───────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="bg-primary p-2 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <span className={`block text-xl font-black tracking-tight ${logoColor} transition-colors duration-300`}>FreshCart</span>
            <span className={`block text-[10px] font-black uppercase tracking-[0.3em] opacity-60 ${textColor}`}>Kenya</span>
          </div>
        </Link>

        {/* ── Desktop nav ────────────────────────────────────────── */}
        {!isAdminPath && (
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                location.pathname + location.search === link.path ||
                (link.path === '/products' && location.pathname === '/products' && !location.search);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 hover:text-white
                    ${isActive ? `${link.active} text-white shadow-md` : `${textColor} ${link.hover} hover:text-white`}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Right actions ──────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          {!isAdminPath && (
            <div className="flex items-center">
              <button className={`p-2.5 rounded-full transition-all hover:bg-gray-100/20 ${textColor}`} aria-label="Search">
                <Search size={20} />
              </button>

              <Link to="/cart" className="relative group" aria-label="Cart">
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
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200/30">
              <div className="hidden sm:flex flex-col items-end leading-none">
                <span className={`text-sm font-black ${textColor}`}>{user.name}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{user.role}</span>
              </div>
              <button
                onClick={logout}
                className={`flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs transition-all active:scale-95
                  ${isAdminPath
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm'
                    : `${textColor} bg-white/10 hover:bg-rose-50 hover:text-rose-600`}`}
                title="Logout"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all active:scale-95 shadow-xl
                ${isFloating
                  ? 'bg-white text-gray-900 hover:shadow-2xl hover:-translate-y-1'
                  : 'bg-primary text-white hover:bg-emerald-700'}`}
            >
              <User size={18} />
              <span>Sign In</span>
            </Link>
          )}

          <button
            className={`lg:hidden p-2 rounded-xl border transition-all ${isFloating ? 'border-white/20 text-white' : 'border-gray-100 text-gray-600'}`}
            onClick={() => setIsMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 bg-white rounded-[2rem] shadow-2xl mt-4 p-6 border border-gray-100">
          <div className="grid gap-2">
            {MOBILE_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl ${link.bg} text-white font-bold transition-all hover:opacity-90 hover:scale-[1.01] group`}
              >
                <span>{link.name}</span>
                <ArrowRight size={18} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="mt-6 flex items-center justify-center p-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
            >
              Enter Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
