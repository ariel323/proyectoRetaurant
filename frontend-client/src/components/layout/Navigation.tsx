import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useCart } from '../../contexts/CartContext';
import MobileMenu from './MobileMenu';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  external?: boolean;
  subItems?: NavigationItem[];
}

export interface NavigationProps {
  /**
   * Lista de elementos de navegación
   */
  items?: NavigationItem[];
  
  /**
   * Logo o título del restaurante
   */
  logo?: React.ReactNode;
  
  /**
   * URL del logo
   */
  logoHref?: string;
  
  /**
   * Mostrar carrito de compras
   */
  showCart?: boolean;
  
  /**
   * Mostrar búsqueda
   */
  showSearch?: boolean;
  
  /**
   * Función de búsqueda
   */
  onSearch?: (query: string) => void;
  
  /**
   * Posición fija en la parte superior
   */
  sticky?: boolean;
  
  /**
   * Fondo transparente
   */
  transparent?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente Navigation - Barra de navegación principal con menú móvil
 */
export const Navigation: React.FC<NavigationProps> = ({
  items = [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Menú', href: '/menu', icon: '🍽️' },
    { label: 'Reservas', href: '/reservas', icon: '📅' },
    { label: 'Sobre Nosotros', href: '/sobre-nosotros', icon: 'ℹ️' },
    { label: 'Contacto', href: '/contacto', icon: '📞' },
  ],
  logo = (
    <div className="flex items-center">
      <span className="text-2xl mr-2">🍽️</span>
      <span className="font-bold text-xl">RestauranteApp</span>
    </div>
  ),
  logoHref = '/',
  showCart = true,
  showSearch = true,
  onSearch,
  sticky = true,
  transparent = false,
  className,
}) => {
  const location = useLocation();
  const { cantidad_total } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const isActiveRoute = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleExternalLink = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <nav
        className={cn(
          'w-full z-30 transition-all duration-300',
          sticky && 'sticky top-0',
          transparent
            ? 'bg-transparent'
            : 'bg-white shadow-md border-b border-gray-200',
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to={logoHref}
                className="flex items-center text-gray-900 hover:text-orange-600 transition-colors"
              >
                {logo}
              </Link>
            </div>

            {/* Navegación Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              {items.map((item, index) => {
                const isActive = isActiveRoute(item.href);
                
                return (
                  <div key={index} className="relative group">
                    {item.external ? (
                      <button
                        onClick={() => handleExternalLink(item.href)}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md',
                          isActive
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                        )}
                      >
                        {item.icon && (
                          <span className="mr-2">{item.icon}</span>
                        )}
                        {item.label}
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md',
                          isActive
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                        )}
                      >
                        {item.icon && (
                          <span className="mr-2">{item.icon}</span>
                        )}
                        {item.label}
                        {item.badge && item.badge > 0 && (
                          <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* Submenu */}
                    {item.subItems && item.subItems.length > 0 && (
                      <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                            >
                              {subItem.icon && (
                                <span className="mr-2">{subItem.icon}</span>
                              )}
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Acciones (Búsqueda, Carrito, etc.) */}
            <div className="flex items-center space-x-4">
              {/* Búsqueda */}
              {showSearch && (
                <div className="relative">
                  {searchOpen ? (
                    <form onSubmit={handleSearch} className="flex items-center">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar platos..."
                        className="w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="ml-2 p-2 text-gray-600 hover:text-orange-600"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className="ml-1 p-2 text-gray-600 hover:text-gray-800"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                      aria-label="Abrir búsqueda"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Carrito */}
              {showCart && (
                <Link
                  to="/carrito"
                  className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
                  aria-label={`Carrito con ${cantidad_total} artículos`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                  {cantidad_total > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {cantidad_total > 99 ? '99+' : cantidad_total}
                    </span>
                  )}
                </Link>
              )}

              {/* Botón menú móvil */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Abrir menú"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuItems={items}
        showCart={showCart}
      />
    </>
  );
};

export default Navigation;