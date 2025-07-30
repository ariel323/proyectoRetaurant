import { apiClient } from '../api';
import { Mesa } from '../types';

export class MesasService {
  private static instance: MesasService;
  
  public static getInstance(): MesasService {
    if (!MesasService.instance) {
      MesasService.instance = new MesasService();
    }
    return MesasService.instance;
  }

  async getMesas(): Promise<Mesa[]> {
    try {
      const mesas = await apiClient.get<Mesa[]>('/mesas');
      console.log(` ${mesas.length} mesas cargadas desde el backend`);
      return mesas;
    } catch (error) {
      console.error('Error loading mesas:', error);
      throw new Error('No se pudieron cargar las mesas disponibles.');
    }
  }

  async getMesasDisponibles(): Promise<Mesa[]> {
    try {
      const mesas = await this.getMesas();
      return mesas.filter(mesa => mesa.estado === 'LIBRE');
    } catch (error) {
      console.error('Error loading available mesas:', error);
      throw error;
    }
  }

  async getMesaPorId(id: number): Promise<Mesa> {
    try {
      return await apiClient.get<Mesa>(`/mesas/${id}`);
    } catch (error) {
      console.error(`Error loading mesa ${id}:`, error);
      throw new Error('No se pudo cargar la información de la mesa.');
    }
  }

  async verificarDisponibilidadMesa(mesaId: number): Promise<boolean> {
    try {
      const mesa = await this.getMesaPorId(mesaId);
      return mesa.estado === 'LIBRE';
    } catch (error) {
      console.error(`Error checking mesa ${mesaId} availability:`, error);
      return false;
    }
  }
}

export const mesasService = MesasService.getInstance();
