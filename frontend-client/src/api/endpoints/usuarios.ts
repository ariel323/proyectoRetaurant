import { apiClient } from "../index";
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  OperationResponse,
} from "../types";

/**
 * Endpoints para gestión de usuarios y autenticación
 * Específico para el frontend-client (funcionalidades limitadas)
 */
export const usuariosEndpoints = {
  /**
   * Obtener rol del usuario actual
   * @returns Promise<{rol: string}>
   */
  getCurrentRole: async (): Promise<{ rol: string }> => {
    try {
      return await apiClient.get<{ rol: string }>("/usuarios/rol", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error al obtener rol del usuario:", error);
      return { rol: "ANONIMO" };
    }
  },

  /**
   * Iniciar sesión (si es necesario para el frontend-client)
   * @param credentials - Credenciales de acceso
   * @returns Promise<LoginResponse>
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      return await apiClient.post<LoginResponse>("/auth/login", credentials);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   * @returns Promise<OperationResponse>
   */
  logout: async (): Promise<OperationResponse> => {
    try {
      return await apiClient.post<OperationResponse>("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  },

  /**
   * Refrescar token de autenticación
   * @param refreshData - Datos para refrescar token
   * @returns Promise<LoginResponse>
   */
  refreshToken: async (
    refreshData: RefreshTokenRequest
  ): Promise<LoginResponse> => {
    try {
      return await apiClient.post<LoginResponse>("/auth/refresh", refreshData);
    } catch (error) {
      console.error("Error al refrescar token:", error);
      throw error;
    }
  },

  /**
   * Obtener información del usuario actual
   * @returns Promise<AuthUser>
   */
  getCurrentUser: async (): Promise<AuthUser> => {
    try {
      return await apiClient.get<AuthUser>("/usuarios/me");
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      throw error;
    }
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns Promise<{authenticated: boolean, user?: AuthUser}>
   */
  checkAuth: async (): Promise<{ authenticated: boolean; user?: AuthUser }> => {
    try {
      const user = await apiClient.get<AuthUser>("/usuarios/me");
      return { authenticated: true, user };
    } catch (error) {
      return { authenticated: false };
    }
  },

  /**
   * Registrar nuevo cliente (si el restaurante permite registro)
   * @param userData - Datos del usuario a registrar
   * @returns Promise<{success: boolean, message: string}>
   */
  registerCustomer: async (userData: {
    nombre: string;
    email: string;
    telefono?: string;
    password?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      return await apiClient.post<{ success: boolean; message: string }>(
        "/usuarios/register-customer",
        userData
      );
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      throw error;
    }
  },

  /**
   * Actualizar perfil del cliente
   * @param userData - Datos a actualizar
   * @returns Promise<AuthUser>
   */
  updateProfile: async (userData: {
    nombre?: string;
    email?: string;
    telefono?: string;
  }): Promise<AuthUser> => {
    try {
      return await apiClient.put<AuthUser>("/usuarios/profile", userData);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  },

  /**
   * Cambiar contraseña del usuario
   * @param passwordData - Datos de cambio de contraseña
   * @returns Promise<OperationResponse>
   */
  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<OperationResponse> => {
    try {
      return await apiClient.put<OperationResponse>(
        "/usuarios/change-password",
        passwordData
      );
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      throw error;
    }
  },

  /**
   * Solicitar restablecimiento de contraseña
   * @param email - Email del usuario
   * @returns Promise<OperationResponse>
   */
  requestPasswordReset: async (email: string): Promise<OperationResponse> => {
    try {
      return await apiClient.post<OperationResponse>(
        "/auth/password-reset-request",
        {
          email,
        }
      );
    } catch (error) {
      console.error("Error al solicitar restablecimiento:", error);
      throw error;
    }
  },

  /**
   * Restablecer contraseña con token
   * @param resetData - Datos de restablecimiento
   * @returns Promise<OperationResponse>
   */
  resetPassword: async (resetData: {
    token: string;
    new_password: string;
    confirm_password: string;
  }): Promise<OperationResponse> => {
    try {
      return await apiClient.post<OperationResponse>(
        "/auth/password-reset",
        resetData
      );
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      throw error;
    }
  },

  /**
   * Verificar token de autenticación
   * @param token - Token a verificar
   * @returns Promise<{valid: boolean, user?: AuthUser}>
   */
  verifyToken: async (
    token: string
  ): Promise<{ valid: boolean; user?: AuthUser }> => {
    try {
      const response = await apiClient.post<{
        valid: boolean;
        user?: AuthUser;
      }>("/auth/verify-token", { token });
      return response;
    } catch (error) {
      return { valid: false };
    }
  },

  /**
   * Obtener preferencias del usuario
   * @returns Promise<{notifications: boolean, theme: string, language: string}>
   */
  getPreferences: async (): Promise<{
    notifications: boolean;
    theme: string;
    language: string;
  }> => {
    try {
      return await apiClient.get<{
        notifications: boolean;
        theme: string;
        language: string;
      }>("/usuarios/preferences");
    } catch (error) {
      console.error("Error al obtener preferencias:", error);
      return {
        notifications: true,
        theme: "light",
        language: "es",
      };
    }
  },

  /**
   * Actualizar preferencias del usuario
   * @param preferences - Nuevas preferencias
   * @returns Promise<OperationResponse>
   */
  updatePreferences: async (preferences: {
    notifications?: boolean;
    theme?: string;
    language?: string;
  }): Promise<OperationResponse> => {
    try {
      return await apiClient.put<OperationResponse>(
        "/usuarios/preferences",
        preferences
      );
    } catch (error) {
      console.error("Error al actualizar preferencias:", error);
      throw error;
    }
  },

  /**
   * Obtener historial de actividad del usuario
   * @param limit - Límite de registros
   * @returns Promise<{timestamp: string, action: string, details: string}[]>
   */
  getActivityHistory: async (
    limit: number = 10
  ): Promise<{ timestamp: string; action: string; details: string }[]> => {
    try {
      const params = { limit };
      return await apiClient.get<
        { timestamp: string; action: string; details: string }[]
      >("/usuarios/activity-history", { params });
    } catch (error) {
      console.error("Error al obtener historial de actividad:", error);
      return [];
    }
  },

  /**
   * Eliminar cuenta del usuario (si está permitido)
   * @param confirmationData - Datos de confirmación
   * @returns Promise<OperationResponse>
   */
  deleteAccount: async (confirmationData: {
    password: string;
    confirmation: string;
  }): Promise<OperationResponse> => {
    try {
      return await apiClient.delete<OperationResponse>(
        "/usuarios/delete-account",
        {
          data: confirmationData,
        }
      );
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      throw error;
    }
  },
};

export default usuariosEndpoints;
