/**
 * Índice central de todas las mutaciones de la API
 * Proporciona operaciones de escritura (POST, PUT, PATCH, DELETE)
 */

export { default as cartMutations } from "./cart";
export { default as pedidosMutations } from "./pedidos";
export { default as mesasMutations } from "./mesas";

// Re-exportar tipos específicos de mutaciones si es necesario
export type {
  CreatePedidoRequest,
  UpdatePedidoRequest,
  CreateMesaRequest,
  UpdateMesaRequest,
} from "../types";
