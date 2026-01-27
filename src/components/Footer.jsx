import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-16 pb-8">
            <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="bg-primary text-white p-1 rounded-lg">FC</span>
                        FreshCart<span className="text-gray-400">Kenya</span>
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Delivering fresh, organic, and locally sourced produce to your doorstep in Nairobi.
                        Quality you can trust, freshness you can taste.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"><Facebook size={20} /></a>
                        <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"><Instagram size={20} /></a>
                        <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"><Twitter size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                        <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Shop All</Link></li>
                        <li><Link to="/products?category=Fruits" className="text-gray-400 hover:text-white transition-colors">Fresh Fruits</Link></li>
                        <li><Link to="/products?category=Vegetables" className="text-gray-400 hover:text-white transition-colors">Vegetables</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="text-lg font-semibold mb-6">Categories</h4>
                    <ul className="space-y-4">
                        <li><Link to="/products?category=Juices" className="text-gray-400 hover:text-white transition-colors">Juices & Smoothies</Link></li>
                        <li><Link to="/products?category=Herbs" className="text-gray-400 hover:text-white transition-colors">Fresh Herbs</Link></li>
                        <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Organic Specials</Link></li>
                        <li><Link to="/cart" className="text-gray-400 hover:text-white transition-colors">Cart</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-gray-400">
                            <MapPin size={20} className="text-primary mt-1" />
                            <span>Westlands, Nairobi,<br />Kenya</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <Phone size={20} className="text-primary" />
                            <span>+254 700 000 000</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <Mail size={20} className="text-primary" />
                            <span>hello@freshcart.co.ke</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container-custom mt-16 pt-8 border-t border-gray-800 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} FreshCart Kenya. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
