// Configuración centralizada de la API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const ENDPOINTS = {
  // Menú
  MENU: '/menu',
  MENU_BY_ID: (id: number) => `/menu/${id}`,
  MENU_BY_CATEGORY: (category: string) => `/menu/category/${category}`,
  MENU_SEARCH: '/menu/search',
  MENU_FEATURED: '/menu/featured',
  
  // Mesas
  MESAS: '/mesas',
  MESA_BY_ID: (id: number) => `/mesas/${id}`,
  MESAS_DISPONIBLES: '/mesas/disponibles',
  MESA_CHECK_AVAILABILITY: (id: number) => `/mesas/${id}/disponible`,
  
  // Pedidos
  PEDIDOS: '/pedidos',
  PEDIDO_BY_ID: (id: number) => `/pedidos/${id}`,
  PEDIDO_CREATE: '/pedidos',
  PEDIDO_UPDATE: (id: number) => `/pedidos/${id}`,
  PEDIDO_CANCEL: (id: number) => `/pedidos/${id}/cancelar`,
  
  // Dashboard/Estadísticas (para mostrar en el cliente)
  DASHBOARD_STATS: '/dashboard/stats',
  
  // Categorías
  CATEGORIES: '/categorias',
} as const;

export const REQUEST_HEADERS = {
  DEFAULT: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  MULTIPART: {
    'Content-Type': 'multipart/form-data',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;