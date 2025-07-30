import React, { useState } from "react";
import { useMesas, useSelectedMesa } from "../hooks";

const MesasPage: React.FC = () => {
  const [filtroEstado, setFiltroEstado] = useState<
    "all" | "LIBRE" | "OCUPADA" | "RESERVADA"
  >("all");
  const {
    data: mesas,
    isLoading,
    error,
  } = useMesas({
    estado: filtroEstado === "all" ? undefined : filtroEstado,
  });
  const { selectedMesa, selectMesa, clearSelectedMesa } = useSelectedMesa();

  const handleSelectMesa = (mesaId: number) => {
    const mesa = mesas?.find((m) => m.id === mesaId);
    if (mesa) {
      selectMesa(mesa);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "LIBRE":
        return "bg-green-100 text-green-800 border-green-300";
      case "OCUPADA":
        return "bg-red-100 text-red-800 border-red-300";
      case "RESERVADA":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Error al cargar mesas</h2>
          <p>{error instanceof Error ? error.message : "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Seleccionar Mesa
        </h1>
        <p className="text-gray-600 mb-6">
          Elige una mesa disponible para comenzar tu pedido
        </p>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFiltroEstado("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEstado === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroEstado("LIBRE")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEstado === "LIBRE"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Libres
          </button>
          <button
            onClick={() => setFiltroEstado("OCUPADA")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEstado === "OCUPADA"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Ocupadas
          </button>
          <button
            onClick={() => setFiltroEstado("RESERVADA")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEstado === "RESERVADA"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Reservadas
          </button>
        </div>

        {/* Mesa seleccionada */}
        {selectedMesa && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">
                  Mesa Seleccionada
                </h3>
                <p className="text-blue-700">
                  Mesa #{selectedMesa.numero} - {selectedMesa.capacidad}{" "}
                  personas
                </p>
              </div>
              <button
                onClick={clearSelectedMesa}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Cambiar Mesa
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid de mesas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mesas?.map((mesa) => (
          <div
            key={mesa.id}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedMesa?.id === mesa.id
                ? "border-blue-500 bg-blue-50"
                : `border-gray-300 bg-white hover:border-gray-400 ${getEstadoColor(
                    mesa.estado
                  )}`
            }`}
            onClick={() =>
              mesa.estado === "LIBRE" && handleSelectMesa(mesa.id!)
            }
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🪑</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Mesa #{mesa.numero}
              </h3>
              <div className="space-y-2">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(
                    mesa.estado
                  )}`}
                >
                  {mesa.estado}
                </div>
                <p className="text-gray-600">{mesa.capacidad} personas</p>
                {mesa.ubicacion && (
                  <p className="text-sm text-gray-500">{mesa.ubicacion}</p>
                )}
              </div>

              {mesa.estado === "LIBRE" && (
                <button
                  className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    selectedMesa?.id === mesa.id
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectMesa(mesa.id!);
                  }}
                >
                  {selectedMesa?.id === mesa.id
                    ? "Seleccionada"
                    : "Seleccionar"}
                </button>
              )}

              {mesa.estado !== "LIBRE" && (
                <div className="mt-4 w-full py-2 px-4 rounded-lg bg-gray-300 text-gray-600 font-medium cursor-not-allowed">
                  No disponible
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(!mesas || mesas.length === 0) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🪑</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay mesas disponibles
          </h3>
          <p className="text-gray-600">
            {filtroEstado === "all"
              ? "No se encontraron mesas en el sistema"
              : `No hay mesas con estado: ${filtroEstado}`}
          </p>
        </div>
      )}

      {/* Botón para continuar */}
      {selectedMesa && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <button
            onClick={() => {
              // Navegar al menú o siguiente paso
              window.location.href = "/menu";
            }}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Continuar al Menú
          </button>
        </div>
      )}
    </div>
  );
};

export default MesasPage;
