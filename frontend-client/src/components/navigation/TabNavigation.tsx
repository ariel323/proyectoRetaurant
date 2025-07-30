import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface Tab {
  /**
   * ID único de la pestaña
   */
  id: string;
  
  /**
   * Etiqueta de la pestaña
   */
  label: string;
  
  /**
   * Contenido de la pestaña
   */
  content: React.ReactNode;
  
  /**
   * Icono de la pestaña
   */
  icon?: string | React.ReactNode;
  
  /**
   * Badge o contador
   */
  badge?: number | string;
  
  /**
   * Pestaña deshabilitada
   */
  disabled?: boolean;
  
  /**
   * Mostrar indicador de carga
   */
  loading?: boolean;
  
  /**
   * Función de renderizado personalizada para el contenido
   */
  render?: () => React.ReactNode;
}

export interface TabNavigationProps {
  /**
   * Lista de pestañas
   */
  tabs: Tab[];
  
  /**
   * Pestaña activa por defecto
   */
  defaultActiveTab?: string;
  
  /**
   * Pestaña activa controlada
   */
  activeTab?: string;
  
  /**
   * Función callback cuando cambia la pestaña
   */
  onTabChange?: (tabId: string, tab: Tab) => void;
  
  /**
   * Variante del estilo
   */
  variant?: 'default' | 'pills' | 'underline' | 'rounded' | 'vertical';
  
  /**
   * Tamaño de las pestañas
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Posición de las pestañas
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Permitir desplazamiento horizontal en pestañas
   */
  scrollable?: boolean;
  
  /**
   * Mostrar contenido lazy (solo renderizar pestaña activa)
   */
  lazy?: boolean;
  
  /**
   * Animar transiciones entre pestañas
   */
  animated?: boolean;
  
  /**
   * Centrear las pestañas
   */
  centered?: boolean;
  
  /**
   * Distribución igual de espacio
   */
  fullWidth?: boolean;
  
  /**
   * Clase CSS adicional para el contenedor
   */
  className?: string;
  
