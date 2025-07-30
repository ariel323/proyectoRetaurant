// UI state management and application-wide interface state
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

export interface ModalState {
  isOpen: boolean;
  type: 'confirm' | 'alert' | 'custom' | null;
  title?: string;
  content?: string;
  component?: string;
  props?: Record<string, any>;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDismissible?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface LoadingState {
  global: boolean;
  components: Record<string, boolean>;
  operations: Record<string, boolean>;
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  sidebarCollapsed: boolean;
  animations: boolean;
  reducedMotion: boolean;
}

export interface NavigationState {
  currentPage: string;
  breadcrumbs: Array<{
    label: string;
    path: string;
    icon?: string;
  }>;
  backHistory: string[];
  canGoBack: boolean;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
}

export interface UIState {
  toasts: ToastMessage[];
  modal: ModalState;
  loading: LoadingState;
  theme: ThemeState;
  navigation: NavigationState;
  layout: {
    headerHeight: number;
    sidebarWidth: number;
    footerHeight: number;
    contentPadding: number;
  };
  device: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    orientation: 'portrait' | 'landscape';
    online: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    notifications: {
      orders: boolean;
      promotions: boolean;
      system: boolean;
      email: boolean;
      push: boolean;
    };
  };
  errors: {
    global: string | null;
    network: boolean;
    lastError: {
      message: string;
      timestamp: string;
      action?: string;
    } | null;
  };
}

// Action types
export const UI_ACTION_TYPES = {
  // Toast actions
  ADD_TOAST: 'ui/addToast',
  REMOVE_TOAST: 'ui/removeToast',
  CLEAR_TOASTS: 'ui/clearToasts',
  
  // Modal actions
  OPEN_MODAL: 'ui/openModal',
  CLOSE_MODAL: 'ui/closeModal',
  UPDATE_MODAL: 'ui/updateModal',
  
  // Loading actions
  SET_GLOBAL_LOADING: 'ui/setGlobalLoading',
  SET_COMPONENT_LOADING: 'ui/setComponentLoading',
  SET_OPERATION_LOADING: 'ui/setOperationLoading',
  CLEAR_LOADING: 'ui/clearLoading',
  
  // Theme actions
  SET_THEME_MODE: 'ui/setThemeMode',
  SET_PRIMARY_COLOR: 'ui/setPrimaryColor',
  SET_FONT_SIZE: 'ui/setFontSize',
  TOGGLE_SIDEBAR: 'ui/toggleSidebar',
  SET_ANIMATIONS: 'ui/setAnimations',
  SET_REDUCED_MOTION: 'ui/setReducedMotion',
  
  // Navigation actions
  SET_CURRENT_PAGE: 'ui/setCurrentPage',
  SET_BREADCRUMBS: 'ui/setBreadcrumbs',
  ADD_BREADCRUMB: 'ui/addBreadcrumb',
  GO_BACK: 'ui/goBack',
  TOGGLE_MOBILE_MENU: 'ui/toggleMobileMenu',
  SET_SIDEBAR_OPEN: 'ui/setSidebarOpen',
  
  // Layout actions
  SET_LAYOUT_DIMENSIONS: 'ui/setLayoutDimensions',
  
  // Device actions
  SET_DEVICE_INFO: 'ui/setDeviceInfo',
  SET_ONLINE_STATUS: 'ui/setOnlineStatus',
  
  // Preferences actions
  SET_LANGUAGE: 'ui/setLanguage',
  SET_CURRENCY: 'ui/setCurrency',
  SET_DATE_FORMAT: 'ui/setDateFormat',
  SET_TIME_FORMAT: 'ui/setTimeFormat',
  UPDATE_NOTIFICATION_PREFERENCES: 'ui/updateNotificationPreferences',
  
  // Error actions
  SET_GLOBAL_ERROR: 'ui/setGlobalError',
  CLEAR_GLOBAL_ERROR: 'ui/clearGlobalError',
  SET_NETWORK_ERROR: 'ui/setNetworkError',
  SET_LAST_ERROR: 'ui/setLastError',
  CLEAR_ERRORS: 'ui/clearErrors',
} as const;

