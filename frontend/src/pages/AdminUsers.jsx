import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Users as UsersIcon, Mail, Shield, User, Search, Filter, BarChart3, Clock, Plus, Trash2, Crown, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";

const AdminUsers = () => {
    const { users, createManager, updateUserRole, deleteUserAccount } = useAuth();
    const { orders } = useOrders();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [showManagerModal, setShowManagerModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [managerForm, setManagerForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
    };

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
    const managersCount = users.filter(u => u.role === "manager").length;

    // Handle create manager
    const handleCreateManager = async (e) => {
        e.preventDefault();
        if (!managerForm.name || !managerForm.email || !managerForm.password) {
            showToast("Please fill in all fields", "error");
            return;
        }
        
        setLoading(true);
        const result = await createManager(managerForm.name, managerForm.email, managerForm.password);
        setLoading(false);

        if (result.success) {
            showToast("Manager created successfully!", "success");
            setManagerForm({ name: "", email: "", password: "" });
            setShowManagerModal(false);
        } else {
            showToast(result.message, "error");
        }
    };

    // Handle role change
    const handleRoleChange = async (userId, newRole) => {
        const result = await updateUserRole(userId, newRole);
        if (result.success) {
            showToast(`User role updated to ${newRole}`, "success");
        } else {
            showToast(result.message, "error");
        }
    };

    // Handle delete user
    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setLoading(true);
        const result = await deleteUserAccount(selectedUser._id);
        setLoading(false);

        if (result.success) {
            showToast("User deleted successfully", "success");
            setShowDeleteConfirm(false);
            setSelectedUser(null);
        } else {
            showToast(result.message, "error");
        }
    };

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
                    <p className="text-gray-500 mt-1">View and manage administrators, managers, and customers</p>
                </div>
                <button
                    onClick={() => setShowManagerModal(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-100 font-bold"
                >
                    <Plus size={20} />
                    Add Manager
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                        <p className="text-2xl font-extrabold text-green-700">
                            {outForDeliveryCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-700">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                            Total Managers
                        </p>
                        <p className="text-2xl font-extrabold text-blue-600">
                            {managersCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Crown size={20} />
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
                        <option value="Manager">Managers</option>
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
                                <th className="px-6 py-4">Actions</th>
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
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                                        user.role === 'admin' ? 'bg-green-100 text-green-700' : 
                                                        user.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-600'
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
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold border-none cursor-pointer ${
                                                            user.role === 'admin' ? 'bg-green-100 text-green-700' :
                                                            user.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}
                                                    >
                                                        <option value="customer">Customer</option>
                                                        <option value="manager">Manager</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {stats.count}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-gray-500">{lastOrderLabel}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <p className="text-sm font-medium">No users found matching your search</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Manager Modal */}
            {showManagerModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Manager</h2>
                            <button
                                onClick={() => setShowManagerModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateManager} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={managerForm.name}
                                    onChange={(e) => setManagerForm({ ...managerForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    placeholder="Enter manager name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={managerForm.email}
                                    onChange={(e) => setManagerForm({ ...managerForm, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    placeholder="manager@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={managerForm.password}
                                    onChange={(e) => setManagerForm({ ...managerForm, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    placeholder="Enter password"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowManagerModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-all disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create Manager"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete User?</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{selectedUser.name}</strong> ({selectedUser.email})? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl font-bold transition-all disabled:opacity-50"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg border-l-4 animate-in fade-in slide-in-from-bottom-4 z-50 ${
                    toast.type === 'success' 
                        ? 'bg-green-50 border-l-green-500 text-green-800' 
                        : 'bg-red-50 border-l-red-500 text-red-800'
                }`}>
                    <div>
                        <p className="font-bold text-sm">{toast.type === 'success' ? 'Success' : 'Error'}</p>
                        <p className="text-xs opacity-90">{toast.message}</p>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminUsers;
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
