import React from "react";
import { Link } from "react-router-dom";

const OrderHistoryPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Historial de Pedidos
        </h1>
        <p className="text-lg text-gray-600">
          Revisa todos tus pedidos anteriores
        </p>
      </div>

      {/* Placeholder para historial de pedidos */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tus Pedidos</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes pedidos anteriores
            </h3>
            <p className="text-gray-600 mb-6">
              Cuando realices tu primer pedido, aparecerá aquí.
            </p>
            <Link
              to="/menu"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Explorar Menú
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
