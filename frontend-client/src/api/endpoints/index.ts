/**
 * Índice central de todos los endpoints de la API del frontend-client
 *
 * Este archivo centraliza y exporta todos los endpoints organizados por módulo,
 * proporcionando una interfaz unificada y segura para acceder a la API del restaurante.
 *
 * @author Frontend Team
 * @version 1.0.0
 */

import { apiClient } from "../index";
import { API_CONFIG, ENDPOINTS, HTTP_STATUS } from "../config";
import {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  OperationResponse,
  ValidationErrorResponse,
  isApiError,
  isValidationError,
  isPaginatedResponse,
} from "../types";

// Importar todos los módulos de endpoints
import { dashboardEndpoints } from "./dashboard";
import { menuEndpoints } from "./menu";
import { mesasEndpoints } from "./mesas";
import { pedidosEndpoints } from "./pedidos";
import { usuariosEndpoints } from "./usuarios";

// ========== TIPOS DE SEGURIDAD ==========

/**
 * Interfaz para definir la estructura de módulos de endpoints
 */
interface EndpointModule {
  readonly [key: string]: (...args: any[]) => Promise<any>;
}

/**
 * Tipo para validar que los módulos implementen la interfaz correcta
 */
type ValidatedEndpointModule<T> = T extends EndpointModule ? T : never;

/**
 * Registro de todos los módulos de endpoints con validación de tipos
 */
interface EndpointRegistry {
  readonly dashboard: ValidatedEndpointModule<typeof dashboardEndpoints>;
  readonly menu: ValidatedEndpointModule<typeof menuEndpoints>;
  readonly mesas: ValidatedEndpointModule<typeof mesasEndpoints>;
  readonly pedidos: ValidatedEndpointModule<typeof pedidosEndpoints>;
  readonly usuarios: ValidatedEndpointModule<typeof usuariosEndpoints>;
}

// ========== CONFIGURACIÓN DE MÓDULOS ==========

/**
 * Configuración de seguridad y permisos por módulo
 */
const MODULE_CONFIG = {
  dashboard: {
    requiresAuth: false,
    allowedMethods: ["GET"],
    rateLimit: 100, // requests por minuto
    cache: true,
    public: true,
  },
  menu: {
    requiresAuth: false,
    allowedMethods: ["GET"],
    rateLimit: 200,
    cache: true,
    public: true,
  },
  mesas: {
    requiresAuth: false,
    allowedMethods: ["GET"],
    rateLimit: 150,
    cache: true,
    public: true,
  },
  pedidos: {
    requiresAuth: false, // Cambiar a true si se requiere autenticación
    allowedMethods: ["GET", "POST", "PUT", "PATCH"],
    rateLimit: 50,
    cache: false,
    public: false,
  },
  usuarios: {
    requiresAuth: true,
    allowedMethods: ["GET", "POST", "PUT", "DELETE"],
    rateLimit: 30,
    cache: false,
    public: false,
  },
} as const;

// ========== REGISTRO PRINCIPAL DE ENDPOINTS ==========

/**
 * Registro principal que contiene todos los módulos de endpoints
 * con validación de tipos y configuración de seguridad
 */
const endpointRegistry: EndpointRegistry = {
  dashboard: dashboardEndpoints,
  menu: menuEndpoints,
  mesas: mesasEndpoints,
  pedidos: pedidosEndpoints,
  usuarios: usuariosEndpoints,
} as const;

// ========== EXPORTS PRINCIPALES ==========

/**
 * Exportación de todos los módulos de endpoints individuales
 */
export { dashboardEndpoints } from "./dashboard";
export { menuEndpoints } from "./menu";
export { mesasEndpoints } from "./mesas";
export { pedidosEndpoints } from "./pedidos";
export { usuariosEndpoints } from "./usuarios";

/**
 * Exportación por defecto del registro completo
 */
export default endpointRegistry;

/**
 * Alias para acceso directo a todos los endpoints
 */
export const allEndpoints = endpointRegistry;

// ========== RE-EXPORTS DE TIPOS ==========

/**
 * Re-exportación de tipos importantes de la API
 */
export type {
  // Tipos principales
  ApiError,
  ApiResponse,
  PaginatedResponse,
  OperationResponse,
  ValidationErrorResponse,

  // Tipos de entidades
  MenuItem,
  Mesa,
  Pedido,
  CartItem,
  Cliente,
  Category,
  AuthUser,

  // Tipos de requests
  CreatePedidoRequest,
  UpdatePedidoRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  CreateMesaRequest,
  UpdateMesaRequest,
  LoginRequest,
  LoginResponse,

  // Tipos de filtros
  MenuFilter,
  MesaFilter,
  PedidoFilter,
  BaseFilter,

  // Tipos de configuración
  ApiClientConfig,
  RequestConfig,
  InterceptorMetadata,

  // Tipos de estadísticas
  DashboardStats,
  SalesReport,

  // Guards de tipos
  isApiError,
  isValidationError,
  isPaginatedResponse,
} from "../types";

