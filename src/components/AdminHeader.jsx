const AdminHeader = () => {
  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      <h2 className="text-xl font-semibold text-gray-700">Dashboard</h2>
      
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
      
      <div>
        <span className="mr-4 text-gray-600">Admin</span>
        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
