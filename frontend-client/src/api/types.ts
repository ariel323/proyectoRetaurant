/**
 * Tipos específicos para operaciones de API
 * Incluye tipos de request, response, parámetros, filtros y configuraciones
 */

// Re-exportar tipos básicos del directorio principal
export type {
  MenuItem,
  Mesa,
  CartItem,
  Cliente,
  Pedido,
  Category,
  ApiResponse,
} from "../types";

// ========== TIPOS DE CONFIGURACIÓN ==========

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableAuth: boolean;
  enableLogging: boolean;
}

export interface RequestConfig {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

export interface InterceptorMetadata {
  startTime?: number;
  retryCount?: number;
  isRetry?: boolean;
  requestId?: string;
}

// ========== TIPOS DE RESPUESTAS DE LA API ==========

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface OperationResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export interface ValidationErrorResponse {
  success: false;
  message: string;
  errors: {
    field: string;
    message: string;
    code: string;
  }[];
}

// ========== TIPOS DE FILTROS Y BÚSQUEDA ==========

export interface BaseFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface MenuFilter extends BaseFilter {
  categoria?: string;
  disponible?: boolean;
  vegetariano?: boolean;
  picante?: boolean;
  precio_min?: number;
  precio_max?: number;
  rating_min?: number;
  calorias_max?: number;
  tiempo_max?: number;
}

export interface MesaFilter extends BaseFilter {
  estado?: "LIBRE" | "OCUPADA" | "RESERVADA";
  capacidad_min?: number;
  capacidad_max?: number;
  ubicacion?: string;
}

export interface PedidoFilter extends BaseFilter {
  estado?:
    | "PENDIENTE"
    | "CONFIRMADO"
    | "PREPARANDO"
    | "LISTO"
    | "ENTREGADO"
    | "CANCELADO";
  mesa_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  cliente_nombre?: string;
  total_min?: number;
  total_max?: number;
}

// ========== TIPOS DE REQUESTS ==========

export interface CreateMenuItemRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  imagen?: File | string;
  disponible?: boolean;
  tiempo_preparacion?: number;
  ingredientes?: string[];
  calorias?: number;
  vegetariano?: boolean;
  picante?: boolean;
}

export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  id: number;
}

export interface CreateMesaRequest {
  numero: number;
  capacidad: number;
  ubicacion: string;
  estado?: "LIBRE" | "OCUPADA" | "RESERVADA";
}

export interface UpdateMesaRequest extends Partial<CreateMesaRequest> {
  id: number;
}

export interface CreatePedidoRequest {
  mesa_id: number;
  cliente: {
    nombre: string;
    telefono?: string;
    email?: string;
    notas?: string;
  };
  items: {
    menu_item_id: number;
    cantidad: number;
    precio_unitario: number;
    notas?: string;
  }[];
  notas?: string;
}

export interface UpdatePedidoRequest {
  estado?:
    | "PENDIENTE"
    | "CONFIRMADO"
    | "PREPARANDO"
    | "LISTO"
    | "ENTREGADO"
    | "CANCELADO";
  tiempo_estimado?: number;
  notas?: string;
}

// ========== TIPOS DE BÚSQUEDA ==========

export interface SearchRequest {
  query: string;
  filters?: Record<string, any>;
  limit?: number;
  includeHighlight?: boolean;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  highlights?: Record<string, string[]>;
}

export interface SearchResponse<T> {
  success: boolean;
  data: SearchResult<T>[];
  meta: {
    total: number;
    query: string;
    processingTime: number;
    suggestions?: string[];
  };
}

// ========== TIPOS DE ESTADÍSTICAS Y DASHBOARD ==========

export interface DashboardStats {
  ventas: {
    total_dia: number;
    total_semana: number;
    total_mes: number;
    pedidos_completados: number;
    pedidos_pendientes: number;
    ticket_promedio: number;
  };
  mesas: {
    total: number;
    ocupadas: number;
    libres: number;
    reservadas: number;
    ocupacion_porcentaje: number;
  };
  menu: {
    total_items: number;
    items_disponibles: number;
    items_agotados: number;
    categorias_activas: number;
  };
  clientes: {
    pedidos_hoy: number;
    nuevos_clientes: number;
    satisfaccion_promedio: number;
  };
}

