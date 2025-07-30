// User authentication and session management
export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  role?: 'customer' | 'admin';
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
  created_at?: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  loginAttempts: number;
  lastActivity: number;
  sessionExpiry: number | null;
}

// Action types
export const AUTH_ACTION_TYPES = {
  LOGIN_START: 'auth/loginStart',
  LOGIN_SUCCESS: 'auth/loginSuccess',
  LOGIN_ERROR: 'auth/loginError',
  LOGOUT: 'auth/logout',
  REGISTER_START: 'auth/registerStart',
  REGISTER_SUCCESS: 'auth/registerSuccess',
  REGISTER_ERROR: 'auth/registerError',
  UPDATE_PROFILE_START: 'auth/updateProfileStart',
  UPDATE_PROFILE_SUCCESS: 'auth/updateProfileSuccess',
  UPDATE_PROFILE_ERROR: 'auth/updateProfileError',
  REFRESH_TOKEN: 'auth/refreshToken',
  RESET_ERROR: 'auth/resetError',
  INCREMENT_LOGIN_ATTEMPTS: 'auth/incrementLoginAttempts',
  RESET_LOGIN_ATTEMPTS: 'auth/resetLoginAttempts',
  UPDATE_LAST_ACTIVITY: 'auth/updateLastActivity',
  SET_SESSION_EXPIRY: 'auth/setSessionExpiry',
} as const;

export type AuthAction =
  | { type: typeof AUTH_ACTION_TYPES.LOGIN_START }
  | { type: typeof AUTH_ACTION_TYPES.LOGIN_SUCCESS; payload: { user: User; token: string; refreshToken?: string } }
  | { type: typeof AUTH_ACTION_TYPES.LOGIN_ERROR; payload: string }
  | { type: typeof AUTH_ACTION_TYPES.LOGOUT }
  | { type: typeof AUTH_ACTION_TYPES.REGISTER_START }
  | { type: typeof AUTH_ACTION_TYPES.REGISTER_SUCCESS; payload: { user: User; token: string } }
  | { type: typeof AUTH_ACTION_TYPES.REGISTER_ERROR; payload: string }
  | { type: typeof AUTH_ACTION_TYPES.UPDATE_PROFILE_START }
  | { type: typeof AUTH_ACTION_TYPES.UPDATE_PROFILE_SUCCESS; payload: User }
  | { type: typeof AUTH_ACTION_TYPES.UPDATE_PROFILE_ERROR; payload: string }
  | { type: typeof AUTH_ACTION_TYPES.REFRESH_TOKEN; payload: { token: string; refreshToken?: string } }
  | { type: typeof AUTH_ACTION_TYPES.RESET_ERROR }
  | { type: typeof AUTH_ACTION_TYPES.INCREMENT_LOGIN_ATTEMPTS }
  | { type: typeof AUTH_ACTION_TYPES.RESET_LOGIN_ATTEMPTS }
  | { type: typeof AUTH_ACTION_TYPES.UPDATE_LAST_ACTIVITY }
  | { type: typeof AUTH_ACTION_TYPES.SET_SESSION_EXPIRY; payload: number };

// Initial state
export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  refreshToken: null,
  loginAttempts: 0,
  lastActivity: Date.now(),
  sessionExpiry: null,
};

// Reducer
export const authReducer = (state: AuthState = initialAuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH_ACTION_TYPES.LOGIN_START:
    case AUTH_ACTION_TYPES.REGISTER_START:
    case AUTH_ACTION_TYPES.UPDATE_PROFILE_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken || null,
        error: null,
        loginAttempts: 0,
        lastActivity: Date.now(),
      };

    case AUTH_ACTION_TYPES.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        loginAttempts: state.loginAttempts + 1,
      };

    case AUTH_ACTION_TYPES.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTION_TYPES.REGISTER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTION_TYPES.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };

    case AUTH_ACTION_TYPES.UPDATE_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTION_TYPES.REFRESH_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken || state.refreshToken,
        lastActivity: Date.now(),
      };

    case AUTH_ACTION_TYPES.LOGOUT:
      return {
        ...initialAuthState,
        lastActivity: Date.now(),
      };

    case AUTH_ACTION_TYPES.RESET_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTION_TYPES.INCREMENT_LOGIN_ATTEMPTS:
      return {
        ...state,
        loginAttempts: state.loginAttempts + 1,
      };

    case AUTH_ACTION_TYPES.RESET_LOGIN_ATTEMPTS:
      return {
        ...state,
        loginAttempts: 0,
      };

    case AUTH_ACTION_TYPES.UPDATE_LAST_ACTIVITY:
      return {
        ...state,
        lastActivity: Date.now(),
      };

    case AUTH_ACTION_TYPES.SET_SESSION_EXPIRY:
      return {
        ...state,
        sessionExpiry: action.payload,
      };

    default:
      return state;
  }
};

