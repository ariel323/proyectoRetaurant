import { MenuItem, Mesa, Cliente, CartItem } from "./index";

export interface Pedido {
  id?: number;
  mesa_id: number;
  mesa?: Mesa;
  cliente: Cliente;
  items: CartItem[];
  total: number;
  estado: "PENDIENTE" | "EN_PREPARACION" | "LISTO" | "ENTREGADO" | "CANCELADO";
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  notas?: string;
}

export interface PedidoFilters {
  estado?: string;
  mesa_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface PedidoStats {
  total_pedidos: number;
  total_ventas: number;
  pedidos_pendientes: number;
  pedidos_completados: number;
}

// Export related types
export type { MenuItem, Mesa, Cliente, CartItem };
