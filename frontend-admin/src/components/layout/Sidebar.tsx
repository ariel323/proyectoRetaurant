import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: "/menu", icon: "🍽️", label: "Menú" },
    { path: "/mesas", icon: "🪑", label: "Mesas" },
    { path: "/pedidos", icon: "📋", label: "Pedidos" },
    { path: "/usuarios", icon: "👥", label: "Usuarios" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Gestión</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
