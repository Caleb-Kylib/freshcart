import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Navbar occupies the top */}
      <Navbar />

      <div className="flex flex-1 pt-20"> {/* pt-20 matches fixed navbar height */}
        {/* Sidebar - hidden on mobile, fixed width on desktop */}
        <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-white sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col min-w-0 bg-gray-50/50">
          <div className="p-4 md:p-10 flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
