import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ClipboardList, ChevronDown, User, Phone, MapPin, Package } from "lucide-react";

import { useOrders } from "../context/OrderContext";

const AdminOrders = () => {
    const { orders, updateOrderStatus } = useOrders();
    const [filter, setFilter] = useState("All");

    const updateStatus = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
    };

    const filteredOrders = filter === "All"
        ? orders
        : orders.filter(o => o.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                <p className="text-gray-500">View and update customer orders.</p>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {["All", "Pending", "Processing", "Delivered"].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === status
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-green-500"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Order Header */}
                        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800">{order.id}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-sm text-gray-500">{order.date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                                <select
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                    className="text-xs border border-gray-200 rounded-lg p-1 outline-none focus:ring-1 focus:ring-green-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Customer Info */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <User size={16} className="text-gray-400" />
                                        <span className="font-medium">{order.customer.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Phone size={16} className="text-gray-400" />
                                        <span>{order.customer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{order.customer.address}, {order.customer.city}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3 col-span-1">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items</h3>
                                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">
                                                {item.name} <span className="text-gray-400">x{item.quantity}</span>
                                            </span>
                                            <span className="font-medium">KES {item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-3 flex flex-col justify-between items-end text-right">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Amount</h3>
                                    <p className="text-2xl font-black text-green-600">KES {order.total.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    {/* Additional actions could go here */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <ClipboardList size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-medium text-gray-500">No {filter !== "All" ? filter.toLowerCase() : ""} orders found</h3>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