// Action creators
export const authActions = {
  loginStart: () => ({ type: AUTH_ACTION_TYPES.LOGIN_START }),
  loginSuccess: (user: User, token: string, refreshToken?: string) => ({
    type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
    payload: { user, token, refreshToken },
  }),
  loginError: (error: string) => ({
    type: AUTH_ACTION_TYPES.LOGIN_ERROR,
    payload: error,
  }),
  logout: () => ({ type: AUTH_ACTION_TYPES.LOGOUT }),
  registerStart: () => ({ type: AUTH_ACTION_TYPES.REGISTER_START }),
  registerSuccess: (user: User, token: string) => ({
    type: AUTH_ACTION_TYPES.REGISTER_SUCCESS,
    payload: { user, token },
  }),
  registerError: (error: string) => ({
    type: AUTH_ACTION_TYPES.REGISTER_ERROR,
    payload: error,
  }),
  updateProfileStart: () => ({ type: AUTH_ACTION_TYPES.UPDATE_PROFILE_START }),
  updateProfileSuccess: (user: User) => ({
    type: AUTH_ACTION_TYPES.UPDATE_PROFILE_SUCCESS,
    payload: user,
  }),
  updateProfileError: (error: string) => ({
    type: AUTH_ACTION_TYPES.UPDATE_PROFILE_ERROR,
    payload: error,
  }),
  refreshToken: (token: string, refreshToken?: string) => ({
    type: AUTH_ACTION_TYPES.REFRESH_TOKEN,
    payload: { token, refreshToken },
  }),
  resetError: () => ({ type: AUTH_ACTION_TYPES.RESET_ERROR }),
  incrementLoginAttempts: () => ({ type: AUTH_ACTION_TYPES.INCREMENT_LOGIN_ATTEMPTS }),
  resetLoginAttempts: () => ({ type: AUTH_ACTION_TYPES.RESET_LOGIN_ATTEMPTS }),
  updateLastActivity: () => ({ type: AUTH_ACTION_TYPES.UPDATE_LAST_ACTIVITY }),
  setSessionExpiry: (expiry: number) => ({
    type: AUTH_ACTION_TYPES.SET_SESSION_EXPIRY,
    payload: expiry,
  }),
} as const;

// Selectors
export const authSelectors = {
  getUser: (state: AuthState) => state.user,
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  getLoading: (state: AuthState) => state.loading,
  getError: (state: AuthState) => state.error,
  getToken: (state: AuthState) => state.token,
  getRefreshToken: (state: AuthState) => state.refreshToken,
  getLoginAttempts: (state: AuthState) => state.loginAttempts,
  getLastActivity: (state: AuthState) => state.lastActivity,
  getSessionExpiry: (state: AuthState) => state.sessionExpiry,
  isSessionExpired: (state: AuthState) => {
    if (!state.sessionExpiry) return false;
    return Date.now() > state.sessionExpiry;
  },
  canAttemptLogin: (state: AuthState, maxAttempts: number = 5) => 
    state.loginAttempts < maxAttempts,
  getUserRole: (state: AuthState) => state.user?.role || 'customer',
  isAdmin: (state: AuthState) => state.user?.role === 'admin',
  getUserPreferences: (state: AuthState) => state.user?.preferences || {
    theme: 'light' as const,
    language: 'es',
    notifications: true,
  },
};

export default authReducer;
