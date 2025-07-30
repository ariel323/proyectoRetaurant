import React, { useState } from "react";
import { useApiClient, useApiMutation } from "../../hooks/useApiClient";
import { MenuItem, Mesa } from "../../types";

/**
 * Componente de demostración que muestra el uso de interceptores
 */
export const InterceptorDemo: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("/menu");

  // Hook para obtener datos con interceptores automáticos
  const { data, loading, error, refetch, retryCount } = useApiClient<
    MenuItem[] | Mesa[]
  >(selectedEndpoint, {
    immediate: true,
    retryOnError: true,
    maxRetries: 3,
    retryDelay: 2000,
  });

  // Hook para mutaciones
  const { mutate, loading: mutating, error: mutationError } = useApiMutation();

  const handleTestError = async () => {
    try {
      await mutate("post", "/non-existent-endpoint", {});
    } catch (error) {
      console.log("Error capturado por los interceptores:", error);
    }
  };

  const handleTestRetry = async () => {
    try {
      // Endpoint que probablemente falle para probar el retry
      await mutate("post", "/test-retry-endpoint", {});
    } catch (error) {
      console.log("Falló después de todos los reintentos:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Demo de Interceptores API</h1>

      {/* Selector de endpoint */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Seleccionar Endpoint:
        </label>
        <select
          value={selectedEndpoint}
          onChange={(e) => setSelectedEndpoint(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="/menu">Menú</option>
          <option value="/mesas">Mesas</option>
          <option value="/categorias">Categorías</option>
        </select>
      </div>

      {/* Información del estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Estado</h3>
          <p className="text-sm text-blue-600">
            {loading ? "Cargando..." : "Completado"}
          </p>
          {retryCount > 0 && (
            <p className="text-xs text-orange-600">Reintentos: {retryCount}</p>
          )}
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Datos</h3>
          <p className="text-sm text-green-600">
            {data
              ? `${Array.isArray(data) ? data.length : 1} items`
              : "Sin datos"}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800">Errores</h3>
          <p className="text-sm text-red-600">
            {error ? error.message : "Sin errores"}
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={refetch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Refrescar
        </button>

        <button
          onClick={handleTestError}
          disabled={mutating}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
        >
          Probar Error
        </button>

        <button
          onClick={handleTestRetry}
          disabled={mutating}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
        >
          Probar Retry
        </button>
      </div>

      {/* Mostrar datos */}
      {data && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Datos Obtenidos:</h3>
          <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Mostrar errores */}
      {(error || mutationError) && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
          <div className="text-sm text-red-600">
            <p>
              <strong>Mensaje:</strong> {(error || mutationError)?.message}
            </p>
            <p>
              <strong>Código:</strong> {(error || mutationError)?.code}
            </p>
            <p>
              <strong>Status:</strong> {(error || mutationError)?.status}
            </p>
          </div>
        </div>
      )}

      {/* Información sobre interceptores */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">
          Características de los Interceptores:
        </h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>
            • <strong>Logging automático:</strong> Todos los requests y
            responses se loggean en desarrollo
          </li>
          <li>
            • <strong>Retry automático:</strong> Reintentos automáticos en
            errores 5xx
          </li>
          <li>
            • <strong>Control de cache:</strong> Timestamps automáticos para
            evitar cache
          </li>
          <li>
            • <strong>Manejo de errores:</strong> Errores tipados y normalizados
          </li>
          <li>
            • <strong>Headers comunes:</strong> Headers automáticos para
            identificar el cliente
          </li>
          <li>
            • <strong>Autenticación:</strong> Soporte para tokens de
            autenticación (configurable)
          </li>
        </ul>
      </div>

      {/* Información técnica */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Este componente demuestra el uso de interceptores desacoplados.</p>
        <p>
          Abre la consola del navegador para ver los logs detallados de los
          interceptores.
        </p>
      </div>
    </div>
  );
};

export default InterceptorDemo;
