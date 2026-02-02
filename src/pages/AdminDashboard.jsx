import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { ShoppingCart, Package, TrendingUp, Plus, ClipboardList } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("adminProducts")) || [];
    const orders = JSON.parse(localStorage.getItem("adminOrders")) || [];

    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    setStats({
      products: products.length,
      orders: orders.length,
      revenue: revenue
    });
  }, []);

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 leading-none">Admin Dashboard</h1>
        <p className="text-gray-500 font-medium mt-2">The pulse of your grocery empire.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-green-50 transition-all duration-500">
          <div className="p-4 bg-green-100 text-green-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Package size={32} />
          </div>
          <div>
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-loose">Total Products</h3>
            <p className="text-3xl font-black text-gray-900">{stats.products}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-50 transition-all duration-500">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
            <ShoppingCart size={32} />
          </div>
          <div>
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-loose">Total Orders</h3>
            <p className="text-3xl font-black text-gray-900">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-orange-50 transition-all duration-500">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
            <TrendingUp size={32} />
          </div>
          <div>
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-loose">Total Revenue</h3>
            <p className="text-3xl font-black text-gray-900 leading-tight">KES {stats.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/products" className="flex items-center justify-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-green-50 hover:text-green-700 transition-all font-bold text-gray-700 group border border-transparent hover:border-green-100">
              <Plus size={20} className="group-hover:scale-125 transition-transform" />
              Inventory
            </Link>
            <Link to="/admin/orders" className="flex items-center justify-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-700 transition-all font-bold text-gray-700 group border border-transparent hover:border-blue-100">
              <ClipboardList size={20} className="group-hover:scale-125 transition-transform" />
              Order Logs
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
