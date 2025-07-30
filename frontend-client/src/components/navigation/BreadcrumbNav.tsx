import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  /**
   * Texto del breadcrumb
   */
  label: string;
  
  /**
   * URL de destino
   */
  href?: string;
  
  /**
   * Icono del breadcrumb
   */
  icon?: string | React.ReactNode;
  
  /**
   * Si es el elemento actual (último)
   */
  current?: boolean;
}

export interface BreadcrumbNavProps {
  /**
   * Lista de elementos del breadcrumb
   */
  items: BreadcrumbItem[];
  
  /**
   * Separador entre elementos
   */
  separator?: string | React.ReactNode;
  
  /**
   * Mostrar el elemento inicial (inicio/home)
   */
  showHome?: boolean;
  
  /**
   * Configuración del elemento home
   */
  homeItem?: {
    label?: string;
    href?: string;
    icon?: string | React.ReactNode;
  };
  
  /**
   * Tamaño del breadcrumb
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Mostrar en una sola línea o permitir wrapping
   */
  nowrap?: boolean;
  
  /**
   * Máximo número de elementos a mostrar (colapsa los intermedios)
   */
  maxItems?: number;
  
  /**
   * Función callback cuando se hace click en un elemento
   */
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  separator = '/',
  showHome = true,
  homeItem = {
    label: 'Inicio',
    href: '/',
    icon: '🏠',
  },
  size = 'md',
  nowrap = false,
  maxItems,
  onItemClick,
  className,
}) => {
  const location = useLocation();
  
  // Construir lista completa incluyendo home si está habilitado
  const allItems = React.useMemo(() => {
    const finalItems = [...items];
    
    // Marcar el último elemento como current si no se especifica
    if (finalItems.length > 0 && !finalItems.some(item => item.current)) {
      finalItems[finalItems.length - 1].current = true;
    }
    
    if (showHome && homeItem.href !== location.pathname) {
      return [
        {
          label: homeItem.label || 'Inicio',
          href: homeItem.href || '/',
          icon: homeItem.icon,
          current: false,
        },
        ...finalItems,
      ];
    }
    
    return finalItems;
  }, [items, showHome, homeItem, location.pathname]);

  // Manejar el colapso de elementos si se especifica maxItems
  const displayItems = React.useMemo(() => {
    if (!maxItems || allItems.length <= maxItems) {
      return allItems;
    }

    const firstItem = allItems[0];
    const lastItems = allItems.slice(-2); // Último y penúltimo
    const collapsedCount = allItems.length - 3;

    return [
      firstItem,
      {
        label: `... (${collapsedCount})`,
        href: undefined,
        current: false,
        icon: '⋯',
      },
      ...lastItems,
    ];
  }, [allItems, maxItems]);

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    onItemClick?.(item, index);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const renderSeparator = () => {
    if (typeof separator === 'string') {
      return (
        <span className="mx-2 text-gray-400 select-none" aria-hidden="true">
          {separator}
        </span>
      );
    }
    return (
      <span className="mx-2 text-gray-400" aria-hidden="true">
        {separator}
      </span>
    );
  };

  const renderIcon = (icon: string | React.ReactNode | undefined) => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return <span className="mr-1 text-base">{icon}</span>;
    }
    
    return <span className="mr-1">{icon}</span>;
  };

  const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const isClickable = !item.current && item.href;
    
    const content = (
      <span className="flex items-center">
        {renderIcon(item.icon)}
        {item.label}
      </span>
    );

    if (item.current) {
      return (
        <span
          className={cn(
            'font-medium text-gray-900 cursor-default',
            getSizeClasses()
          )}
          aria-current="page"
        >
          {content}
        </span>
      );
    }

    if (!isClickable) {
      return (
        <span
          className={cn(
            'text-gray-500 cursor-default',
            getSizeClasses()
          )}
        >
          {content}
        </span>
      );
    }

    return (
      <Link
        to={item.href!}
        onClick={() => handleItemClick(item, index)}
        className={cn(
          'text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded',
          getSizeClasses()
        )}
      >
        {content}
      </Link>
    );
  };

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center space-x-1',
        nowrap ? 'whitespace-nowrap overflow-x-auto' : 'flex-wrap',
        className
      )}
    >
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {renderItem(item, index, isLast)}
              {!isLast && renderSeparator()}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Hook para generar breadcrumbs automáticamente basado en la ruta
export const useBreadcrumbFromPath = (
  pathMap?: Record<string, { label: string; icon?: string }>
) => {
  const location = useLocation();
  
  return React.useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      const config = pathMap?.[currentPath] || pathMap?.[segment];
      const isLast = index === pathSegments.length - 1;
      
      items.push({
        label: config?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        icon: config?.icon,
        current: isLast,
      });
    });
    
    return items;
  }, [location.pathname, pathMap]);
};

// Breadcrumbs predefinidos para el restaurante
export const restaurantBreadcrumbs = {
  '/menu': { label: 'Menú', icon: '🍽️' },
  '/menu/categoria': { label: 'Categorías', icon: '📂' },
  '/mesas': { label: 'Mesas', icon: '🪑' },
  '/pedido': { label: 'Pedido', icon: '📋' },
  '/pedido/carrito': { label: 'Carrito', icon: '🛒' },
  '/pedido/confirmacion': { label: 'Confirmación', icon: '✅' },
  '/perfil': { label: 'Perfil', icon: '👤' },
  '/contacto': { label: 'Contacto', icon: '📞' },
  '/about': { label: 'Acerca de', icon: 'ℹ️' },
};

export default BreadcrumbNav;
