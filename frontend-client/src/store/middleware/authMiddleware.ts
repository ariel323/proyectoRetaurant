// Authentication middleware for token management and session handling
import { authSelectors, authActions, AUTH_ACTION_TYPES } from '../slices/authSlice';
import { uiActions } from '../slices/uiSlice';

export interface AuthMiddlewareConfig {
  tokenStorage: 'localStorage' | 'sessionStorage';
  refreshThreshold: number; // minutes before expiry to refresh
  sessionTimeout: number; // minutes of inactivity before logout
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
}

const defaultConfig: AuthMiddlewareConfig = {
  tokenStorage: 'localStorage',
  refreshThreshold: 5,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
};

export const createAuthMiddleware = (config: Partial<AuthMiddlewareConfig> = {}) => {
  const cfg = { ...defaultConfig, ...config };
  const storage = cfg.tokenStorage === 'localStorage' ? localStorage : sessionStorage;
  
  let sessionTimer: NodeJS.Timeout | null = null;
  let refreshTimer: NodeJS.Timeout | null = null;

  const startSessionTimer = (dispatch: any) => {
    if (sessionTimer) clearTimeout(sessionTimer);
    
    sessionTimer = setTimeout(() => {
      dispatch(authActions.logout());
      dispatch(uiActions.addToast({
        type: 'warning',
        title: 'Sesión expirada',
        message: 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.',
        duration: 0,
        persistent: true,
      }));
    }, cfg.sessionTimeout * 60 * 1000);
  };

  const startRefreshTimer = (dispatch: any, expiresIn: number) => {
    if (refreshTimer) clearTimeout(refreshTimer);
    
    const refreshTime = (expiresIn - cfg.refreshThreshold) * 60 * 1000;
    if (refreshTime <= 0) return;

    refreshTimer = setTimeout(async () => {
      try {
        const refreshToken = storage.getItem('refreshToken');
        if (!refreshToken) {
          dispatch(authActions.logout());
          return;
        }

        // Here you would call your refresh token API
        // const response = await authService.refreshToken(refreshToken);
        // dispatch(authActions.refreshToken(response.token, response.refreshToken));
        
        dispatch(uiActions.addToast({
          type: 'info',
          title: 'Token actualizado',
          message: 'Tu sesión se ha renovado automáticamente.',
        }));
      } catch (error) {
        console.error('Token refresh failed:', error);
        dispatch(authActions.logout());
        dispatch(uiActions.addToast({
          type: 'error',
          title: 'Error de autenticación',
          message: 'No se pudo renovar tu sesión. Por favor, inicia sesión nuevamente.',
        }));
      }
    }, refreshTime);
  };

  const clearTimers = () => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      sessionTimer = null;
    }
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  };

  return (store: any) => (next: any) => (action: any) => {
    const state = store.getState();
    const authState = state.auth || {};

    // Handle login attempts and lockout
    if (action.type === AUTH_ACTION_TYPES.LOGIN_ERROR) {
      const attempts = authSelectors.getLoginAttempts(authState) + 1;
      
      if (attempts >= cfg.maxLoginAttempts) {
        const lockoutEnd = Date.now() + (cfg.lockoutDuration * 60 * 1000);
        storage.setItem('lockoutEnd', lockoutEnd.toString());
        
        store.dispatch(uiActions.addToast({
          type: 'error',
          title: 'Cuenta bloqueada',
          message: `Demasiados intentos fallidos. Intenta nuevamente en ${cfg.lockoutDuration} minutos.`,
          duration: 0,
          persistent: true,
        }));
      }
    }

    // Check lockout before allowing login
    if (action.type === AUTH_ACTION_TYPES.LOGIN_START) {
      const lockoutEnd = storage.getItem('lockoutEnd');
      if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
        const remainingTime = Math.ceil((parseInt(lockoutEnd) - Date.now()) / (1000 * 60));
        
        store.dispatch(authActions.loginError(
          `Cuenta bloqueada. Intenta nuevamente en ${remainingTime} minutos.`
        ));
        return;
      }
    }

    // Handle successful login
    if (action.type === AUTH_ACTION_TYPES.LOGIN_SUCCESS) {
      const { token, refreshToken, user } = action.payload;
      
      // Store tokens
      storage.setItem('token', token);
      if (refreshToken) {
        storage.setItem('refreshToken', refreshToken);
      }
      storage.setItem('user', JSON.stringify(user));
      
      // Clear lockout
      storage.removeItem('lockoutEnd');
      
      // Start session management
      startSessionTimer(store.dispatch);
      
      // Calculate token expiry and start refresh timer
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expiresIn = (tokenPayload.exp * 1000 - Date.now()) / (1000 * 60); // minutes
        
        store.dispatch(authActions.setSessionExpiry(tokenPayload.exp * 1000));
        startRefreshTimer(store.dispatch, expiresIn);
      } catch (error) {
        console.warn('Could not parse token expiry:', error);
      }

      store.dispatch(uiActions.addToast({
        type: 'success',
        title: 'Bienvenido',
        message: `Hola ${user.nombre}, has iniciado sesión correctamente.`,
      }));
    }

    // Handle logout
    if (action.type === AUTH_ACTION_TYPES.LOGOUT) {
      // Clear storage
      storage.removeItem('token');
      storage.removeItem('refreshToken');
      storage.removeItem('user');
      storage.removeItem('lockoutEnd');
      
      // Clear timers
      clearTimers();
      
      store.dispatch(uiActions.addToast({
        type: 'info',
        title: 'Sesión cerrada',
        message: 'Has cerrado sesión exitosamente.',
      }));
    }

    // Handle activity updates
    if (action.type === AUTH_ACTION_TYPES.UPDATE_LAST_ACTIVITY) {
      if (authSelectors.isAuthenticated(authState)) {
        startSessionTimer(store.dispatch);
      }
    }

    // Handle token refresh
    if (action.type === AUTH_ACTION_TYPES.REFRESH_TOKEN) {
      const { token, refreshToken } = action.payload;
      
      storage.setItem('token', token);
      if (refreshToken) {
        storage.setItem('refreshToken', refreshToken);
      }

      // Restart refresh timer
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expiresIn = (tokenPayload.exp * 1000 - Date.now()) / (1000 * 60);
        
        store.dispatch(authActions.setSessionExpiry(tokenPayload.exp * 1000));
        startRefreshTimer(store.dispatch, expiresIn);
      } catch (error) {
        console.warn('Could not parse refreshed token expiry:', error);
      }
    }

    // Auto-logout on session expiry
    if (authSelectors.isAuthenticated(authState) && authSelectors.isSessionExpired(authState)) {
      store.dispatch(authActions.logout());
      store.dispatch(uiActions.addToast({
        type: 'warning',
        title: 'Sesión expirada',
        message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      }));
      return;
    }

    const result = next(action);

    // Track user activity for non-auth actions
    if (authSelectors.isAuthenticated(store.getState().auth) && 
        !action.type.startsWith('auth/') && 
        !action.type.startsWith('ui/')) {
      store.dispatch(authActions.updateLastActivity());
    }

    return result;
  };
};

// Helper function to initialize auth state from storage
export const initializeAuthFromStorage = (dispatch: any, config: Partial<AuthMiddlewareConfig> = {}) => {
  const cfg = { ...defaultConfig, ...config };
  const storage = cfg.tokenStorage === 'localStorage' ? localStorage : sessionStorage;

  try {
    const token = storage.getItem('token');
    const userStr = storage.getItem('user');
    const refreshToken = storage.getItem('refreshToken');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      
      // Check if token is expired
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        if (tokenPayload.exp * 1000 > Date.now()) {
          dispatch(authActions.loginSuccess(user, token, refreshToken || undefined));
          return true;
        } else {
          // Token expired, clear storage
          storage.removeItem('token');
          storage.removeItem('user');
          storage.removeItem('refreshToken');
        }
      } catch (error) {
        console.warn('Could not parse stored token:', error);
        // Clear invalid token
        storage.removeItem('token');
        storage.removeItem('user');
        storage.removeItem('refreshToken');
      }
    }
  } catch (error) {
    console.error('Error initializing auth from storage:', error);
  }

  return false;
};

export default createAuthMiddleware;
