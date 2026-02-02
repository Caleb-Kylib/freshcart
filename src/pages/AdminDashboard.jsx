import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { ShoppingCart, Package, TrendingUp, Plus, ClipboardList } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    lowStockCount: 0,
    bestSellers: []
  });

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("adminProducts")) || [];
    const orders = JSON.parse(localStorage.getItem("adminOrders")) || [];

    // Revenue calculation
    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Low stock count
    const lowStockCount = products.filter(p => p.stock < 10).length;

    // Best sellers calculation
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.name]) {
          productSales[item.name].quantity += item.quantity;
        } else {
          productSales[item.name] = {
            quantity: item.quantity,
            image: item.image,
            price: item.price
          };
        }
      });
    });

    const bestSellers = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setStats({
      products: products.length,
      orders: orders.length,
      revenue: revenue,
      lowStockCount,
      bestSellers
    });
  }, []);

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 leading-none">Admin Dashboard</h1>
        <p className="text-gray-500 font-medium mt-2">Real-time insights for your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-xl hover:shadow-green-50 transition-all duration-500">
          <div className="p-4 bg-green-100 text-green-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Package size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Products</h3>
            <p className="text-2xl font-black text-gray-900">{stats.products}</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-xl hover:shadow-blue-50 transition-all duration-500">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Orders</h3>
            <p className="text-2xl font-black text-gray-900">{stats.orders}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-xl hover:shadow-orange-50 transition-all duration-500">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Revenue</h3>
            <p className="text-xl font-black text-gray-900 leading-tight">KES {stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-xl hover:shadow-red-50 transition-all duration-500 border-l-4 border-l-red-500">
          <div className="p-4 bg-red-100 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Package size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest text-red-500">Low Stock</h3>
            <p className="text-2xl font-black text-red-600">{stats.lowStockCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Best Sellers */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900">Best-Selling Products</h3>
            <span className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-black rounded-full uppercase tracking-wider">Top 5</span>
          </div>
          <div className="space-y-4">
            {stats.bestSellers.length > 0 ? (
              stats.bestSellers.map((product, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 font-medium">KES {product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-green-600">{product.quantity} Sold</p>
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(product.quantity / stats.bestSellers[0].quantity) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 font-medium italic">
                No sales data available yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-green-600 p-8 rounded-[2.5rem] shadow-xl shadow-green-100 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black mb-2">Management</h3>
            <p className="text-green-100 text-sm font-medium">Quickly jump to your management console.</p>
          </div>
          <div className="space-y-3 mt-8">
            <Link to="/admin/products" className="flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
              <span className="font-bold">Inventory</span>
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            </Link>
            <Link to="/admin/orders" className="flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
              <span className="font-bold">Recent Orders</span>
              <ClipboardList size={20} className="group-hover:scale-110 transition-transform" />
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-green-500/30">
            <p className="text-[10px] uppercase font-black tracking-widest text-green-200 opacity-60">Status: System Online</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
