import { useState } from "react";

const ProductModal = ({
  products,
  saveProducts,
  setOpenModal,
  editingProduct,
}) => {
  const [form, setForm] = useState(
    editingProduct || {
      id: Date.now(),
      name: "",
      category: "",
      price: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === form.id ? form : p
      );
      saveProducts(updated);
    } else {
      saveProducts([...products, form]);
    }

    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price (KES)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpenModal(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductModal;
