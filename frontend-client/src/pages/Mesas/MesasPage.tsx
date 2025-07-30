import React from "react";
import { useQuery } from "react-query";
import { mesasEndpoints } from "../../api/endpoints/mesas";
import MesaContainer from "../../components/mesa/MesaContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Mesa } from "../../types";

const MesasPage: React.FC = () => {
  const {
    data: mesas,
    isLoading,
    error,
    refetch,
  } = useQuery<Mesa[]>(
    "mesas",
    () => mesasEndpoints.getAll({ estado: "LIBRE" }),
    {
      staleTime: 30000, // 30 segundos
      cacheTime: 300000, // 5 minutos
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  const handleMesaSelect = (mesa: Mesa) => {
    console.log("Mesa seleccionada:", mesa);
    // Aquí puedes manejar la selección de mesa
    // Por ejemplo, guardar en localStorage o context
    localStorage.setItem("selectedMesa", JSON.stringify(mesa));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error al cargar las mesas
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar las mesas disponibles. Por favor, intenta
            nuevamente.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selecciona tu Mesa
        </h1>
        <p className="text-lg text-gray-600">
          Elige la mesa que más te convenga para tu experiencia gastronómica
        </p>
      </div>

      <div className="mt-8">
        {mesas && mesas.length > 0 ? (
          <MesaContainer
            mesas={mesas}
            onMesaSelect={handleMesaSelect}
            variant="grid"
            className="space-y-6"
          />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay mesas disponibles
            </h3>
            <p className="text-gray-600">
              En este momento no hay mesas disponibles. Por favor, intenta más
              tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesasPage;
