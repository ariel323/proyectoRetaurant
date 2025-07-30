import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { ApiError } from "../types";
import { HTTP_STATUS } from "./config";

// Tipos para configuración de interceptores
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryOn: number[];
}

interface InterceptorConfig {
  enableLogging: boolean;
  enableRetry: boolean;
  retryConfig: RetryConfig;
  enableAuth: boolean;
  enableCacheControl: boolean;
}

// Configuración por defecto
const DEFAULT_CONFIG: InterceptorConfig = {
  enableLogging: process.env.NODE_ENV === "development",
  enableRetry: true,
  retryConfig: {
    retries: 3,
    retryDelay: 1000,
    retryOn: [HTTP_STATUS.INTERNAL_SERVER_ERROR, 502, 503, 504],
  },
  enableAuth: false, // Se puede habilitar si se requiere autenticación
  enableCacheControl: true,
};

// Símbolos para evitar conflictos con propiedades existentes
const RETRY_COUNT_SYMBOL = Symbol("retryCount");
const IS_RETRY_SYMBOL = Symbol("isRetry");

/**
 * Configura todos los interceptores para una instancia de Axios
 */
export function setupInterceptors(
  axiosInstance: AxiosInstance,
  config: Partial<InterceptorConfig> = {}
): void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Limpiar interceptores existentes
  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.response.clear();

  // Configurar interceptores de request
  setupRequestInterceptors(axiosInstance, finalConfig);

  // Configurar interceptores de response
  setupResponseInterceptors(axiosInstance, finalConfig);
}

/**
 * Configura los interceptores de request
 */
function setupRequestInterceptors(
  axiosInstance: AxiosInstance,
  config: InterceptorConfig
): void {
  axiosInstance.interceptors.request.use(
    (requestConfig) => {
      // 1. Logging de requests
      if (config.enableLogging) {
        logRequest(requestConfig);
      }

      // 2. Control de cache
      if (config.enableCacheControl) {
        requestConfig = addCacheControl(requestConfig) as any;
      }

      // 3. Autenticación (si está habilitada)
      if (config.enableAuth) {
        requestConfig = addAuthHeader(requestConfig) as any;
      }

      // 4. Headers adicionales
      requestConfig = addCommonHeaders(requestConfig) as any;

      // 5. Timestamp para debugging
      (requestConfig as any).metadata = {
        ...(requestConfig as any).metadata,
        startTime: Date.now(),
      };

      return requestConfig;
    },
    (error) => {
      if (config.enableLogging) {
        console.error("🔴 Request Interceptor Error:", error);
      }
      return Promise.reject(createApiError(error));
    }
  );
}

/**
 * Configura los interceptores de response
 */
function setupResponseInterceptors(
  axiosInstance: AxiosInstance,
  config: InterceptorConfig
): void {
  axiosInstance.interceptors.response.use(
    (response) => {
      // 1. Logging de responses exitosos
      if (config.enableLogging) {
        logResponse(response);
      }

      // 2. Normalizar estructura de respuesta
      response = normalizeResponse(response);

      return response;
    },
    async (error: AxiosError) => {
      // 1. Logging de errores
      if (config.enableLogging) {
        logError(error);
      }

      // 2. Retry automático
      if (config.enableRetry && shouldRetry(error, config.retryConfig)) {
        return retryRequest(axiosInstance, error, config.retryConfig);
      }

      // 3. Manejo especial de errores de autenticación
      if (isAuthError(error)) {
        handleAuthError(error);
      }

      // 4. Crear error tipado
      const apiError = createApiError(error);

      return Promise.reject(apiError);
    }
  );
}

/**
 * Añade control de cache a las requests GET
 */
function addCacheControl(config: AxiosRequestConfig): AxiosRequestConfig {
  if (config.method?.toLowerCase() === "get") {
    config.params = {
      ...config.params,
      _t: Date.now(), // Timestamp para evitar cache del navegador
    };
  }
  return config;
}

/**
 * Añade header de autenticación si existe token
 */
function addAuthHeader(config: AxiosRequestConfig): AxiosRequestConfig {
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}

/**
 * Añade headers comunes a todas las requests
 */
function addCommonHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
  const commonHeaders = {
    "X-Requested-With": "XMLHttpRequest",
    "X-Client-Version": process.env.REACT_APP_VERSION || "1.0.0",
    "X-Client-Platform": "web",
  };

  config.headers = {
    ...commonHeaders,
    ...config.headers,
  };

  return config;
}

/**
 * Normaliza la estructura de respuesta
 */
function normalizeResponse(response: AxiosResponse): AxiosResponse {
  // Si la respuesta no tiene la estructura esperada, la normalizamos
  if (response.data && typeof response.data === "object") {
    // Asegurar que siempre haya un campo success si no existe
    if (!("success" in response.data)) {
      response.data = {
        success: true,
        data: response.data,
      };
    }
  }
  return response;
}

/**
 * Determina si un error debe reintentar la request
 */
