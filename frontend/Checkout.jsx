import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, Loader2 } from 'lucide-react';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: 'Nairobi',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (cartItems.length === 0 && !success) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate Payment Processing
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            clearCart();
        }, 2000); // 2 seconds delay
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg max-w-md text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you, {formData.name}. We have received your order.
                        You will receive an M-Pesa prompt on <b>{formData.phone}</b> shortly to complete payment.
                    </p>
                    <button onClick={() => navigate('/')} className="btn-primary w-full">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Form */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Delivery Details</h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (M-Pesa)</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                    placeholder="07XX XXX XXX"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100 outline-none transition-all bg-white"
                                    >
                                        <option>Nairobi</option>
                                        <option>Kiambu</option>
                                        <option>Machakos</option>
                                        <option>Kajiado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address / Estate</label>
                                    <input
                                        required
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                        placeholder="e.g. Westlands, Plot 10"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Your Order</h2>
                            <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-gray-600">{item.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
                                        </div>
                                        <span className="font-medium">KES {item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>KES {cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl text-gray-900 border-t border-gray-100 pt-3">
                                    <span>Total</span>
                                    <span>KES {cartTotal}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="bg-green-50 p-4 rounded-xl flex items-center gap-4 mb-6 border border-green-100">
                                    <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center font-bold italic text-green-600">
                                        M-Pesa
                                    </div>
                                    <p className="text-xs text-green-800">
                                        A payment request will be sent to the phone number provided above.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={loading}
                                    className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2"
                                >
                                    {loading ? <><Loader2 className="animate-spin" /> Processing...</> : `Pay KES ${cartTotal}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
