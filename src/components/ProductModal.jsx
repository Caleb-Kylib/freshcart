import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

const ProductModal = ({
  products,
  saveProducts,
  setOpenModal,
  editingProduct,
}) => {
  const [form, setForm] = useState({
    id: Date.now(),
    name: "",
    category: "Fruits",
    price: "",
    description: "",
    image: "",
    stock: "",
    unit: "kg"
  });

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    }
  }, [editingProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      id: form.id || Date.now()
    };

    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? productData : p
      );
      saveProducts(updated);
    } else {
      saveProducts([...products, productData]);
    }

    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={() => setOpenModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  placeholder="e.g. Fresh Mangoes"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Juices">Juices</option>
                    <option value="Herbs">Herbs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="bunch">bunch</option>
                    <option value="piece">piece</option>
                    <option value="punnet">punnet</option>
                    <option value="500ml">500ml</option>
                    <option value="1L">1L</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe the product..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none min-h-[100px]"
                  required
                />
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image URL</label>
              <input
                placeholder="https://images.unsplash.com/..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <div className="mt-2 border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center p-4 bg-gray-50 overflow-hidden relative">
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x400?text=Invalid+Image+URL";
                    }}
                  />
                ) : (
                  <>
                    <ImageIcon className="text-gray-400 mb-2" size={48} />
                    <p className="text-sm text-gray-500">Image preview will appear here</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-sm transition-colors"
            >
              {editingProduct ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
