import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import { Pedido, CreatePedidoRequest, UpdatePedidoRequest } from "../types";

/**
 * Mutaciones para gestión de pedidos
 * Incluye crear, actualizar, cancelar y gestionar estado de pedidos
 */
export const pedidosMutations = {
  /**
   * Crear un nuevo pedido
   * @param pedidoData - Datos del pedido a crear
   * @returns Promise<Pedido>
   */
  create: async (pedidoData: CreatePedidoRequest): Promise<Pedido> => {
    try {
      const response = await apiClient.post<Pedido>(
        ENDPOINTS.PEDIDOS,
        pedidoData
      );
      return response;
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
      const response = await apiClient.put<Pedido>(
        `${ENDPOINTS.PEDIDOS}/${id}`,
        updateData
      );
      return response;
    } catch (error) {
      console.error(`Error al actualizar pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancelar un pedido
   * @param id - ID del pedido a cancelar
   * @returns Promise<{ success: boolean; message: string }>
   */
  cancel: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.patch<{
        success: boolean;
        message: string;
      }>(`${ENDPOINTS.PEDIDOS}/${id}/cancelar`);
      return response;
    } catch (error) {
      console.error(`Error al cancelar pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Confirmar un pedido
   * @param id - ID del pedido a confirmar
   * @returns Promise<Pedido>
   */
  confirm: async (id: number): Promise<Pedido> => {
    try {
      const response = await apiClient.patch<Pedido>(
        `${ENDPOINTS.PEDIDOS}/${id}/confirmar`
      );
      return response;
    } catch (error) {
      console.error(`Error al confirmar pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Marcar pedido como listo
   * @param id - ID del pedido
   * @returns Promise<Pedido>
   */
  markReady: async (id: number): Promise<Pedido> => {
    try {
      const response = await apiClient.patch<Pedido>(
        `${ENDPOINTS.PEDIDOS}/${id}/listo`
      );
      return response;
    } catch (error) {
      console.error(`Error al marcar pedido ${id} como listo:`, error);
      throw error;
    }
  },

  /**
   * Marcar pedido como entregado
   * @param id - ID del pedido
   * @returns Promise<Pedido>
   */
  markDelivered: async (id: number): Promise<Pedido> => {
    try {
      const response = await apiClient.patch<Pedido>(
        `${ENDPOINTS.PEDIDOS}/${id}/entregado`
      );
      return response;
    } catch (error) {
      console.error(`Error al marcar pedido ${id} como entregado:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un pedido
   * @param id - ID del pedido a eliminar
   * @returns Promise<{ success: boolean; message: string }>
   */
  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(`${ENDPOINTS.PEDIDOS}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Agregar items a un pedido existente
   * @param id - ID del pedido
   * @param items - Items a agregar
   * @returns Promise<Pedido>
   */
  addItems: async (
    id: number,
    items: Array<{ itemId: number; cantidad: number }>
  ): Promise<Pedido> => {
    try {
      const response = await apiClient.post<Pedido>(
        `${ENDPOINTS.PEDIDOS}/${id}/items`,
        { items }
      );
      return response;
    } catch (error) {
      console.error(`Error al agregar items al pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Remover items de un pedido
   * @param id - ID del pedido
   * @param itemIds - IDs de los items a remover
   * @returns Promise<Pedido>
   */
  removeItems: async (id: number, itemIds: number[]): Promise<Pedido> => {
    try {
      const response = await apiClient.delete<Pedido>(
        `${ENDPOINTS.PEDIDOS}/${id}/items`,
        { data: { itemIds } }
      );
      return response;
    } catch (error) {
      console.error(`Error al remover items del pedido ${id}:`, error);
      throw error;
    }
  },
};

export default pedidosMutations;
