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

  // Load initial data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminProducts"));
    if (saved && saved.length > 0) {
      setProducts(saved);
    } else {
      const initialWithStock = initialProducts.map(p => ({
        ...p,
        stock: p.stock || 20, // Default stock if missing
        description: p.description || "Fresh produce from farm.",
        unit: p.unit || "kg"
      }));
      setProducts(initialWithStock);
      localStorage.setItem("adminProducts", JSON.stringify(initialWithStock));
    }
  }, []);

  // Save/Update Handler
  const handleSaveProduct = (updatedProducts) => {
    setProducts(updatedProducts);
    localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
    setOpenModal(false);
    setEditingProduct(null);
  };

  // Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem("adminProducts", JSON.stringify(updated));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setOpenModal(true);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Product Management</h1>
          <p className="text-gray-500 font-medium">Create, edit and manage your store inventory.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-100 font-bold transform active:scale-95"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by product name or category..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-green-50/30 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-100">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <span className="font-bold text-gray-800 text-lg">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="font-black text-gray-900 text-lg">KES {Number(p.price).toLocaleString()}</span>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5 min-w-[100px]">
                      <span className={`text-sm font-bold ${p.stock < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                        {p.stock} {p.unit} Available
                      </span>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${p.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                        title="Edit Product"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 bg-gray-50 rounded-full">
                        <Package className="text-gray-300" size={64} />
                      </div>
                      <p className="text-xl font-bold text-gray-400">No products found matching your search</p>
                      <button onClick={() => setSearchTerm("")} className="text-green-600 font-bold hover:underline">Clear Filters</button>
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
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
