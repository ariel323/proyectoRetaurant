import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">🏪 Admin Panel - Restaurante</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">👤 Administrador</span>
            <button className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
