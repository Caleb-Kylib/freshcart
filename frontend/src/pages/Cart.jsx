import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
    const { cartItems, cartTotal, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 border border-gray-100 scale-110">
                    <ShoppingBag size={48} className="text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Your cart is empty</h2>
                <p className="text-gray-500 mb-10 max-w-md font-medium leading-relaxed">
                    Explore our farm-fresh selection and start filling your kitchen with quality groceries.
                </p>
                <Link
                    to="/products"
                    className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]"
                >
                    Discover Products
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#FDFDFD]">
            <div className="container-custom">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
                        <p className="text-gray-500 font-medium mt-1">Check your items and proceed to checkout.</p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-sm font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-2"
                    >
                        Clear All Items
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden">
                            <div className="space-y-0">
                                {cartItems.map(item => (
                                    <CartItem key={item._id || item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link
                                to="/products"
                                className="inline-flex items-center text-gray-900 font-bold hover:text-emerald-600 group transition-all"
                            >
                                <ArrowLeft size={18} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 border border-gray-100 sticky top-32">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">Order Summary</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-bold">KES {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Service Fee</span>
                                    <span className="text-emerald-600 font-black">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Tax</span>
                                    <span className="text-gray-900 font-bold">KES 0</span>
                                </div>

                                <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Total</p>
                                        <span className="text-3xl font-black text-emerald-600 tracking-tight">KES {cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full bg-emerald-600 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-[0.98]"
                            >
                                Proceed to Checkout
                            </Link>

                            <div className="mt-10 pt-8 border-t border-gray-50">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4 text-center">Payment Methods</p>
                                <div className="flex justify-center items-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                    {/* M-PESA Placeholder visual */}
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[11px] font-bold text-gray-900">M-PESA SECURE</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-200"></div>
                                    <span className="text-[11px] font-bold text-gray-900 uppercase">Cash on Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