function shouldRetry(error: AxiosError, retryConfig: RetryConfig): boolean {
  if (!error.config) return false;

  const retryCount = (error.config as any)[RETRY_COUNT_SYMBOL] || 0;

  // No reintentar si ya se alcanzó el límite
  if (retryCount >= retryConfig.retries) return false;

  // No reintentar errores del cliente (4xx)
  if (
    error.response?.status &&
    error.response.status >= 400 &&
    error.response.status < 500
  ) {
    return false;
  }

  // Reintentar solo en códigos específicos o errores de red
  return !error.response || retryConfig.retryOn.includes(error.response.status);
}

/**
 * Reintenta una request fallida
 */
async function retryRequest(
  axiosInstance: AxiosInstance,
  error: AxiosError,
  retryConfig: RetryConfig
): Promise<AxiosResponse> {
  const config = error.config!;
  const retryCount = (config as any)[RETRY_COUNT_SYMBOL] || 0;

  // Incrementar contador de reintentos
  (config as any)[RETRY_COUNT_SYMBOL] = retryCount + 1;
  (config as any)[IS_RETRY_SYMBOL] = true;

  // Esperar antes del reintento
  await new Promise((resolve) =>
    setTimeout(resolve, retryConfig.retryDelay * (retryCount + 1))
  );

  console.log(
    `🔄 Reintentando request (${retryCount + 1}/${retryConfig.retries}):`,
    `${config.method?.toUpperCase()} ${config.url}`
  );

  return axiosInstance.request(config);
}

/**
 * Verifica si es un error de autenticación
 */
function isAuthError(error: AxiosError): boolean {
  return (
    error.response?.status === HTTP_STATUS.UNAUTHORIZED ||
    error.response?.status === HTTP_STATUS.FORBIDDEN
  );
}

/**
 * Maneja errores de autenticación
 */
function handleAuthError(error: AxiosError): void {
  // Limpiar tokens de autenticación
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");

  // Opcional: redirigir a login
  if (window.location.pathname !== "/login") {
    console.warn("🔐 Sesión expirada, redirigiendo al login...");
    // window.location.href = '/login';
  }
}

/**
 * Crea un objeto ApiError tipado
 */
function createApiError(error: any): ApiError {
  if (error.response) {
    // Error con respuesta del servidor
    return {
      message:
        error.response.data?.message ||
        error.response.data?.error ||
        "Error del servidor",
      status: error.response.status,
      code: error.response.data?.code || `HTTP_${error.response.status}`,
    };
  } else if (error.request) {
    // Error de red/conexión
    return {
      message: "Error de conexión. Verifique su conexión a internet.",
      status: 0,
      code: "NETWORK_ERROR",
    };
  } else {
    // Error desconocido
    return {
      message: error.message || "Error desconocido",
      status: 0,
      code: "UNKNOWN_ERROR",
    };
  }
}

/**
 * Funciones de logging
 */
function logRequest(config: AxiosRequestConfig): void {
  const method = config.method?.toUpperCase() || "GET";
  const url = config.url || "";
  const isRetry = (config as any)[IS_RETRY_SYMBOL];
  const retryCount = (config as any)[RETRY_COUNT_SYMBOL] || 0;

  const retryIndicator = isRetry ? `🔄 [Retry ${retryCount}]` : "📤";

  console.groupCollapsed(`${retryIndicator} ${method} ${url}`);
  console.log("Config:", config);
  if (config.params) console.log("Params:", config.params);
  if (config.data) console.log("Data:", config.data);
  console.groupEnd();
}

function logResponse(response: AxiosResponse): void {
  const method = response.config.method?.toUpperCase() || "GET";
  const url = response.config.url || "";
  const duration = (response.config as any).metadata?.startTime
    ? Date.now() - (response.config as any).metadata.startTime
    : 0;

  console.groupCollapsed(`✅ ${method} ${url} (${duration}ms)`);
  console.log("Response:", response.data);
  console.log("Status:", response.status);
  console.log("Headers:", response.headers);
  console.groupEnd();
}

function logError(error: AxiosError): void {
  const method = error.config?.method?.toUpperCase() || "UNKNOWN";
  const url = error.config?.url || "UNKNOWN";
  const status = error.response?.status || 0;

  console.groupCollapsed(`❌ ${method} ${url} (${status})`);
  console.error("Error:", error);
  if (error.response?.data)
    console.error("Response Data:", error.response.data);
  console.groupEnd();
}

// Interceptores específicos para casos de uso comunes
export const interceptors = {
  /**
   * Interceptor simple para logging básico
   */
  setupBasicLogging: (axiosInstance: AxiosInstance) => {
    setupInterceptors(axiosInstance, {
      enableLogging: true,
      enableRetry: false,
      enableAuth: false,
      enableCacheControl: false,
    });
  },

  /**
   * Interceptor completo para producción
   */
  setupProduction: (axiosInstance: AxiosInstance) => {
    setupInterceptors(axiosInstance, {
      enableLogging: false,
      enableRetry: true,
      enableAuth: true,
      enableCacheControl: true,
    });
  },

  /**
   * Interceptor para desarrollo
   */
  setupDevelopment: (axiosInstance: AxiosInstance) => {
    setupInterceptors(axiosInstance, {
      enableLogging: true,
      enableRetry: true,
      enableAuth: false,
      enableCacheControl: true,
    });
  },
};

export default setupInterceptors;
