import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "./LoginForm";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, usuario } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Si está autenticado pero NO es admin, denegar acceso
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-4">
            Solo los administradores pueden acceder a este panel.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Usuario actual: {usuario?.username} ({usuario?.rol})
          </p>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">
              Contacta al administrador del sistema si necesitas acceso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si es admin, mostrar contenido
  return <>{children}</>;
};

export default ProtectedRoute;
