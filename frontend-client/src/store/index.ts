// Exportaciones principales del store
export { default as store } from "./store";
export type { RootState, AppDispatch } from "./store";

// Exportar slices (reducers)
export { default as authSlice } from "./slices/authSlice";
export { default as cartSlice } from "./slices/cartSlice";
export { default as menuSlice } from "./slices/menuSlice";
export { default as orderSlice } from "./slices/orderSlice";
export { default as mesasSlice } from "./slices/mesasSlice";
export { default as uiSlice } from "./slices/uiSlice";

// Exportar tipos de los slices
export type { AuthState, User } from "./slices/authSlice";
export type { CartState } from "./slices/cartSlice";
export type { MenuState } from "./slices/menuSlice";
export type { OrderState } from "./slices/orderSlice";
export type { MesasState } from "./slices/mesasSlice";
export type { UIState } from "./slices/uiSlice";

// Exportar objetos de acciones (no las acciones individuales)
export { authActions, authSelectors } from "./slices/authSlice";
export { cartActions, cartSelectors } from "./slices/cartSlice";
export { menuActions, menuSelectors } from "./slices/menuSlice";
export { orderActions, orderSelectors } from "./slices/orderSlice";
export { mesasActions, mesasSelectors } from "./slices/mesasSlice";
export { uiActions, uiSelectors } from "./slices/uiSlice";

// Exportar middleware
export { default as createAuthMiddleware } from "./middleware/authMiddleware";
export { default as createApiMiddleware } from "./middleware/apiMiddleware";
export { default as createPersistenceMiddleware } from "./middleware/persistenceMiddleware";

// Exportar utilidades si existen
export { initializeAuthFromStorage } from "./middleware/authMiddleware";
export {
  loadPersistedState,
  clearPersistedState,
  migrateState,
} from "./middleware/persistenceMiddleware";
