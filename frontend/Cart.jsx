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
                <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                    <ShoppingBag size={48} className="text-gray-300" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any fresh groceries to your cart yet.</p>
                <Link to="/products" className="btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-700">Items ({cartItems.length})</h2>
                                <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear Cart</button>
                            </div>

                            <div>
                                {cartItems.map(item => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-primary mt-4 font-medium transition-colors">
                            <ArrowLeft size={18} className="mr-2" /> Continue Shopping
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="font-bold text-xl mb-6 text-gray-900">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>KES {cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <span className="font-bold text-primary text-2xl">KES {cartTotal}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="w-full btn-primary flex justify-center py-4 rounded-xl">
                                Proceed to Checkout
                            </Link>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <span className="bg-gray-100 px-2 py-1 rounded">Secure Checkout</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">M-Pesa Only</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
