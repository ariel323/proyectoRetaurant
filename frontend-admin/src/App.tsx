import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/admin/Dashboard";
import MenuAdmin from "./components/admin/MenuAdmin";
import UsuariosAdmin from "./components/admin/UsuariosAdmin";
import MesasAdmin from "./components/admin/MesasAdmin";
import PedidosAdmin from "./components/admin/PedidosAdmin";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Layout>
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/menu" element={<MenuAdmin />} />
              <Route path="/usuarios" element={<UsuariosAdmin />} />
              <Route path="/mesas" element={<MesasAdmin />} />
              <Route path="/pedidos" element={<PedidosAdmin />} />
              <Route
                path="*"
                element={
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                      Página no encontrada
                    </h1>
                    <p className="text-gray-600 mb-4">
                      La página que buscas no existe.
                    </p>
                    <Link
                      to="/"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Volver al inicio
                    </Link>
                  </div>
                }
              />
            </Routes>
          </ProtectedRoute>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
