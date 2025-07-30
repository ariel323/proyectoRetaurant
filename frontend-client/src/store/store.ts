// Redux store configuration with vanilla Redux (no RTK dependency)
import { createStore, combineReducers, applyMiddleware, compose } from "redux";

// Import reducers
import authReducer, { AuthState } from "./slices/authSlice";
import cartReducer, { CartState } from "./slices/cartSlice";
import menuReducer, { MenuState } from "./slices/menuSlice";
import orderReducer, { OrderState } from "./slices/orderSlice";
import mesasReducer, { MesasState } from "./slices/mesasSlice";
import uiReducer, { UIState } from "./slices/uiSlice";

// Import middleware
import createAuthMiddleware, {
  initializeAuthFromStorage,
} from "./middleware/authMiddleware";
import createApiMiddleware from "./middleware/apiMiddleware";
import createPersistenceMiddleware, {
  loadPersistedState,
} from "./middleware/persistenceMiddleware";

// Root state interface
export interface RootState {
  auth: AuthState;
  cart: CartState;
  menu: MenuState;
  orders: OrderState;
  mesas: MesasState;
  ui: UIState;
}

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  menu: menuReducer,
  orders: orderReducer,
  mesas: mesasReducer,
  ui: uiReducer,
});

// Create middleware
const authMiddleware = createAuthMiddleware({
  tokenStorage: "localStorage",
  refreshThreshold: 5,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
});

const apiMiddleware = createApiMiddleware({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  showErrorToasts: true,
  showSuccessToasts: false,
  handleUnauthorized: true,
  handleNetworkErrors: true,
});

const persistenceMiddleware = createPersistenceMiddleware({
  storage: "localStorage",
  key: "restaurant-app-state",
  whitelist: ["cart", "ui", "menu"],
  blacklist: ["auth"],
  throttle: 1000,
  version: 1,
});

// Load persisted state
const persistedState = loadPersistedState({
  storage: "localStorage",
  key: "restaurant-app-state",
  whitelist: ["cart", "ui", "menu"],
  blacklist: ["auth"],
  version: 1,
});

// Development tools
const composeEnhancers =
  (typeof window !== "undefined" &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// Create store
export const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(
    applyMiddleware(authMiddleware, apiMiddleware, persistenceMiddleware)
  )
);

// Initialize auth from storage
initializeAuthFromStorage(store.dispatch, {
  tokenStorage: "localStorage",
});

// Export types
export type AppDispatch = typeof store.dispatch;
export type AppGetState = typeof store.getState;

// Export selectors for easy access
export * from "./slices/authSlice";
export * from "./slices/cartSlice";
export * from "./slices/menuSlice";
export * from "./slices/orderSlice";
export * from "./slices/mesasSlice";
export * from "./slices/uiSlice";

export default store;
