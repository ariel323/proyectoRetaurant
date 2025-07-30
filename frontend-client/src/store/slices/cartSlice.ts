import { CartItem, MenuItem } from "../../types";

// State interface
export interface CartState {
  items: CartItem[];
  total: number;
  cantidad_total: number;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  lastAddedItem: CartItem | null;
}

// Action types
export const CART_ACTION_TYPES = {
  ADD_ITEM: "cart/addItem",
  REMOVE_ITEM: "cart/removeItem",
  UPDATE_QUANTITY: "cart/updateQuantity",
  UPDATE_NOTES: "cart/updateNotes",
  CLEAR_CART: "cart/clearCart",
  TOGGLE_CART: "cart/toggleCart",
  OPEN_CART: "cart/openCart",
  CLOSE_CART: "cart/closeCart",
  SET_LOADING: "cart/setLoading",
  SET_ERROR: "cart/setError",
  CLEAR_ERROR: "cart/clearError",
  SET_LAST_ADDED: "cart/setLastAdded",
} as const;

// Action types
export type CartAction =
  | {
      type: typeof CART_ACTION_TYPES.ADD_ITEM;
      payload: { menuItem: MenuItem; cantidad?: number; notas?: string };
    }
  | { type: typeof CART_ACTION_TYPES.REMOVE_ITEM; payload: string }
  | {
      type: typeof CART_ACTION_TYPES.UPDATE_QUANTITY;
      payload: { id: string; cantidad: number };
    }
  | {
      type: typeof CART_ACTION_TYPES.UPDATE_NOTES;
      payload: { id: string; notas: string };
    }
  | { type: typeof CART_ACTION_TYPES.CLEAR_CART }
  | { type: typeof CART_ACTION_TYPES.TOGGLE_CART }
  | { type: typeof CART_ACTION_TYPES.OPEN_CART }
  | { type: typeof CART_ACTION_TYPES.CLOSE_CART }
  | { type: typeof CART_ACTION_TYPES.SET_LOADING; payload: boolean }
  | { type: typeof CART_ACTION_TYPES.SET_ERROR; payload: string }
  | { type: typeof CART_ACTION_TYPES.CLEAR_ERROR }
  | { type: typeof CART_ACTION_TYPES.SET_LAST_ADDED; payload: CartItem | null };

// Initial state
export const initialCartState: CartState = {
  items: [],
  total: 0,
  cantidad_total: 0,
  isOpen: false,
  loading: false,
  error: null,
  lastAddedItem: null,
};

// Helper functions
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const cantidad_total = items.reduce((sum, item) => sum + item.cantidad, 0);
  return { total, cantidad_total };
};

const generateCartItemId = (menuItem: MenuItem, notas: string = "") => {
  return `${menuItem.id}-${Date.now()}-${notas.slice(0, 10)}`;
};

