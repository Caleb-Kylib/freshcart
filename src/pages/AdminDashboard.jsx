import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ShoppingCart, Package, TrendingUp } from "lucide-react";

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of your grocery store performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 font-medium text-sm">Total Products</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.products}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 font-medium text-sm">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 font-medium text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-800">KES {stats.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity or Quick Links could go here */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/products" className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors text-center font-medium">
              Manage Products
            </a>
            <a href="/admin/orders" className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors text-center font-medium">
              View Orders
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
