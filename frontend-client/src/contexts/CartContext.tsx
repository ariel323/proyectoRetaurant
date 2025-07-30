import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { CartItem, MenuItem, CartState, CartActions } from "../types";

interface CartContextType extends CartState, CartActions {}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: { menuItem: MenuItem; cantidad?: number; notas?: string };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; cantidad: number } }
  | { type: "UPDATE_NOTES"; payload: { id: string; notas: string } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "CLOSE_CART" }
  | { type: "OPEN_CART" };

const initialState: CartState = {
  items: [],
  total: 0,
  cantidad_total: 0,
  isOpen: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { menuItem, cantidad = 1, notas = "" } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.menuItem.id === menuItem.id && item.notas === notas
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                subtotal: (item.cantidad + cantidad) * item.menuItem.precio,
              }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${menuItem.id}-${Date.now()}`,
          menuItem,
          cantidad,
          notas,
          subtotal: menuItem.precio * cantidad,
          precio: menuItem.precio,
        };
        newItems = [...state.items, newItem];
      }

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const cantidad_total = newItems.reduce(
        (sum, item) => sum + item.cantidad,
        0
      );

      return { ...state, items: newItems, total, cantidad_total };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const cantidad_total = newItems.reduce(
        (sum, item) => sum + item.cantidad,
        0
      );

      return { ...state, items: newItems, total, cantidad_total };
    }

    case "UPDATE_QUANTITY": {
      const { id, cantidad } = action.payload;
      if (cantidad <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: id });
      }

      const newItems = state.items.map((item) =>
        item.id === id
          ? { ...item, cantidad, subtotal: cantidad * item.menuItem.precio }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const cantidad_total = newItems.reduce(
        (sum, item) => sum + item.cantidad,
        0
      );

      return { ...state, items: newItems, total, cantidad_total };
    }

    case "UPDATE_NOTES": {
      const { id, notas } = action.payload;
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, notas } : item
      );

      return { ...state, items: newItems };
    }

    case "CLEAR_CART":
      return { ...state, items: [], total: 0, cantidad_total: 0 };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (menuItem: MenuItem, cantidad?: number, notas?: string) => {
    dispatch({ type: "ADD_ITEM", payload: { menuItem, cantidad, notas } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, cantidad: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, cantidad } });
  };

  const updateNotes = (id: string, notas: string) => {
    dispatch({ type: "UPDATE_NOTES", payload: { id, notas } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" });
  };

  const openCart = () => {
    dispatch({ type: "OPEN_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
        toggleCart,
        closeCart,
        openCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
