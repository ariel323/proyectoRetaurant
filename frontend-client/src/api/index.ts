import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '../types';
import { API_CONFIG } from './config';
import { setupInterceptors } from './interceptors';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Configurar interceptores usando el módulo desacoplado
    this.setupInterceptors();
  }

  private setupInterceptors() {
    if (process.env.NODE_ENV === 'development') {
      // Configuración para desarrollo con logging completo
      setupInterceptors(this.client, {
        enableLogging: true,
        enableRetry: true,
        enableAuth: false, // Cambiar a true si se requiere autenticación
        enableCacheControl: true,
        retryConfig: {
          retries: API_CONFIG.RETRY_ATTEMPTS,
          retryDelay: API_CONFIG.RETRY_DELAY,
          retryOn: [500, 502, 503, 504]
        }
      });
    } else {
      // Configuración para producción
      setupInterceptors(this.client, {
        enableLogging: false,
        enableRetry: true,
        enableAuth: false, // Cambiar a true si se requiere autenticación
        enableCacheControl: true,
        retryConfig: {
          retries: API_CONFIG.RETRY_ATTEMPTS,
          retryDelay: API_CONFIG.RETRY_DELAY,
          retryOn: [500, 502, 503, 504]
        }
      });
    }
  }

  /**
   * Método GET genérico
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return this.extractData(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Método POST genérico
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return this.extractData(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Método PUT genérico
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return this.extractData(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Método PATCH genérico
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return this.extractData(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Método DELETE genérico
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return this.extractData(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Método para subir archivos
   */
  async uploadFile<T>(url: string, file: File, fieldName = 'file', additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return this.extractData(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Método para requests con parámetros de búsqueda
   */
  async search<T>(url: string, params: Record<string, any>): Promise<T> {
    return this.get<T>(url, { params });
  }

  /**
   * Método para requests paginadas
   */
  async paginate<T>(
    url: string, 
    page: number = 1, 
    limit: number = 10, 
    additionalParams?: Record<string, any>
  ): Promise<ApiResponse<T[]>> {
    const params = {
      page,
      limit,
      ...additionalParams,
    };

    try {
      const response = await this.client.get<ApiResponse<T[]>>(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Extrae los datos de la respuesta de la API
   */
  private extractData<T>(response: ApiResponse<T> | T): T {
    // Si la respuesta ya tiene la estructura de ApiResponse
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as ApiResponse<T>).data;
    }
    
    // Si la respuesta es directamente los datos
    return response as T;
  }

  /**
   * Maneja y transforma errores
   */
  private handleError(error: any): ApiError {
    // Si ya es un ApiError (procesado por los interceptores), lo devolvemos tal como está
    if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
      return error as ApiError;
    }

    // Si no, creamos un ApiError genérico
    return {
      message: 'Error inesperado en la comunicación con el servidor',
      status: 0,
      code: 'UNEXPECTED_ERROR',
    };
  }

  /**
   * Obtiene la instancia de Axios para casos especiales
   */
  getInstance(): AxiosInstance {
    return this.client;
  }

  /**
   * Permite configurar headers globales
   */
  setGlobalHeader(key: string, value: string): void {
    this.client.defaults.headers[key] = value;
  }

  /**
   * Permite remover headers globales
   */
  removeGlobalHeader(key: string): void {
    delete this.client.defaults.headers[key];
  }

  /**
   * Permite cambiar el timeout globalmente
   */
  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// Export por defecto para compatibilidad
export default apiClient;

// Exports adicionales para casos de uso específicos
export { ApiClient };
