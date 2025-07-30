import { CartItem, CartState, MenuItem } from "../../types";

/**
 * Mutations para gestión del carrito de compras
 * Maneja operaciones locales del carrito sin API calls
 */
export const cartMutations = {
  /**
   * Agregar item al carrito
   * @param cartState - Estado actual del carrito
   * @param item - Item a agregar
   * @returns Nuevo estado del carrito
   */
  addItem: (cartState: CartState, item: CartItem): CartState => {
    const existingItemIndex = cartState.items.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex >= 0) {
      // Si el item ya existe, aumentar cantidad
      const updatedItems = [...cartState.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        cantidad: updatedItems[existingItemIndex].cantidad + item.cantidad,
      };

      return {
        ...cartState,
        items: updatedItems,
        total: cartState.total + item.precio * item.cantidad,
        cantidad_total: cartState.cantidad_total + item.cantidad,
      };
    } else {
      // Si es un item nuevo, agregarlo
      return {
        ...cartState,
        items: [...cartState.items, item],
        total: cartState.total + item.precio * item.cantidad,
        cantidad_total: cartState.cantidad_total + item.cantidad,
      };
    }
  },

  /**
   * Remover item del carrito
   * @param cartState - Estado actual del carrito
   * @param itemId - ID del item a remover
   * @returns Nuevo estado del carrito
   */
  removeItem: (cartState: CartState, itemId: string): CartState => {
    const itemToRemove = cartState.items.find((item) => item.id === itemId);

    if (!itemToRemove) return cartState;

    return {
      ...cartState,
      items: cartState.items.filter((item) => item.id !== itemId),
      total: cartState.total - itemToRemove.precio * itemToRemove.cantidad,
      cantidad_total: cartState.cantidad_total - itemToRemove.cantidad,
    };
  },

  /**
   * Actualizar cantidad de un item
   * @param cartState - Estado actual del carrito
   * @param itemId - ID del item a actualizar
   * @param nuevaCantidad - Nueva cantidad
   * @returns Nuevo estado del carrito
   */
  updateItemQuantity: (
    cartState: CartState,
    itemId: string,
    nuevaCantidad: number
  ): CartState => {
    if (nuevaCantidad <= 0) {
      return cartMutations.removeItem(cartState, itemId);
    }

    const itemIndex = cartState.items.findIndex((item) => item.id === itemId);

    if (itemIndex < 0) return cartState;

    const item = cartState.items[itemIndex];
    const diferenciaCantidad = nuevaCantidad - item.cantidad;

    const updatedItems = [...cartState.items];
    updatedItems[itemIndex] = {
      ...item,
      cantidad: nuevaCantidad,
    };

    return {
      ...cartState,
      items: updatedItems,
      total: cartState.total + item.precio * diferenciaCantidad,
      cantidad_total: cartState.cantidad_total + diferenciaCantidad,
    };
  },

  /**
   * Limpiar carrito
   * @returns Estado vacío del carrito
   */
  clearCart: (): CartState => ({
    items: [],
    total: 0,
    cantidad_total: 0,
    isOpen: false,
  }),

  /**
   * Aplicar descuento al carrito
   * @param cartState - Estado actual del carrito
   * @param descuentoPorcentaje - Porcentaje de descuento (0-100)
   * @returns Nuevo estado del carrito con descuento aplicado
   */
  applyDiscount: (
    cartState: CartState,
    descuentoPorcentaje: number
  ): CartState => {
    const descuento = (cartState.total * descuentoPorcentaje) / 100;
    return {
      ...cartState,
      total: Math.max(0, cartState.total - descuento),
    };
  },

  /**
   * Toggle visibilidad del carrito
   * @param cartState - Estado actual del carrito
   * @returns Estado con visibilidad toggled
   */
  toggleCart: (cartState: CartState): CartState => ({
    ...cartState,
    isOpen: !cartState.isOpen,
  }),
};

export default cartMutations;
