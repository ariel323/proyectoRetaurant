import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import { MenuItem, Category, MenuFilter, ApiResponse, ApiError } from "../types";

/**
 * Endpoints avanzados para gestión del menú del restaurante
 * Incluye funcionalidades como filtrado, categorías y búsqueda
 * Optimizado para el frontend-client con mejores capacidades
 */
export const menuNewEndpoints = {
  /**
   * Obtener todos los items del menú con filtros avanzados
   * @param filters - Filtros avanzados para la búsqueda
   * @returns Promise<MenuItem[]>
   */
  getAllWithFilters: async (filters?: {
    categoria?: string;
    precioMin?: number;
    precioMax?: number;
    busqueda?: string;
    disponible?: boolean;
    ordenarPor?: 'nombre' | 'precio' | 'categoria';
    orden?: 'asc' | 'desc';
    limite?: number;
    pagina?: number;
  }): Promise<MenuItem[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters?.categoria) params.append('categoria', filters.categoria);
      if (filters?.precioMin !== undefined) params.append('precioMin', filters.precioMin.toString());
      if (filters?.precioMax !== undefined) params.append('precioMax', filters.precioMax.toString());
      if (filters?.busqueda) params.append('busqueda', filters.busqueda);
      if (filters?.disponible !== undefined) params.append('disponible', filters.disponible.toString());
      if (filters?.ordenarPor) params.append('ordenarPor', filters.ordenarPor);
      if (filters?.orden) params.append('orden', filters.orden);
      if (filters?.limite) params.append('limite', filters.limite.toString());
      if (filters?.pagina) params.append('pagina', filters.pagina.toString());

      return await apiClient.get<MenuItem[]>(`${ENDPOINTS.MENU}?${params.toString()}`);
    } catch (error) {
      console.error("Error al obtener menú con filtros:", error);
      throw error;
    }
  },

  /**
   * Obtener todas las categorías disponibles
   * @returns Promise<Category[]>
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      return await apiClient.get<Category[]>(`${ENDPOINTS.MENU}/categorias`);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
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
      return await apiClient.get<MenuItem[]>(`${ENDPOINTS.MENU}/categoria/${encodeURIComponent(categoria)}`);
    } catch (error) {
      console.error(`Error al obtener menú por categoría ${categoria}:`, error);
      throw error;
    }
  },

  /**
   * Buscar items del menú por nombre
   * @param termino - Término de búsqueda
   * @returns Promise<MenuItem[]>
   */
  search: async (termino: string): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(`${ENDPOINTS.MENU}/buscar?q=${encodeURIComponent(termino)}`);
    } catch (error) {
      console.error(`Error en búsqueda de menú con término ${termino}:`, error);
      throw error;
    }
  },

  /**
   * Obtener items del menú más populares
   * @param limite - Cantidad de items a retornar
   * @returns Promise<MenuItem[]>
   */
  getPopular: async (limite: number = 10): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(`${ENDPOINTS.MENU}/popular?limite=${limite}`);
    } catch (error) {
      console.error("Error al obtener items populares:", error);
      throw error;
    }
  },

  /**
   * Obtener detalles de un item específico del menú
   * @param id - ID del item
   * @returns Promise<MenuItem>
   */
  getById: async (id: number): Promise<MenuItem> => {
    try {
      return await apiClient.get<MenuItem>(`${ENDPOINTS.MENU}/${id}`);
    } catch (error) {
      console.error(`Error al obtener item del menú con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener items del menú dentro de un rango de precios
   * @param precioMin - Precio mínimo
   * @param precioMax - Precio máximo
   * @returns Promise<MenuItem[]>
   */
  getByPriceRange: async (precioMin: number, precioMax: number): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(`${ENDPOINTS.MENU}/precio-rango?min=${precioMin}&max=${precioMax}`);
    } catch (error) {
      console.error(`Error al obtener menú por rango de precios ${precioMin}-${precioMax}:`, error);
      throw error;
    }
  },

  /**
   * Obtener items del menú recomendados
   * @param basadoEn - Criterio de recomendación
   * @returns Promise<MenuItem[]>
   */
  getRecommended: async (basadoEn: 'popular' | 'precio' | 'categoria' = 'popular'): Promise<MenuItem[]> => {
    try {
      return await apiClient.get<MenuItem[]>(`${ENDPOINTS.MENU}/recomendados?basadoEn=${basadoEn}`);
    } catch (error) {
      console.error(`Error al obtener recomendaciones basadas en ${basadoEn}:`, error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas del menú
   * @returns Promise<MenuStats>
   */
  getStats: async (): Promise<{
    totalItems: number;
    totalCategorias: number;
    precioPromedio: number;
    itemMasCaroy: MenuItem;
    itemMasBarato: MenuItem;
    categoriaPopular: string;
  }> => {
    try {
      return await apiClient.get(`${ENDPOINTS.MENU}/estadisticas`);
    } catch (error) {
      console.error("Error al obtener estadísticas del menú:", error);
      throw error;
    }
  }
};

// Exportar como default también para compatibilidad
export default menuNewEndpoints;