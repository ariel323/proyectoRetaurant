import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import { MenuItem, Category, MenuFilter, ApiResponse } from "../types";

/**
 * Endpoints para gestión del menú del restaurante
 * Optimizado para el frontend-client (solo lectura)
 */
export const menuEndpoints = {
  /**
   * Obtener todos los items del menú disponibles
   * @param filters - Filtros opcionales para la búsqueda
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
   * Obtener menú con paginación
   * @param page - Página actual
   * @param limit - Límite de items por página
   * @param filters - Filtros opcionales
   * @returns Promise<ApiResponse<MenuItem[]>>
   */
  getPaginated: async (
    page: number = 1,
    limit: number = 10,
    filters?: Partial<MenuFilter>
  ): Promise<ApiResponse<MenuItem[]>> => {
    try {
      return await apiClient.paginate<MenuItem>(ENDPOINTS.MENU, page, limit, {
        disponible: true,
        ...filters,
      });
    } catch (error) {
      console.error("Error al obtener menú paginado:", error);
      throw error;
    }
  },

  /**
   * Obtener item del menú por ID
   * @param id - ID del item
   * @returns Promise<MenuItem>
   */
  getById: async (id: number): Promise<MenuItem> => {
    try {
      return await apiClient.get<MenuItem>(ENDPOINTS.MENU_BY_ID(id));
    } catch (error) {
      console.error(`Error al obtener item del menú ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener items por categoría
   * @param categoria - Nombre de la categoría
   * @returns Promise<MenuItem[]>
   */
  getByCategory: async (categoria: string): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(ENDPOINTS.MENU, {
        params: { categoria, disponible: true },
      });
    } catch (error) {
      console.error(`Error al obtener items de categoría ${categoria}:`, error);
      throw error;
    }
  },

  /**
   * Buscar items del menú
   * @param query - Término de búsqueda
   * @param filters - Filtros adicionales
   * @returns Promise<MenuItem[]>
   */
  search: async (
    query: string,
    filters?: Partial<MenuFilter>
  ): Promise<MenuItem[]> => {
    try {
      const params = {
        search: query,
        disponible: true,
        ...filters,
      };

      return await apiClient.get<MenuItem[]>(ENDPOINTS.MENU_SEARCH, { params });
    } catch (error) {
      console.error("Error al buscar en el menú:", error);
      throw error;
    }
  },

  /**
   * Obtener items destacados
   * @param limit - Límite de items (opcional)
   * @returns Promise<MenuItem[]>
   */
  getFeatured: async (limit?: number): Promise<MenuItem[]> => {
    try {
      const params = limit ? { limit, destacado: true } : { destacado: true };
      return await apiClient.get<MenuItem[]>(ENDPOINTS.MENU, { params });
    } catch (error) {
      console.error("Error al obtener items destacados:", error);
      return [];
    }
  },

  /**
   * Obtener todas las categorías
   * @returns Promise<Category[]>
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      return await apiClient.get<Category[]>(ENDPOINTS.CATEGORIES);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      return [];
    }
  },

  /**
   * Obtener items por rango de precio
   * @param minPrice - Precio mínimo
   * @param maxPrice - Precio máximo
   * @returns Promise<MenuItem[]>
   */
  getByPriceRange: async (
    minPrice: number,
    maxPrice: number
  ): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(ENDPOINTS.MENU, {
        params: {
          precio_min: minPrice,
          precio_max: maxPrice,
          disponible: true,
        },
      });
    } catch (error) {
      console.error("Error al obtener items por rango de precio:", error);
      return [];
    }
  },

  /**
   * Obtener items populares
   * @param limit - Límite de items
   * @returns Promise<MenuItem[]>
   */
  getPopular: async (limit: number = 10): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(ENDPOINTS.MENU_FEATURED, {
        params: { limit },
      });
    } catch (error) {
      console.error("Error al obtener items populares:", error);
      return [];
    }
  },

  /**
   * Verificar disponibilidad de un item
   * @param id - ID del item
   * @returns Promise<{disponible: boolean}>
   */
  checkAvailability: async (id: number): Promise<{ disponible: boolean }> => {
    try {
      return await apiClient.get<{ disponible: boolean }>(
        `${ENDPOINTS.MENU}/${id}/availability`
      );
    } catch (error) {
      console.error(`Error al verificar disponibilidad del item ${id}:`, error);
      return { disponible: false };
    }
  },

  /**
   * Obtener recomendaciones basadas en un item
   * @param itemId - ID del item base
   * @param limit - Límite de recomendaciones
   * @returns Promise<MenuItem[]>
   */
  getRecommendations: async (
    itemId: number,
    limit: number = 5
  ): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(
        `${ENDPOINTS.MENU}/${itemId}/recommendations`,
        {
          params: { limit },
        }
      );
    } catch (error) {
      console.error(
        `Error al obtener recomendaciones para item ${itemId}:`,
        error
      );
      return [];
    }
  },
};

/**
 * Exportación por defecto del módulo de endpoints de menú
 */
export default menuEndpoints;
