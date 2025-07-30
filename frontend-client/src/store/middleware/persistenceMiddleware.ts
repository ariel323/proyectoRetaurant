// Persistence middleware for saving and restoring state to/from localStorage

export interface PersistenceConfig {
  storage: 'localStorage' | 'sessionStorage';
  key: string;
  whitelist?: string[]; // State slices to persist
  blacklist?: string[]; // State slices to exclude
  transforms?: Record<string, {
    serialize?: (state: any) => any;
    deserialize?: (state: any) => any;
  }>;
  throttle: number; // Debounce time in milliseconds
  version: number; // Schema version for migrations
}

const defaultConfig: PersistenceConfig = {
  storage: 'localStorage',
  key: 'restaurant-app-state',
  whitelist: ['cart', 'ui', 'menu'],
  blacklist: ['auth'], // Auth handled separately for security
  throttle: 1000,
  version: 1,
};

// Actions that should trigger persistence
const PERSISTENCE_TRIGGER_PATTERNS = [
  /^cart\//,
  /^ui\/(setTheme|setLanguage|setCurrency|setPreferences)/,
  /^menu\/(setFilters|setSortBy)/,
];

const shouldPersist = (actionType: string): boolean => {
  return PERSISTENCE_TRIGGER_PATTERNS.some(pattern => pattern.test(actionType));
};

// Default transforms for common data types
const defaultTransforms = {
  ui: {
    serialize: (state: any) => ({
      ...state,
      // Don't persist loading states, toasts, or modals
      loading: { global: false, components: {}, operations: {} },
      toasts: [],
      modal: { isOpen: false, type: null },
      errors: { global: null, network: false, lastError: null },
    }),
    deserialize: (state: any) => ({
      ...state,
      loading: { global: false, components: {}, operations: {} },
      toasts: [],
      modal: { isOpen: false, type: null },
      errors: { global: null, network: false, lastError: null },
    }),
  },
  cart: {
    serialize: (state: any) => state,
    deserialize: (state: any) => state,
  },
  menu: {
    serialize: (state: any) => ({
      // Only persist filters and preferences, not the actual menu data
      filters: state.filters,
      sortBy: state.sortBy,
      viewMode: state.viewMode,
    }),
    deserialize: (persistedState: any) => ({
      productos: [],
      categorias: [],
      loading: false,
      error: null,
      lastUpdate: null,
      ...persistedState,
    }),
  },
};

export const createPersistenceMiddleware = (config: Partial<PersistenceConfig> = {}) => {
  const cfg = { ...defaultConfig, ...config };
  const storage = cfg.storage === 'localStorage' ? localStorage : sessionStorage;
  const transforms = { ...defaultTransforms, ...cfg.transforms };
  
  let throttleTimer: NodeJS.Timeout | null = null;

  const serialize = (state: any): string => {
    try {
      const stateToSerialize: any = { version: cfg.version };

      Object.keys(state).forEach(sliceKey => {
        // Check whitelist/blacklist
        if (cfg.whitelist && !cfg.whitelist.includes(sliceKey)) return;
        if (cfg.blacklist && cfg.blacklist.includes(sliceKey)) return;

        const sliceState = state[sliceKey];
        const transform = (transforms as any)[sliceKey];

        if (transform?.serialize) {
          stateToSerialize[sliceKey] = transform.serialize(sliceState);
        } else {
          stateToSerialize[sliceKey] = sliceState;
        }
      });

      return JSON.stringify(stateToSerialize);
    } catch (error) {
      console.error('Failed to serialize state:', error);
      return '{}';
    }
  };

  const saveState = (state: any) => {
    if (throttleTimer) {
      clearTimeout(throttleTimer);
    }

    throttleTimer = setTimeout(() => {
      try {
        const serializedState = serialize(state);
        storage.setItem(cfg.key, serializedState);
      } catch (error) {
        console.error('Failed to save state to storage:', error);
        
        // Handle quota exceeded error
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          // Try to clear old data and retry
          try {
            const keys = Object.keys(storage);
            const appKeys = keys.filter(key => key.startsWith('restaurant-app-'));
            
            // Remove oldest app data
            if (appKeys.length > 1) {
              appKeys.slice(0, -1).forEach(key => storage.removeItem(key));
              storage.setItem(cfg.key, serialize(state));
            }
          } catch (retryError) {
            console.error('Failed to save state even after cleanup:', retryError);
          }
        }
      }
    }, cfg.throttle);
  };

  return (store: any) => (next: any) => (action: any) => {
    const result = next(action);

    // Check if this action should trigger persistence
    if (shouldPersist(action.type)) {
      const state = store.getState();
      saveState(state);
    }

    return result;
  };
};

// Helper function to load persisted state
export const loadPersistedState = (config: Partial<PersistenceConfig> = {}): any => {
  const cfg = { ...defaultConfig, ...config };
  const storage = cfg.storage === 'localStorage' ? localStorage : sessionStorage;
  const transforms = { ...defaultTransforms, ...cfg.transforms };

  try {
    const serializedState = storage.getItem(cfg.key);
    if (!serializedState) return {};

    const parsedState = JSON.parse(serializedState);
    const version = parsedState.version || 0;

    // Handle version migrations
    if (version < cfg.version) {
      console.log(`State version ${version} is outdated, clearing...`);
      storage.removeItem(cfg.key);
      return {};
    }

    const deserializedState: any = {};

    Object.keys(parsedState).forEach(sliceKey => {
      if (sliceKey === 'version') return;

      const sliceState = parsedState[sliceKey];
      const transform = (transforms as any)[sliceKey];

      if (transform?.deserialize) {
        deserializedState[sliceKey] = transform.deserialize(sliceState);
      } else {
        deserializedState[sliceKey] = sliceState;
      }
    });

    return deserializedState;
  } catch (error) {
    console.error('Failed to load persisted state:', error);
    // Clear corrupted data
    storage.removeItem(cfg.key);
    return {};
  }
};

// Helper function to clear persisted state
export const clearPersistedState = (config: Partial<PersistenceConfig> = {}): void => {
  const cfg = { ...defaultConfig, ...config };
  const storage = cfg.storage === 'localStorage' ? localStorage : sessionStorage;
  
  try {
    storage.removeItem(cfg.key);
  } catch (error) {
    console.error('Failed to clear persisted state:', error);
  }
};

// Helper function to migrate state between versions
export const migrateState = (state: any, fromVersion: number, toVersion: number): any => {
  let migratedState = { ...state };

  // Add migration logic for each version bump
  for (let version = fromVersion; version < toVersion; version++) {
    switch (version) {
      case 0:
        // Migration from version 0 to 1
        // Example: rename fields, restructure data, etc.
        if (migratedState.userPreferences) {
          migratedState.ui = {
            ...migratedState.ui,
            preferences: migratedState.userPreferences,
          };
          delete migratedState.userPreferences;
        }
        break;
      
      // Add more migration cases as needed
      default:
        break;
    }
  }

  return { ...migratedState, version: toVersion };
};

// Helper to create a persistence-aware action creator
export const createPersistentAction = (actionCreator: any) => {
  return (...args: any[]) => {
    const action = actionCreator(...args);
    return {
      ...action,
      meta: {
        ...action.meta,
        persist: true,
      },
    };
  };
};

export default createPersistenceMiddleware;
