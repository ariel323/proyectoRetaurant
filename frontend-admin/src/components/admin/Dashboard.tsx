import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getMenu } from "../../services/menuService";
import { getEstadisticasMesas } from "../../services/mesasService";
import { getUsuarios } from "../../services/UsuarioService";
import { useToast } from "../../hooks/useToast";

interface DashboardStats {
  totalPlatos: number;
  mesasActivas: number;
  pedidosHoy: number;
  totalUsuarios: number;
  ventasHoy: number;
  mesasLibres: number;
  mesasOcupadas: number;
  mesasReservadas: number;
}

const Dashboard: React.FC = () => {
  const { usuario } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalPlatos: 0,
    mesasActivas: 0,
    pedidosHoy: 0,
    totalUsuarios: 0,
    ventasHoy: 0,
    mesasLibres: 0,
    mesasOcupadas: 0,
    mesasReservadas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar datos en paralelo
        const [productos, estadisticasMesas, usuarios] =
          await Promise.allSettled([
            getMenu(),
            getEstadisticasMesas(),
            getUsuarios(),
          ]);

        const newStats: DashboardStats = {
          totalPlatos:
            productos.status === "fulfilled" ? productos.value.length : 0,
          mesasActivas: 0, // Se calculará más abajo
          pedidosHoy: 0, // TODO: implementar endpoint de pedidos
          totalUsuarios:
            usuarios.status === "fulfilled" ? usuarios.value.length : 0,
          ventasHoy: 0, // TODO: implementar endpoint de ventas
          mesasLibres: 0,
          mesasOcupadas: 0,
          mesasReservadas: 0,
        };

        if (estadisticasMesas.status === "fulfilled") {
          const mesasStats = estadisticasMesas.value;
          newStats.mesasLibres = mesasStats.libres;
          newStats.mesasOcupadas = mesasStats.ocupadas;
          newStats.mesasReservadas = mesasStats.reservadas;
          newStats.mesasActivas = mesasStats.ocupadas + mesasStats.reservadas;
        }

        setStats(newStats);

        // Mostrar advertencias si hay problemas con algunos servicios
        const errors = [];
        if (productos.status === "rejected") {
          errors.push(`Menú: ${productos.reason.message}`);
        }
        if (estadisticasMesas.status === "rejected") {
          errors.push(`Mesas: ${estadisticasMesas.reason.message}`);
        }
        if (usuarios.status === "rejected") {
          errors.push(`Usuarios: ${usuarios.reason.message}`);
        }

        if (errors.length > 0) {
          setError(`Algunos datos no se pudieron cargar: ${errors.join(", ")}`);
          addToast({
            type: "warning",
            message:
              "Algunos datos del dashboard no se pudieron cargar. Revisa la conexión con el backend.",
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        setError(`Error al cargar el dashboard: ${errorMessage}`);
        addToast({
          type: "error",
          message:
            "No se pudo cargar el dashboard. Revisa la conexión con el backend.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [addToast]);

  const dashboardCards = [
    {
      title: "Gestión de Menú",
      description: "Administrar platos, precios y disponibilidad",
      icon: "🍽️",
      path: "/menu",
      gradient: "from-blue-500 to-blue-600",
      stats:
        stats.totalPlatos > 0 ? `${stats.totalPlatos} platos` : "Sin datos",
    },
    {
      title: "Gestión de Mesas",
      description: "Configurar mesas y estados",
      icon: "🪑",
      path: "/mesas",
      gradient: "from-green-500 to-green-600",
      stats: `${stats.mesasLibres} libres, ${stats.mesasOcupadas} ocupadas`,
    },
    {
      title: "Gestión de Pedidos",
      description: "Ver y administrar pedidos activos",
      icon: "📋",
      path: "/pedidos",
      gradient: "from-orange-500 to-orange-600",
      stats: stats.pedidosHoy > 0 ? `${stats.pedidosHoy} hoy` : "Sin datos",
    },
    {
      title: "Gestión de Usuarios",
      description: "Administrar usuarios del sistema",
      icon: "👥",
      path: "/usuarios",
      gradient: "from-purple-500 to-purple-600",
      stats:
        stats.totalUsuarios > 0
          ? `${stats.totalUsuarios} usuarios`
          : "Sin datos",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, {usuario?.username || "Admin"}! 👋
          </h1>
          <p className="text-gray-600">
            Panel de administración del restaurante
          </p>
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🍽️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Platos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPlatos}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🪑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Mesas Libres
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.mesasLibres}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Mesas Activas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.mesasActivas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsuarios}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => (
            <Link
              key={card.title}
              to={card.path}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div
                className={`bg-gradient-to-br ${card.gradient} p-6 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{card.title}</p>
                    <p className="text-sm opacity-90 mt-1">
                      {card.description}
                    </p>
                    <p className="text-xs opacity-75 mt-2">{card.stats}</p>
                  </div>
                  <div className="text-3xl opacity-80">{card.icon}</div>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Estado de la Base de Datos */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Productos en Menú</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.totalPlatos}
              </p>
              <p className="text-xs text-gray-500">
                {stats.totalPlatos > 0 ? "✅ Datos cargados" : "⚠️ Sin datos"}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Mesas Configuradas</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.mesasLibres +
                  stats.mesasOcupadas +
                  stats.mesasReservadas}
              </p>
              <p className="text-xs text-gray-500">
                {stats.mesasLibres +
                  stats.mesasOcupadas +
                  stats.mesasReservadas >
                0
                  ? "✅ Datos cargados"
                  : "⚠️ Sin datos"}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Usuarios Registrados</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.totalUsuarios}
              </p>
              <p className="text-xs text-gray-500">
                {stats.totalUsuarios > 0 ? "✅ Datos cargados" : "⚠️ Sin datos"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
