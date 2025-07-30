import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import { Mesa, MesaFilter } from "../types";

/**
 * Queries para obtener datos de mesas
 * Optimizado para React Query con cacheo eficiente
 */
export const mesasQueries = {
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
   * Obtener una mesa por ID
   * @param id - ID de la mesa
   * @returns Promise<Mesa>
   */
  getById: async (id: number): Promise<Mesa> => {
    try {
      return await apiClient.get<Mesa>(`${ENDPOINTS.MESAS}/${id}`);
    } catch (error) {
      console.error(`Error al obtener mesa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener mesas por estado
   * @param estado - Estado de las mesas
   * @returns Promise<Mesa[]>
   */
  getByStatus: async (
    estado: "LIBRE" | "OCUPADA" | "RESERVADA" | "MANTENIMIENTO"
  ): Promise<Mesa[]> => {
    try {
      return await apiClient.get<Mesa[]>(`${ENDPOINTS.MESAS}/estado/${estado}`);
    } catch (error) {
      console.error(`Error al obtener mesas con estado ${estado}:`, error);
      throw error;
    }
  },

  /**
   * Obtener mesas libres disponibles
   * @returns Promise<Mesa[]>
   */
  getAvailable: async (): Promise<Mesa[]> => {
    try {
      return await apiClient.get<Mesa[]>(`${ENDPOINTS.MESAS}/disponibles`);
    } catch (error) {
      console.error("Error al obtener mesas disponibles:", error);
      throw error;
    }
  },

  /**
   * Obtener mesas ocupadas
   * @returns Promise<Mesa[]>
   */
  getOccupied: async (): Promise<Mesa[]> => {
    try {
      return await apiClient.get<Mesa[]>(`${ENDPOINTS.MESAS}/ocupadas`);
    } catch (error) {
      console.error("Error al obtener mesas ocupadas:", error);
      throw error;
    }
  },

  /**
   * Obtener mesas reservadas
   * @returns Promise<Mesa[]>
   */
  getReserved: async (): Promise<Mesa[]> => {
    try {
      return await apiClient.get<Mesa[]>(`${ENDPOINTS.MESAS}/reservadas`);
    } catch (error) {
      console.error("Error al obtener mesas reservadas:", error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de mesas
   * @returns Promise<MesaStats>
   */
  getStats: async (): Promise<{
    totalMesas: number;
    mesasLibres: number;
    mesasOcupadas: number;
    mesasReservadas: number;
    mesasMantenimiento: number;
    porcentajeOcupacion: number;
    capacidadTotal: number;
    capacidadDisponible: number;
  }> => {
    try {
      return await apiClient.get(`${ENDPOINTS.MESAS}/estadisticas`);
    } catch (error) {
      console.error("Error al obtener estadísticas de mesas:", error);
      throw error;
    }
  },

  /**
   * Buscar mesas por número
   * @param numero - Número de mesa a buscar
   * @returns Promise<Mesa[]>
   */
  searchByNumber: async (numero: number): Promise<Mesa[]> => {
    try {
      return await apiClient.get<Mesa[]>(
        `${ENDPOINTS.MESAS}/buscar?numero=${numero}`
      );
    } catch (error) {
      console.error(`Error al buscar mesa número ${numero}:`, error);
      throw error;
    }
  },

  /**
   * Obtener capacidad total del restaurante
   * @returns Promise<number>
   */
  getTotalCapacity: async (): Promise<number> => {
    try {
      const response = await apiClient.get<{ capacidad: number }>(
        `${ENDPOINTS.MESAS}/capacidad-total`
      );
      return response.capacidad;
    } catch (error) {
      console.error("Error al obtener capacidad total:", error);
      throw error;
    }
  },
};

export default mesasQueries;
