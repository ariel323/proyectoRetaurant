import React, { useEffect, useState, useCallback } from "react";
import {
  getMesas,
  agregarMesa,
  eliminarMesa,
  editarMesa,
  Mesa,
} from "../../services/mesasService";

const MesasAdmin: React.FC = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState<Mesa["estado"]>("LIBRE");
  const [editando, setEditando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Limpiar mensaje después de 5 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const cargarMesas = useCallback(async () => {
    try {
      setCargando(true);
      const mesasData = await getMesas();
      setMesas(mesasData);
      setMensaje(null);
    } catch (e: any) {
      setMensaje(`Error al cargar mesas: ${e.message}`);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarMesas();
  }, [cargarMesas]);

  const resetForm = useCallback(() => {
    setNumero("");
    setEstado("LIBRE");
    setEditando(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setCargando(true);
      const numeroInt = parseInt(numero);

      if (isNaN(numeroInt) || numeroInt <= 0) {
        setMensaje("Por favor ingresa un número válido");
        return;
      }

      if (editando) {
        await editarMesa(editando, {
          numero: numeroInt,
          estado, // ✅ Ahora es del tipo correcto
        });
        setMensaje("¡Mesa actualizada exitosamente!");
      } else {
        await agregarMesa({
          numero: numeroInt,
          estado, // ✅ Ahora es del tipo correcto
        });
        setMensaje("¡Mesa agregada exitosamente!");
      }

      resetForm();
      await cargarMesas();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id: number, numeroMesa: number) => {
    if (
      !window.confirm(`¿Seguro que deseas eliminar la Mesa #${numeroMesa}?`)
    ) {
      return;
    }

    try {
      setCargando(true);
      console.log(`Intentando eliminar mesa con ID: ${id}`); // Debug log
      await eliminarMesa(id);
      setMensaje("Mesa eliminada exitosamente");
      await cargarMesas();
    } catch (e: any) {
      console.error("Error detallado al eliminar mesa:", e); // Debug log detallado
      setMensaje(`Error al eliminar mesa: ${e.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (mesa: Mesa) => {
    setEditando(mesa.id);
    setNumero(mesa.numero.toString());
    setEstado(mesa.estado);
  };

  const getEstadoConfig = (estado: string) => {
    const configs = {
      LIBRE: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✓",
        label: "Libre",
      },
      OCUPADA: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "●",
        label: "Ocupada",
      },
      RESERVADA: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏰",
        label: "Reservada",
      },
    };
    return configs[estado as keyof typeof configs] || configs.LIBRE;
  };

  const estadosOptions = [
    { value: "LIBRE", label: "Libre" },
    { value: "OCUPADA", label: "Ocupada" },
    { value: "RESERVADA", label: "Reservada" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Administración de Mesas
          </h1>
          <div className="text-sm text-gray-600">
            Total: {mesas.length} mesa{mesas.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Mensaje de estado */}
        {mensaje && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              mensaje.includes("Error")
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            } transition-all duration-300`}
          >
            <div className="flex items-center">
              <span className="mr-2">
                {mensaje.includes("Error") ? "❌" : "✅"}
              </span>
              {mensaje}
            </div>
          </div>
        )}

        {/* Formulario para agregar/editar mesa */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            {editando ? (
              <>
                <span className="mr-2">✏️</span>
                Editar Mesa #{numero}
              </>
            ) : (
              <>
                <span className="mr-2">➕</span>
                Agregar Nueva Mesa
              </>
            )}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Mesa *
              </label>
              <input
                type="number"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 1, 2, 3..."
                min="1"
                required
                disabled={cargando}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as Mesa["estado"])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={cargando}
              >
                {estadosOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2 items-end">
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {cargando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>{editando ? "✅ Actualizar" : "➕ Agregar"}</>
                )}
              </button>

              {editando && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={cargando}
                  className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de mesas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🏪</span>
              Mesas del Restaurante
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({mesas.length} total)
              </span>
            </h2>
          </div>

          {cargando ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando mesas...</p>
            </div>
          ) : mesas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">🍽️</div>
              <p className="text-lg mb-2">No hay mesas registradas</p>
              <p className="text-sm">
                Agrega la primera mesa usando el formulario de arriba
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
              {mesas
                .sort((a, b) => a.numero - b.numero)
                .map((mesa) => {
                  const estadoConfig = getEstadoConfig(mesa.estado);
                  return (
                    <div
                      key={mesa.id}
                      className={`border-2 rounded-lg p-4 hover:shadow-lg transition-all duration-200 ${
                        editando === mesa.id
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <span className="mr-2">🪑</span>
                          Mesa #{mesa.numero}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${estadoConfig.color}`}
                        >
                          <span className="mr-1">{estadoConfig.icon}</span>
                          {estadoConfig.label}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditar(mesa)}
                          disabled={cargando}
                          className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-200 disabled:bg-blue-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(mesa.id, mesa.numero)}
                          disabled={cargando}
                          className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm hover:bg-red-200 disabled:bg-red-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MesasAdmin;