export type UIAction =
  | { type: typeof UI_ACTION_TYPES.ADD_TOAST; payload: ToastMessage }
  | { type: typeof UI_ACTION_TYPES.REMOVE_TOAST; payload: string }
  | { type: typeof UI_ACTION_TYPES.CLEAR_TOASTS }
  | { type: typeof UI_ACTION_TYPES.OPEN_MODAL; payload: Omit<ModalState, 'isOpen'> }
  | { type: typeof UI_ACTION_TYPES.CLOSE_MODAL }
  | { type: typeof UI_ACTION_TYPES.UPDATE_MODAL; payload: Partial<ModalState> }
  | { type: typeof UI_ACTION_TYPES.SET_GLOBAL_LOADING; payload: boolean }
  | { type: typeof UI_ACTION_TYPES.SET_COMPONENT_LOADING; payload: { component: string; loading: boolean } }
  | { type: typeof UI_ACTION_TYPES.SET_OPERATION_LOADING; payload: { operation: string; loading: boolean } }
  | { type: typeof UI_ACTION_TYPES.CLEAR_LOADING }
  | { type: typeof UI_ACTION_TYPES.SET_THEME_MODE; payload: ThemeState['mode'] }
  | { type: typeof UI_ACTION_TYPES.SET_PRIMARY_COLOR; payload: string }
  | { type: typeof UI_ACTION_TYPES.SET_FONT_SIZE; payload: ThemeState['fontSize'] }
  | { type: typeof UI_ACTION_TYPES.TOGGLE_SIDEBAR }
  | { type: typeof UI_ACTION_TYPES.SET_ANIMATIONS; payload: boolean }
  | { type: typeof UI_ACTION_TYPES.SET_REDUCED_MOTION; payload: boolean }
  | { type: typeof UI_ACTION_TYPES.SET_CURRENT_PAGE; payload: string }
  | { type: typeof UI_ACTION_TYPES.SET_BREADCRUMBS; payload: NavigationState['breadcrumbs'] }
  | { type: typeof UI_ACTION_TYPES.ADD_BREADCRUMB; payload: NavigationState['breadcrumbs'][0] }
  | { type: typeof UI_ACTION_TYPES.GO_BACK }
  | { type: typeof UI_ACTION_TYPES.TOGGLE_MOBILE_MENU }
  | { type: typeof UI_ACTION_TYPES.SET_SIDEBAR_OPEN; payload: boolean }
  | { type: typeof UI_ACTION_TYPES.SET_LAYOUT_DIMENSIONS; payload: Partial<UIState['layout']> }
  | { type: typeof UI_ACTION_TYPES.SET_DEVICE_INFO; payload: Partial<UIState['device']> }
  | { type: typeof UI_ACTION_TYPES.SET_ONLINE_STATUS; payload: boolean }
  | { type: typeof UI_ACTION_TYPES.SET_LANGUAGE; payload: string }
  | { type: typeof UI_ACTION_TYPES.SET_CURRENCY; payload: string }
  | { type: typeof UI_ACTION_TYPES.SET_DATE_FORMAT; payload: string }
  | { type: typeof UI_ACTION_TYPES.SET_TIME_FORMAT; payload: UIState['preferences']['timeFormat'] }
  | { type: typeof UI_ACTION_TYPES.UPDATE_NOTIFICATION_PREFERENCES; payload: Partial<UIState['preferences']['notifications']> }
  | { type: typeof UI_ACTION_TYPES.SET_GLOBAL_ERROR; payload: string }
  | { type: typeof UI_ACTION_TYPES.CLEAR_GLOBAL_ERROR }
  | { type: typeof UI_ACTION_TYPES.SET_NETWORK_ERROR; payload: boolean }
  | { type: typeof UI_ACTION_TYPES.SET_LAST_ERROR; payload: { message: string; action?: string } }
  | { type: typeof UI_ACTION_TYPES.CLEAR_ERRORS };

// Initial state
export const initialUIState: UIState = {
  toasts: [],
  modal: {
    isOpen: false,
    type: null,
  },
  loading: {
    global: false,
    components: {},
    operations: {},
  },
  theme: {
    mode: 'light',
    primaryColor: '#f97316', // orange-500
    fontSize: 'md',
    sidebarCollapsed: false,
    animations: true,
    reducedMotion: false,
  },
  navigation: {
    currentPage: '/',
    breadcrumbs: [],
    backHistory: [],
    canGoBack: false,
    sidebarOpen: false,
    mobileMenuOpen: false,
  },
  layout: {
    headerHeight: 64,
    sidebarWidth: 280,
    footerHeight: 60,
    contentPadding: 24,
  },
  device: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape',
    online: true,
  },
  preferences: {
    language: 'es',
    currency: 'CLP',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    notifications: {
      orders: true,
      promotions: true,
      system: true,
      email: true,
      push: true,
    },
  },
  errors: {
    global: null,
    network: false,
    lastError: null,
  },
};