  /**
   * Clase CSS adicional para el área de contenido
   */
  contentClassName?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  position = 'top',
  scrollable = false,
  lazy = false,
  animated = true,
  centered = false,
  fullWidth = false,
  className,
  contentClassName,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    defaultActiveTab || tabs[0]?.id || ''
  );
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const activeTab = controlledActiveTab || internalActiveTab;
  const currentTab = tabs.find(tab => tab.id === activeTab);

  const handleTabClick = (tab: Tab) => {
    if (tab.disabled) return;
    
    if (!controlledActiveTab) {
      setInternalActiveTab(tab.id);
    }
    
    onTabChange?.(tab.id, tab);
  };

  // Actualizar indicador para variantes que lo necesiten
  useEffect(() => {
    if ((variant === 'underline' || variant === 'pills') && tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
      if (activeButton) {
        const rect = activeButton.getBoundingClientRect();
        const containerRect = tabsRef.current.getBoundingClientRect();
        
        if (variant === 'underline') {
          setIndicatorStyle({
            width: rect.width,
            left: rect.left - containerRect.left,
            bottom: 0,
          });
        }
      }
    }
  }, [activeTab, variant]);

  const getTabListClasses = () => {
    const baseClasses = 'relative flex';
    
    const variantClasses = {
      default: 'border-b border-gray-200',
      pills: 'bg-gray-100 p-1 rounded-lg inline-flex',
      underline: 'border-b border-gray-200',
      rounded: 'space-x-1',
      vertical: 'flex-col space-y-1 border-r border-gray-200',
    };
    
    const positionClasses = {
      top: '',
      bottom: 'order-2',
      left: 'flex-col',
      right: 'flex-col order-2',
    };
    
    const layoutClasses = cn(
      scrollable && position === 'top' && 'overflow-x-auto scrollbar-hide',
      centered && 'justify-center',
      fullWidth && variant !== 'pills' && 'w-full',
      variant === 'vertical' && 'flex-col'
    );

    return cn(
      baseClasses,
      variantClasses[variant],
      positionClasses[position],
      layoutClasses
    );
  };

  const getTabButtonClasses = (tab: Tab, isActive: boolean) => {
    const baseClasses = 'relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    
    const variantClasses = {
      default: cn(
        'border-b-2 font-medium',
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      ),
      pills: cn(
        'rounded-md font-medium',
        isActive
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      ),
      underline: cn(
        'font-medium pb-4',
        isActive
          ? 'text-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      ),
      rounded: cn(
        'rounded-lg font-medium',
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      ),
      vertical: cn(
        'text-left justify-start border-r-2 pr-4',
        isActive
          ? 'border-blue-500 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      ),
    };

    const disabledClasses = tab.disabled 
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer';

    const fullWidthClasses = fullWidth && variant !== 'pills' 
      ? 'flex-1 text-center' 
      : '';

    return cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      disabledClasses,
      fullWidthClasses
    );
  };

  const renderIcon = (icon: string | React.ReactNode | undefined) => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return <span className="mr-2">{icon}</span>;
    }
    
    return <span className="mr-2">{icon}</span>;
  };

  const renderBadge = (badge: number | string | undefined) => {
    if (!badge) return null;
    
    return (
      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        {badge}
      </span>
    );
  };

  const renderLoadingSpinner = () => (
    <span className="ml-2 inline-block animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
  );

  const renderTabButton = (tab: Tab) => {
    const isActive = tab.id === activeTab;
    
    return (
      <button
        key={tab.id}
        data-tab-id={tab.id}
        onClick={() => handleTabClick(tab)}
        disabled={tab.disabled}
        className={getTabButtonClasses(tab, isActive)}
        aria-selected={isActive}
        aria-controls={`tabpanel-${tab.id}`}
        role="tab"
        type="button"
      >
        <span className="flex items-center">
          {renderIcon(tab.icon)}
          {tab.label}
          {tab.loading && renderLoadingSpinner()}
          {!tab.loading && renderBadge(tab.badge)}
        </span>
      </button>
    );
  };

  const renderIndicator = () => {
    if (variant !== 'underline') return null;
    
    return (
      <div
        className="absolute h-0.5 bg-blue-500 transition-all duration-200"
        style={indicatorStyle}
      />
    );
  };

  const renderContent = () => {
    if (!currentTab) return null;

    const content = currentTab.render ? currentTab.render() : currentTab.content;
    
    if (lazy) {
      return content;
    }

    return (
      <div className="relative">
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          const tabContent = tab.render ? tab.render() : tab.content;
          
          return (
            <div
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={cn(
                animated && 'transition-opacity duration-200',
                isActive ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
              )}
            >
              {tabContent}
            </div>
          );
        })}
      </div>
    );
  };

  const isVertical = variant === 'vertical' || position === 'left' || position === 'right';

  return (
    <div className={cn(
      'w-full',
      isVertical ? 'flex' : 'space-y-4',
      className
    )}>
      <div
        ref={tabsRef}
        className={getTabListClasses()}
        role="tablist"
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      >
        {tabs.map(renderTabButton)}
        {renderIndicator()}
      </div>
      
      <div className={cn(
        'flex-1',
        isVertical && 'ml-6',
        contentClassName
      )}>
        {renderContent()}
      </div>
    </div>
  );
};

// Hook para gestionar el estado de pestañas
export const useTabs = (initialTab?: string) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab || '');
  const [tabHistory, setTabHistory] = useState<string[]>([]);

  const changeTab = (tabId: string) => {
    setActiveTab(tabId);
    setTabHistory(prev => [...prev.filter(id => id !== tabId), tabId]);
  };

  const goToPreviousTab = () => {
    if (tabHistory.length > 1) {
      const previousTab = tabHistory[tabHistory.length - 2];
      setActiveTab(previousTab);
      setTabHistory(prev => prev.slice(0, -1));
    }
  };

  const resetTabs = (newTab?: string) => {
    setActiveTab(newTab || '');
    setTabHistory([]);
  };

  return {
    activeTab,
    tabHistory,
    changeTab,
    goToPreviousTab,
    resetTabs,
  };
};

export default TabNavigation;
