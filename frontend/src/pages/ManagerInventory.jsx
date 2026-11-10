import { useState, useMemo } from "react";
import ManagerLayout from "../components/ManagerLayout";
import StatusBadge from "../components/StatusBadge";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  Search,
  Plus,
  Minus,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Eye,
  Link as LinkIcon,
  ChevronDown
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import {
  formatCurrency,
  formatDate,
  getStockStatus
} from "../utils/managerUtils";

const ManagerInventory = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showWastedModal, setShowWastedModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [adjustmentQty, setAdjustmentQty] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.filter(Boolean);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search
      const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category
      const categoryMatch = categoryFilter === "All" || product.category === categoryFilter;

      // Status
      let statusMatch = true;
      if (statusFilter !== "All") {
        const status = getStockStatus(product.stock, product.reorderLevel || 10);
        statusMatch = status === statusFilter;
      }

      return searchMatch && categoryMatch && statusMatch;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const openAdjustment = (product, type) => {
    setSelectedProduct(product);
    setAdjustmentType(type);
    setAdjustmentQty("");
    setShowAdjustModal(true);
  };

  const openWasted = (product) => {
    setSelectedProduct(product);
    setAdjustmentQty("");
    setShowWastedModal(true);
  };

  const openPriceRequest = (product) => {
    setSelectedProduct(product);
    setShowRequestModal(true);
  };

  const confirmAdjustment = () => {
    if (!adjustmentQty || parseInt(adjustmentQty) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    // In a real app, this would update via API
    setRequestSent(true);
    setTimeout(() => {
      setShowAdjustModal(false);
      setRequestSent(false);
      setAdjustmentQty("");
    }, 1500);
  };

  const confirmWasted = () => {
    if (!adjustmentQty || parseInt(adjustmentQty) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    setRequestSent(true);
    setTimeout(() => {
      setShowWastedModal(false);
      setRequestSent(false);
      setAdjustmentQty("");
    }, 1500);
  };

  const confirmPriceRequest = () => {
    setRequestSent(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSent(false);
    }, 1500);
  };

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1B2A1F] mb-2">Inventory</h1>
        <p className="text-[#666] text-lg">View and manage product stock levels</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#E2E8E0] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-[#999]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
          >
            <option>All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
          >
            <option>All Status</option>
            <option>In stock</option>
            <option>Low</option>
            <option>Out of stock</option>
            <option>Expiring soon</option>
          </select>

          {/* Spacer */}
          <div />

          {/* Reset */}
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("All");
              setStatusFilter("All");
            }}
            className="px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm font-medium text-[#666] hover:bg-[#F7FAF5] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-[#E2E8E0] overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7FAF5] border-b border-[#E2E8E0]">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Stock</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Unit</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Reorder Level</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Price</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#999] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => {
                  const status = getStockStatus(product.stock, product.reorderLevel || 10);
                  return (
                    <tr key={idx} className="border-b border-[#E2E8E0] hover:bg-[#F7FAF5] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-[#1B2A1F]">{product.name}</p>
                            <p className="text-xs text-[#999]">SKU: {product._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#1B2A1F]">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-[#1B2A1F]">{product.stock}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#1B2A1F]">{product.unit || 'unit'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#1B2A1F]">{product.reorderLevel || 10}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={status} type="stock" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-[#1B2A1F]">{formatCurrency(product.price)}</span>
                          <button
                            onClick={() => openPriceRequest(product)}
                            className="text-[#00A300] hover:text-[#087E08] transition-colors"
                            title="Request price change"
                          >
                            <LinkIcon size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {product.stock < (product.reorderLevel || 10) ? (
                            <button
                              onClick={() => openAdjustment(product, "add")}
                              className="p-2 bg-[#FFF3E0] text-[#F9A825] rounded hover:bg-[#F9A825] hover:text-white transition-colors"
                              title="Add stock"
                            >
                              <Plus size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => openAdjustment(product, "add")}
                              className="p-2 border border-[#E2E8E0] text-[#00A300] rounded hover:bg-[#E8F5E9] transition-colors"
                              title="Add stock"
                            >
                              <Plus size={16} />
                            </button>
                          )}

                          {product.stock > 0 && (
                            <button
                              onClick={() => openAdjustment(product, "subtract")}
                              className="p-2 border border-[#E2E8E0] text-[#1B2A1F] rounded hover:bg-[#F7FAF5] transition-colors"
                              title="Remove stock"
                            >
                              <Minus size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => openWasted(product)}
                            className="p-2 border border-[#E2E8E0] text-[#D32F2F] rounded hover:bg-[#FFEBEE] transition-colors"
                            title="Mark as wasted"
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                            }}
                            className="p-2 border border-[#E2E8E0] text-[#1B2A1F] rounded hover:bg-[#F7FAF5] transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F7FAF5]">
            <p className="text-[#999] font-medium">No products found matching your filters</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
          <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Total Items</h3>
          <p className="text-3xl font-bold text-[#1B2A1F]">{filteredProducts.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
          <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">In Stock</h3>
          <p className="text-3xl font-bold text-[#2E7D32]">
            {filteredProducts.filter(p => getStockStatus(p.stock, p.reorderLevel || 10) === 'In stock').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
          <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Low Stock</h3>
          <p className="text-3xl font-bold text-[#F9A825]">
            {filteredProducts.filter(p => getStockStatus(p.stock, p.reorderLevel || 10) === 'Low').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8E0] p-6">
          <h3 className="text-[#999] text-xs font-bold uppercase tracking-widest mb-3">Out of Stock</h3>
          <p className="text-3xl font-bold text-[#D32F2F]">
            {filteredProducts.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        type="info"
        title={requestSent ? "Stock Updated" : `${adjustmentType === 'add' ? 'Add' : 'Remove'} Stock`}
        message={
          requestSent
            ? `${selectedProduct?.name} stock has been ${adjustmentType === 'add' ? 'increased' : 'decreased'} by ${adjustmentQty} units.`
            : `How many ${selectedProduct?.unit || 'units'} of ${selectedProduct?.name} do you want to ${adjustmentType === 'add' ? 'add' : 'remove'}?`
        }
        onConfirm={confirmAdjustment}
        confirmText={requestSent ? "Done" : "Confirm"}
        loading={false}
      >
        {!requestSent && (
          <input
            type="number"
            min="1"
            value={adjustmentQty}
            onChange={(e) => setAdjustmentQty(e.target.value)}
            placeholder="Enter quantity"
            className="w-full px-4 py-2 border border-[#E2E8E0] rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
            autoFocus
          />
        )}
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showWastedModal}
        onClose={() => setShowWastedModal(false)}
        type="warning"
        title={requestSent ? "Wastage Recorded" : "Mark as Wasted"}
        message={
          requestSent
            ? `${adjustmentQty} units of ${selectedProduct?.name} have been recorded as wasted.`
            : `Record how many units of ${selectedProduct?.name} are wasted/damaged?`
        }
        onConfirm={confirmWasted}
        confirmText={requestSent ? "Done" : "Record"}
        loading={false}
      >
        {!requestSent && (
          <input
            type="number"
            min="1"
            max={selectedProduct?.stock}
            value={adjustmentQty}
            onChange={(e) => setAdjustmentQty(e.target.value)}
            placeholder="Enter quantity"
            className="w-full px-4 py-2 border border-[#E2E8E0] rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
            autoFocus
          />
        )}
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        type={requestSent ? "success" : "info"}
        title={requestSent ? "Request Sent" : "Request Price Change"}
        message={
          requestSent
            ? `Your price change request for ${selectedProduct?.name} has been sent to the admin for approval.`
            : `Request a price change for ${selectedProduct?.name} (Current: ${formatCurrency(selectedProduct?.price)}). An admin will review and approve the new price.`
        }
        onConfirm={confirmPriceRequest}
        confirmText={requestSent ? "Done" : "Send Request"}
        loading={false}
      />
    </ManagerLayout>
  );
};

export default ManagerInventory;
