import { apiClient } from "../index";
import { ENDPOINTS } from "../config";
import { Mesa, CreateMesaRequest, UpdateMesaRequest } from "../types";

/**
 * Mutaciones para gestión de mesas
 * Incluye crear, actualizar, cambiar estado y gestionar disponibilidad
 */
export const mesasMutations = {
  /**
   * Crear una nueva mesa
   * @param mesaData - Datos de la mesa a crear
   * @returns Promise<Mesa>
   */
  create: async (mesaData: CreateMesaRequest): Promise<Mesa> => {
    try {
      const response = await apiClient.post<Mesa>(ENDPOINTS.MESAS, mesaData);
      return response;
    } catch (error) {
      console.error("Error al crear mesa:", error);
      throw error;
    }
  },

  /**
   * Actualizar una mesa existente
   * @param id - ID de la mesa
   * @param updateData - Datos a actualizar
   * @returns Promise<Mesa>
   */
  update: async (id: number, updateData: UpdateMesaRequest): Promise<Mesa> => {
    try {
      const response = await apiClient.put<Mesa>(
        `${ENDPOINTS.MESAS}/${id}`,
        updateData
      );
      return response;
    } catch (error) {
      console.error(`Error al actualizar mesa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar una mesa
   * @param id - ID de la mesa a eliminar
   * @returns Promise<{ success: boolean; message: string }>
   */
  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(`${ENDPOINTS.MESAS}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar mesa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cambiar estado de una mesa
   * @param id - ID de la mesa
   * @param estado - Nuevo estado
   * @returns Promise<Mesa>
   */
  changeStatus: async (
    id: number,
    estado: "LIBRE" | "OCUPADA" | "RESERVADA" | "MANTENIMIENTO"
  ): Promise<Mesa> => {
    try {
      const response = await apiClient.patch<Mesa>(
        `${ENDPOINTS.MESAS}/${id}/estado`,
        { estado }
      );
      return response;
    } catch (error) {
      console.error(
        `Error al cambiar estado de mesa ${id} a ${estado}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Reservar una mesa
   * @param id - ID de la mesa
   * @param reservaData - Datos de la reserva
   * @returns Promise<Mesa>
   */
  reserve: async (
    id: number,
    reservaData: {
      nombreCliente: string;
      telefono?: string;
      fechaReserva: string;
      duracionEstimada?: number;
      comentarios?: string;
    }
  ): Promise<Mesa> => {
    try {
      const response = await apiClient.post<Mesa>(
        `${ENDPOINTS.MESAS}/${id}/reservar`,
        reservaData
      );
      return response;
    } catch (error) {
      console.error(`Error al reservar mesa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Liberar una mesa (cambiar a estado LIBRE)
   * @param id - ID de la mesa
   * @returns Promise<Mesa>
   */
  liberate: async (id: number): Promise<Mesa> => {
    try {
      const response = await apiClient.patch<Mesa>(
        `${ENDPOINTS.MESAS}/${id}/liberar`
      );
      return response;
    } catch (error) {
      console.error(`Error al liberar mesa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Ocupar una mesa (cambiar a estado OCUPADA)
   * @param id - ID de la mesa
   * @returns Promise<Mesa>
   */
  occupy: async (id: number): Promise<Mesa> => {
    try {
      const response = await apiClient.patch<Mesa>(
        `${ENDPOINTS.MESAS}/${id}/ocupar`
      );
      return response;
    } catch (error) {
      console.error(`Error al ocupar mesa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Marcar mesa en mantenimiento
   * @param id - ID de la mesa
   * @param motivo - Motivo del mantenimiento
   * @returns Promise<Mesa>
   */
  setMaintenance: async (id: number, motivo?: string): Promise<Mesa> => {
    try {
      const response = await apiClient.patch<Mesa>(
        `${ENDPOINTS.MESAS}/${id}/mantenimiento`,
        { motivo }
      );
      return response;
    } catch (error) {
      console.error(`Error al marcar mesa ${id} en mantenimiento:`, error);
      throw error;
    }
  },
};

export default mesasMutations;
