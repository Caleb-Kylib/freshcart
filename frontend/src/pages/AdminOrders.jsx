import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import {
    ClipboardList,
    ChevronDown,
    User,
    Phone,
    MapPin,
    Package,
    CreditCard,
    Calendar,
    Eye,
    Printer,
    Pencil,
    XCircle
} from "lucide-react";
import { useOrders } from "../context/OrderContext";

const AdminOrders = () => {
    const { orders, updateOrderStatus } = useOrders();
    const [filter, setFilter] = useState("All");

    const statuses = ["All", "Pending", "Paid", "Packed", "Out for Delivery", "Delivered", "Cancelled"];

    const statusCounts = statuses.reduce((acc, status) => {
        if (status === "All") {
            acc[status] = orders.length;
        } else {
            acc[status] = orders.filter(o => o.orderStatus === status).length;
        }
        return acc;
    }, {});

    const updateStatus = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
    };

    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const filteredOrders = filter === "All"
        ? sortedOrders
        : sortedOrders.filter(o => o.orderStatus === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-amber-50 text-amber-700 border-amber-100";
            case "Paid": return "bg-sky-50 text-sky-700 border-sky-100";
            case "Packed": return "bg-blue-50 text-blue-700 border-blue-100";
            case "Out for Delivery": return "bg-indigo-50 text-indigo-700 border-indigo-100";
            case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Cancelled": return "bg-rose-50 text-rose-700 border-rose-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
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
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${filter === status
                            ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-100 scale-105"
                            : "bg-white text-gray-600 border-gray-100 hover:border-green-500/60 hover:text-green-700"
                            }`}
                    >
                        <span>{status}</span>
                        <span className={`inline-flex items-center justify-center min-w-[1.75rem] px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${filter === status
                            ? "bg-white/15 text-white"
                            : "bg-gray-100 text-gray-500"
                            }`}>
                            {statusCounts[status] ?? 0}
                        </span>
                    </button>
                ))}
            </div>

            <div className="space-y-7">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-[2px] transition-transform transition-shadow duration-150"
                        >
                            {/* Order Header */}
                            <div className="px-6 py-5 bg-gray-50/60 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white px-3.5 py-1.5 rounded-lg border border-gray-200 text-sm font-extrabold text-gray-900 shadow-sm uppercase tracking-tight">
                                        Order #{order._id.slice(-6).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                                        <Calendar size={14} />
                                        {formatDate(order.createdAt)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.16em] border ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-px"
                                    >
                                        {statuses.filter(s => s !== "All").map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="px-7 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
                                {/* Customer Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 group">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900 leading-none mb-1">{order.userId?.name || "Customer"}</div>
                                                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter">ID: {order.userId?._id?.slice(-8) || "N/A"}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <MapPin size={16} />
                                            </div>
                                            <div className="text-xs text-gray-600 leading-relaxed font-medium">
                                                {order.shippingAddress}<br />
                                                <span className="flex items-center gap-1.5 mt-1">
                                                    <Phone size={12} /> {order.customerPhone || "No Phone"}
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
                                            <span className="text-xs font-semibold text-gray-500">Method</span>
                                            <span className="text-xs font-semibold text-green-600 italic">M-Pesa</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-gray-500">Status</span>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-[0.16em] ${order.paymentStatus === "Paid"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                    : "bg-rose-50 text-rose-700 border border-rose-100"
                                                    }`}
                                            >
                                                {order.paymentStatus || "Captured"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4 lg:col-span-1">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Items ({order.items.length})</h3>
                                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                        {order.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center text-xs py-1.5 border-b border-gray-50 last:border-b-0"
                                            >
                                                <span className="text-gray-700 font-medium">
                                                    {item.name}{" "}
                                                    <span className="text-gray-400 font-normal text-[11px]">
                                                        x{item.quantity}
                                                    </span>
                                                </span>
                                                <span className="font-semibold text-gray-900 text-right min-w-[5rem]">
                                                    KES {(item.price * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total + Actions */}
                                <div className="space-y-4 flex flex-col justify-between items-end lg:border-l lg:border-gray-100 lg:pl-6">
                                    <div className="text-right w-full lg:w-auto">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                            Grand Total
                                        </h3>
                                        <p className="text-2xl md:text-3xl font-extrabold text-green-600 tracking-tight">
                                            <span className="text-xs md:text-sm font-semibold mr-1 text-gray-500 align-top">
                                                KES
                                            </span>
                                            {(order.totalAmount || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                            aria-label="View order"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                            aria-label="Print order"
                                        >
                                            <Printer size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                            aria-label="Edit order"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-rose-100 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                            aria-label="Cancel order"
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </div>
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
