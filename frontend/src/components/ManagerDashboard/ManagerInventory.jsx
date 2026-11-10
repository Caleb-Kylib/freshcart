import React, { useEffect, useState } from 'react';

const ManagerInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (lowStockOnly) params.append('lowStockOnly', 'true');
        if (category) params.append('category', category);

        const res = await fetch(`http://localhost:5000/api/manager/inventory?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch inventory');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [lowStockOnly, category]);

  const getStockColor = (stock) => {
    if (stock < 5) return 'bg-red-50 border-l-4 border-red-500';
    if (stock < 10) return 'bg-orange-50 border-l-4 border-orange-500';
    return 'bg-green-50 border-l-4 border-green-500';
  };

  const getStockBadge = (stock) => {
    if (stock < 5) return 'bg-red-100 text-red-800';
    if (stock < 10) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">📦 Inventory Management</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setLowStockOnly(!lowStockOnly)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            lowStockOnly
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🚨 Low Stock Only
        </button>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Categories</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Herbs">Herbs</option>
          <option value="Smoothies">Smoothies</option>
          <option value="Lifestyle Bundles">Lifestyle Bundles</option>
        </select>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-12">Loading inventory...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className={`rounded-lg p-6 ${getStockColor(product.stock)}`}>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{product.category}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Stock Level</p>
                  <p className="text-2xl font-bold text-gray-900">{product.stock} <span className="text-xs">{product.unit}</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Unit Price</p>
                  <p className="text-2xl font-bold text-gray-900">KES {product.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockBadge(product.stock)}`}>
                  {product.stock < 5 ? 'Critical' : product.stock < 10 ? 'Low' : 'Good'}
                </span>
                <span className="text-xs font-medium text-gray-600">
                  Sold: {product.soldCount || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerInventory;
