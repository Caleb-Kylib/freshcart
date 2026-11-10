import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  TrendingUp,
  Activity,
  LogOut,
  Eye
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ManagerSidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const links = [
    { name: "Overview", path: "/manager", icon: <LayoutDashboard size={20} /> },
    { name: "Orders", path: "/manager/orders", icon: <ShoppingBag size={20} /> },
    { name: "Inventory", path: "/manager/inventory", icon: <ClipboardList size={20} /> },
    { name: "Stock Movements", path: "/manager/stock-movements", icon: <Activity size={20} /> },
    { name: "Reports", path: "/manager/reports", icon: <TrendingUp size={20} /> },
    { name: "Cashier Activity", path: "/manager/cashier-activity", icon: <Eye size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-full flex flex-col bg-[#0B5D1E]">
      {/* Header with role badge */}
      <div className="p-6 border-b border-[#0A4016]">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-[#00A300] text-white text-xs font-bold rounded-full">
            MANAGER
          </span>
        </div>
        <h3 className="text-white font-bold text-sm">{user?.name || 'Manager'}</h3>
        <p className="text-[#A8D5B8] text-xs mt-1">Daily Operations</p>
      </div>

      {/* Navigation Menu */}
      <div className="p-4 flex-1">
        <h2 className="text-xs font-bold text-[#7DBF9F] uppercase tracking-widest mb-4 px-3">Navigation</h2>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/manager"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#00A300] text-white shadow-lg"
                    : "text-[#A8D5B8] hover:bg-[#0A4016] hover:text-white"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#0A4016]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-[#FF6B6B] hover:bg-[#0A4016] rounded-lg transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;
