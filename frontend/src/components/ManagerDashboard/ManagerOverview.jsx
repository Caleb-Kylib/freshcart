import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, Package, Zap } from 'lucide-react';

const ManagerOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/manager/overview', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch overview');
        setData(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <div className="text-center py-12">Loading overview...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!data) return <div className="text-center py-12 text-red-600">Failed to load data</div>;

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('border', 'bg')}/10`}>
          <Icon size={32} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Package}
          title="Total Orders"
          value={data.totalOrders}
          color="border-emerald-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Revenue"
          value={`KES ${(data.totalRevenue || 0).toLocaleString()}`}
          color="border-blue-500"
        />
        <StatCard
          icon={AlertTriangle}
          title="Low Stock Items"
          value={data.lowStockCount}
          color="border-orange-500"
          subtitle={`${data.lowStockCount} products below 10 units`}
        />
        <StatCard
          icon={Zap}
          title="Pending Orders"
          value={data.pendingOrders}
          color="border-red-500"
          subtitle={`${data.processingOrders} processing`}
        />
      </div>

      {/* Low stock alert */}
      {data.lowStockProducts && data.lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-orange-900 mb-4">🚨 Low Stock Alert</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.lowStockProducts.map(product => (
              <div key={product._id} className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">{product.name}</p>
                <p className="text-2xl font-bold text-orange-600">{product.stock} units</p>
                <p className="text-xs text-gray-500 mt-1">{product.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerOverview;
