import { useState, useMemo } from "react";
import ManagerLayout from "../components/ManagerLayout";
import StatusBadge from "../components/StatusBadge";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  Search,
  ChevronDown,
  X,
  Calendar,
  MapPin,
  Phone,
  DollarSign,
  RefreshCw
} from "lucide-react";
import { useOrders } from "../context/OrderContext";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  PAYMENT_METHODS
} from "../utils/managerUtils";

const ManagerOrders = () => {
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search by order ID or customer name
      const searchMatch = 
        order._id?.toString().includes(searchTerm.toLowerCase()) ||
        order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch = statusFilter === "All" || order.orderStatus === statusFilter;

      // Payment filter
      const paymentMatch = paymentFilter === "All" || order.paymentStatus === paymentFilter;

      // Date filter
      let dateMatch = true;
      if (dateFilter !== "All") {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        orderDate.setHours(0, 0, 0, 0);

        if (dateFilter === "Today") {
          dateMatch = orderDate.getTime() === today.getTime();
        } else if (dateFilter === "This Week") {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          dateMatch = orderDate >= weekStart && orderDate <= today;
        } else if (dateFilter === "This Month") {
          dateMatch = orderDate.getMonth() === today.getMonth() && 
                     orderDate.getFullYear() === today.getFullYear();
        }
      }

      return searchMatch && statusMatch && paymentMatch && dateMatch;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter]);

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDrawer(true);
  };

  const handleStatusChange = (newSt) => {
    setNewStatus(newSt);
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    // In a real app, this would update via API
    setRequestSent(true);
    setTimeout(() => {
      setShowStatusModal(false);
      setRequestSent(false);
    }, 1500);
  };

  const handleRefundRequest = () => {
    setRequestSent(true);
    setTimeout(() => {
      setShowRefundModal(false);
      setRequestSent(false);
    }, 1500);
  };

  const handleCancelOrder = () => {
    setRequestSent(true);
    setTimeout(() => {
      setShowCancelModal(false);
      setRequestSent(false);
    }, 1500);
  };

  const orderStatuses = ["New", "Packing", "Out for delivery", "Delivered", "Cancelled"];
  const paymentStatuses = ["Pending", "Paid", "Failed"];

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1B2A1F] mb-2">Orders</h1>
        <p className="text-[#666] text-lg">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#E2E8E0] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-[#999]" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
            />
          </div>

          {/* Order Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
          >
            <option>All Status</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
          >
            <option>All Payments</option>
            {paymentStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
          >
            <option>All Dates</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>

          {/* Reset */}
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
              setPaymentFilter("All");
              setDateFilter("All");
            }}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm font-medium text-[#666] hover:bg-[#F7FAF5] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-[#E2E8E0] overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7FAF5] border-b border-[#E2E8E0]">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Order #</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Customer</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Items</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Total</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Payment</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-[#E2E8E0] hover:bg-[#F7FAF5] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#1B2A1F]">#{order._id?.slice(-6)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-[#1B2A1F]">{order.userId?.name || 'Unknown'}</p>
                        <p className="text-xs text-[#999]">{order.userId?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#1B2A1F]">
                      <span className="text-sm font-medium">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#1B2A1F]">{formatCurrency(order.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.orderStatus} type="order" />
                    </td>
                    <td className="px-6 py-4 text-[#999] text-sm">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="text-[#00A300] font-semibold text-sm hover:text-[#087E08] transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F7FAF5]">
            <p className="text-[#999] font-medium">No orders found matching your filters</p>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      {showDrawer && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDrawer(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E2E8E0]">
              <h2 className="text-xl font-bold text-[#1B2A1F]">
                Order #{selectedOrder._id?.slice(-6)}
              </h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-[#999] hover:text-[#1B2A1F] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-bold text-[#999] uppercase mb-3">Customer</h3>
                <p className="font-semibold text-[#1B2A1F]">{selectedOrder.userId?.name}</p>
                <p className="text-sm text-[#999]">{selectedOrder.userId?.email}</p>
                <p className="text-sm text-[#999]">{selectedOrder.userId?.phone}</p>
              </div>

              {/* Order Status */}
              <div>
                <h3 className="text-sm font-bold text-[#999] uppercase mb-3">Status</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-[#999] font-semibold">Order Status</label>
                    <StatusBadge status={selectedOrder.orderStatus} type="order" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-xs text-[#999] font-semibold">Payment Status</label>
                    <StatusBadge status={selectedOrder.paymentStatus} type="payment" className="mt-2" />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="text-sm font-bold text-[#999] uppercase mb-3">Delivery Address</h3>
                <div className="flex gap-3 p-3 bg-[#F7FAF5] rounded-lg">
                  <MapPin size={18} className="text-[#00A300] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#1B2A1F]">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-bold text-[#999] uppercase mb-3">Items</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-[#F7FAF5] rounded">
                      <div>
                        <p className="text-sm font-semibold text-[#1B2A1F]">{item.name}</p>
                        <p className="text-xs text-[#999]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[#1B2A1F]">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-[#E2E8E0] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#1B2A1F]">Total</span>
                  <span className="text-2xl font-bold text-[#00A300]">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-bold text-[#999] uppercase mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#2E7D32] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#1B2A1F]">Order Created</p>
                      <p className="text-xs text-[#999]">{formatDateTime(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-[#E2E8E0] p-6 space-y-3">
              {selectedOrder.orderStatus !== "Delivered" && selectedOrder.orderStatus !== "Cancelled" && (
                <div className="relative">
                  <button
                    onClick={() => handleStatusChange(selectedOrder.orderStatus)}
                    className="w-full px-4 py-2 bg-[#00A300] text-white font-semibold rounded-lg hover:bg-[#087E08] transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    Update Status
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}

              {selectedOrder.paymentStatus === "Pending" && (
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="w-full px-4 py-2 bg-[#F9A825] text-white font-semibold rounded-lg hover:bg-[#F57F17] transition-colors text-sm"
                >
                  Request Refund
                </button>
              )}

              {selectedOrder.orderStatus !== "Cancelled" && selectedOrder.orderStatus !== "Delivered" && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-4 py-2 border border-[#D32F2F] text-[#D32F2F] font-semibold rounded-lg hover:bg-[#FFEBEE] transition-colors text-sm"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        type="info"
        title={requestSent ? "Status Updated" : "Update Order Status"}
        message={requestSent ? "Order status has been updated successfully." : "Are you sure you want to update this order status?"}
        onConfirm={confirmStatusChange}
        confirmText="Update"
        loading={false}
      />

      <ConfirmationModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        type="warning"
        title={requestSent ? "Refund Request Sent" : "Request Refund"}
        message={requestSent ? "A refund request has been sent to the admin for approval." : "Request a refund for this order. An admin will review and approve/deny the request."}
        onConfirm={handleRefundRequest}
        confirmText="Send Request"
        loading={false}
      />

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        type="error"
        title={requestSent ? "Order Cancelled" : "Cancel Order"}
        message={requestSent ? "The order has been cancelled successfully." : "Are you sure you want to cancel this order? This action cannot be undone."}
        onConfirm={handleCancelOrder}
        confirmText="Cancel Order"
        loading={false}
      />
    </ManagerLayout>
  );
};

export default ManagerOrders;
