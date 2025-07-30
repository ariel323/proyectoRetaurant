import { apiClient } from "../index";
import { ENDPOINTS } from "../config";

/**
 * Endpoints para análisis y reportes del restaurante
 * Proporciona métricas y estadísticas generales
 */
export const analyticsEndpoints = {
  /**
   * Obtener resumen de ventas diarias
   * @param fecha - Fecha específica (YYYY-MM-DD)
   * @returns Promise<DailySalesReport>
   */
  getDailySales: async (
    fecha?: string
  ): Promise<{
    fecha: string;
    totalVentas: number;
    totalPedidos: number;
    pedidosCompletados: number;
    pedidosCancelados: number;
    itemMasVendido: string;
    horasPico: string[];
    ingresoPromedioPorPedido: number;
  }> => {
    try {
      const params = fecha ? { fecha } : {};
      return await apiClient.get("/api/analytics/ventas-diarias", { params });
    } catch (error) {
      console.error("Error al obtener ventas diarias:", error);
      throw error;
    }
  },

  /**
   * Obtener análisis de productos populares
   * @param periodo - Periodo de análisis
   * @returns Promise<ProductAnalysis[]>
   */
  getPopularProducts: async (
    periodo: "semana" | "mes" | "año" = "mes"
  ): Promise<
    Array<{
      itemId: number;
      nombre: string;
      categoria: string;
      cantidadVendida: number;
      ingresoGenerado: number;
      porcentajeVentas: number;
    }>
  > => {
    try {
      return await apiClient.get(
        `/api/analytics/productos-populares?periodo=${periodo}`
      );
    } catch (error) {
      console.error("Error al obtener productos populares:", error);
      throw error;
    }
  },

  /**
   * Obtener análisis de ocupación de mesas
   * @param fecha - Fecha específica
   * @returns Promise<TableOccupancyReport>
   */
  getTableOccupancy: async (
    fecha?: string
  ): Promise<{
    fecha: string;
    porcentajeOcupacionPromedio: number;
    mesaMasUsada: number;
    mesaMenosUsada: number;
    horasPico: Array<{ hora: string; ocupacion: number }>;
    tiempoPromedioOcupacion: number;
  }> => {
    try {
      const params = fecha ? { fecha } : {};
      return await apiClient.get("/api/analytics/ocupacion-mesas", { params });
    } catch (error) {
      console.error("Error al obtener análisis de ocupación:", error);
      throw error;
    }
  },

  /**
   * Obtener tendencias de ventas
   * @param periodo - Periodo de análisis
   * @returns Promise<SalesTrends>
   */
  getSalesTrends: async (
    periodo: "semanal" | "mensual" | "anual" = "mensual"
  ): Promise<{
    periodo: string;
    datos: Array<{
      fecha: string;
      ventas: number;
      pedidos: number;
      crecimientoPorcentual: number;
    }>;
    tendenciaGeneral: "creciente" | "decreciente" | "estable";
    proyeccionProximoPeriodo: number;
  }> => {
    try {
      return await apiClient.get(
        `/api/analytics/tendencias-ventas?periodo=${periodo}`
      );
    } catch (error) {
      console.error("Error al obtener tendencias de ventas:", error);
      throw error;
    }
  },

  /**
   * Obtener métricas en tiempo real
   * @returns Promise<RealTimeMetrics>
   */
  getRealTimeMetrics: async (): Promise<{
    mesasOcupadas: number;
    pedidosActivos: number;
    ventasHoy: number;
    clientesAtendidos: number;
    tiempoEsperaPromedio: number;
    eficienciaCocina: number;
  }> => {
    try {
      return await apiClient.get("/api/analytics/metricas-tiempo-real");
    } catch (error) {
      console.error("Error al obtener métricas en tiempo real:", error);
      throw error;
    }
  },
};

export default analyticsEndpoints;