// Reducer
export const uiReducer = (state: UIState = initialUIState, action: UIAction): UIState => {
  switch (action.type) {
    case UI_ACTION_TYPES.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };

    case UI_ACTION_TYPES.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };

    case UI_ACTION_TYPES.CLEAR_TOASTS:
      return {
        ...state,
        toasts: [],
      };

    case UI_ACTION_TYPES.OPEN_MODAL:
      return {
        ...state,
        modal: {
          ...action.payload,
          isOpen: true,
        },
      };

    case UI_ACTION_TYPES.CLOSE_MODAL:
      return {
        ...state,
        modal: {
          isOpen: false,
          type: null,
        },
      };

    case UI_ACTION_TYPES.UPDATE_MODAL:
      return {
        ...state,
        modal: {
          ...state.modal,
          ...action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_GLOBAL_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          global: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_COMPONENT_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          components: {
            ...state.loading.components,
            [action.payload.component]: action.payload.loading,
          },
        },
      };

    case UI_ACTION_TYPES.SET_OPERATION_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          operations: {
            ...state.loading.operations,
            [action.payload.operation]: action.payload.loading,
          },
        },
      };

    case UI_ACTION_TYPES.CLEAR_LOADING:
      return {
        ...state,
        loading: {
          global: false,
          components: {},
          operations: {},
        },
      };

    case UI_ACTION_TYPES.SET_THEME_MODE:
      return {
        ...state,
        theme: {
          ...state.theme,
          mode: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_PRIMARY_COLOR:
      return {
        ...state,
        theme: {
          ...state.theme,
          primaryColor: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_FONT_SIZE:
      return {
        ...state,
        theme: {
          ...state.theme,
          fontSize: action.payload,
        },
      };

    case UI_ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        theme: {
          ...state.theme,
          sidebarCollapsed: !state.theme.sidebarCollapsed,
        },
      };

    case UI_ACTION_TYPES.SET_ANIMATIONS:
      return {
        ...state,
        theme: {
          ...state.theme,
          animations: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_REDUCED_MOTION:
      return {
        ...state,
        theme: {
          ...state.theme,
          reducedMotion: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_CURRENT_PAGE:
      const newBackHistory = state.navigation.currentPage !== action.payload 
        ? [...state.navigation.backHistory, state.navigation.currentPage]
        : state.navigation.backHistory;

      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentPage: action.payload,
          backHistory: newBackHistory.slice(-10), // Keep only last 10 pages
          canGoBack: newBackHistory.length > 0,
        },
      };

    case UI_ACTION_TYPES.SET_BREADCRUMBS:
      return {
        ...state,
        navigation: {
          ...state.navigation,
          breadcrumbs: action.payload,
        },
      };

    case UI_ACTION_TYPES.ADD_BREADCRUMB:
      return {
        ...state,
        navigation: {
          ...state.navigation,
          breadcrumbs: [...state.navigation.breadcrumbs, action.payload],
        },
      };

    case UI_ACTION_TYPES.GO_BACK:
      if (state.navigation.backHistory.length === 0) return state;
      
      const lastPage = state.navigation.backHistory[state.navigation.backHistory.length - 1];
      const newHistory = state.navigation.backHistory.slice(0, -1);

      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentPage: lastPage,
          backHistory: newHistory,
          canGoBack: newHistory.length > 0,
        },
      };

    case UI_ACTION_TYPES.TOGGLE_MOBILE_MENU:
      return {
        ...state,
        navigation: {
          ...state.navigation,
          mobileMenuOpen: !state.navigation.mobileMenuOpen,
        },
      };

    case UI_ACTION_TYPES.SET_SIDEBAR_OPEN:
      return {
        ...state,
        navigation: {
          ...state.navigation,
          sidebarOpen: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_LAYOUT_DIMENSIONS:
      return {
        ...state,
        layout: {
          ...state.layout,
          ...action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_DEVICE_INFO:
      return {
        ...state,
        device: {
          ...state.device,
          ...action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_ONLINE_STATUS:
      return {
        ...state,
        device: {
          ...state.device,
          online: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_LANGUAGE:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          language: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_CURRENCY:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          currency: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_DATE_FORMAT:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          dateFormat: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_TIME_FORMAT:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          timeFormat: action.payload,
        },
      };

    case UI_ACTION_TYPES.UPDATE_NOTIFICATION_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          notifications: {
            ...state.preferences.notifications,
            ...action.payload,
          },
        },
      };

    case UI_ACTION_TYPES.SET_GLOBAL_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          global: action.payload,
        },
      };

    case UI_ACTION_TYPES.CLEAR_GLOBAL_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          global: null,
        },
      };

    case UI_ACTION_TYPES.SET_NETWORK_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          network: action.payload,
        },
      };

    case UI_ACTION_TYPES.SET_LAST_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          lastError: {
            ...action.payload,
            timestamp: new Date().toISOString(),
          },
        },
      };

    case UI_ACTION_TYPES.CLEAR_ERRORS:
      return {
        ...state,
        errors: {
          global: null,
          network: false,
          lastError: null,
        },
      };

    default:
      return state;
  }
};

