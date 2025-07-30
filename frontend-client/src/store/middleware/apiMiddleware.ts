// API middleware for handling HTTP requests, responses, and error management
import { uiActions } from '../slices/uiSlice';
import { authActions } from '../slices/authSlice';

export interface ApiMiddlewareConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  showErrorToasts: boolean;
  showSuccessToasts: boolean;
  handleUnauthorized: boolean;
  handleNetworkErrors: boolean;
}

const defaultConfig: ApiMiddlewareConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  showErrorToasts: true,
  showSuccessToasts: false,
  handleUnauthorized: true,
  handleNetworkErrors: true,
};

// Action types that trigger API calls
const API_ACTION_PATTERNS = [
  /^.*\/(fetch|create|update|delete|cancel).*Start$/,
  /^.*\/.*Request$/,
  /^.*\/.*Load$/,
];

const isApiAction = (actionType: string): boolean => {
  return API_ACTION_PATTERNS.some(pattern => pattern.test(actionType));
};

const getApiEndpoint = (actionType: string): string | null => {
  // Map action types to API endpoints
  const endpointMap: Record<string, string> = {
    // Menu actions
    'menu/fetchMenuStart': '/productos',
    'menu/fetchCategoriesStart': '/categorias',
    
    // Cart/Order actions
    'orders/createOrderStart': '/pedidos',
    'orders/fetchOrdersStart': '/pedidos',
    'orders/fetchOrderStart': '/pedidos',
    'orders/updateOrderStatusStart': '/pedidos',
    'orders/cancelOrderStart': '/pedidos',
    
    // Auth actions
    'auth/loginStart': '/auth/login',
    'auth/registerStart': '/auth/register',
    'auth/updateProfileStart': '/auth/profile',
    
    // Mesa actions
    'mesas/fetchMesasStart': '/mesas',
    'mesas/fetchReservasStart': '/reservas',
    'mesas/createReservaStart': '/reservas',
    'mesas/updateMesaStatusStart': '/mesas',
    'mesas/updateReservaStatusStart': '/reservas',
    'mesas/cancelReservaStart': '/reservas',
    'mesas/checkAvailabilityStart': '/mesas/availability',
  };

  return endpointMap[actionType] || null;
};

