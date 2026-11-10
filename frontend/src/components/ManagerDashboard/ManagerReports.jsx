import React, { useEffect, useState } from 'react';

const ManagerReports = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [categoryReport, setCategoryReport] = useState([]);
  const [statusReport, setStatusReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('sales');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');

        if (reportType === 'sales') {
          const res = await fetch('http://localhost:5000/api/manager/reports/sales', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch sales report');
          setSalesReport(await res.json());
        } else if (reportType === 'categories') {
          const res = await fetch('http://localhost:5000/api/manager/reports/categories', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch category report');
          setCategoryReport(await res.json());
        } else if (reportType === 'status') {
          const res = await fetch('http://localhost:5000/api/manager/reports/order-status', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch status report');
          setStatusReport(await res.json());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [reportType]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">📈 Reports & Analytics</h1>

      {/* Report type selector */}
      <div className="mb-8 flex gap-4">
        {[
          { id: 'sales', label: '📊 Sales Report', icon: '📊' },
          { id: 'categories', label: '🏷️ By Category', icon: '🏷️' },
          { id: 'status', label: '📦 Order Status', icon: '📦' },
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setReportType(btn.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              reportType === btn.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-12">Loading report...</div>
      ) : reportType === 'sales' && salesReport ? (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6 border-l-4 border-emerald-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-emerald-700">KES {(salesReport.summary?.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-blue-700">{salesReport.summary?.totalOrders || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Avg Order Value</p>
              <p className="text-3xl font-bold text-purple-700">KES {Math.round(salesReport.summary?.avgOrderValue || 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Daily sales */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Daily Sales</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-900">Date</th>
                    <th className="text-right p-3 font-semibold text-gray-900">Revenue</th>
                    <th className="text-right p-3 font-semibold text-gray-900">Orders</th>
                    <th className="text-right p-3 font-semibold text-gray-900">Avg Value</th>
                  </tr>
                </thead>
                <tbody>
                  {(salesReport.dailySales || []).map(day => (
                    <tr key={day._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">{day._id}</td>
                      <td className="p-3 text-right font-bold text-emerald-600">KES {day.revenue.toLocaleString()}</td>
                      <td className="p-3 text-right text-gray-600">{day.orderCount}</td>
                      <td className="p-3 text-right text-gray-600">KES {Math.round(day.avgOrderValue).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : reportType === 'categories' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryReport.map(category => (
            <div key={category._id} className="bg-white rounded-lg p-6 shadow-md border-l-4 border-emerald-500">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{category._id}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Stock:</span>
                  <span className="font-bold text-gray-900">{category.totalStock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-bold text-gray-900">{category.productCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Price:</span>
                  <span className="font-bold text-gray-900">KES {Math.round(category.avgPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sold:</span>
                  <span className="font-bold text-emerald-600">{category.totalSold}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reportType === 'status' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusReport.map(status => {
            const colors = {
              'Pending': 'bg-yellow-50 border-yellow-500 text-yellow-700',
              'Processing': 'bg-blue-50 border-blue-500 text-blue-700',
              'Shipped': 'bg-purple-50 border-purple-500 text-purple-700',
              'Delivered': 'bg-green-50 border-green-500 text-green-700',
            };
            const colorClass = colors[status._id] || 'bg-gray-50 border-gray-500 text-gray-700';
            return (
              <div key={status._id} className={`rounded-lg p-6 border-l-4 ${colorClass}`}>
                <p className="text-sm font-medium opacity-75 mb-2">{status._id}</p>
                <p className="text-3xl font-bold mb-2">{status.count}</p>
                <p className="text-sm opacity-75">Revenue: KES {status.totalRevenue.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ManagerReports;
