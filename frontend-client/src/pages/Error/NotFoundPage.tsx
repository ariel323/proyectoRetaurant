import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
          <div className="text-6xl mb-6">🍽️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Página no encontrada
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe. Quizás se haya movido o
            eliminado.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </Link>
          <Link
            to="/menu"
            className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
          >
            Ver Menú
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Si crees que esto es un error, por favor contáctanos.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
