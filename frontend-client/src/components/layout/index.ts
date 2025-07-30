// Import types for internal use
import type { BreadcrumbItem } from './Breadcrumbs';

// Layout Components
export { default as Layout } from './Layout';
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as Navigation } from './Navigation';
export { default as MobileMenu } from './MobileMenu';
export { default as Breadcrumbs, SimpleBreadcrumbs } from './Breadcrumbs';

// Layout component types
export type { BreadcrumbItem, BreadcrumbsProps } from './Breadcrumbs';
export type { NavigationItem, NavigationProps } from './Navigation';
export type { MenuItem as MobileMenuItem, MobileMenuProps } from './MobileMenu';

/**
 * Layout utility functions
 */

// Función para generar elementos de navegación predeterminados
export const getDefaultNavigationItems = () => [
  { label: 'Inicio', href: '/', icon: '🏠' },
  { label: 'Menú', href: '/menu', icon: '🍽️' },
  { label: 'Categorías', href: '/categorias', icon: '📂' },
  { label: 'Ofertas', href: '/ofertas', icon: '🏷️' },
  { label: 'Mesas', href: '/mesas', icon: '🪑' },
  { label: 'Reservas', href: '/reservas', icon: '📅' },
  { label: 'Sobre Nosotros', href: '/sobre-nosotros', icon: 'ℹ️' },
  { label: 'Contacto', href: '/contacto', icon: '📞' },
];

// Función para generar breadcrumbs comunes
export const getCommonBreadcrumbs = (page: string): BreadcrumbItem[] => {
  const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
    menu: [
      { label: 'Inicio', href: '/', icon: '🏠' },
      { label: 'Menú' }
    ],
    carrito: [
      { label: 'Inicio', href: '/', icon: '🏠' },
      { label: 'Carrito' }
    ],
    checkout: [
      { label: 'Inicio', href: '/', icon: '🏠' },
      { label: 'Carrito', href: '/carrito' },
      { label: 'Finalizar Pedido' }
    ],
    reservas: [
      { label: 'Inicio', href: '/', icon: '🏠' },
      { label: 'Reservas' }
    ],
    contacto: [
      { label: 'Inicio', href: '/', icon: '🏠' },
      { label: 'Contacto' }
    ],
  };

  return breadcrumbMap[page] || [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: page.charAt(0).toUpperCase() + page.slice(1) }
  ];
};