import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

const ProductModal = ({
  onSave,
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
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
      setPreview(""); // Clear local preview when editing a new product
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

    onSave(productData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl relative my-auto animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10 rounded-t-[2rem]">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-none">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Fill in the details below to update your inventory.</p>
          </div>
          <button
            onClick={() => setOpenModal(false)}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Essential Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Avocados"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-medium appearance-none"
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Juices">Juices</option>
                    <option value="Smoothies">Smoothies</option>
                    <option value="Herbs">Herbs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Unit</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-medium appearance-none"
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
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Price (KES)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-black text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Stock</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-gray-50 border-none px-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-black text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Visuals & Desc */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Product Image</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setForm({ ...form, image: `/products/${file.name}` });
                        // For preview only, we use URL.createObjectURL
                        const url = URL.createObjectURL(file);
                        setPreview(url);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full bg-gray-50 border-2 border-dashed border-gray-200 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-gray-500 group-hover:bg-gray-100 group-hover:border-green-300 transition-all">
                    <Upload size={18} />
                    <span className="text-sm font-bold">Upload Image</span>
                  </div>
                </div>
                {form.image && (
                  <p className="text-[10px] font-mono text-gray-400 mt-2 ml-1 truncate">
                    Path: {form.image}
                  </p>
                )}
              </div>

              <div className="border-[3px] border-dashed border-gray-100 rounded-[2rem] aspect-square flex flex-col items-center justify-center p-4 bg-gray-50 overflow-hidden relative group">
                {(preview || form.image) ? (
                  <img
                    src={preview || form.image}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x400?text=Image+Not+Found";
                    }}
                  />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Image Preview<br />Will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Description</label>
            <textarea
              placeholder="Describe the freshness, origin, and nutrients..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none min-h-[100px] font-medium leading-relaxed resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="flex-1 px-8 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="flex-[2] px-8 py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-700 transform active:scale-[0.98] transition-all"
            >
              {editingProduct ? "Save Updates" : "Confirm & Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
