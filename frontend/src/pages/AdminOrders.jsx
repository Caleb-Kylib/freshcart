import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ClipboardList, ChevronDown, User, Phone, MapPin, Package, CreditCard, Calendar } from "lucide-react";
import { useOrders } from "../context/OrderContext";

const AdminOrders = () => {
    const { orders, updateOrderStatus } = useOrders();
    const [filter, setFilter] = useState("All");

    const statuses = ["All", "Pending", "Paid", "Packed", "Out for Delivery", "Delivered", "Cancelled"];

    const updateStatus = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
    };

    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const filteredOrders = filter === "All"
        ? sortedOrders
        : sortedOrders.filter(o => o.orderStatus === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Packed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Out for Delivery': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-xl text-green-600">
                            <ClipboardList size={28} />
                        </div>
                        Order Management
                    </h1>
                    <p className="text-gray-500 mt-1">Track and manage customer deliveries</p>
                </div>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {statuses.map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${filter === status
                            ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-100 scale-105"
                            : "bg-white text-gray-600 border-gray-100 hover:border-green-500 hover:text-green-600"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-black text-gray-900 shadow-sm uppercase tracking-tighter">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                        <Calendar size={14} />
                                        {formatDate(order.createdAt)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border animate-in fade-in zoom-in ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all cursor-pointer shadow-sm"
                                    >
                                        {statuses.filter(s => s !== "All").map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
                                {/* Customer Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 group">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 leading-none mb-1">{order.userId?.name || 'Customer'}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: {order.userId?._id?.slice(-8) || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <MapPin size={16} />
                                            </div>
                                            <div className="text-xs text-gray-600 leading-relaxed font-medium">
                                                {order.shippingAddress}<br />
                                                <span className="flex items-center gap-1.5 mt-1">
                                                    <Phone size={12} /> {order.customerPhone || 'No Phone'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment</h3>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-500">Method</span>
                                            <span className="text-xs font-black text-green-600 italic">M-Pesa</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-500">Status</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${order.paymentStatus === 'Paid' ? 'bg-green-600 text-white' : 'bg-rose-600 text-white'
                                                }`}>
                                                {order.paymentStatus || 'Captured'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4 lg:col-span-1">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Items ({order.items.length})</h3>
                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-xs">
                                                <span className="text-gray-600 font-medium">
                                                    {item.name} <span className="text-gray-400 font-bold">x{item.quantity}</span>
                                                </span>
                                                <span className="font-black text-gray-900">KES {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="space-y-4 flex flex-col justify-between items-end">
                                    <div className="text-right">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Grand Total</h3>
                                        <p className="text-3xl font-black text-green-600 tracking-tighter">
                                            <span className="text-sm font-bold mr-1">KES</span>
                                            {(order.totalAmount || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1">
                                        Print Invoice <ChevronDown size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ClipboardList size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 mb-2">Zero {filter !== "All" ? filter : ""} Orders</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto font-medium">
                            {filter === "All"
                                ? "Incoming customer orders will appear here automatically."
                                : `There are currently no orders with the ${filter} status.`}
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