// ========== UTILIDADES DE SEGURIDAD ==========

/**
 * Clase para validar y ejecutar endpoints de forma segura
 */
class SafeEndpointExecutor {
  private static instance: SafeEndpointExecutor;
  private readonly rateLimitMap = new Map<string, number[]>();

  private constructor() {}

  public static getInstance(): SafeEndpointExecutor {
    if (!SafeEndpointExecutor.instance) {
      SafeEndpointExecutor.instance = new SafeEndpointExecutor();
    }
    return SafeEndpointExecutor.instance;
  }

  /**
   * Verificar si un módulo existe y es válido
   */
  private isValidModule(module: string): module is keyof EndpointRegistry {
    return (
      module in endpointRegistry &&
      !!endpointRegistry[module as keyof EndpointRegistry]
    );
  }

  /**
   * Verificar límites de velocidad por módulo
   */
  private checkRateLimit(module: keyof EndpointRegistry): boolean {
    const config = MODULE_CONFIG[module];
    const now = Date.now();
    const key = module;

    if (!this.rateLimitMap.has(key)) {
      this.rateLimitMap.set(key, []);
    }

    const requests = this.rateLimitMap.get(key)!;

    // Filtrar requests del último minuto
    const recentRequests = requests.filter((time) => now - time < 60000);

    if (recentRequests.length >= config.rateLimit) {
      return false;
    }

    // Agregar request actual
    recentRequests.push(now);
    this.rateLimitMap.set(key, recentRequests);

    return true;
  }

  /**
   * Verificar permisos de autenticación
   */
  private async checkAuthPermissions(
    module: keyof EndpointRegistry
  ): Promise<boolean> {
    const config = MODULE_CONFIG[module];

    if (!config.requiresAuth) {
      return true;
    }

    try {
      // Verificar si el usuario está autenticado
      const authResponse = await usuariosEndpoints.checkAuth();
      return authResponse.authenticated;
    } catch {
      return false;
    }
  }

  /**
   * Ejecutar endpoint de forma segura
   */
  public async execute<T>(
    module: string,
    method: string,
    ...args: any[]
  ): Promise<T> {
    // Validar módulo
    if (!this.isValidModule(module)) {
      throw new Error(`Módulo '${module}' no existe o no es válido`);
    }

    // Verificar rate limit
    if (!this.checkRateLimit(module)) {
      throw new Error(`Rate limit excedido para módulo '${module}'`);
    }

    // Verificar permisos de autenticación
    const hasPermission = await this.checkAuthPermissions(module);
    if (!hasPermission) {
      throw new Error(`Sin permisos para acceder al módulo '${module}'`);
    }

    // Verificar que el método existe
    const endpointModule = endpointRegistry[module];
    const endpointMethod = (endpointModule as any)[method];

    if (typeof endpointMethod !== "function") {
      throw new Error(`Método '${method}' no encontrado en módulo '${module}'`);
    }

    try {
      return await endpointMethod(...args);
    } catch (error) {
      console.error(`Error ejecutando ${module}.${method}:`, error);
      throw error;
    }
  }
}

// ========== UTILIDADES PÚBLICAS ==========

/**
 * Instancia singleton del ejecutor seguro
 */
const safeExecutor = SafeEndpointExecutor.getInstance();

/**
 * Utilidades para manejo seguro de endpoints
 */
export const endpointUtils = {
  /**
   * Verificar si un endpoint específico está disponible
   */
  isEndpointAvailable: (module: string, method: string): boolean => {
    try {
      if (!(module in endpointRegistry)) {
        return false;
      }

      const endpointModule = endpointRegistry[module as keyof EndpointRegistry];
      return typeof (endpointModule as any)[method] === "function";
    } catch {
      return false;
    }
  },

  /**
   * Obtener la lista de módulos disponibles
   */
  getAvailableModules: (): string[] => {
    return Object.keys(endpointRegistry);
  },

  /**
   * Obtener métodos disponibles para un módulo
   */
  getModuleMethods: (module: string): string[] => {
    try {
      if (!(module in endpointRegistry)) {
        return [];
      }

      const endpointModule = endpointRegistry[module as keyof EndpointRegistry];
      return Object.keys(endpointModule).filter(
        (key) => typeof (endpointModule as any)[key] === "function"
      );
    } catch {
      return [];
    }
  },

  /**
   * Obtener configuración de un módulo
   */
  getModuleConfig: (module: string) => {
    return MODULE_CONFIG[module as keyof typeof MODULE_CONFIG] || null;
  },

  /**
   * Ejecutar endpoint de forma segura con validaciones
   */
  safeExecute: async <T>(
    module: string,
    method: string,
    ...args: any[]
  ): Promise<T> => {
    return safeExecutor.execute<T>(module, method, ...args);
  },

  /**
   * Verificar salud de la API
   */
  checkApiHealth: async (): Promise<{
    status: "healthy" | "degraded" | "down";
    modules: Record<string, boolean>;
    timestamp: string;
  }> => {
    const modules: Record<string, boolean> = {};
    let healthyCount = 0;

    for (const module of Object.keys(endpointRegistry)) {
      try {
        // Intentar una operación simple en cada módulo
        if (module === "menu") {
          await menuEndpoints.getCategories();
        } else if (module === "mesas") {
          await mesasEndpoints.getOccupancyStats();
        } else if (module === "dashboard") {
          await dashboardEndpoints.getPublicStats();
        }
        modules[module] = true;
        healthyCount++;
      } catch {
        modules[module] = false;
      }
    }

    const totalModules = Object.keys(endpointRegistry).length;
    let status: "healthy" | "degraded" | "down";

    if (healthyCount === totalModules) {
      status = "healthy";
    } else if (healthyCount > 0) {
      status = "degraded";
    } else {
      status = "down";
    }

    return {
      status,
      modules,
      timestamp: new Date().toISOString(),
    };
  },
};

