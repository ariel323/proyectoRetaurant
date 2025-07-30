import { MenuItem } from '../../types';

// State interface
export interface MenuState {
  items: MenuItem[];
  categories: string[];
  featuredItems: MenuItem[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    search: string;
    vegetariano: boolean;
    picante: boolean;
    disponible: boolean;
    priceRange: {
      min: number;
      max: number;
    };
  };
}

// Action types
export const MENU_ACTION_TYPES = {
  FETCH_MENU_START: 'menu/fetchMenuStart',
  FETCH_MENU_SUCCESS: 'menu/fetchMenuSuccess',
  FETCH_MENU_ERROR: 'menu/fetchMenuError',
  FETCH_CATEGORIES_SUCCESS: 'menu/fetchCategoriesSuccess',
  FETCH_FEATURED_SUCCESS: 'menu/fetchFeaturedSuccess',
  SET_FILTER: 'menu/setFilter',
  RESET_FILTERS: 'menu/resetFilters',
  SET_SEARCH: 'menu/setSearch',
  CLEAR_ERROR: 'menu/clearError',
} as const;

// Action creators
export type MenuAction =
  | { type: typeof MENU_ACTION_TYPES.FETCH_MENU_START }
  | { type: typeof MENU_ACTION_TYPES.FETCH_MENU_SUCCESS; payload: MenuItem[] }
  | { type: typeof MENU_ACTION_TYPES.FETCH_MENU_ERROR; payload: string }
  | { type: typeof MENU_ACTION_TYPES.FETCH_CATEGORIES_SUCCESS; payload: string[] }
  | { type: typeof MENU_ACTION_TYPES.FETCH_FEATURED_SUCCESS; payload: MenuItem[] }
  | { type: typeof MENU_ACTION_TYPES.SET_FILTER; payload: { key: keyof MenuState['filters']; value: any } }
  | { type: typeof MENU_ACTION_TYPES.RESET_FILTERS }
  | { type: typeof MENU_ACTION_TYPES.SET_SEARCH; payload: string }
  | { type: typeof MENU_ACTION_TYPES.CLEAR_ERROR };

// Initial state
export const initialMenuState: MenuState = {
  items: [],
  categories: [],
  featuredItems: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    search: '',
    vegetariano: false,
    picante: false,
    disponible: true,
    priceRange: {
      min: 0,
      max: 1000,
    },
  },
};

// Reducer
export const menuReducer = (state: MenuState = initialMenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case MENU_ACTION_TYPES.FETCH_MENU_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case MENU_ACTION_TYPES.FETCH_MENU_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null,
      };

    case MENU_ACTION_TYPES.FETCH_MENU_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case MENU_ACTION_TYPES.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
      };

    case MENU_ACTION_TYPES.FETCH_FEATURED_SUCCESS:
      return {
        ...state,
        featuredItems: action.payload,
      };

    case MENU_ACTION_TYPES.SET_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };

    case MENU_ACTION_TYPES.RESET_FILTERS:
      return {
        ...state,
        filters: initialMenuState.filters,
      };

    case MENU_ACTION_TYPES.SET_SEARCH:
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.payload,
        },
      };

    case MENU_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Action creators
export const menuActions = {
  fetchMenuStart: () => ({ type: MENU_ACTION_TYPES.FETCH_MENU_START }),
  fetchMenuSuccess: (items: MenuItem[]) => ({ 
    type: MENU_ACTION_TYPES.FETCH_MENU_SUCCESS, 
    payload: items 
  }),
  fetchMenuError: (error: string) => ({ 
    type: MENU_ACTION_TYPES.FETCH_MENU_ERROR, 
    payload: error 
  }),
  fetchCategoriesSuccess: (categories: string[]) => ({ 
    type: MENU_ACTION_TYPES.FETCH_CATEGORIES_SUCCESS, 
    payload: categories 
  }),
  fetchFeaturedSuccess: (items: MenuItem[]) => ({ 
    type: MENU_ACTION_TYPES.FETCH_FEATURED_SUCCESS, 
    payload: items 
  }),
  setFilter: (key: keyof MenuState['filters'], value: any) => ({ 
    type: MENU_ACTION_TYPES.SET_FILTER, 
    payload: { key, value } 
  }),
  resetFilters: () => ({ type: MENU_ACTION_TYPES.RESET_FILTERS }),
  setSearch: (search: string) => ({ type: MENU_ACTION_TYPES.SET_SEARCH, payload: search }),
  clearError: () => ({ type: MENU_ACTION_TYPES.CLEAR_ERROR }),
} as const;

// Selectors
export const menuSelectors = {
  getMenuItems: (state: MenuState) => state.items,
  getCategories: (state: MenuState) => state.categories,
  getFeaturedItems: (state: MenuState) => state.featuredItems,
  getLoading: (state: MenuState) => state.loading,
  getError: (state: MenuState) => state.error,
  getFilters: (state: MenuState) => state.filters,
  getFilteredItems: (state: MenuState) => {
    let filtered = state.items;

    // Filter by availability
    if (state.filters.disponible) {
      filtered = filtered.filter(item => item.disponible);
    }

    // Filter by category
    if (state.filters.category !== 'all') {
      filtered = filtered.filter(item => item.categoria === state.filters.category);
    }

    // Filter by search
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.nombre.toLowerCase().includes(searchLower) ||
        item.descripcion?.toLowerCase().includes(searchLower) ||
        item.ingredientes?.some(ing => ing.toLowerCase().includes(searchLower))
      );
    }

    // Filter by vegetarian
    if (state.filters.vegetariano) {
      filtered = filtered.filter(item => item.vegetariano);
    }

    // Filter by spicy
    if (state.filters.picante) {
      filtered = filtered.filter(item => item.picante);
    }

    // Filter by price range
    filtered = filtered.filter(item =>
      item.precio >= state.filters.priceRange.min &&
      item.precio <= state.filters.priceRange.max
    );

    return filtered;
  },
};

export default menuReducer;