// Reducer
export const cartReducer = (
  state: CartState = initialCartState,
  action: CartAction
): CartState => {
  switch (action.type) {
    case CART_ACTION_TYPES.ADD_ITEM: {
      const { menuItem, cantidad = 1, notas = "" } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.menuItem.id === menuItem.id && item.notas === notas
      );

      let newItems: CartItem[];
      let lastAddedItem: CartItem;

      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                subtotal: (item.cantidad + cantidad) * item.menuItem.precio,
              }
            : item
        );
        lastAddedItem = newItems[existingItemIndex];
      } else {
        // Add new item
        lastAddedItem = {
          id: generateCartItemId(menuItem, notas),
          menuItem,
          cantidad,
          notas,
          subtotal: menuItem.precio * cantidad,
          precio: menuItem.precio,
        };
        newItems = [...state.items, lastAddedItem];
      }

      const { total, cantidad_total } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        total,
        cantidad_total,
        lastAddedItem,
        error: null,
      };
    }

    case CART_ACTION_TYPES.REMOVE_ITEM: {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const { total, cantidad_total } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        total,
        cantidad_total,
        error: null,
      };
    }

    case CART_ACTION_TYPES.UPDATE_QUANTITY: {
      const { id, cantidad } = action.payload;

      if (cantidad <= 0) {
        // Remove item if quantity is 0 or less
        const newItems = state.items.filter((item) => item.id !== id);
        const { total, cantidad_total } = calculateTotals(newItems);

        return {
          ...state,
          items: newItems,
          total,
          cantidad_total,
        };
      }

      const newItems = state.items.map((item) =>
        item.id === id
          ? { ...item, cantidad, subtotal: item.menuItem.precio * cantidad }
          : item
      );

      const { total, cantidad_total } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        total,
        cantidad_total,
      };
    }

    case CART_ACTION_TYPES.UPDATE_NOTES: {
      const { id, notas } = action.payload;
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, notas } : item
      );

      return {
        ...state,
        items: newItems,
      };
    }

    case CART_ACTION_TYPES.CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0,
        cantidad_total: 0,
        lastAddedItem: null,
        error: null,
      };

    case CART_ACTION_TYPES.TOGGLE_CART:
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case CART_ACTION_TYPES.OPEN_CART:
      return {
        ...state,
        isOpen: true,
      };

    case CART_ACTION_TYPES.CLOSE_CART:
      return {
        ...state,
        isOpen: false,
      };

    case CART_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case CART_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case CART_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case CART_ACTION_TYPES.SET_LAST_ADDED:
      return {
        ...state,
        lastAddedItem: action.payload,
      };

    default:
      return state;
  }
};

// Action creators
export const cartActions = {
  addItem: (menuItem: MenuItem, cantidad?: number, notas?: string) => ({
    type: CART_ACTION_TYPES.ADD_ITEM,
    payload: { menuItem, cantidad, notas },
  }),
  removeItem: (id: string) => ({
    type: CART_ACTION_TYPES.REMOVE_ITEM,
    payload: id,
  }),
  updateQuantity: (id: string, cantidad: number) => ({
    type: CART_ACTION_TYPES.UPDATE_QUANTITY,
    payload: { id, cantidad },
  }),
  updateNotes: (id: string, notas: string) => ({
    type: CART_ACTION_TYPES.UPDATE_NOTES,
    payload: { id, notas },
  }),
  clearCart: () => ({ type: CART_ACTION_TYPES.CLEAR_CART }),
  toggleCart: () => ({ type: CART_ACTION_TYPES.TOGGLE_CART }),
  openCart: () => ({ type: CART_ACTION_TYPES.OPEN_CART }),
  closeCart: () => ({ type: CART_ACTION_TYPES.CLOSE_CART }),
  setLoading: (loading: boolean) => ({
    type: CART_ACTION_TYPES.SET_LOADING,
    payload: loading,
  }),
  setError: (error: string) => ({
    type: CART_ACTION_TYPES.SET_ERROR,
    payload: error,
  }),
  clearError: () => ({ type: CART_ACTION_TYPES.CLEAR_ERROR }),
  setLastAdded: (item: CartItem | null) => ({
    type: CART_ACTION_TYPES.SET_LAST_ADDED,
    payload: item,
  }),
} as const;

// Selectors
export const cartSelectors = {
  getItems: (state: CartState) => state.items,
  getTotal: (state: CartState) => state.total,
  getTotalQuantity: (state: CartState) => state.cantidad_total,
  getIsOpen: (state: CartState) => state.isOpen,
  getLoading: (state: CartState) => state.loading,
  getError: (state: CartState) => state.error,
  getLastAddedItem: (state: CartState) => state.lastAddedItem,
  getItemCount: (state: CartState) => state.items.length,
  isEmpty: (state: CartState) => state.items.length === 0,
  getItemById: (state: CartState, id: string) =>
    state.items.find((item) => item.id === id),
  getItemsByMenuId: (state: CartState, menuId: number) =>
    state.items.filter((item) => item.menuItem.id === menuId),
  getTotalWithTax: (state: CartState, taxRate: number = 0.1) =>
    state.total * (1 + taxRate),
  getTotalWithTaxAndService: (
    state: CartState,
    taxRate: number = 0.1,
    serviceRate: number = 0.05
  ) => state.total * (1 + taxRate + serviceRate),
};

export default cartReducer;