// Action creators
export const uiActions = {
  // Toast actions
  addToast: (toast: Omit<ToastMessage, 'id'>) => ({
    type: UI_ACTION_TYPES.ADD_TOAST,
    payload: { ...toast, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) },
  }),
  removeToast: (id: string) => ({ type: UI_ACTION_TYPES.REMOVE_TOAST, payload: id }),
  clearToasts: () => ({ type: UI_ACTION_TYPES.CLEAR_TOASTS }),
  
  // Modal actions
  openModal: (modal: Omit<ModalState, 'isOpen'>) => ({ type: UI_ACTION_TYPES.OPEN_MODAL, payload: modal }),
  closeModal: () => ({ type: UI_ACTION_TYPES.CLOSE_MODAL }),
  updateModal: (updates: Partial<ModalState>) => ({ type: UI_ACTION_TYPES.UPDATE_MODAL, payload: updates }),
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => ({ type: UI_ACTION_TYPES.SET_GLOBAL_LOADING, payload: loading }),
  setComponentLoading: (component: string, loading: boolean) => ({
    type: UI_ACTION_TYPES.SET_COMPONENT_LOADING,
    payload: { component, loading },
  }),
  setOperationLoading: (operation: string, loading: boolean) => ({
    type: UI_ACTION_TYPES.SET_OPERATION_LOADING,
    payload: { operation, loading },
  }),
  clearLoading: () => ({ type: UI_ACTION_TYPES.CLEAR_LOADING }),
  
  // Theme actions
  setThemeMode: (mode: ThemeState['mode']) => ({ type: UI_ACTION_TYPES.SET_THEME_MODE, payload: mode }),
  setPrimaryColor: (color: string) => ({ type: UI_ACTION_TYPES.SET_PRIMARY_COLOR, payload: color }),
  setFontSize: (size: ThemeState['fontSize']) => ({ type: UI_ACTION_TYPES.SET_FONT_SIZE, payload: size }),
  toggleSidebar: () => ({ type: UI_ACTION_TYPES.TOGGLE_SIDEBAR }),
  setAnimations: (enabled: boolean) => ({ type: UI_ACTION_TYPES.SET_ANIMATIONS, payload: enabled }),
  setReducedMotion: (enabled: boolean) => ({ type: UI_ACTION_TYPES.SET_REDUCED_MOTION, payload: enabled }),
  
  // Navigation actions
  setCurrentPage: (page: string) => ({ type: UI_ACTION_TYPES.SET_CURRENT_PAGE, payload: page }),
  setBreadcrumbs: (breadcrumbs: NavigationState['breadcrumbs']) => ({
    type: UI_ACTION_TYPES.SET_BREADCRUMBS,
    payload: breadcrumbs,
  }),
  addBreadcrumb: (breadcrumb: NavigationState['breadcrumbs'][0]) => ({
    type: UI_ACTION_TYPES.ADD_BREADCRUMB,
    payload: breadcrumb,
  }),
  goBack: () => ({ type: UI_ACTION_TYPES.GO_BACK }),
  toggleMobileMenu: () => ({ type: UI_ACTION_TYPES.TOGGLE_MOBILE_MENU }),
  setSidebarOpen: (open: boolean) => ({ type: UI_ACTION_TYPES.SET_SIDEBAR_OPEN, payload: open }),
  
  // Layout actions
  setLayoutDimensions: (dimensions: Partial<UIState['layout']>) => ({
    type: UI_ACTION_TYPES.SET_LAYOUT_DIMENSIONS,
    payload: dimensions,
  }),
  
  // Device actions
  setDeviceInfo: (info: Partial<UIState['device']>) => ({ type: UI_ACTION_TYPES.SET_DEVICE_INFO, payload: info }),
  setOnlineStatus: (online: boolean) => ({ type: UI_ACTION_TYPES.SET_ONLINE_STATUS, payload: online }),
  
  // Preferences actions
  setLanguage: (language: string) => ({ type: UI_ACTION_TYPES.SET_LANGUAGE, payload: language }),
  setCurrency: (currency: string) => ({ type: UI_ACTION_TYPES.SET_CURRENCY, payload: currency }),
  setDateFormat: (format: string) => ({ type: UI_ACTION_TYPES.SET_DATE_FORMAT, payload: format }),
  setTimeFormat: (format: UIState['preferences']['timeFormat']) => ({
    type: UI_ACTION_TYPES.SET_TIME_FORMAT,
    payload: format,
  }),
  updateNotificationPreferences: (preferences: Partial<UIState['preferences']['notifications']>) => ({
    type: UI_ACTION_TYPES.UPDATE_NOTIFICATION_PREFERENCES,
    payload: preferences,
  }),
  
  // Error actions
  setGlobalError: (error: string) => ({ type: UI_ACTION_TYPES.SET_GLOBAL_ERROR, payload: error }),
  clearGlobalError: () => ({ type: UI_ACTION_TYPES.CLEAR_GLOBAL_ERROR }),
  setNetworkError: (error: boolean) => ({ type: UI_ACTION_TYPES.SET_NETWORK_ERROR, payload: error }),
  setLastError: (message: string, action?: string) => ({
    type: UI_ACTION_TYPES.SET_LAST_ERROR,
    payload: { message, action },
  }),
  clearErrors: () => ({ type: UI_ACTION_TYPES.CLEAR_ERRORS }),
} as const;

