import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import { Pedido, PedidoFilter, PaginatedResponse } from "../types";

/**
 * Queries para obtener datos de pedidos
 * Optimizado para React Query con cacheo y refetch automático
 */
export const pedidosQueries = {
  /**
   * Obtener todos los pedidos con filtros
   * @param filters - Filtros opcionales
   * @returns Promise<Pedido[]>
   */
  getAll: async (filters?: Partial<PedidoFilter>): Promise<Pedido[]> => {
    try {
      const params = filters || {};
      return await apiClient.get<Pedido[]>(ENDPOINTS.PEDIDOS, { params });
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      throw error;
    }
  },

  /**
   * Obtener pedidos con paginación
   * @param page - Página actual
   * @param limit - Cantidad por página
   * @param filters - Filtros adicionales
   * @returns Promise<PaginatedResponse<Pedido>>
   */
  getPaginated: async (
    page: number = 1,
    limit: number = 10,
    filters?: Partial<PedidoFilter>
  ): Promise<PaginatedResponse<Pedido>> => {
    try {
      const params = { page, limit, ...filters };
      return await apiClient.get<PaginatedResponse<Pedido>>(
        `${ENDPOINTS.PEDIDOS}/paginado`,
        { params }
      );
    } catch (error) {
      console.error("Error al obtener pedidos paginados:", error);
      throw error;
    }
  },

  /**
   * Obtener un pedido por ID
   * @param id - ID del pedido
   * @returns Promise<Pedido>
   */
  getById: async (id: number): Promise<Pedido> => {
    try {
      return await apiClient.get<Pedido>(`${ENDPOINTS.PEDIDOS}/${id}`);
    } catch (error) {
      console.error(`Error al obtener pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener pedidos por estado
   * @param estado - Estado de los pedidos
   * @returns Promise<Pedido[]>
   */
  getByStatus: async (
    estado: "PENDIENTE" | "EN_PREPARACION" | "LISTO" | "ENTREGADO" | "CANCELADO"
  ): Promise<Pedido[]> => {
    try {
      return await apiClient.get<Pedido[]>(
        `${ENDPOINTS.PEDIDOS}/estado/${estado}`
      );
    } catch (error) {
      console.error(`Error al obtener pedidos con estado ${estado}:`, error);
      throw error;
    }
  },

  /**
   * Obtener pedidos por mesa
   * @param mesaId - ID de la mesa
   * @returns Promise<Pedido[]>
   */
  getByMesa: async (mesaId: number): Promise<Pedido[]> => {
    try {
      return await apiClient.get<Pedido[]>(
        `${ENDPOINTS.PEDIDOS}/mesa/${mesaId}`
      );
    } catch (error) {
      console.error(`Error al obtener pedidos de mesa ${mesaId}:`, error);
      throw error;
    }
  },

  /**
   * Obtener pedidos activos (no entregados ni cancelados)
   * @returns Promise<Pedido[]>
   */
  getActive: async (): Promise<Pedido[]> => {
    try {
      return await apiClient.get<Pedido[]>(`${ENDPOINTS.PEDIDOS}/activos`);
    } catch (error) {
      console.error("Error al obtener pedidos activos:", error);
      throw error;
    }
  },

  /**
   * Obtener historial de pedidos
   * @param fechaInicio - Fecha de inicio
   * @param fechaFin - Fecha de fin
   * @returns Promise<Pedido[]>
   */
  getHistory: async (
    fechaInicio: string,
    fechaFin: string
  ): Promise<Pedido[]> => {
    try {
      const params = { fechaInicio, fechaFin };
      return await apiClient.get<Pedido[]>(`${ENDPOINTS.PEDIDOS}/historial`, {
        params,
      });
    } catch (error) {
      console.error(`Error al obtener historial de pedidos:`, error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de pedidos
   * @param periodo - Periodo de estadísticas
   * @returns Promise<PedidoStats>
   */
  getStats: async (
    periodo: "hoy" | "semana" | "mes" | "año" = "hoy"
  ): Promise<{
    totalPedidos: number;
    pedidosPendientes: number;
    pedidosCompletados: number;
    pedidosCancelados: number;
    ingresoTotal: number;
    tiempoPromedioPreparacion: number;
    itemMasPedido: string;
  }> => {
    try {
      return await apiClient.get(
        `${ENDPOINTS.PEDIDOS}/estadisticas?periodo=${periodo}`
      );
    } catch (error) {
      console.error(`Error al obtener estadísticas de pedidos:`, error);
      throw error;
    }
  },

  /**
   * Obtener total de ventas por periodo
   * @param periodo - Periodo de consulta
   * @returns Promise<number>
   */
  getTotalSales: async (
    periodo: "hoy" | "semana" | "mes" | "año" = "hoy"
  ): Promise<number> => {
    try {
      const response = await apiClient.get<{ total: number }>(
        `${ENDPOINTS.PEDIDOS}/ventas-total?periodo=${periodo}`
      );
      return response.total;
    } catch (error) {
      console.error(`Error al obtener total de ventas:`, error);
      throw error;
    }
  },
};

export default pedidosQueries;
