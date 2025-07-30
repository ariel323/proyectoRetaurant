import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import { Mesa, MesaFilter, ApiResponse } from "../types";

/**
 * Endpoints para gestión de mesas del restaurante
 * Optimizado para el frontend-client (solo consulta)
 */
export const mesasEndpoints = {
  /**
   * Obtener todas las mesas
   * @param filters - Filtros opcionales
   * @returns Promise<Mesa[]>
   */
  getAll: async (filters?: Partial<MesaFilter>): Promise<Mesa[]> => {
    try {
      const params = filters || {};
      return await apiClient.get<Mesa[]>(ENDPOINTS.MESAS, { params });
    } catch (error) {
      console.error("Error al obtener mesas:", error);
      throw error;
    }
  },

  /**
   * Obtener mesas con paginación
   * @param page - Página actual
   * @param limit - Límite de mesas por página
   * @param filters - Filtros opcionales
   * @returns Promise<PaginatedResponse<Mesa>>
   */
  getPaginated: async (
    page: number = 1,
    limit: number = 10,
    filters?: Partial<MesaFilter>
  ): Promise<ApiResponse<Mesa[]>> => {
    try {
      return await apiClient.paginate<Mesa>(
        ENDPOINTS.MESAS,
        page,
        limit,
        filters
      );
    } catch (error) {
      console.error("Error al obtener mesas paginadas:", error);
      throw error;
    }
  },

  /**
   * Obtener mesa por ID
   * @param id - ID de la mesa
   * @returns Promise<Mesa>
   */
  getById: async (id: number): Promise<Mesa> => {
    try {
      return await apiClient.get<Mesa>(ENDPOINTS.MESA_BY_ID(id));
    } catch (error) {
      console.error(`Error al obtener mesa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener mesas disponibles (libres)
   * @param capacidadMinima - Capacidad mínima requerida
   * @returns Promise<Mesa[]>
   */
  getAvailable: async (capacidadMinima?: number): Promise<Mesa[]> => {
    try {
      const params = capacidadMinima ? { capacidad_min: capacidadMinima } : {};
      return await apiClient.get<Mesa[]>(ENDPOINTS.MESAS_DISPONIBLES, {
        params,
      });
    } catch (error) {
      console.error("Error al obtener mesas disponibles:", error);
      return [];
    }
  },

  /**
   * Verificar disponibilidad de una mesa específica
   * @param id - ID de la mesa
   * @returns Promise<{disponible: boolean, tiempo_estimado?: number}>
   */
  checkAvailability: async (
    id: number
  ): Promise<{ disponible: boolean; tiempo_estimado?: number }> => {
    try {
      return await apiClient.get<{
        disponible: boolean;
        tiempo_estimado?: number;
      }>(ENDPOINTS.MESA_CHECK_AVAILABILITY(id));
    } catch (error) {
      console.error(`Error al verificar disponibilidad de mesa ${id}:`, error);
      return { disponible: false };
    }
  },

  /**
   * Obtener mesas por estado
   * @param estado - Estado de las mesas
   * @returns Promise<Mesa[]>
   */
  getByStatus: async (
    estado: "LIBRE" | "OCUPADA" | "RESERVADA"
  ): Promise<Mesa[]> => {
    try {
      const params = { estado };
      return await apiClient.get<Mesa[]>(ENDPOINTS.MESAS, { params });
    } catch (error) {
      console.error(`Error al obtener mesas con estado ${estado}:`, error);
      return [];
    }
  },

  /**
   * Obtener mesas por capacidad
   * @param capacidadMinima - Capacidad mínima
   * @param capacidadMaxima - Capacidad máxima (opcional)
   * @returns Promise<Mesa[]>
   */
  getByCapacity: async (
    capacidadMinima: number,
    capacidadMaxima?: number
  ): Promise<Mesa[]> => {
    try {
      const params: any = { capacidad_min: capacidadMinima };
      if (capacidadMaxima) {
        params.capacidad_max = capacidadMaxima;
      }

      return await apiClient.get<Mesa[]>(ENDPOINTS.MESAS, { params });
    } catch (error) {
      console.error(
        `Error al obtener mesas por capacidad ${capacidadMinima}${
          capacidadMaxima ? `-${capacidadMaxima}` : "+"
        }:`,
        error
      );
      return [];
    }
  },

  /**
   * Obtener mesas por ubicación
   * @param ubicacion - Ubicación específica
   * @returns Promise<Mesa[]>
   */
  getByLocation: async (ubicacion: string): Promise<Mesa[]> => {
    try {
      const params = { ubicacion };
      return await apiClient.get<Mesa[]>(ENDPOINTS.MESAS, { params });
    } catch (error) {
      console.error(`Error al obtener mesas en ubicación ${ubicacion}:`, error);
      return [];
    }
  },

  /**
   * Obtener mesas disponibles por capacidad mínima
   * @param capacidad - Capacidad mínima requerida
   * @returns Promise<Mesa[]>
   */
  getAvailableByCapacity: async (capacidad: number): Promise<Mesa[]> => {
    try {
      const params = {
        estado: "LIBRE",
        capacidad_min: capacidad,
      };
      return await apiClient.get<Mesa[]>(ENDPOINTS.MESAS, { params });
    } catch (error) {
      console.error(
        `Error al obtener mesas disponibles con capacidad ${capacidad}:`,
        error
      );
      return [];
    }
  },

  /**
   * Obtener estadísticas de ocupación de mesas
   * @returns Promise<{total: number, libres: number, ocupadas: number, reservadas: number}>
   */
  getOccupancyStats: async (): Promise<{
    total: number;
    libres: number;
    ocupadas: number;
    reservadas: number;
    porcentaje_ocupacion: number;
  }> => {
    try {
      return await apiClient.get<{
        total: number;
        libres: number;
        ocupadas: number;
        reservadas: number;
        porcentaje_ocupacion: number;
      }>("/mesas/occupancy-stats");
    } catch (error) {
      console.error("Error al obtener estadísticas de ocupación:", error);
      return {
        total: 0,
        libres: 0,
        ocupadas: 0,
        reservadas: 0,
        porcentaje_ocupacion: 0,
      };
    }
  },

  /**
   * Obtener ubicaciones disponibles
   * @returns Promise<string[]>
   */
  getLocations: async (): Promise<string[]> => {
    try {
      return await apiClient.get<string[]>("/mesas/locations");
    } catch (error) {
      console.error("Error al obtener ubicaciones:", error);
      return [];
    }
  },

  /**
   * Obtener capacidades disponibles
   * @returns Promise<number[]>
   */
  getCapacities: async (): Promise<number[]> => {
    try {
      return await apiClient.get<number[]>("/mesas/capacities");
    } catch (error) {
      console.error("Error al obtener capacidades:", error);
      return [];
    }
  },

  /**
   * Obtener tiempo de espera estimado para mesas
   * @param capacidad - Capacidad requerida (opcional)
   * @returns Promise<{tiempo_espera_minutos: number}>
   */
  getEstimatedWaitTime: async (
    capacidad?: number
  ): Promise<{ tiempo_espera_minutos: number }> => {
    try {
      const params = capacidad ? { capacidad } : {};
      return await apiClient.get<{ tiempo_espera_minutos: number }>(
        "/mesas/wait-time",
        { params }
      );
    } catch (error) {
      console.error("Error al obtener tiempo de espera:", error);
      return { tiempo_espera_minutos: 15 }; // Valor por defecto
    }
  },

  /**
   * Obtener layout/distribución de mesas
   * @returns Promise<{mesa_id: number, posicion: {x: number, y: number}, estado: string}[]>
   */
  getLayout: async (): Promise<
    { mesa_id: number; posicion: { x: number; y: number }; estado: string }[]
  > => {
    try {
      return await apiClient.get<
        {
          mesa_id: number;
          posicion: { x: number; y: number };
          estado: string;
        }[]
      >("/mesas/layout");
    } catch (error) {
      console.error("Error al obtener layout de mesas:", error);
      return [];
    }
  },

  /**
   * Buscar mesas disponibles con filtros específicos
   * @param filters - Filtros de búsqueda
   * @returns Promise<Mesa[]>
   */
  searchAvailable: async (filters: {
    capacidad_min?: number;
    capacidad_max?: number;
    ubicacion?: string;
    tiempo_max_espera?: number;
  }): Promise<Mesa[]> => {
    try {
      const params = {
        estado: "LIBRE",
        ...filters,
      };
      return await apiClient.search<Mesa[]>("/mesas/search", params);
    } catch (error) {
      console.error("Error al buscar mesas disponibles:", error);
      return [];
    }
  },
};

export default mesasEndpoints;
