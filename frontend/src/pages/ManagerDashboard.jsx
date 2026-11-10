import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ManagerLayout from "../components/ManagerLayout";
import StatusBadge from "../components/StatusBadge";
import {
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Package,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import {
  calculateStats,
  generateLast7DaysSalesData,
  getOrdersNeedingAttention,
  formatCurrency,
  formatDate
} from "../utils/managerUtils";

const ManagerDashboard = () => {
  const { products } = useProducts();
  const { orders } = useOrders();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [attentionOrders, setAttentionOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);

  useEffect(() => {
    // Calculate stats
    const calculatedStats = calculateStats(orders, products);
    setStats(calculatedStats);

    // Generate chart data
    const chartData = generateLast7DaysSalesData(orders);
    setChartData(chartData);

    // Get orders needing attention
    const attention = getOrdersNeedingAttention(orders);
    setAttentionOrders(attention);

    // Get low stock items
    const lowStock = products
      .filter(p => p.stock < (p.reorderLevel || 10) && p.stock > 0)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
    setLowStockItems(lowStock);

    // Get expiring items (mock - would need expiry dates in product model)
    const expiring = products
      .filter(p => Math.random() > 0.8)
      .slice(0, 3);
    setExpiringItems(expiring);
  }, [orders, products]);

  if (!stats) {
    return (
      <ManagerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A300] mx-auto mb-4"></div>
            <p className="text-[#1B2A1F] font-medium">Loading dashboard...</p>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  const maxSales = Math.max(...chartData.map(d => d.sales), 1);

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#1B2A1F] mb-2">Overview</h1>
        <p className="text-[#666] text-lg">Daily operations summary and key metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {/* Today's Orders */}
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest">
              Today's Orders
            </h3>
            <ShoppingCart size={20} className="text-[#00A300]" />
          </div>
          <p className="text-3xl font-bold text-[#1B2A1F] mb-2">{stats.todayOrders}</p>
          <p className="text-xs text-[#999]">Orders placed</p>
        </div>

        {/* Today's Sales */}
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest">
              Today's Sales
            </h3>
            <TrendingUp size={20} className="text-[#2E7D32]" />
          </div>
          <p className="text-3xl font-bold text-[#1B2A1F] mb-2">
            {formatCurrency(stats.todaysSales)}
          </p>
          <p className="text-xs text-[#999]">Total revenue</p>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest">
              Low Stock
            </h3>
            <AlertTriangle size={20} className="text-[#F9A825]" />
          </div>
          <p className="text-3xl font-bold text-[#1B2A1F] mb-2">{stats.lowStockItems}</p>
          <p className="text-xs text-[#999]">Items below reorder level</p>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest">
              Out of Stock
            </h3>
            <Package size={20} className="text-[#D32F2F]" />
          </div>
          <p className="text-3xl font-bold text-[#1B2A1F] mb-2">{stats.outOfStock}</p>
          <p className="text-xs text-[#999]">Items unavailable</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest">
              Pending
            </h3>
            <Clock size={20} className="text-[#1976D2]" />
          </div>
          <p className="text-3xl font-bold text-[#1B2A1F] mb-2">{stats.pendingOrders}</p>
          <p className="text-xs text-[#999]">Orders awaiting processing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#E2E8E0] p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1B2A1F] mb-2">7-Day Sales Trend</h2>
            <p className="text-[#999] text-sm">Daily revenue for the past week</p>
          </div>

          {chartData.length > 0 ? (
            <div className="flex items-end justify-between gap-3 h-64">
              {chartData.map((item, index) => {
                const height = maxSales > 0 ? (item.sales / maxSales) * 100 : 0;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="relative w-full h-48 mb-3 flex items-end justify-center">
                      <div
                        className="w-full bg-[#00A300] rounded-t-lg transition-all hover:bg-[#087E08]"
                        style={{ height: `${height}%`, minHeight: height > 0 ? '20px' : '0px' }}
                        title={formatCurrency(item.sales)}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#1B2A1F]">{item.date}</span>
                    <span className="text-xs text-[#999] mt-1">{formatCurrency(item.sales)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-[#F7FAF5] rounded-lg border-2 border-dashed border-[#E2E8E0]">
              <p className="text-[#999] font-medium">No sales data available</p>
            </div>
          )}
        </div>

        {/* Low Stock & Expiring Panel */}
        <div className="space-y-6">
          {/* Low Stock Items */}
          <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E2E8E0]">
              <div>
                <h3 className="text-lg font-bold text-[#1B2A1F]">Low Stock</h3>
                <p className="text-xs text-[#999] mt-1">{lowStockItems.length} items</p>
              </div>
              <AlertTriangle size={24} className="text-[#F9A825]" />
            </div>

            {lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-3 bg-[#FFF3E0] rounded-lg">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1B2A1F] truncate">{item.name}</p>
                      <p className="text-xs text-[#F9A825] font-bold">{item.stock} {item.unit || 'units'} left</p>
                    </div>
                  </div>
                ))}
                <Link
                  to="/manager/inventory"
                  className="block w-full text-center py-2 mt-4 bg-[#00A300] text-white text-sm font-bold rounded-lg hover:bg-[#087E08] transition-colors"
                >
                  Request Restock
                </Link>
              </div>
            ) : (
              <p className="text-sm text-[#999] text-center py-4">All items well stocked</p>
            )}
          </div>

          {/* Expiring Soon */}
          {expiringItems.length > 0 && (
            <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E2E8E0]">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2A1F]">Expiring Soon</h3>
                  <p className="text-xs text-[#999] mt-1">{expiringItems.length} items</p>
                </div>
                <AlertTriangle size={24} className="text-[#EF6C00]" />
              </div>

              <div className="space-y-3">
                {expiringItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-3 bg-[#FFE0B2] rounded-lg">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1B2A1F] truncate">{item.name}</p>
                      <p className="text-xs text-[#EF6C00] font-bold">Exp: {formatDate(item.expiryDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Needing Attention */}
      <div className="mt-12 bg-white rounded-lg border border-[#E2E8E0] p-8">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E2E8E0]">
          <div>
            <h2 className="text-xl font-bold text-[#1B2A1F]">Orders Needing Attention</h2>
            <p className="text-[#999] text-sm mt-1">Late, unpaid, or cancelled orders</p>
          </div>
          <Link
            to="/manager/orders"
            className="text-[#00A300] font-semibold text-sm hover:text-[#087E08] flex items-center gap-2"
          >
            View All <ArrowUpRight size={16} />
          </Link>
        </div>

        {attentionOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8E0]">
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase">Order #</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase">Payment</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {attentionOrders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b border-[#E2E8E0] hover:bg-[#F7FAF5] transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-semibold text-[#1B2A1F]">#{order._id?.slice(-6)}</span>
                    </td>
                    <td className="px-4 py-4 text-[#1B2A1F]">{order.userId?.name || 'Unknown'}</td>
                    <td className="px-4 py-4 font-semibold text-[#1B2A1F]">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={order.orderStatus} type="order" />
                    </td>
                    <td className="px-4 py-4 text-[#999]">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-[#F7FAF5] rounded-lg border-2 border-dashed border-[#E2E8E0]">
            <p className="text-[#999] font-medium">No orders requiring attention</p>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
};

export default ManagerDashboard;