export interface SalesReport {
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  ventas_totales: number;
  pedidos_total: number;
  ticket_promedio: number;
  items_mas_vendidos: {
    menu_item_id: number;
    nombre: string;
    cantidad_vendida: number;
    ingresos_generados: number;
  }[];
  ventas_por_categoria: {
    categoria: string;
    cantidad: number;
    ingresos: number;
    porcentaje: number;
  }[];
  ventas_por_hora: {
    hora: number;
    cantidad_pedidos: number;
    ingresos: number;
  }[];
}

// ========== TIPOS DE AUTENTICACIÓN ==========

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: {
      id: number;
      email: string;
      nombre: string;
      rol: string;
    };
    expiresAt: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  rol: "ADMIN" | "MESERO" | "COCINERO" | "CLIENTE";
  activo: boolean;
  ultimo_acceso?: string;
}

// ========== TIPOS DE UPLOAD/ARCHIVOS ==========

export interface FileUploadRequest {
  file: File;
  category: "menu" | "profile" | "restaurant" | "temp";
  description?: string;
  alt_text?: string;
}

export interface FileUploadResponse {
  success: boolean;
  data: {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimeType: string;
    category: string;
    uploadedAt: string;
  };
}

export interface FileDeleteRequest {
  fileId: string;
  permanent?: boolean;
}

// ========== TIPOS DE VALIDACIÓN ==========

export interface ValidationRule {
  field: string;
  rules: string[];
  message?: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings?: Record<string, string[]>;
}

// ========== TIPOS DE NOTIFICACIONES ==========

export interface NotificationData {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: {
    label: string;
    action: string;
    url?: string;
  }[];
}

export interface WebSocketMessage {
  type: "notification" | "order_update" | "table_update" | "menu_update";
  data: any;
  timestamp: string;
  channel: string;
}

// ========== TIPOS DE CONFIGURACIÓN DE ENDPOINTS ==========

export interface EndpointConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  requiresAuth?: boolean;
  timeout?: number;
  retries?: number;
  cache?: boolean | number;
  rateLimit?: {
    requests: number;
    window: number; // en segundos
  };
}

export interface ApiEndpoints {
  // Menú
  menu: {
    getAll: EndpointConfig;
    getById: EndpointConfig;
    getByCategory: EndpointConfig;
    search: EndpointConfig;
    create: EndpointConfig;
    update: EndpointConfig;
    delete: EndpointConfig;
    featured: EndpointConfig;
  };

  // Mesas
  mesas: {
    getAll: EndpointConfig;
    getById: EndpointConfig;
    getAvailable: EndpointConfig;
    create: EndpointConfig;
    update: EndpointConfig;
    delete: EndpointConfig;
    checkAvailability: EndpointConfig;
  };

  // Pedidos
  pedidos: {
    getAll: EndpointConfig;
    getById: EndpointConfig;
    create: EndpointConfig;
    update: EndpointConfig;
    cancel: EndpointConfig;
    getByMesa: EndpointConfig;
    getByStatus: EndpointConfig;
  };

  // Dashboard
  dashboard: {
    getStats: EndpointConfig;
    getSalesReport: EndpointConfig;
    getPopularItems: EndpointConfig;
  };

  // Archivos
  files: {
    upload: EndpointConfig;
    delete: EndpointConfig;
    getById: EndpointConfig;
  };
}

// ========== TIPOS DE CACHE ==========

export interface CacheConfig {
  enabled: boolean;
  defaultTTL: number; // en segundos
  maxSize: number; // número máximo de entradas
  storage: "memory" | "localStorage" | "sessionStorage";
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  size: number;
}

