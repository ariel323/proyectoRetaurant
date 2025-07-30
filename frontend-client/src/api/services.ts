/**
 * Configuración centralizada de servicios de la API
 * Integra endpoints, queries y mutations en un servicio unificado
 */

// Importar todos los endpoints
import { menuEndpoints } from "./endpoints/menu";
import { menuNewEndpoints } from "./endpoints/menu_new";
import { mesasEndpoints } from "./endpoints/mesas";
import { pedidosEndpoints } from "./endpoints/pedidos";
import { usuariosEndpoints } from "./endpoints/usuarios";
import { dashboardEndpoints } from "./endpoints/dashboard";
import { analyticsEndpoints } from "./endpoints/analytics";

// Importar queries
import { menuQueries } from "./queries/menu";
import { pedidosQueries } from "./queries/pedidos";
import { mesasQueries } from "./queries/mesas";

// Importar mutations
import { cartMutations } from "./mutations/cart";
import { pedidosMutations } from "./mutations/pedidos";
import { mesasMutations } from "./mutations/mesas";

/**
 * Servicio completo de la API del restaurante
 * Proporciona acceso organizado a todas las operaciones
 */
export const apiServices = {
  // Servicios de lectura (queries)
  queries: {
    menu: menuQueries,
    pedidos: pedidosQueries,
    mesas: mesasQueries,
  },

  // Servicios de escritura (mutations)
  mutations: {
    cart: cartMutations,
    pedidos: pedidosMutations,
    mesas: mesasMutations,
  },

  // Endpoints especializados
  endpoints: {
    menu: menuEndpoints,
    menuNew: menuNewEndpoints,
    mesas: mesasEndpoints,
    pedidos: pedidosEndpoints,
    usuarios: usuariosEndpoints,
    dashboard: dashboardEndpoints,
    analytics: analyticsEndpoints,
  },

  // Operaciones híbridas comunes
  operations: {
    /**
     * Crear pedido completo con validaciones
     */
    createOrderWithValidation: async (orderData: any) => {
      try {
        // Validar mesa disponible
        const mesa = await mesasQueries.getById(orderData.mesa_id);
        if (mesa.estado !== "LIBRE") {
          throw new Error("La mesa no está disponible");
        }

        // Validar items del menú
        const menuItems = await Promise.all(
          orderData.items.map((item: any) => menuQueries.getById(item.itemId))
        );

        // Calcular total
        const total = menuItems.reduce((sum, item, index) => {
          return sum + item.precio * orderData.items[index].cantidad;
        }, 0);

        // Crear pedido
        const pedido = await pedidosMutations.create({
          ...orderData,
          total,
        });

        // Actualizar estado de la mesa
        await mesasMutations.occupy(orderData.mesa_id);

        return pedido;
      } catch (error) {
        console.error("Error en createOrderWithValidation:", error);
        throw error;
      }
    },

    /**
     * Completar pedido y liberar mesa
     */
    completeOrderAndReleaseTable: async (pedidoId: number) => {
      try {
        // Obtener pedido
        const pedido = await pedidosQueries.getById(pedidoId);

        // Marcar como entregado
        const pedidoActualizado = await pedidosMutations.markDelivered(
          pedidoId
        );

        // Liberar mesa - usar mesa_id en lugar de mesaId
        if (pedido.mesa_id) {
          await mesasMutations.liberate(pedido.mesa_id);
        }

        return pedidoActualizado;
      } catch (error) {
        console.error("Error en completeOrderAndReleaseTable:", error);
        throw error;
      }
    },

    /**
     * Obtener dashboard completo
     */
    getDashboardData: async () => {
      try {
        const [mesasStats, pedidosStats, ventasHoy, metricas] =
          await Promise.all([
            mesasQueries.getStats(),
            pedidosQueries.getStats("hoy"),
            pedidosQueries.getTotalSales("hoy"),
            analyticsEndpoints.getRealTimeMetrics(),
          ]);

        return {
          mesas: mesasStats,
          pedidos: pedidosStats,
          ventas: ventasHoy,
          metricas,
        };
      } catch (error) {
        console.error("Error en getDashboardData:", error);
        throw error;
      }
    },
  },
};

// Exportar como default para uso directo
export default apiServices;

// Exportar servicios individuales para uso específico
export {
  menuQueries,
  pedidosQueries,
  mesasQueries,
  cartMutations,
  pedidosMutations,
  mesasMutations,
  menuEndpoints,
  menuNewEndpoints,
  analyticsEndpoints,
};
