import React, { useState, useRef } from 'react';
import { cn } from '../../utils/cn';
import NavItem from './NavItem';

export interface NavMenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: string | React.ReactNode;
  badge?: number | string;
  external?: boolean;
  disabled?: boolean;
  children?: NavMenuItem[];
}

export interface NavMenuProps {
  /**
   * Lista de elementos del menú
   */
  items: NavMenuItem[];
  
  /**
   * Orientación del menú
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Variante del estilo
   */
  variant?: 'default' | 'pills' | 'tabs' | 'sidebar' | 'mobile';
  
  /**
   * Tamaño del menú
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Permitir múltiples elementos abiertos (solo para menús con submenús)
   */
  allowMultiple?: boolean;
  
  /**
   * Elementos colapsados por defecto
   */
  defaultCollapsed?: boolean;
  
  /**
   * Función callback cuando se selecciona un elemento
   */
  onItemSelect?: (item: NavMenuItem) => void;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
  
  /**
   * Mostrar separadores entre elementos
   */
  showSeparators?: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({
  items,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  allowMultiple = false,
  defaultCollapsed = true,
  onItemSelect,
  className,
  showSeparators = false,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [focusedIndex] = useState<number>(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleItemClick = (item: NavMenuItem) => {
    if (item.children && item.children.length > 0) {
      toggleItem(item.id);
    }
    onItemSelect?.(item);
  };

  const getMenuClasses = () => {
    const baseClasses = 'focus:outline-none';
    
    const orientationClasses = orientation === 'horizontal'
      ? 'flex flex-wrap'
      : 'flex flex-col space-y-1';
    
    const variantClasses = {
      default: '',
      pills: orientation === 'horizontal' ? 'space-x-2' : '',
      tabs: orientation === 'horizontal' 
        ? 'border-b border-gray-200 space-x-6' 
        : 'border-r border-gray-200',
      sidebar: 'space-y-2',
      mobile: 'space-y-1',
    };

    return cn(
      baseClasses,
      orientationClasses,
      variantClasses[variant],
      className
    );
  };

  const renderSubmenu = (children: NavMenuItem[], parentId: string) => {
    const isOpen = openItems.has(parentId);
    
    if (!isOpen) return null;

    return (
      <div className={cn(
        'mt-2 space-y-1',
        variant === 'sidebar' ? 'ml-6 pl-4 border-l-2 border-gray-100' : 'ml-4'
      )}>
        {children.map((child, index) => (
          <div key={child.id}>
            <NavItem
              href={child.href || '#'}
              label={child.label}
              icon={child.icon}
              badge={child.badge}
              external={child.external}
              disabled={child.disabled}
              variant={variant === 'sidebar' ? 'sidebar' : 'default'}
              size={size}
              onClick={() => handleItemClick(child)}
              className={cn(
                variant === 'sidebar' && 'text-sm',
                child.disabled && 'opacity-50 cursor-not-allowed'
              )}
            />
            {showSeparators && index < children.length - 1 && (
              <hr className="my-1 border-gray-200" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMenuItem = (item: NavMenuItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems.has(item.id);

    return (
      <div key={item.id} className="relative">
        <div className="flex items-center">
          <NavItem
            href={item.href || '#'}
            label={item.label}
            icon={item.icon}
            badge={item.badge}
            external={item.external}
            disabled={item.disabled}
            variant={variant === 'sidebar' ? 'sidebar' : variant === 'mobile' ? 'mobile' : variant === 'tabs' ? 'tab' : 'default'}
            size={size}
            onClick={(e) => {
              if (hasChildren && !item.href) {
                e.preventDefault();
              }
              handleItemClick(item);
            }}
            className={cn(
              hasChildren && 'flex-1',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
          
          {hasChildren && (
            <button
              onClick={() => toggleItem(item.id)}
              className={cn(
                'p-1 rounded transition-transform',
                variant === 'sidebar' 
                  ? 'text-gray-400 hover:text-gray-600'
                  : 'text-gray-500 hover:text-gray-700',
                isOpen && 'transform rotate-180'
              )}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? 'Contraer' : 'Expandir'} ${item.label}`}
            >
              <span className="text-sm">▼</span>
            </button>
          )}
        </div>

        {hasChildren && item.children && renderSubmenu(item.children, item.id)}
      </div>
    );
  };

  return (
    <nav
      ref={menuRef}
      className={getMenuClasses()}
      role="navigation"
      aria-label="Menú de navegación"
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {renderMenuItem(item, index)}
          {showSeparators && 
           orientation === 'horizontal' && 
           index < items.length - 1 && (
            <div className="border-l border-gray-300 h-6 mx-2" />
          )}
          {showSeparators && 
           orientation === 'vertical' && 
           index < items.length - 1 && (
            <hr className="my-2 border-gray-200" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Hook personalizado para gestionar el estado del menú
export const useNavMenu = (items: NavMenuItem[]) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const setActive = (itemId: string) => {
    setActiveItem(itemId);
  };

  const toggleOpen = (itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const openAll = () => {
    const allIds = items.flatMap(item => 
      item.children ? [item.id, ...item.children.map(child => child.id)] : [item.id]
    );
    setOpenItems(new Set(allIds));
  };

  const closeAll = () => {
    setOpenItems(new Set());
  };

  return {
    activeItem,
    openItems,
    setActive,
    toggleOpen,
    openAll,
    closeAll,
  };
};

export default NavMenu;