export interface CacheManager {
  get<T>(key: string): CacheEntry<T> | null;
  set<T>(key: string, data: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  size(): number;
  keys(): string[];
}

// ========== TIPOS DE MÉTRICAS Y MONITORING ==========

export interface ApiMetrics {
  requestsTotal: number;
  requestsSuccess: number;
  requestsError: number;
  averageResponseTime: number;
  slowestRequest: {
    url: string;
    method: string;
    duration: number;
    timestamp: string;
  };
  errorRate: number;
  lastError?: {
    message: string;
    status: number;
    timestamp: string;
    url: string;
  };
}

export interface PerformanceEntry {
  url: string;
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
  status: number;
  size?: number;
  cached?: boolean;
}

// ========== TIPOS UTILITARIOS ==========

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type SortOrder = "asc" | "desc";

export type ApiStatus = "idle" | "loading" | "success" | "error";

export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: ApiError;
  errorCode?: string;
  canRetry: boolean;
  retryCount: number;
}

// ========== TIPOS DE HOOKS Y ESTADO ==========

export interface UseApiOptions {
  immediate?: boolean;
  retryOnError?: boolean;
  retryDelay?: number;
  maxRetries?: number;
  cacheKey?: string;
  cacheTTL?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  status: ApiStatus;
  lastFetch?: number;
}

export interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: ApiError, variables: TVariables) => void;
  onSettled?: (
    data: TData | null,
    error: ApiError | null,
    variables: TVariables
  ) => void;
}

// ========== TIPOS DE EVENTOS Y CALLBACKS ==========

export interface ApiEventHandlers {
  onRequestStart?: (config: RequestConfig) => void;
  onRequestSuccess?: (response: any) => void;
  onRequestError?: (error: ApiError) => void;
  onRequestEnd?: () => void;
}

export interface WebSocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Error) => void;
  onReconnect?: (attempt: number) => void;
}

// ========== CONSTANTES DE TIPOS ==========

export const API_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
export const CACHE_STRATEGIES = [
  "memory",
  "localStorage",
  "sessionStorage",
] as const;
export const ERROR_CODES = [
  "NETWORK_ERROR",
  "TIMEOUT_ERROR",
  "VALIDATION_ERROR",
  "AUTH_ERROR",
  "SERVER_ERROR",
  "UNKNOWN_ERROR",
] as const;
export const NOTIFICATION_TYPES = [
  "info",
  "success",
  "warning",
  "error",
] as const;

// ========== CLASES DE ERROR ==========

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly data?: any;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string = "UNKNOWN_ERROR",
    status: number = 500,
    data?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.data = data;
    this.timestamp = new Date();

    // Mantener el stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      data: this.data,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

// ========== GUARDS DE TIPOS ==========

export function isApiError(error: any): error is ApiError {
  return (
    error &&
    typeof error === "object" &&
    "message" in error &&
    "status" in error
  );
}

export function isValidationError(
  response: any
): response is ValidationErrorResponse {
  return response && !response.success && Array.isArray(response.errors);
}

export function isPaginatedResponse<T>(
  response: any
): response is PaginatedResponse<T> {
  return (
    response &&
    Array.isArray(response.data) &&
    response.meta &&
    typeof response.meta.total === "number"
  );
}

export function isSearchResponse<T>(
  response: any
): response is SearchResponse<T> {
  return (
    response &&
    Array.isArray(response.data) &&
    response.meta &&
    typeof response.meta.query === "string"
  );
}

// ========== TIPOS CONDICIONALES Y UTILITARIOS AVANZADOS ==========

export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalField<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type ApiEndpoint<T = any> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K]
    : T[K] extends object
    ? ApiEndpoint<T[K]>
    : EndpointConfig;
};

export type FilterFor<T> = {
  [K in keyof T]?: T[K] extends string
    ? string | string[]
    : T[K] extends number
    ? number | { min?: number; max?: number }
    : T[K] extends boolean
    ? boolean
    : T[K] extends Date
    ? string | { from?: string; to?: string }
    : any;
} & BaseFilter;

// ========== EXPORTS PRINCIPALES ==========

// Las funciones ya están exportadas directamente
