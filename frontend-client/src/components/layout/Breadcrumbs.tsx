import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface BreadcrumbsProps {
  /**
   * Lista de elementos del breadcrumb
   */
  items?: BreadcrumbItem[];
  
  /**
   * Separador personalizado entre elementos
   */
  separator?: string;
  
  /**
   * Mostrar icono de inicio
   */
  showHomeIcon?: boolean;
  
  /**
   * URL de la página principal
   */
  homeUrl?: string;
  
  /**
   * Generar breadcrumbs automáticamente desde la URL
   */
  autoGenerate?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente Breadcrumbs - Navegación jerárquica para mostrar la ubicación actual
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  separator = '/',
  showHomeIcon = true,
  homeUrl = '/',
  autoGenerate = true,
  className,
}) => {
  const location = useLocation();

  // Función para generar breadcrumbs automáticamente desde la URL
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Mapeo de rutas a etiquetas amigables
    const routeLabels: Record<string, string> = {
      'menu': 'Menú',
      'categoria': 'Categoría',
      'plato': 'Plato',
      'mesas': 'Mesas',
      'mesa': 'Mesa',
      'pedidos': 'Pedidos',
      'pedido': 'Pedido',
      'reservas': 'Reservas',
      'reserva': 'Reserva',
      'carrito': 'Carrito',
      'checkout': 'Finalizar Pedido',
      'confirmacion': 'Confirmación',
      'perfil': 'Perfil',
      'configuracion': 'Configuración',
      'ayuda': 'Ayuda',
      'contacto': 'Contacto',
      'sobre-nosotros': 'Sobre Nosotros',
    };

    // Agregar home si no estamos en la página principal
    if (pathSegments.length > 0) {
      breadcrumbs.push({
        label: 'Inicio',
        href: homeUrl,
        icon: '🏠'
      });
    }

    // Generar breadcrumbs para cada segmento
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Solo agregar href si no es el último elemento
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : path,
      });
    });

    return breadcrumbs;
  };

  // Usar items proporcionados o generar automáticamente
  const finalItems = items.length > 0 ? items : (autoGenerate ? generateBreadcrumbs() : []);

  // No mostrar breadcrumbs si estamos en la página principal y no hay items
  if (finalItems.length === 0 && location.pathname === homeUrl) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      <ol className="flex items-center space-x-1">
        {finalItems.map((item, index) => {
          const isLast = index === finalItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center">
              {/* Separador (excepto para el primer elemento) */}
              {!isFirst && (
                <span className="text-gray-400 mx-2 select-none">
                  {separator}
                </span>
              )}

              {/* Elemento del breadcrumb */}
              <div className="flex items-center">
                {/* Icono (si existe) */}
                {item.icon && (
                  <span className="mr-1 text-base">{item.icon}</span>
                )}

                {/* Enlace o texto */}
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className={cn(
                      'text-gray-600 hover:text-orange-600 transition-colors font-medium',
                      'hover:underline focus:outline-none focus:underline',
                      isFirst && showHomeIcon && 'flex items-center'
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span 
                    className={cn(
                      'font-medium',
                      isLast 
                        ? 'text-gray-900 cursor-default' 
                        : 'text-gray-600'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Componente simplificado para uso común
export const SimpleBreadcrumbs: React.FC<{
  items: { label: string; href?: string }[];
  className?: string;
}> = ({ items, className }) => {
  return (
    <Breadcrumbs
      items={items}
      className={className}
      showHomeIcon={false}
      autoGenerate={false}
    />
  );
};

export default Breadcrumbs;