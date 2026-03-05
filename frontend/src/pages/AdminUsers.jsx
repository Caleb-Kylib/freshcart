import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Users as UsersIcon, Mail, Shield, User, Search, Filter, BarChart3, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";

const AdminUsers = () => {
    const { users } = useAuth();
    const { orders } = useOrders();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    const ordersByUserId = orders.reduce((map, order) => {
        const userId = order.userId?._id || order.userId;
        if (!userId) return map;
        const prev = map[userId] || { count: 0, lastOrderDate: null };
        const created = order.createdAt;
        map[userId] = {
            count: prev.count + 1,
            lastOrderDate:
                !prev.lastOrderDate || new Date(created) > new Date(prev.lastOrderDate)
                    ? created
                    : prev.lastOrderDate
        };
        return map;
    }, {});

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "All" || user.role === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const isToday = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const now = new Date();
        return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()
        );
    };

    const totalOrdersToday = orders.filter(o => isToday(o.createdAt)).length;
    const pendingCount = orders.filter(o => o.orderStatus === "Pending").length;
    const outForDeliveryCount = orders.filter(o => o.orderStatus === "Out for Delivery").length;

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-xl text-green-600">
                            <UsersIcon size={28} />
                        </div>
                        User Management
                    </h1>
                    <p className="text-gray-500 mt-1">View and manage system administrators and customers</p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                            Orders Today
                        </p>
                        <p className="text-2xl font-extrabold text-gray-900">
                            {totalOrdersToday}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <BarChart3 size={20} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                            Pending Orders
                        </p>
                        <p className="text-2xl font-extrabold text-amber-600">
                            {pendingCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                            Out for Delivery
                        </p>
                        <p className="text-2xl font-extrabold text-indigo-600">
                            {outForDeliveryCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400" size={20} />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-2.5 outline-none font-medium"
                    >
                        <option value="All">All Roles</option>
                        <option value="Admin">Administrators</option>
                        <option value="Customer">Customers</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-100 uppercase text-[10px] font-bold text-gray-500 tracking-widest">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Total Orders</th>
                                <th className="px-6 py-4">Last Order</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => {
                                    const id = user._id || user.id;
                                    const stats = ordersByUserId[id] || { count: 0, lastOrderDate: null };
                                    const lastOrderLabel = stats.lastOrderDate
                                        ? new Date(stats.lastOrderDate).toLocaleString("en-KE", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })
                                        : "No orders yet";

                                    return (
                                        <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-400">ID: {id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail size={14} className="text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                                {user.role}
                                            </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {stats.count}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-gray-500">
                                                    {lastOrderLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                    Active
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-300">
                                                <Search size={32} />
                                            </div>
                                            <p className="text-gray-500 font-medium whitespace-normal max-w-xs">
                                                No users found matching your search.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;
