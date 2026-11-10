import React, { useEffect, useState } from 'react';

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = statusFilter
          ? `http://localhost:5000/api/manager/orders?status=${statusFilter}`
          : 'http://localhost:5000/api/manager/orders';
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
  };

  const paymentColors = {
    'Pending': 'text-yellow-600',
    'Paid': 'text-green-600',
    'Failed': 'text-red-600',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">📦 Orders Management</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No orders found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900">Order ID</th>
                <th className="text-left p-4 font-semibold text-gray-900">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Payment</th>
                <th className="text-left p-4 font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs text-gray-600">{order._id.substring(0, 8)}...</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.userId?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{order.userId?.email || ''}</p>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-900">KES {order.totalAmount?.toLocaleString() || 0}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus] || 'bg-gray-100'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className={`p-4 font-semibold ${paymentColors[order.paymentStatus] || 'text-gray-600'}`}>
                    {order.paymentStatus}
                  </td>
                  <td className="p-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerOrders;
