import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { ShoppingCart, Package, TrendingUp, Plus, ClipboardList, Users, AlertCircle } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { users, user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    lowStockCount: 0,
    bestSellers: []
  });

  useEffect(() => {
    const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const lowStockCount = products.filter(p => p.stock < 10).length;
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
      users: users.length,
      revenue: revenue,
      lowStockCount,
      bestSellers
    });
  }, [products, orders, users]);

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="relative mb-12 overflow-hidden rounded-[3rem] bg-emerald-900 p-10 text-white shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Welcome back, <span className="text-emerald-400">{user?.name?.split(' ')[0] || 'Admin'}</span>!
          </h1>
          <p className="text-emerald-100/70 font-medium text-lg max-w-xl">
            Here's what's happening with FreshCart Kenya today. All systems are operational and performing at peak efficiency.
          </p>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-[80px]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: "Total Revenue", value: `KES ${stats.revenue.toLocaleString()}`, sub: "+12% from last month", icon: <TrendingUp size={24} />, color: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" },
          { label: "Active Orders", value: stats.orders, sub: "Pending processing", icon: <ShoppingCart size={24} />, color: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
          { label: "Store Inventory", value: stats.products, sub: "Items listed", icon: <Package size={24} />, color: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
          { label: "Platform Users", value: stats.users, sub: "Registered accounts", icon: <Users size={24} />, color: "bg-indigo-500", text: "text-indigo-600", light: "bg-indigo-50" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`p-4 ${item.light} ${item.text} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-[0.15em] mb-2">{item.label}</h3>
            <p className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{item.value}</p>
            <p className="text-xs font-bold text-gray-400 italic font-mono">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Best Sellers */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Best Selling Products</h3>
              <p className="text-gray-400 text-sm font-medium mt-1">Based on recent sales data.</p>
            </div>
            <span className="px-5 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100">Top Performers</span>
          </div>

          <div className="space-y-6">
            {stats.bestSellers.length > 0 ? (
              stats.bestSellers.map((product, idx) => (
                <div key={idx} className="flex items-center gap-6 p-5 hover:bg-emerald-50/30 rounded-3xl transition-all group border border-transparent hover:border-emerald-50">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-inner">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-gray-900 text-lg mb-1 truncate">{product.name}</p>
                    <p className="text-sm text-emerald-600 font-black">KES {product.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-sm font-black text-gray-900">{product.quantity} Sold</p>
                    <div className="w-24 h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(product.quantity / stats.bestSellers[0].quantity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-3xl py-12 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100">
                No orders discovered yet. Start selling to see stats!
              </div>
            )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-10">
          {/* Quick Tasks */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">Quick Management</h3>
            <div className="space-y-4">
              <Link to="/admin/products" className="flex items-center justify-between p-6 bg-emerald-50 hover:bg-emerald-500 hover:text-white rounded-[2rem] transition-all group border border-emerald-100/50">
                <span className="font-bold">Add New Product</span>
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              </Link>
              <Link to="/admin/orders" className="flex items-center justify-between p-6 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-[2rem] transition-all group border border-blue-100/50">
                <span className="font-bold">Pending Orders</span>
                <div className="bg-blue-200 group-hover:bg-blue-400 px-3 py-1 rounded-full text-[10px] font-black text-blue-700 group-hover:text-white transition-colors">
                  {stats.orders}
                </div>
              </Link>
            </div>
          </div>

          {/* Low Stock Watch */}
          <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 shadow-sm shadow-rose-50">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <AlertCircle size={24} />
              <h3 className="text-xl font-black">Stock Alert</h3>
            </div>
            <p className="text-rose-700/70 text-sm font-medium mb-6"> {stats.lowStockCount} items are running dangerously low on stock.</p>
            <Link to="/admin/products" className="block w-full text-center py-4 bg-rose-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-[0.98]">
              Restock Now
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
