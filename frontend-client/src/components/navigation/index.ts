// Navigation Components
export { default as NavItem } from './NavItem';
export { default as NavMenu, useNavMenu } from './NavMenu';
export { default as BreadcrumbNav, useBreadcrumbFromPath, restaurantBreadcrumbs } from './BreadcrumbNav';
export { default as TabNavigation, useTabs } from './TabNavigation';
export { default as StepNavigation, useStepNavigation } from './StepNavigation';

// Component Props Types
export type { NavItemProps } from './NavItem';
export type { NavMenuProps, NavMenuItem } from './NavMenu';
export type { BreadcrumbNavProps, BreadcrumbItem } from './BreadcrumbNav';
export type { TabNavigationProps, Tab } from './TabNavigation';
export type { StepNavigationProps, Step } from './StepNavigation';

// Navigation utility types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: string | React.ReactNode;
  badge?: number | string;
  external?: boolean;
  disabled?: boolean;
  children?: NavigationItem[];
}

export interface NavigationConfig {
  primary: NavigationItem[];
  secondary?: NavigationItem[];
  footer?: NavigationItem[];
}

// Navigation utility functions
export const navigationUtils = {
  /**
   * Busca un elemento de navegación por ID
   */
  findItemById: (items: NavigationItem[], id: string): NavigationItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = navigationUtils.findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  },

  /**
   * Busca un elemento de navegación por href
   */
  findItemByHref: (items: NavigationItem[], href: string): NavigationItem | null => {
    for (const item of items) {
      if (item.href === href) return item;
      if (item.children) {
        const found = navigationUtils.findItemByHref(item.children, href);
        if (found) return found;
      }
    }
    return null;
  },

  /**
   * Obtiene la ruta de breadcrumbs para un href dado
   */
  getBreadcrumbPath: (items: NavigationItem[], targetHref: string): NavigationItem[] => {
    const findPath = (items: NavigationItem[], target: string, path: NavigationItem[] = []): NavigationItem[] | null => {
      for (const item of items) {
        const currentPath = [...path, item];
        
        if (item.href === target) {
          return currentPath;
        }
        
        if (item.children) {
          const result = findPath(item.children, target, currentPath);
          if (result) return result;
        }
      }
      return null;
    };

    return findPath(items, targetHref) || [];
  },

  /**
   * Filtra elementos de navegación por criterios
   */
  filterItems: (
    items: NavigationItem[], 
    criteria: {
      enabled?: boolean;
      hasChildren?: boolean;
      external?: boolean;
    }
  ): NavigationItem[] => {
    return items.filter(item => {
      if (criteria.enabled !== undefined && item.disabled === criteria.enabled) return false;
      if (criteria.hasChildren !== undefined && (!!item.children) !== criteria.hasChildren) return false;
      if (criteria.external !== undefined && item.external !== criteria.external) return false;
      return true;
    });
  },

  /**
   * Flattens a nested navigation structure
   */
  flattenItems: (items: NavigationItem[]): NavigationItem[] => {
    const result: NavigationItem[] = [];
    
    const flatten = (items: NavigationItem[]) => {
      items.forEach(item => {
        result.push(item);
        if (item.children) {
          flatten(item.children);
        }
      });
    };
    
    flatten(items);
    return result;
  },

  /**
   * Valida la estructura de navegación
   */
  validateNavigation: (items: NavigationItem[]): { 
    isValid: boolean; 
    errors: string[] 
  } => {
    const errors: string[] = [];
    const usedIds = new Set<string>();
    
    const validate = (items: NavigationItem[], level = 0) => {
      items.forEach((item, index) => {
        // Validar ID único
        if (usedIds.has(item.id)) {
          errors.push(`Duplicate ID found: ${item.id}`);
        } else {
          usedIds.add(item.id);
        }
        
        // Validar que tenga label
        if (!item.label || item.label.trim() === '') {
          errors.push(`Item at index ${index} (level ${level}) missing label`);
        }
        
        // Validar href si no tiene children
        if (!item.children && !item.href) {
          errors.push(`Item ${item.id} has no href and no children`);
        }
        
        // Validar children recursivamente
        if (item.children) {
          validate(item.children, level + 1);
        }
      });
    };
    
    validate(items);
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Predefined navigation configurations for restaurant
export const restaurantNavigation: NavigationConfig = {
  primary: [
    {
      id: 'home',
      label: 'Inicio',
      href: '/',
      icon: '🏠',
    },
    {
      id: 'menu',
      label: 'Menú',
      href: '/menu',
      icon: '🍽️',
      children: [
        {
          id: 'menu-entradas',
          label: 'Entradas',
          href: '/menu/entradas',
          icon: '🥗',
        },
        {
          id: 'menu-principales',
          label: 'Platos Principales',
          href: '/menu/principales',
          icon: '🍖',
        },
        {
          id: 'menu-postres',
          label: 'Postres',
          href: '/menu/postres',
          icon: '🍰',
        },
        {
          id: 'menu-bebidas',
          label: 'Bebidas',
          href: '/menu/bebidas',
          icon: '🥤',
        },
      ],
    },
    {
      id: 'mesas',
      label: 'Mesas',
      href: '/mesas',
      icon: '🪑',
    },
    {
      id: 'pedido',
      label: 'Mi Pedido',
      href: '/pedido',
      icon: '📋',
      badge: 'cart-count', // Placeholder for dynamic badge
    },
    {
      id: 'about',
      label: 'Nosotros',
      href: '/about',
      icon: 'ℹ️',
    },
    {
      id: 'contact',
      label: 'Contacto',
      href: '/contact',
      icon: '📞',
    },
  ],
  secondary: [
    {
      id: 'profile',
      label: 'Mi Perfil',
      href: '/profile',
      icon: '👤',
    },
    {
      id: 'orders',
      label: 'Mis Pedidos',
      href: '/orders',
      icon: '📦',
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      href: '/favorites',
      icon: '❤️',
    },
  ],
  footer: [
    {
      id: 'privacy',
      label: 'Política de Privacidad',
      href: '/privacy',
    },
    {
      id: 'terms',
      label: 'Términos de Uso',
      href: '/terms',
    },
    {
      id: 'help',
      label: 'Ayuda',
      href: '/help',
    },
  ],
};

// Navigation constants
export const NAVIGATION_CONSTANTS = {
  SEPARATORS: {
    SLASH: '/',
    ARROW: '→',
    CHEVRON: '›',
    DOT: '•',
  },
  POSITIONS: ['top', 'bottom', 'left', 'right'] as const,
  VARIANTS: ['default', 'pills', 'tabs', 'underline', 'rounded', 'vertical'] as const,
  SIZES: ['sm', 'md', 'lg'] as const,
} as const;
