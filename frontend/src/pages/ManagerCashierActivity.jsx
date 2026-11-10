import { useState, useMemo } from "react";
import ManagerLayout from "../components/ManagerLayout";
import {
  Search,
  ChevronRight,
  Activity,
  Clock,
  ShoppingCart,
  Package,
  Eye,
  RefreshCw
} from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { formatDateTime, formatDate } from "../utils/managerUtils";

const ManagerCashierActivity = () => {
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCashier, setSelectedCashier] = useState(null);
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Mock cashier data
  const generateCashierData = () => {
    const cashiers = [
      { id: 1, name: 'Cashier 1', status: 'Active' },
      { id: 2, name: 'Cashier 2', status: 'Active' },
      { id: 3, name: 'Cashier 3', status: 'Idle' },
      { id: 4, name: 'Cashier 4', status: 'Active' },
      { id: 5, name: 'Cashier 5', status: 'Offline' }
    ];

    return cashiers.map(cashier => {
      const cashierOrders = orders.slice(0, Math.floor(Math.random() * 20) + 5);
      const lastActive = new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000);

      return {
        ...cashier,
        ordersHandled: cashierOrders.length,
        stockEntries: Math.floor(Math.random() * 30),
        totalRevenue: cashierOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        lastActive: lastActive.toISOString(),
        avgOrderValue: cashierOrders.length > 0 ? 
          cashierOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / cashierOrders.length : 0,
        recentOrders: cashierOrders.slice(0, 5)
      };
    });
  };

  const allCashiers = useMemo(() => generateCashierData(), [orders]);

  // Filter cashiers
  const filteredCashiers = useMemo(() => {
    return allCashiers.filter(cashier => {
      const searchMatch = cashier.name.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "All" || cashier.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [allCashiers, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#E8F5E9', text: '#2E7D32', icon: '🟢' };
      case 'Idle':
        return { bg: '#FFF3E0', text: '#F9A825', icon: '🟡' };
      case 'Offline':
        return { bg: '#F7FAF5', text: '#999', icon: '⚫' };
      default:
        return { bg: '#F7FAF5', text: '#999', icon: '⚫' };
    }
  };

  const openActivityLog = (cashier) => {
    setSelectedCashier(cashier);
    setShowActivityLog(true);
  };

  // Generate activity log for selected cashier
  const generateActivityLog = (cashier) => {
    if (!cashier) return [];

    const activities = [];
    for (let i = 0; i < 15; i++) {
      const types = ['Order Created', 'Stock Added', 'Stock Removed', 'Adjustment', 'Order Completed'];
      const type = types[Math.floor(Math.random() * types.length)];
      const daysAgo = Math.floor(Math.random() * 7);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      activities.push({
        id: i,
        type,
        description: type === 'Order Created' 
          ? `Created order #${Math.random().toString(36).substr(2, 5).toUpperCase()}`
          : type === 'Order Completed'
          ? `Completed order processing`
          : `${type.toLowerCase()} - ${Math.floor(Math.random() * 20) + 1} units`,
        timestamp: date.toISOString(),
        details: type === 'Order Created' ? `Amount: KES ${Math.floor(Math.random() * 10000) + 500}` : null
      });
    }

    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const activityLog = selectedCashier ? generateActivityLog(selectedCashier) : [];

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1B2A1F] mb-2">Cashier Activity</h1>
        <p className="text-[#666] text-lg">Monitor cashier performance and activity logs</p>
      </div>

      {/* Main Content or Activity Log */}
      {!showActivityLog ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg border border-[#E2E8E0] p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-[#999]" />
                <input
                  type="text"
                  placeholder="Search cashier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Idle</option>
                <option>Offline</option>
              </select>

              {/* Spacer */}
              <div />

              {/* Reset */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm font-medium text-[#666] hover:bg-[#F7FAF5] transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* Cashiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCashiers.map(cashier => {
              const statusColor = getStatusColor(cashier.status);
              return (
                <div
                  key={cashier.id}
                  className="bg-white rounded-lg border border-[#E2E8E0] overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="p-6 bg-[#F7FAF5] border-b border-[#E2E8E0]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#1B2A1F]">{cashier.name}</h3>
                        <p className="text-xs text-[#999] mt-1">ID: {cashier.id}</p>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                      >
                        {cashier.status}
                      </div>
                    </div>

                    {/* Last Active */}
                    <div className="flex items-center gap-2 text-xs text-[#999]">
                      <Clock size={14} />
                      <span>Last active: {formatDateTime(cashier.lastActive)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-6 space-y-4">
                    {/* Orders */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingCart size={18} className="text-[#00A300]" />
                        <div>
                          <p className="text-xs text-[#999] font-semibold uppercase">Orders Handled</p>
                          <p className="text-2xl font-bold text-[#1B2A1F]">{cashier.ordersHandled}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#999] text-right">
                        <strong>{cashier.avgOrderValue.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}</strong>
                        <br />avg per order
                      </p>
                    </div>

                    {/* Stock Entries */}
                    <div className="flex items-center justify-between p-3 bg-[#F7FAF5] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-[#1976D2]" />
                        <div>
                          <p className="text-xs text-[#999] font-semibold uppercase">Stock Entries</p>
                          <p className="text-xl font-bold text-[#1B2A1F]">{cashier.stockEntries}</p>
                        </div>
                      </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="flex items-center justify-between p-3 bg-[#E8F5E9] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Activity size={18} className="text-[#2E7D32]" />
                        <div>
                          <p className="text-xs text-[#999] font-semibold uppercase">Total Revenue</p>
                          <p className="text-xl font-bold text-[#2E7D32]">
                            {cashier.totalRevenue.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => openActivityLog(cashier)}
                      className="w-full px-4 py-2 border border-[#00A300] text-[#00A300] font-semibold rounded-lg hover:bg-[#E8F5E9] transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye size={16} />
                      View Activity Log
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
              <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Total Cashiers</h3>
              <p className="text-3xl font-bold text-[#1B2A1F]">{filteredCashiers.length}</p>
            </div>

            <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
              <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Active Now</h3>
              <p className="text-3xl font-bold text-[#2E7D32]">
                {filteredCashiers.filter(c => c.status === 'Active').length}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
              <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Total Orders Handled</h3>
              <p className="text-3xl font-bold text-[#1B2A1F]">
                {filteredCashiers.reduce((sum, c) => sum + c.ordersHandled, 0)}
              </p>
            </div>
          </div>
        </>
      ) : (
        // Activity Log View
        <div>
          {/* Back Button */}
          <button
            onClick={() => {
              setShowActivityLog(false);
              setSelectedCashier(null);
            }}
            className="mb-6 px-4 py-2 border border-[#E2E8E0] text-[#1B2A1F] font-semibold rounded-lg hover:bg-[#F7FAF5] transition-colors flex items-center gap-2"
          >
            ← Back to Cashiers
          </button>

          {/* Activity Log Header */}
          <div className="bg-white rounded-lg border border-[#E2E8E0] p-8 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-[#1B2A1F]">{selectedCashier?.name} - Activity Log</h2>
              <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: getStatusColor(selectedCashier?.status).bg,
                  color: getStatusColor(selectedCashier?.status).text
                }}
              >
                {selectedCashier?.status}
              </div>
            </div>
            <p className="text-[#999] text-sm">Last 15 activities</p>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-3">
            {activityLog.map((activity, idx) => (
              <div
                key={activity.id}
                className="bg-white rounded-lg border border-[#E2E8E0] p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="mt-1">
                    <div className="w-3 h-3 rounded-full bg-[#00A300]" />
                    {idx < activityLog.length - 1 && (
                      <div className="w-0.5 h-8 bg-[#E2E8E0] mx-auto mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#1B2A1F]">{activity.type}</h3>
                      <span className="text-xs text-[#999]">{formatDateTime(activity.timestamp)}</span>
                    </div>
                    <p className="text-sm text-[#666] mt-1">{activity.description}</p>
                    {activity.details && (
                      <p className="text-xs text-[#999] mt-2">{activity.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
              <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Total Orders</h3>
              <p className="text-3xl font-bold text-[#1B2A1F]">{selectedCashier?.ordersHandled}</p>
            </div>

            <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
              <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Stock Entries</h3>
              <p className="text-3xl font-bold text-[#1B2A1F]">{selectedCashier?.stockEntries}</p>
            </div>

            <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
              <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Total Revenue</h3>
              <p className="text-2xl font-bold text-[#2E7D32]">
                {selectedCashier?.totalRevenue.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerCashierActivity;
