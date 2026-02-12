import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users as UsersIcon,
  Settings,
  LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const links = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <ShoppingBag size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ClipboardList size={20} /> },
    { name: "Users", path: "/admin/users", icon: <UsersIcon size={20} /> },
    { name: "Reports", path: "/admin/reports", icon: <ClipboardList size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">Menu</h2>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-green-50 text-green-700 shadow-sm border border-green-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
