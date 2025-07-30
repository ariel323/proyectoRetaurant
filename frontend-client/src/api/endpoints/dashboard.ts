import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import { DashboardStats, SalesReport } from "../types";

/**
 * Endpoints para dashboard y estadísticas del restaurante
 * Optimizado para el frontend-client con datos públicos
 */
export const dashboardEndpoints = {
  /**
   * Obtener estadísticas generales del restaurante
   * @returns Promise<DashboardStats>
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      return await apiClient.get<DashboardStats>(ENDPOINTS.DASHBOARD_STATS);
    } catch (error) {
      console.error("Error al obtener estadísticas del dashboard:", error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas básicas para mostrar al cliente
   * @returns Promise<Partial<DashboardStats>>
   */
  getPublicStats: async (): Promise<Partial<DashboardStats>> => {
    try {
      const stats = await apiClient.get<DashboardStats>(
        ENDPOINTS.DASHBOARD_STATS
      );

      // Filtrar solo información relevante para clientes
      return {
        mesas: {
          total: stats.mesas.total,
          ocupadas: stats.mesas.ocupadas,
          libres: stats.mesas.libres,
          reservadas: stats.mesas.reservadas,
          ocupacion_porcentaje: stats.mesas.ocupacion_porcentaje,
        },
        menu: {
          total_items: stats.menu.total_items,
          items_disponibles: stats.menu.items_disponibles,
          items_agotados: stats.menu.items_agotados,
          categorias_activas: stats.menu.categorias_activas,
        },
      };
    } catch (error) {
      console.error("Error al obtener estadísticas públicas:", error);
      // Devolver datos por defecto si hay error
      return {
        mesas: {
          total: 0,
          ocupadas: 0,
          libres: 0,
          reservadas: 0,
          ocupacion_porcentaje: 0,
        },
        menu: {
          total_items: 0,
          items_disponibles: 0,
          items_agotados: 0,
          categorias_activas: 0,
        },
      };
    }
  },

  /**
   * Obtener tiempo de espera promedio
   * @returns Promise<{tiempo_espera_promedio: number}>
   */
  getWaitTime: async (): Promise<{ tiempo_espera_promedio: number }> => {
    try {
      return await apiClient.get<{ tiempo_espera_promedio: number }>(
        "/dashboard/wait-time"
      );
    } catch (error) {
      console.error("Error al obtener tiempo de espera:", error);
      return { tiempo_espera_promedio: 15 }; // Valor por defecto
    }
  },

  /**
   * Obtener popularidad de items del menú
   * @param limit - Número máximo de items a retornar
   * @returns Promise<MenuItem[]>
   */
  getPopularItems: async (limit: number = 5): Promise<any[]> => {
    try {
      const params = { limit };
      return await apiClient.get<any[]>("/dashboard/popular-items", { params });
    } catch (error) {
      console.error("Error al obtener items populares:", error);
      return [];
    }
  },

  /**
   * Obtener estado actual de las mesas (para mostrar disponibilidad)
   * @returns Promise<{libres: number, ocupadas: number, reservadas: number}>
   */
  getTableStatus: async (): Promise<{
    libres: number;
    ocupadas: number;
    reservadas: number;
  }> => {
    try {
      return await apiClient.get<{
        libres: number;
        ocupadas: number;
        reservadas: number;
      }>("/dashboard/table-status");
    } catch (error) {
      console.error("Error al obtener estado de mesas:", error);
      return { libres: 0, ocupadas: 0, reservadas: 0 };
    }
  },

  /**
   * Obtener horarios de mayor actividad
   * @returns Promise<{hora: number, actividad: number}[]>
   */
  getBusyHours: async (): Promise<{ hora: number; actividad: number }[]> => {
    try {
      return await apiClient.get<{ hora: number; actividad: number }[]>(
        "/dashboard/busy-hours"
      );
    } catch (error) {
      console.error("Error al obtener horarios ocupados:", error);
      return [];
    }
  },

  /**
   * Obtener reporte de ventas (versión simplificada para clientes)
   * @param periodo - Periodo del reporte ('dia', 'semana', 'mes')
   * @returns Promise<Partial<SalesReport>>
   */
  getPublicSalesReport: async (
    periodo: "dia" | "semana" | "mes" = "dia"
  ): Promise<Partial<SalesReport>> => {
    try {
      const params = { periodo, public: true };
      return await apiClient.get<Partial<SalesReport>>(
        "/dashboard/sales-report",
        {
          params,
        }
      );
    } catch (error) {
      console.error("Error al obtener reporte de ventas público:", error);
      return {
        periodo,
        items_mas_vendidos: [],
        ventas_por_categoria: [],
      };
    }
  },

  /**
   * Obtener información del restaurante para mostrar al cliente
   * @returns Promise<{nombre: string, descripcion: string, horarios: any}>
   */
  getRestaurantInfo: async (): Promise<{
    nombre: string;
    descripcion: string;
    horarios: any;
    contacto: any;
  }> => {
    try {
      return await apiClient.get<{
        nombre: string;
        descripcion: string;
        horarios: any;
        contacto: any;
      }>("/dashboard/restaurant-info");
    } catch (error) {
      console.error("Error al obtener información del restaurante:", error);
      return {
        nombre: "Restaurante",
        descripcion: "Bienvenido a nuestro restaurante",
        horarios: {
          lunes_viernes: "09:00 - 22:00",
          sabado_domingo: "10:00 - 23:00",
        },
        contacto: {
          telefono: "+1234567890",
          email: "info@restaurante.com",
          direccion: "Calle Principal 123",
        },
      };
    }
  },

  /**
   * Obtener métricas de satisfacción del cliente
   * @returns Promise<{rating_promedio: number, total_reseñas: number}>
   */
  getCustomerSatisfaction: async (): Promise<{
    rating_promedio: number;
    total_reseñas: number;
  }> => {
    try {
      return await apiClient.get<{
        rating_promedio: number;
        total_reseñas: number;
      }>("/dashboard/customer-satisfaction");
    } catch (error) {
      console.error("Error al obtener satisfacción del cliente:", error);
      return {
        rating_promedio: 4.5,
        total_reseñas: 0,
      };
    }
  },

  /**
   * Obtener notificaciones públicas del restaurante
   * @returns Promise<{id: string, mensaje: string, tipo: string, activa: boolean}[]>
   */
  getPublicNotifications: async (): Promise<
    { id: string; mensaje: string; tipo: string; activa: boolean }[]
  > => {
    try {
      return await apiClient.get<
        { id: string; mensaje: string; tipo: string; activa: boolean }[]
      >("/dashboard/notifications/public");
    } catch (error) {
      console.error("Error al obtener notificaciones públicas:", error);
      return [];
    }
  },
};

export default dashboardEndpoints;
