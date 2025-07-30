import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { usuario, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
      logout();
    }
  };

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "📊", description: "Vista general" },
    {
      path: "/menu",
      label: "Menú",
      icon: "🍽️",
      description: "Gestionar platos",
    },
    {
      path: "/mesas",
      label: "Mesas",
      icon: "🪑",
      description: "Estado de mesas",
    },
    {
      path: "/pedidos",
      label: "Pedidos",
      icon: "📋",
      description: "Órdenes activas",
    },
    {
      path: "/usuarios",
      label: "Usuarios",
      icon: "👥",
      description: "Gestión de usuarios",
    },
  ];

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 lg:px-6">
          <div className="flex justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg shadow-md">
                  <span className="text-xl font-bold">🍽️</span>
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Restaurant Admin
                  </span>
                  <div className="text-xs text-gray-500 hidden sm:block">
                    Panel de Administración
                  </div>
                </div>
              </div>
            </div>

            {/* Usuario y acciones */}
            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5-5 5-5h-5m-6 10v-4a6 6 0 1 1 12 0v4"
                  />
                </svg>
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Perfil de usuario */}
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {usuario?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {usuario?.username}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    {usuario?.rol}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-white shadow-xl border-r border-gray-200
          flex flex-col
        `}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center lg:justify-center">
              <h2 className="text-lg font-bold text-gray-800">Navegación</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActivePath(item.path)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-102"
                  }
                `}
              >
                <div
                  className={`
                  flex items-center justify-center w-10 h-10 rounded-lg mr-4 transition-colors
                  ${
                    isActivePath(item.path)
                      ? "bg-white bg-opacity-20"
                      : "bg-gray-100 group-hover:bg-gray-200"
                  }
                `}
                >
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm">{item.label}</span>
                  <div
                    className={`text-xs transition-colors ${
                      isActivePath(item.path)
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
                {isActivePath(item.path) && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Sistema Online
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Última actualización: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
