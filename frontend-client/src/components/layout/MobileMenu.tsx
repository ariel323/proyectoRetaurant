import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useCart } from '../../contexts/CartContext';

export interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  subItems?: MenuItem[];
}

export interface MobileMenuProps {
  /**
   * Lista de elementos del menú
   */
  menuItems?: MenuItem[];
  
  /**
   * Estado de apertura del menú
   */
  isOpen: boolean;
  
  /**
   * Función para cerrar el menú
   */
  onClose: () => void;
  
  /**
   * Logo o título del restaurante
   */
  logo?: string;
  
  /**
   * URL del logo
   */
  logoHref?: string;
  
  /**
   * Mostrar carrito en el menú móvil
   */
  showCart?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente MobileMenu - Menú de navegación para dispositivos móviles
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  menuItems = [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Menú', href: '/menu', icon: '🍽️' },
    { label: 'Categorías', href: '/categorias', icon: '📂' },
    { label: 'Ofertas', href: '/ofertas', icon: '🏷️' },
    { label: 'Mesas', href: '/mesas', icon: '🪑' },
    { label: 'Reservas', href: '/reservas', icon: '📅' },
    { label: 'Sobre Nosotros', href: '/sobre-nosotros', icon: 'ℹ️' },
    { label: 'Contacto', href: '/contacto', icon: '📞' },
  ],
  isOpen,
  onClose,
  logo = '🍽️ RestauranteApp',
  logoHref = '/',
  showCart = true,
  className,
}) => {
  const location = useLocation();
  const { cantidad_total, total } = useCart();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Cerrar menú cuando cambie la ruta
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Header del menú */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-600">
          <Link
            to={logoHref}
            onClick={handleLinkClick}
            className="text-white font-bold text-lg"
          >
            {logo}
          </Link>
          
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            aria-label="Cerrar menú"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Información del carrito */}
        {showCart && cantidad_total > 0 && (
          <div className="p-4 bg-orange-50 border-b border-orange-200">
            <Link
              to="/carrito"
              onClick={handleLinkClick}
              className="flex items-center justify-between hover:bg-orange-100 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🛒</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {cantidad_total} {cantidad_total === 1 ? 'artículo' : 'artículos'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: ${total.toFixed(2)}
                  </div>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto">
          <div className="p-2">
            {menuItems.map((item, index) => {
              const isActive = isActiveRoute(item.href);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItems.has(index);

              return (
                <div key={index} className="mb-1">
                  {/* Item principal */}
                  <div
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center flex-1"
                    >
                      {item.icon && (
                        <span className="text-xl mr-3">{item.icon}</span>
                      )}
                      <span className="font-medium">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Botón para expandir submenús */}
                    {hasSubItems && (
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="p-1 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg
                          className={cn(
                            'w-4 h-4 transition-transform',
                            isExpanded ? 'rotate-90' : ''
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Subitems */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems!.map((subItem, subIndex) => {
                        const isSubActive = isActiveRoute(subItem.href);
                        
                        return (
                          <Link
                            key={subIndex}
                            to={subItem.href}
                            onClick={handleLinkClick}
                            className={cn(
                              'flex items-center p-2 pl-8 rounded-lg transition-colors text-sm',
                              isSubActive
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            )}
                          >
                            {subItem.icon && (
                              <span className="text-base mr-2">{subItem.icon}</span>
                            )}
                            {subItem.label}
                            {subItem.badge && subItem.badge > 0 && (
                              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center">
                                {subItem.badge > 99 ? '99+' : subItem.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer del menú */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            © 2024 RestauranteApp
          </div>
          <div className="text-xs text-gray-400 text-center mt-1">
            v1.0.0
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;