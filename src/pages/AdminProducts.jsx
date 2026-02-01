import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ProductModal from "../components/ProductModal";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminProducts")) || [];
    setProducts(saved);
  }, []);

  const saveProducts = (data) => {
    setProducts(data);
    localStorage.setItem("adminProducts", JSON.stringify(data));
  };

  const handleDelete = (id) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setOpenModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price (KES)</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.price}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setOpenModal(true);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No products added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
