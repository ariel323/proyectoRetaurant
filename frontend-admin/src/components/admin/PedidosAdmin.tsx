import React, { useEffect, useState } from "react";
import {
  getPedidos,
  eliminarPedido,
  Pedido,
} from "../../services/pedidosService";

const PedidosAdmin: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargarPedidos = async () => {
    try {
      setPedidos(await getPedidos());
    } catch (e: any) {
      setMensaje(e.message);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      await eliminarPedido(id);
      setMensaje("Pedido eliminado.");
      cargarPedidos();
    } catch (e: any) {
      setMensaje("Error: " + e.message);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "En preparación":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📋 Gestión de Pedidos
        </h2>

        {mensaje && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-6">
            {mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Pedido #{pedido.id}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(
                    pedido.estado
                  )}`}
                >
                  {pedido.estado}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Mesa:</span> #
                  {pedido.mesa.numero}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold text-green-600 ml-2">
                    ${pedido.total.toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Productos:</h4>
                <ul className="space-y-1">
                  {pedido.items.map((item) => (
                    <li
                      key={item.id}
                      className="text-sm text-gray-600 flex justify-between"
                    >
                      <span>{item.nombre}</span>
                      <span>${item.precio}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleEliminar(pedido.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Eliminar Pedido
              </button>
            </div>
          ))}
        </div>

        {pedidos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay pedidos
            </h3>
            <p className="text-gray-600">
              Los pedidos aparecerán aquí cuando los clientes ordenen
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosAdmin;
