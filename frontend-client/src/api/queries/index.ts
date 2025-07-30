/**
 * Índice central de todas las queries de la API
 * Proporciona operaciones de lectura optimizadas para React Query
 */

export { default as menuQueries } from "./menu";
export { default as pedidosQueries } from "./pedidos";
export { default as mesasQueries } from "./mesas";

// Re-exportar tipos específicos de queries si es necesario
export type {
  MenuFilter,
  PedidoFilter,
  MesaFilter,
  PaginatedResponse,
} from "../types";
