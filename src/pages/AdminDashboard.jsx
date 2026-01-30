import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <AdminHeader />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Welcome to the Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-700 font-semibold">Total Products</h3>
              <p className="text-2xl font-bold text-green-600">120</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-700 font-semibold">Total Orders</h3>
              <p className="text-2xl font-bold text-green-600">45</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-700 font-semibold">Revenue</h3>
              <p className="text-2xl font-bold text-green-600">KES 120,000</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
