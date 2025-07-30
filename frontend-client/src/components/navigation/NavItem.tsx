import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface NavItemProps {
  /**
   * URL de destino
   */
  href: string;
  
  /**
   * Texto del enlace
   */
  label: string;
  
  /**
   * Icono del elemento de navegación
   */
  icon?: string | React.ReactNode;
  
  /**
   * Badge o contador
   */
  badge?: number | string;
  
  /**
   * Si es un enlace externo
   */
  external?: boolean;
  
  /**
   * Elemento activo
   */
  active?: boolean;
  
  /**
   * Elemento deshabilitado
   */
  disabled?: boolean;
  
  /**
   * Función de click personalizada
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
  
  /**
   * Variante del estilo
   */
  variant?: 'default' | 'sidebar' | 'tab' | 'breadcrumb' | 'mobile';
  
  /**
   * Tamaño del elemento
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Elementos hijos del navegador
   */
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  label,
  icon,
  badge,
  external = false,
  active,
  disabled = false,
  onClick,
  className,
  variant = 'default',
  size = 'md',
  children,
}) => {
  const location = useLocation();
  
  // Determinar si el elemento está activo
  const isActive = active !== undefined ? active : location.pathname === href;
  
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  // Configuraciones de variantes
  const getVariantClasses = () => {
    const baseClasses = 'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'sidebar':
        return cn(
          baseClasses,
          'flex items-center gap-3 px-4 py-3 rounded-lg text-left w-full',
          isActive
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 font-medium'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
          disabled && 'opacity-50 cursor-not-allowed',
          'focus:ring-blue-500'
        );
        
      case 'tab':
        return cn(
          baseClasses,
          'px-4 py-2 text-sm font-medium border-b-2 transition-all',
          isActive
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          disabled && 'opacity-50 cursor-not-allowed',
          'focus:ring-blue-500'
        );
        
      case 'breadcrumb':
        return cn(
          baseClasses,
          'text-sm hover:text-blue-600',
          isActive
            ? 'text-gray-900 font-medium cursor-default'
            : 'text-gray-500',
          disabled && 'opacity-50 cursor-not-allowed',
          'focus:ring-blue-500'
        );
        
      case 'mobile':
        return cn(
          baseClasses,
          'flex items-center gap-3 px-4 py-3 text-base font-medium border-b border-gray-100',
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-900 hover:bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed',
          'focus:ring-blue-500'
        );
        
      default:
        return cn(
          baseClasses,
          'inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
          isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
          disabled && 'opacity-50 cursor-not-allowed',
          'focus:ring-blue-500'
        );
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-lg px-4 py-3';
      default:
        return 'text-sm px-3 py-2';
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return <span className="text-lg">{icon}</span>;
    }
    
    return icon;
  };

  const renderBadge = () => {
    if (!badge) return null;
    
    return (
      <span className={cn(
        'inline-flex items-center justify-center rounded-full text-xs font-medium',
        variant === 'sidebar' || variant === 'mobile'
          ? 'bg-red-100 text-red-800 px-2 py-0.5 min-w-[1.25rem] h-5'
          : 'bg-red-500 text-white px-1.5 py-0.5 min-w-[1rem] h-4'
      )}>
        {badge}
      </span>
    );
  };

  const content = (
    <>
      {renderIcon()}
      <span className={cn(
        variant === 'breadcrumb' && !isActive && 'truncate'
      )}>
        {label}
      </span>
      {renderBadge()}
      {children}
    </>
  );

  const commonProps = {
    onClick: handleClick,
    className: cn(
      getVariantClasses(),
      variant !== 'breadcrumb' && getSizeClasses(),
      className
    ),
    'aria-current': isActive ? 'page' as const : undefined,
    'aria-disabled': disabled,
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...commonProps}
      >
        {content}
        <span className="sr-only">(se abre en nueva ventana)</span>
      </a>
    );
  }

  if (disabled || (variant === 'breadcrumb' && isActive)) {
    return (
      <span {...commonProps}>
        {content}
      </span>
    );
  }

  return (
    <Link to={href} {...commonProps}>
      {content}
    </Link>
  );
};

export default NavItem;