// ========== FUNCIONES DE INICIALIZACIÓN ==========

/**
 * Inicializar el sistema de endpoints
 */
export const initializeEndpoints = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log("🚀 Inicializando sistema de endpoints...");

    // Verificar conexión con la API
    const healthCheck = await endpointUtils.checkApiHealth();

    if (healthCheck.status === "down") {
      console.error("❌ La API no está disponible");
      return {
        success: false,
        message: "API no disponible",
        details: healthCheck,
      };
    }

    // Registrar módulos disponibles
    const modules = endpointUtils.getAvailableModules();
    console.log(`✅ Módulos de endpoints cargados: ${modules.join(", ")}`);

    // Verificar configuración
    console.log(`🔧 Configuración base: ${API_CONFIG.BASE_URL}`);
    console.log(`⏱️  Timeout: ${API_CONFIG.TIMEOUT}ms`);
    console.log(`🔄 Reintentos: ${API_CONFIG.RETRY_ATTEMPTS}`);

    return {
      success: true,
      message: "Sistema de endpoints inicializado correctamente",
      details: {
        modules,
        health: healthCheck,
        config: API_CONFIG,
      },
    };
  } catch (error) {
    console.error("❌ Error al inicializar endpoints:", error);
    return {
      success: false,
      message: "Error al inicializar sistema de endpoints",
      details: error,
    };
  }
};

// ========== EXPORTS ADICIONALES ==========

/**
 * Constantes útiles para el frontend
 */
export const constants = {
  API_CONFIG,
  ENDPOINTS,
  HTTP_STATUS,
  MODULE_CONFIG,
} as const;

/**
 * Funciones helper para crear hooks personalizados
 */
export const createEndpointHook = (
  module: keyof EndpointRegistry,
  method: string
) => {
  return (...args: any[]) => {
    return endpointUtils.safeExecute(module, method, ...args);
  };
};

/**
 * Middleware para validación de respuestas
 */
export const responseValidators = {
  validateApiResponse: <T>(response: any): response is ApiResponse<T> => {
    return response && typeof response === "object" && "success" in response;
  },

  validatePaginatedResponse: <T>(
    response: any
  ): response is PaginatedResponse<T> => {
    return isPaginatedResponse<T>(response);
  },

  validateOperationResponse: (response: any): response is OperationResponse => {
    return (
      response &&
      typeof response === "object" &&
      "success" in response &&
      "message" in response
    );
  },
};

/**
 * Logger específico para endpoints
 */
export const endpointLogger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`📡 [Endpoints] ${message}`, data || "");
    }
  },

  error: (message: string, error?: any) => {
    console.error(`❌ [Endpoints] ${message}`, error || "");
  },

  warn: (message: string, data?: any) => {
    console.warn(`⚠️ [Endpoints] ${message}`, data || "");
  },
};

// ========== INICIALIZACIÓN AUTOMÁTICA ==========

/**
 * Auto-inicialización en desarrollo
 */
if (process.env.NODE_ENV === "development") {
  initializeEndpoints()
    .then((result) => {
      if (result.success) {
        endpointLogger.info("Sistema de endpoints listo para usar");
      } else {
        endpointLogger.error("Fallo en la inicialización", result.details);
      }
    })
    .catch((error) => {
      endpointLogger.error("Error crítico en inicialización", error);
    });
}

// ========== EXPORT FINAL ==========

/**
 * Export principal con toda la funcionalidad
 */
export {
  endpointRegistry as endpoints,
  safeExecutor,
  MODULE_CONFIG as moduleConfig,
};
