# Store Exports - Guía de uso

## Exportaciones principales

### Store y tipos

```typescript
import { store, RootState, AppDispatch } from "./store";
```

### Reducers (Slices)

```typescript
import {
  authSlice,
  cartSlice,
  menuSlice,
  orderSlice,
  mesasSlice,
  uiSlice,
} from "./store";
```

### Tipos de estado

```typescript
import type {
  AuthState,
  User,
  CartState,
  MenuState,
  OrderState,
  MesasState,
  UIState,
} from "./store";
```

## Acciones y Selectores

### Auth

```typescript
import { authActions, authSelectors } from "./store";

// Uso de acciones
store.dispatch(authActions.loginStart());
store.dispatch(authActions.loginSuccess(user, token));
store.dispatch(authActions.logout());

// Uso de selectores
const user = authSelectors.getUser(store.getState());
const isAuthenticated = authSelectors.isAuthenticated(store.getState());
```

### Cart (Carrito)

```typescript
import { cartActions, cartSelectors } from "./store";

// Acciones disponibles
store.dispatch(cartActions.addItem(menuItem, quantity));
store.dispatch(cartActions.removeItem(itemId));
store.dispatch(cartActions.clearCart());

// Selectores
const items = cartSelectors.getItems(store.getState());
const total = cartSelectors.getTotal(store.getState());
```

### Menu

```typescript
import { menuActions, menuSelectors } from "./store";

// Acciones
store.dispatch(menuActions.setItems(menuItems));
store.dispatch(menuActions.setCategories(categories));

// Selectores
const menuItems = menuSelectors.getItems(store.getState());
const categories = menuSelectors.getCategories(store.getState());
```

### Orders (Pedidos)

```typescript
import { orderActions, orderSelectors } from "./store";

// Acciones
store.dispatch(orderActions.addOrder(order));
store.dispatch(orderActions.updateOrder(orderId, updates));

// Selectores
const orders = orderSelectors.getOrders(store.getState());
const orderById = orderSelectors.getOrderById(store.getState(), orderId);
```

### Mesas

```typescript
import { mesasActions, mesasSelectors } from "./store";

// Acciones
store.dispatch(mesasActions.setMesas(mesas));
store.dispatch(mesasActions.updateMesa(mesaId, updates));

// Selectores
const mesas = mesasSelectors.getMesas(store.getState());
const availableMesas = mesasSelectors.getAvailableMesas(store.getState());
```

### UI

```typescript
import { uiActions, uiSelectors } from "./store";

// Acciones
store.dispatch(uiActions.setTheme("dark"));
store.dispatch(uiActions.showNotification(message, type));
store.dispatch(uiActions.toggleSidebar());

// Selectores
const theme = uiSelectors.getTheme(store.getState());
const notifications = uiSelectors.getNotifications(store.getState());
```

## Middleware

### Middleware de autenticación

```typescript
import { createAuthMiddleware, initializeAuthFromStorage } from "./store";

// Configurar middleware
const authMiddleware = createAuthMiddleware({
  tokenStorage: "localStorage",
  refreshThreshold: 5,
});

// Inicializar desde storage
initializeAuthFromStorage();
```

### Middleware de persistencia

```typescript
import {
  createPersistenceMiddleware,
  loadPersistedState,
  clearPersistedState,
  migrateState,
} from "./store";

// Configurar persistencia
const persistenceMiddleware = createPersistenceMiddleware({
  key: "app-state",
  whitelist: ["cart", "auth"],
});

// Cargar estado persistido
const persistedState = loadPersistedState();

// Limpiar estado persistido
clearPersistedState();
```

### Middleware de API

```typescript
import { createApiMiddleware } from "./store";

const apiMiddleware = createApiMiddleware();
```

## Uso con React

### Conectar el store a React

```typescript
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
  return <Provider store={store}>{/* Tu aplicación */}</Provider>;
}
```

### Usar en componentes

```typescript
import { useSelector, useDispatch } from "react-redux";
import { RootState, cartActions, authSelectors } from "./store";

function MyComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => authSelectors.getUser(state));
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = (item) => {
    dispatch(cartActions.addItem(item));
  };

  // ...
}
```

## Ejemplo completo

```typescript
import {
  store,
  RootState,
  AppDispatch,
  authActions,
  cartActions,
  authSelectors,
  cartSelectors,
} from "./store";

// Configurar autenticación
store.dispatch(authActions.loginSuccess(userData, token));

// Agregar item al carrito
store.dispatch(cartActions.addItem(menuItem, 2));

// Obtener datos del estado
const state = store.getState();
const user = authSelectors.getUser(state);
const cartTotal = cartSelectors.getTotal(state);

console.log("Usuario:", user);
console.log("Total del carrito:", cartTotal);
```
