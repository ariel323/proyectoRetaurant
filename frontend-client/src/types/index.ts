// Tipos base que coinciden con el backend
export interface MenuItem {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  imagen?: string;
  disponible: boolean;
  tiempo_preparacion?: number;
  ingredientes?: string[];
  calorias?: number;
  vegetariano?: boolean;
  picante?: boolean;
  rating?: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  ubicacion: string;
  estado: "LIBRE" | "OCUPADA" | "RESERVADA";
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CartItem {
  id: string; // ID temporal para el carrito
  menuItem: MenuItem;
  cantidad: number;
  notas?: string;
  subtotal: number;
  precio: number; // Add precio property for calculations
}

export interface Cliente {
  nombre: string;
  telefono?: string;
  email?: string;
  notas?: string;
}

export interface Pedido {
  id?: number;
  mesa_id: number;
  cliente: Cliente;
  items: CartItem[];
  total: number;
  estado: "PENDIENTE" | "EN_PREPARACION" | "LISTO" | "ENTREGADO" | "CANCELADO";
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  notas?: string;
  tiempo_estimado?: number;
}

export interface Category {
  id: number | string;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  imagen?: string;
  icono?: string;
  cantidad_items: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

export interface CartState {
  items: CartItem[];
  total: number;
  cantidad_total: number;
  isOpen: boolean;
}

export interface CartActions {
  addItem: (menuItem: MenuItem, cantidad?: number, notas?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  updateNotes: (id: string, notas: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
}

// ========== TIPOS DE ERROR ==========

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// ========== TIPOS DE RESPUESTA ==========

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ========== TIPOS DE FILTROS ==========

export interface MenuFilter {
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
  vegetariano?: boolean;
  disponible?: boolean;
  search?: string;
}

export interface PedidoFilter {
  estado?: string;
  mesa_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface MesaFilter {
  estado?: string;
  capacidadMin?: number;
  capacidadMax?: number;
  ubicacion?: string;
}

// ========== TIPOS DE REQUEST ==========

export interface CreatePedidoRequest {
  mesa_id: number;
  cliente: Cliente;
  items: Array<{
    itemId: number;
    cantidad: number;
    notas?: string;
  }>;
  total: number;
  notas?: string;
}

export interface UpdatePedidoRequest {
  items?: Array<{
    itemId: number;
    cantidad: number;
    notas?: string;
  }>;
  estado?: Pedido["estado"];
  notas?: string;
  tiempo_estimado?: number;
}

export interface CreateMesaRequest {
  numero: number;
  capacidad?: number;
  ubicacion?: string;
}

export interface UpdateMesaRequest {
  numero?: number;
  estado?: Mesa["estado"];
  capacidad?: number;
  ubicacion?: string;
}

// ========== FUNCIONES DE VALIDACIÓN ==========

export const isApiError = (obj: any): obj is ApiError =>
  obj && typeof obj.message === "string" && typeof obj.status === "number";

export const isValidationError = (obj: any): obj is ValidationError =>
  obj && typeof obj.field === "string" && typeof obj.message === "string";

export const isPaginatedResponse = <T>(obj: any): obj is PaginatedResponse<T> =>
  obj &&
  Array.isArray(obj.data) &&
  obj.pagination &&
  typeof obj.pagination.page === "number";

// Re-exportar tipos específicos evitando conflictos circulares
export type { CartFilters, CartSummary } from "./cart";