// Selectors
export const uiSelectors = {
  // Toast selectors
  getAllToasts: (state: UIState) => state.toasts,
  getToastById: (state: UIState, id: string) => state.toasts.find(toast => toast.id === id),
  
  // Modal selectors
  getModal: (state: UIState) => state.modal,
  isModalOpen: (state: UIState) => state.modal.isOpen,
  getModalType: (state: UIState) => state.modal.type,
  
  // Loading selectors
  getGlobalLoading: (state: UIState) => state.loading.global,
  getComponentLoading: (state: UIState, component: string) => state.loading.components[component] || false,
  getOperationLoading: (state: UIState, operation: string) => state.loading.operations[operation] || false,
  isAnyLoading: (state: UIState) => 
    state.loading.global || 
    Object.values(state.loading.components).some(Boolean) ||
    Object.values(state.loading.operations).some(Boolean),
  
  // Theme selectors
  getTheme: (state: UIState) => state.theme,
  getThemeMode: (state: UIState) => state.theme.mode,
  getPrimaryColor: (state: UIState) => state.theme.primaryColor,
  getFontSize: (state: UIState) => state.theme.fontSize,
  isSidebarCollapsed: (state: UIState) => state.theme.sidebarCollapsed,
  areAnimationsEnabled: (state: UIState) => state.theme.animations,
  isReducedMotion: (state: UIState) => state.theme.reducedMotion,
  
  // Navigation selectors
  getNavigation: (state: UIState) => state.navigation,
  getCurrentPage: (state: UIState) => state.navigation.currentPage,
  getBreadcrumbs: (state: UIState) => state.navigation.breadcrumbs,
  canGoBack: (state: UIState) => state.navigation.canGoBack,
  isSidebarOpen: (state: UIState) => state.navigation.sidebarOpen,
  isMobileMenuOpen: (state: UIState) => state.navigation.mobileMenuOpen,
  
  // Layout selectors
  getLayout: (state: UIState) => state.layout,
  getLayoutDimensions: (state: UIState) => state.layout,
  
  // Device selectors
  getDevice: (state: UIState) => state.device,
  isMobile: (state: UIState) => state.device.isMobile,
  isTablet: (state: UIState) => state.device.isTablet,
  isDesktop: (state: UIState) => state.device.isDesktop,
  getOrientation: (state: UIState) => state.device.orientation,
  isOnline: (state: UIState) => state.device.online,
  
  // Preferences selectors
  getPreferences: (state: UIState) => state.preferences,
  getLanguage: (state: UIState) => state.preferences.language,
  getCurrency: (state: UIState) => state.preferences.currency,
  getDateFormat: (state: UIState) => state.preferences.dateFormat,
  getTimeFormat: (state: UIState) => state.preferences.timeFormat,
  getNotificationPreferences: (state: UIState) => state.preferences.notifications,
  
  // Error selectors
  getErrors: (state: UIState) => state.errors,
  getGlobalError: (state: UIState) => state.errors.global,
  hasNetworkError: (state: UIState) => state.errors.network,
  getLastError: (state: UIState) => state.errors.lastError,
  hasAnyError: (state: UIState) => 
    Boolean(state.errors.global || state.errors.network || state.errors.lastError),
};

export default uiReducer;