const getHttpMethod = (actionType: string): string => {
  if (actionType.includes('fetch') || actionType.includes('check')) return 'GET';
  if (actionType.includes('create')) return 'POST';
  if (actionType.includes('update')) return 'PUT';
  if (actionType.includes('delete') || actionType.includes('cancel')) return 'DELETE';
  return 'POST';
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createApiMiddleware = (config: Partial<ApiMiddlewareConfig> = {}) => {
  const cfg = { ...defaultConfig, ...config };

  const makeApiCall = async (
    endpoint: string,
    method: string,
    data?: any,
    token?: string,
    attempt: number = 1
  ): Promise<any> => {
    const url = endpoint.startsWith('http') ? endpoint : `${cfg.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), cfg.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        (error as any).data = errorData;
        throw error;
      }

      const responseData = await response.json();
      return responseData;

    } catch (error: any) {
      clearTimeout(timeoutId);

      // Handle network errors and retries
      if (attempt < cfg.retryAttempts && 
          (error.name === 'AbortError' || error.name === 'TypeError' || error.status >= 500)) {
        await delay(cfg.retryDelay * attempt);
        return makeApiCall(endpoint, method, data, token, attempt + 1);
      }

      throw error;
    }
  };

  return (store: any) => (next: any) => async (action: any) => {
    // Pass through non-API actions
    if (!isApiAction(action.type)) {
      return next(action);
    }

    const endpoint = getApiEndpoint(action.type);
    if (!endpoint) {
      console.warn(`No API endpoint mapped for action: ${action.type}`);
      return next(action);
    }

    const state = store.getState();
    const token = state.auth?.token;
    const method = getHttpMethod(action.type);

    // Dispatch the start action
    const result = next(action);

    // Set loading state
    const operationName = action.type.replace(/Start$/, '');
    store.dispatch(uiActions.setOperationLoading(operationName, true));

    try {
      // Prepare request data
      let requestData = action.payload;
      let requestEndpoint = endpoint;

      // Handle specific cases
      if (action.type.includes('fetchOrder') && action.payload?.id) {
        requestEndpoint = `${endpoint}/${action.payload.id}`;
        requestData = undefined;
      } else if (action.type.includes('update') && action.payload?.id) {
        requestEndpoint = `${endpoint}/${action.payload.id}`;
        requestData = action.payload.data || action.payload;
      } else if (action.type.includes('cancel') && action.payload?.id) {
        requestEndpoint = `${endpoint}/${action.payload}/cancel`;
        requestData = undefined;
      }

      const response = await makeApiCall(requestEndpoint, method, requestData, token);

      // Dispatch success action
      const successActionType = action.type.replace('Start', 'Success');
      store.dispatch({
        type: successActionType,
        payload: response.data || response,
      });

      // Show success toast if configured
      if (cfg.showSuccessToasts && method !== 'GET') {
        const operationMap: Record<string, string> = {
          POST: 'creado',
          PUT: 'actualizado',
          DELETE: 'eliminado',
        };
        
        store.dispatch(uiActions.addToast({
          type: 'success',
          title: 'Operación exitosa',
          message: `El elemento ha sido ${operationMap[method] || 'procesado'} correctamente.`,
        }));
      }

      // Clear network error if it was set
      if (state.ui?.errors?.network) {
        store.dispatch(uiActions.setNetworkError(false));
      }

    } catch (error: any) {
      console.error(`API Error for ${action.type}:`, error);

      // Dispatch error action
      const errorActionType = action.type.replace('Start', 'Error');
      store.dispatch({
        type: errorActionType,
        payload: error.message || 'Error en la comunicación con el servidor',
      });

      // Handle specific error cases
      if (error.status === 401 && cfg.handleUnauthorized) {
        store.dispatch(authActions.logout());
        store.dispatch(uiActions.addToast({
          type: 'error',
          title: 'Sesión expirada',
          message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          persistent: true,
        }));
        return result;
      }

      if (error.status === 403) {
        store.dispatch(uiActions.addToast({
          type: 'error',
          title: 'Acceso denegado',
          message: 'No tienes permisos para realizar esta acción.',
        }));
        return result;
      }

      // Handle network errors
      if (cfg.handleNetworkErrors && (error.name === 'TypeError' || error.name === 'AbortError')) {
        store.dispatch(uiActions.setNetworkError(true));
        
        if (cfg.showErrorToasts) {
          store.dispatch(uiActions.addToast({
            type: 'error',
            title: 'Error de conexión',
            message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
            action: {
              label: 'Reintentar',
              handler: () => store.dispatch(action),
            },
          }));
        }
        return result;
      }

      // Show error toast
      if (cfg.showErrorToasts) {
        let errorMessage = 'Ha ocurrido un error inesperado';
        
        if (error.status === 400) {
          errorMessage = error.data?.message || 'Los datos enviados no son válidos';
        } else if (error.status === 404) {
          errorMessage = 'El recurso solicitado no fue encontrado';
        } else if (error.status === 422) {
          errorMessage = 'Error de validación en los datos';
        } else if (error.status >= 500) {
          errorMessage = 'Error interno del servidor';
        } else if (error.message) {
          errorMessage = error.message;
        }

        store.dispatch(uiActions.addToast({
          type: 'error',
          title: 'Error',
          message: errorMessage,
          duration: error.status >= 500 ? 0 : undefined, // Persistent for server errors
        }));
      }

      // Set last error for debugging
      store.dispatch(uiActions.setLastError(error.message || 'API Error', action.type));

    } finally {
      // Clear loading state
      store.dispatch(uiActions.setOperationLoading(operationName, false));
    }

    return result;
  };
};

// Helper function to create API action creators
export const createApiActions = (entityName: string, endpoints: Record<string, string>) => {
  const actions: Record<string, any> = {};

  Object.entries(endpoints).forEach(([actionName, endpoint]) => {
    const startActionType = `${entityName}/${actionName}Start`;
    const successActionType = `${entityName}/${actionName}Success`;
    const errorActionType = `${entityName}/${actionName}Error`;

    actions[`${actionName}Start`] = (payload?: any) => ({
      type: startActionType,
      payload,
    });

    actions[`${actionName}Success`] = (payload: any) => ({
      type: successActionType,
      payload,
    });

    actions[`${actionName}Error`] = (payload: string) => ({
      type: errorActionType,
      payload,
    });
  });

  return actions;
};

export default createApiMiddleware;
