import Navbar from "./Navbar";
import Footer from "./Footer";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 bg-gray-100">
        <AdminSidebar />

        <main className="flex-1 p-6">{children}</main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLayout;
