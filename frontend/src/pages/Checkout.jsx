import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, CreditCard, Truck, MapPin, Phone, User, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart, removeFromCart, updateQuantity } = useCart();
    const { placeOrder } = useOrders();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        customerPhone: user?.phone || '',
        shippingAddress: '',
        paymentMethod: 'M-PesaSTK'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        setLoading(true);
        const orderData = {
            items: cartItems.map(item => ({
                productId: item._id || item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            totalAmount: cartTotal,
            shippingAddress: formData.shippingAddress,
            customerPhone: formData.customerPhone,
            paymentMethod: formData.paymentMethod
        };

        const result = await placeOrder(orderData);
        setLoading(false);

        if (result.success) {
            setOrderDetails(result.order);
            setOrderSuccess(true);
            clearCart();
            // Redirect after 5 seconds or keep showing success
            setTimeout(() => {
                navigate('/payment-status', { state: { orderId: result.order._id || result.order.id } });
            }, 5000);
        } else {
            alert(result.message || "Failed to place order. Please try again.");
        }
    };

    if (orderSuccess) {
        return (
            <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-emerald-50 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600">
                        <CheckCircle2 size={56} className="animate-bounce" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Order Placed!</h2>
                    <p className="text-gray-500 mb-8 font-medium">Thank you for shopping with FreshCart. Your organic goodness is on the way!</p>
                    
                    <div className="bg-emerald-50 rounded-2xl p-6 mb-8 text-left border border-emerald-100">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">Order Summary</p>
                        <div className="flex justify-between text-gray-900 font-bold mb-1">
                            <span>Order ID:</span>
                            <span className="font-mono text-xs">#{orderDetails?._id?.toString().slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-gray-900 font-bold">
                            <span>Total Paid:</span>
                            <span>KES {cartTotal}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/')}
                        className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        Return to Shop <ArrowRight size={20} />
                    </button>
                    <p className="text-gray-400 text-xs mt-6">Redirecting to status page in 5 seconds...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-400">
                        <ShoppingBag size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Add some fresh organic produce to your cart first.</p>
                    <Link to="/products" className="btn-primary inline-flex items-center gap-3">
                        <ArrowRight size={20} className="rotate-180" /> Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen bg-gray-50">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Checkout Form */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-emerald-600 text-white p-2 rounded-xl">
                                <Truck size={24} />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Delivery Info */}
                            <div className="bg-white overflow-hidden rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <MapPin className="text-emerald-600" size={20} /> 1. Delivery Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="customerName"
                                                required
                                                placeholder="Enter your name"
                                                value={formData.customerName}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-widest text-gray-500 ml-1">Phone Number (M-Pesa)</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="tel"
                                                name="customerPhone"
                                                required
                                                placeholder="07XX XXX XXX"
                                                value={formData.customerPhone}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-black uppercase tracking-widest text-gray-500 ml-1">Shipping Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                                            <textarea
                                                name="shippingAddress"
                                                required
                                                rows="3"
                                                placeholder="Apartment, Street Name, Estate, City..."
                                                value={formData.shippingAddress}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white overflow-hidden rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <CreditCard className="text-emerald-600" size={20} /> 2. Payment Method
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`relative flex items-center gap-4 p-6 rounded-2xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'M-PesaSTK' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="M-PesaSTK"
                                            checked={formData.paymentMethod === 'M-PesaSTK'}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'M-PesaSTK' ? 'border-emerald-600' : 'border-gray-300'}`}>
                                            {formData.paymentMethod === 'M-PesaSTK' && <div className="w-3 h-3 bg-emerald-600 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 tracking-tight">M-Pesa Prompt</p>
                                            <p className="text-xs text-emerald-600 font-bold">Fast & Secure</p>
                                        </div>
                                        <img src="/mpesa-logo.png" alt="M-Pesa" className="ml-auto h-8 opacity-80" />
                                    </label>

                                    <label className={`relative flex items-center gap-4 p-6 rounded-2xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={formData.paymentMethod === 'COD'}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'COD' ? 'border-emerald-600' : 'border-gray-300'}`}>
                                            {formData.paymentMethod === 'COD' && <div className="w-3 h-3 bg-emerald-600 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 tracking-tight">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500 font-bold italic">Pay when you receive</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-[400px]">
                        <div className="bg-emerald-900 text-white rounded-[3rem] p-8 md:p-10 shadow-2xl sticky top-32">
                            <h3 className="text-2xl font-black mb-8 border-b border-emerald-800 pb-6 uppercase tracking-widest text-[14px]">Order Summary</h3>
                            
                            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
                                {cartItems.map((item) => (
                                    <div key={item._id || item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm leading-tight text-white/90 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-emerald-400 font-black mt-1 uppercase tracking-widest">{item.quantity} x KES {item.price}</p>
                                        </div>
                                        <p className="font-black text-sm">KES {item.quantity * item.price}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-emerald-800 pt-8 mb-8 font-bold">
                                <div className="flex justify-between text-emerald-300">
                                    <span>Subtotal</span>
                                    <span>KES {cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-emerald-300">
                                    <span>Delivery</span>
                                    <span>KES 0</span>
                                </div>
                                <div className="flex justify-between text-2xl font-black pt-4 border-t border-emerald-800/50">
                                    <span>Total</span>
                                    <span className="text-amber-400">KES {cartTotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full py-6 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-4 bg-amber-400 text-emerald-950 hover:bg-white active:scale-95 shadow-2xl shadow-emerald-950/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-emerald-950/30 border-t-emerald-950 animate-spin rounded-full" />
                                        Processing...
                                    </>
                                ) : (
                                    <>Pay KES {cartTotal} <ArrowRight size={22} /></>
                                )}
                            </button>
                            
                            <div className="mt-8 flex items-center justify-center gap-3 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                <ShieldCheck size={16} /> Secure SSL Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
