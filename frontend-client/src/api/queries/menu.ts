import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import { MenuItem, MenuFilter } from "../types";

/**
 * Queries para obtener datos del menú
 * Optimizado para React Query con cacheo eficiente
 */
export const menuQueries = {
  /**
   * Obtener todos los items del menú
   * @param filters - Filtros opcionales
   * @returns Promise<MenuItem[]>
   */
  getAll: async (filters?: Partial<MenuFilter>): Promise<MenuItem[]> => {
    try {
      const params = filters || {};
      return await apiClient.get<MenuItem[]>(ENDPOINTS.MENU, { params });
    } catch (error) {
      console.error("Error al obtener menú:", error);
      throw error;
    }
  },

  /**
   * Obtener un item del menú por ID
   * @param id - ID del item
   * @returns Promise<MenuItem>
   */
  getById: async (id: number): Promise<MenuItem> => {
    try {
      return await apiClient.get<MenuItem>(`${ENDPOINTS.MENU}/${id}`);
    } catch (error) {
      console.error(`Error al obtener item del menú ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener items del menú por categoría
   * @param categoria - Nombre de la categoría
   * @returns Promise<MenuItem[]>
   */
  getByCategory: async (categoria: string): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(
        `${ENDPOINTS.MENU}/categoria/${encodeURIComponent(categoria)}`
      );
    } catch (error) {
      console.error(`Error al obtener menú por categoría ${categoria}:`, error);
      throw error;
    }
  },

  /**
   * Buscar items del menú
   * @param termino - Término de búsqueda
   * @returns Promise<MenuItem[]>
   */
  search: async (termino: string): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(
        `${ENDPOINTS.MENU}/buscar?q=${encodeURIComponent(termino)}`
      );
    } catch (error) {
      console.error(`Error en búsqueda de menú:`, error);
      throw error;
    }
  },

  /**
   * Obtener categorías disponibles
   * @returns Promise<string[]>
   */
  getCategories: async (): Promise<string[]> => {
    try {
      return await apiClient.get<string[]>(`${ENDPOINTS.MENU}/categorias`);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      throw error;
    }
  },

  /**
   * Obtener items populares
   * @param limite - Cantidad de items
   * @returns Promise<MenuItem[]>
   */
  getPopular: async (limite: number = 10): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(
        `${ENDPOINTS.MENU}/popular?limite=${limite}`
      );
    } catch (error) {
      console.error("Error al obtener items populares:", error);
      throw error;
    }
  },
};

export default menuQueries;
