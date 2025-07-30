import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import {
  Pedido,
  CreatePedidoRequest,
  UpdatePedidoRequest,
  PedidoFilter,
  OperationResponse,
  ApiResponse,
} from "../types";

/**
 * Endpoints para gestión de pedidos del restaurante
 * Optimizado para el frontend-client
 */
export const pedidosEndpoints = {
  /**
   * Obtener todos los pedidos (con filtros opcionales)
   * @param filters - Filtros para la consulta
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
   * @param limit - Límite de pedidos por página
   * @param filters - Filtros opcionales
   * @returns Promise<PaginatedResponse<Pedido>>
   */
  getPaginated: async (
    page: number = 1,
    limit: number = 10,
    filters?: Partial<PedidoFilter>
  ): Promise<ApiResponse<Pedido[]>> => {
    try {
      return await apiClient.paginate<Pedido>(
        ENDPOINTS.PEDIDOS,
        page,
        limit,
        filters
      );
    } catch (error) {
      console.error("Error al obtener pedidos paginados:", error);
      throw error;
    }
  },

  /**
   * Obtener pedido por ID
   * @param id - ID del pedido
   * @returns Promise<Pedido>
   */
  getById: async (id: number): Promise<Pedido> => {
    try {
      return await apiClient.get<Pedido>(ENDPOINTS.PEDIDO_BY_ID(id));
    } catch (error) {
      console.error(`Error al obtener pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo pedido
   * @param pedidoData - Datos del pedido a crear
   * @returns Promise<Pedido>
   */
  create: async (pedidoData: CreatePedidoRequest): Promise<Pedido> => {
    try {
      // Validar datos antes de enviar
      if (!pedidoData.mesa_id) {
        throw new Error("Mesa ID es requerido");
      }

      if (!pedidoData.items || pedidoData.items.length === 0) {
        throw new Error("Al menos un item es requerido");
      }

      if (!pedidoData.cliente.nombre.trim()) {
        throw new Error("Nombre del cliente es requerido");
      }

      return await apiClient.post<Pedido>(ENDPOINTS.PEDIDO_CREATE, pedidoData);
    } catch (error) {
      console.error("Error al crear pedido:", error);
      throw error;
    }
  },

  /**
   * Actualizar un pedido existente
   * @param id - ID del pedido
   * @param updateData - Datos a actualizar
   * @returns Promise<Pedido>
   */
  update: async (
    id: number,
    updateData: UpdatePedidoRequest
  ): Promise<Pedido> => {
    try {
      return await apiClient.put<Pedido>(
        ENDPOINTS.PEDIDO_UPDATE(id),
        updateData
      );
    } catch (error) {
      console.error(`Error al actualizar pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancelar un pedido
   * @param id - ID del pedido
   * @param motivo - Motivo de cancelación (opcional)
   * @returns Promise<OperationResponse>
   */
  cancel: async (id: number, motivo?: string): Promise<OperationResponse> => {
    try {
      const data = motivo ? { motivo } : {};
      return await apiClient.patch<OperationResponse>(
        ENDPOINTS.PEDIDO_CANCEL(id),
        data
      );
    } catch (error) {
      console.error(`Error al cancelar pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener pedidos por mesa
   * @param mesaId - ID de la mesa
   * @param incluirHistorial - Incluir pedidos anteriores
   * @returns Promise<Pedido[]>
   */
  getByMesa: async (
    mesaId: number,
    incluirHistorial: boolean = false
  ): Promise<Pedido[]> => {
    try {
      const params = incluirHistorial ? { incluir_historial: true } : {};
      return await apiClient.get<Pedido[]>(`/pedidos/mesa/${mesaId}`, {
        params,
      });
    } catch (error) {
      console.error(`Error al obtener pedidos de mesa ${mesaId}:`, error);
      return [];
    }
  },

  /**
   * Obtener pedidos por estado
   * @param estado - Estado de los pedidos
   * @param limit - Límite de resultados (opcional)
   * @returns Promise<Pedido[]>
   */
  getByStatus: async (
    estado:
      | "PENDIENTE"
      | "CONFIRMADO"
      | "PREPARANDO"
      | "LISTO"
      | "ENTREGADO"
      | "CANCELADO",
    limit?: number
  ): Promise<Pedido[]> => {
    try {
      const params: any = { estado };
      if (limit) params.limit = limit;

      return await apiClient.get<Pedido[]>(ENDPOINTS.PEDIDOS, { params });
    } catch (error) {
      console.error(`Error al obtener pedidos con estado ${estado}:`, error);
      return [];
    }
  },

  /**
   * Obtener pedidos activos (no entregados ni cancelados)
   * @param mesaId - ID de mesa específica (opcional)
   * @returns Promise<Pedido[]>
   */
  getActive: async (mesaId?: number): Promise<Pedido[]> => {
    try {
      const params: any = {
        estado_not_in: "ENTREGADO,CANCELADO",
      };

      if (mesaId) params.mesa_id = mesaId;

      return await apiClient.get<Pedido[]>(ENDPOINTS.PEDIDOS, { params });
    } catch (error) {
      console.error("Error al obtener pedidos activos:", error);
      return [];
    }
  },

  /**
   * Obtener historial de pedidos por cliente
   * @param clienteInfo - Información del cliente (nombre, teléfono o email)
   * @param limit - Límite de resultados
   * @returns Promise<Pedido[]>
   */
  getByCustomer: async (
    clienteInfo: { nombre?: string; telefono?: string; email?: string },
    limit: number = 10
  ): Promise<Pedido[]> => {
    try {
      const params = { ...clienteInfo, limit };
      return await apiClient.get<Pedido[]>("/pedidos/customer", { params });
    } catch (error) {
      console.error("Error al obtener pedidos por cliente:", error);
      return [];
    }
  },

  /**
   * Obtener tiempo de espera estimado para un pedido
   * @param pedidoData - Datos del pedido para calcular tiempo
   * @returns Promise<{tiempo_estimado_minutos: number}>
   */
  getEstimatedTime: async (pedidoData: {
    mesa_id: number;
    items: { menu_item_id: number; cantidad: number }[];
  }): Promise<{ tiempo_estimado_minutos: number }> => {
    try {
      return await apiClient.post<{ tiempo_estimado_minutos: number }>(
        "/pedidos/estimate-time",
        pedidoData
      );
    } catch (error) {
      console.error("Error al obtener tiempo estimado:", error);
      return { tiempo_estimado_minutos: 20 }; // Valor por defecto
    }
  },

  /**
   * Calcular total de un pedido antes de crearlo
   * @param items - Items del pedido
   * @returns Promise<{subtotal: number, impuestos: number, total: number}>
   */
  calculateTotal: async (
    items: {
      menu_item_id: number;
      cantidad: number;
    }[]
  ): Promise<{
    subtotal: number;
    impuestos: number;
    total: number;
    desglose: {
      item_id: number;
      nombre: string;
      cantidad: number;
      precio_unitario: number;
      subtotal: number;
    }[];
  }> => {
    try {
      return await apiClient.post<{
        subtotal: number;
        impuestos: number;
        total: number;
        desglose: {
          item_id: number;
          nombre: string;
          cantidad: number;
          precio_unitario: number;
          subtotal: number;
        }[];
      }>("/pedidos/calculate-total", { items });
    } catch (error) {
      console.error("Error al calcular total:", error);
      throw error;
    }
  },

  /**
   * Validar disponibilidad de items antes de crear pedido
   * @param items - Items a validar
   * @returns Promise<{valido: boolean, items_no_disponibles: number[]}>
   */
  validateItems: async (
    items: {
      menu_item_id: number;
      cantidad: number;
    }[]
  ): Promise<{
    valido: boolean;
    items_no_disponibles: number[];
    mensajes: string[];
  }> => {
    try {
      return await apiClient.post<{
        valido: boolean;
        items_no_disponibles: number[];
        mensajes: string[];
      }>("/pedidos/validate-items", { items });
    } catch (error) {
      console.error("Error al validar items:", error);
      return {
        valido: false,
        items_no_disponibles: [],
        mensajes: ["Error al validar disponibilidad"],
      };
    }
  },

  /**
   * Obtener estado de un pedido en tiempo real
   * @param id - ID del pedido
   * @returns Promise<{estado: string, tiempo_restante?: number, siguiente_paso?: string}>
   */
  getStatus: async (
    id: number
  ): Promise<{
    estado: string;
    tiempo_restante?: number;
    siguiente_paso?: string;
    ubicacion_actual?: string;
  }> => {
    try {
      return await apiClient.get<{
        estado: string;
        tiempo_restante?: number;
        siguiente_paso?: string;
        ubicacion_actual?: string;
      }>(`/pedidos/${id}/status`);
    } catch (error) {
      console.error(`Error al obtener estado del pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener pedidos recientes para mostrar en dashboard
   * @param limit - Número de pedidos a mostrar
   * @returns Promise<Pedido[]>
   */
  getRecent: async (limit: number = 5): Promise<Pedido[]> => {
    try {
      const params = {
        limit,
        sortBy: "fecha_creacion",
        sortOrder: "desc",
      };

      return await apiClient.get<Pedido[]>(ENDPOINTS.PEDIDOS, { params });
    } catch (error) {
      console.error("Error al obtener pedidos recientes:", error);
      return [];
    }
  },

  /**
   * Obtener estadísticas de pedidos
   * @param periodo - Periodo para las estadísticas
   * @returns Promise<{total: number, por_estado: any, promedio_tiempo: number}>
   */
  getStats: async (
    periodo: "dia" | "semana" | "mes" = "dia"
  ): Promise<{
    total: number;
    por_estado: Record<string, number>;
    promedio_tiempo: number;
    ticket_promedio: number;
  }> => {
    try {
      const params = { periodo };
      return await apiClient.get<{
        total: number;
        por_estado: Record<string, number>;
        promedio_tiempo: number;
        ticket_promedio: number;
      }>("/pedidos/stats", { params });
    } catch (error) {
      console.error("Error al obtener estadísticas de pedidos:", error);
      return {
        total: 0,
        por_estado: {},
        promedio_tiempo: 0,
        ticket_promedio: 0,
      };
    }
  },
};

export default pedidosEndpoints;
