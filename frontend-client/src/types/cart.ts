// Tipos específicos para el carrito (sin circular imports)

export interface CartFilters {
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
}

export interface CartSummary {
  items: any[]; // Usar any para evitar circular import
  total: number;
  cantidad_total: number;
  descuento?: number;
  impuestos?: number;
  total_final: number;
}

export interface CartOperations {
  addItem: (item: any) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, cantidad: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}
