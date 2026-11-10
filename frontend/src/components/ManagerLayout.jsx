import Navbar from "./Navbar";
import ManagerSidebar from "./ManagerSidebar";

const ManagerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F7FAF5] flex flex-col">
      {/* Fixed Navbar occupies the top */}
      <Navbar />

      <div className="flex flex-1 pt-20">
        {/* Sidebar - hidden on mobile, fixed width on desktop */}
        <div className="hidden md:block w-64 flex-shrink-0 border-r border-[#E2E8E0] bg-[#0B5D1E] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <ManagerSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col min-w-0">
          <div className="p-4 md:p-10 flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
