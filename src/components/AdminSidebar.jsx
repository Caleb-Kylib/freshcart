import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <div className="w-64 bg-green-600 min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Grocery Admin</h1>
      <nav className="space-y-4">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-green-700 transition ${
                isActive ? "bg-green-800" : ""
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
