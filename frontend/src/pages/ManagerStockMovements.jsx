import { useState, useMemo } from "react";
import ManagerLayout from "../components/ManagerLayout";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Trash2,
  Filter,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { formatDate, formatDateTime } from "../utils/managerUtils";

const ManagerStockMovements = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [itemFilter, setItemFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("30days");

  // Mock stock movements data
  const generateStockMovements = () => {
    const movements = [];
    const today = new Date();

    products.forEach((product, idx) => {
      // Random movements for demo
      const numMovements = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < numMovements; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);

        const types = ['Added', 'Adjusted', 'Wasted'];
        const type = types[Math.floor(Math.random() * types.length)];
        const qty = Math.floor(Math.random() * 50) + 1;

        movements.push({
          id: `${idx}-${i}`,
          date: date.toISOString(),
          itemName: product.name,
          itemId: product._id,
          type,
          quantity: qty,
          unit: product.unit || 'units',
          reason: type === 'Added' ? 'Stock replenishment' : type === 'Wasted' ? 'Expired/Damaged' : 'Inventory adjustment',
          performedBy: ['Cashier ' + Math.floor(Math.random() * 5) + 1, 'System'][Math.floor(Math.random() * 2)],
          reference: `MOV-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`
        });
      }
    });

    // Sort by date descending
    return movements.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const allMovements = useMemo(() => generateStockMovements(), [products]);

  // Filter movements
  const filteredMovements = useMemo(() => {
    return allMovements.filter(movement => {
      // Search
      const searchMatch = movement.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.performedBy.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const typeMatch = typeFilter === "All" || movement.type === typeFilter;

      // Item filter
      const itemMatch = itemFilter === "All" || movement.itemId === itemFilter;

      // Date filter
      let dateMatch = true;
      if (dateFilter !== "All") {
        const movementDate = new Date(movement.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        movementDate.setHours(0, 0, 0, 0);

        const daysAgo = Math.floor((today - movementDate) / (1000 * 60 * 60 * 24));

        if (dateFilter === "today") {
          dateMatch = daysAgo === 0;
        } else if (dateFilter === "7days") {
          dateMatch = daysAgo <= 7;
        } else if (dateFilter === "30days") {
          dateMatch = daysAgo <= 30;
        }
      }

      return searchMatch && typeMatch && itemMatch && dateMatch;
    });
  }, [allMovements, searchTerm, typeFilter, itemFilter, dateFilter]);

  const getMovementIcon = (type) => {
    switch (type) {
      case 'Added':
        return <TrendingUp className="text-[#2E7D32]" size={18} />;
      case 'Wasted':
        return <Trash2 className="text-[#D32F2F]" size={18} />;
      case 'Adjusted':
        return <ArrowRight className="text-[#1976D2]" size={18} />;
      default:
        return <Filter className="text-[#999]" size={18} />;
    }
  };

  const getMovementColor = (type) => {
    switch (type) {
      case 'Added':
        return 'bg-[#E8F5E9]';
      case 'Wasted':
        return 'bg-[#FFEBEE]';
      case 'Adjusted':
        return 'bg-[#E3F2FD]';
      default:
        return 'bg-[#F7FAF5]';
    }
  };

  const uniqueItems = [...new Set(allMovements.map(m => m.itemId))];
  const itemOptions = products.filter(p => uniqueItems.includes(p._id));

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1B2A1F] mb-2">Stock Movements</h1>
        <p className="text-[#666] text-lg">Track all inventory additions, adjustments, and wastage</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#E2E8E0] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-[#999]" />
            <input
              type="text"
              placeholder="Search by item, reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
          >
            <option>All Types</option>
            <option>Added</option>
            <option>Adjusted</option>
            <option>Wasted</option>
          </select>

          {/* Item Filter */}
          <select
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
          >
            <option value="All">All Items</option>
            {itemOptions.map(item => (
              <option key={item._id} value={item._id}>{item.name}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="All">All time</option>
          </select>

          {/* Reset */}
          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("All");
              setItemFilter("All");
              setDateFilter("30days");
            }}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm font-medium text-[#666] hover:bg-[#F7FAF5] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Movements List */}
      <div className="space-y-3">
        {filteredMovements.length > 0 ? (
          filteredMovements.map((movement) => (
            <div
              key={movement.id}
              className={`${getMovementColor(movement.type)} rounded-lg border border-[#E2E8E0] p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="mt-1">
                  {getMovementIcon(movement.type)}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-[#1B2A1F]">{movement.itemName}</h3>
                      <p className="text-xs text-[#999]">{movement.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1B2A1F]">
                        {movement.type === 'Wasted' ? '−' : '+'}{movement.quantity} {movement.unit}
                      </p>
                      <p className="text-xs text-[#999]">{movement.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-[#E2E8E0] border-opacity-50">
                    <div>
                      <p className="text-xs text-[#999] font-semibold uppercase">Date</p>
                      <p className="text-sm text-[#1B2A1F] font-medium">{formatDateTime(movement.date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#999] font-semibold uppercase">Reason</p>
                      <p className="text-sm text-[#1B2A1F]">{movement.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#999] font-semibold uppercase">Performed By</p>
                      <p className="text-sm text-[#1B2A1F]">{movement.performedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#999] font-semibold uppercase">Movement ID</p>
                      <p className="text-sm font-mono text-[#1B2A1F]">{movement.reference}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-[#E2E8E0] p-12 text-center">
            <p className="text-[#999] font-medium">No stock movements found matching your filters</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Total Movements */}
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
          <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Total Movements</h3>
          <p className="text-3xl font-bold text-[#1B2A1F]">{filteredMovements.length}</p>
          <p className="text-xs text-[#999] mt-2">In selected period</p>
        </div>

        {/* Total Added */}
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
          <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Stock Added</h3>
          <p className="text-3xl font-bold text-[#2E7D32]">
            {filteredMovements.filter(m => m.type === 'Added').length}
          </p>
          <p className="text-xs text-[#999] mt-2">Replenishments</p>
        </div>

        {/* Total Wasted */}
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
          <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Stock Wasted</h3>
          <p className="text-3xl font-bold text-[#D32F2F]">
            {filteredMovements.filter(m => m.type === 'Wasted').length}
          </p>
          <p className="text-xs text-[#999] mt-2">Expired/Damaged</p>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerStockMovements;
