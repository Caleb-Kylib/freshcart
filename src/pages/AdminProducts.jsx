import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ProductModal from "../components/ProductModal";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { products as initialProducts } from "../data/products";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminProducts"));
    if (saved && saved.length > 0) {
      setProducts(saved);
    } else {
      // Initialize with products from data/products.js if localStorage is empty
      const initialWithStock = initialProducts.map(p => ({
        ...p,
        stock: Math.floor(Math.random() * 100) + 10 // Random stock for demo
      }));
      setProducts(initialWithStock);
      localStorage.setItem("adminProducts", JSON.stringify(initialWithStock));
    }
  }, []);

  const saveProducts = (data) => {
    setProducts(data);
    localStorage.setItem("adminProducts", JSON.stringify(data));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-500 text-sm">Create, edit and manage your store products.</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setOpenModal(true);
          }}
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm font-medium"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (KES)</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-800">
                    KES {Number(p.price).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm font-medium ${p.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                        {p.stock} {p.unit}
                      </span>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setOpenModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="text-gray-300" size={48} />
                      <p>No products found matching your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <ProductModal
          products={products}
          setOpenModal={setOpenModal}
          saveProducts={saveProducts}
          editingProduct={editingProduct}
        />
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
