import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface TabItem {
  /**
   * Identificador único del tab
   */
  id: string;
  
  /**
   * Etiqueta del tab
   */
  label: string;
  
  /**
   * Contenido del tab
   */
  content: React.ReactNode;
  
  /**
   * Icono del tab
   */
  icon?: React.ReactNode;
  
  /**
   * Badge/contador del tab
   */
  badge?: string | number;
  
  /**
   * Deshabilitar el tab
   */
  disabled?: boolean;
  
  /**
   * Clases CSS adicionales para el tab
   */
  className?: string;
}

interface TabsProps {
  /**
   * Lista de tabs
   */
  tabs: TabItem[];
  
  /**
   * Tab activo por defecto
   */
  defaultActiveTab?: string;
  
  /**
   * Tab activo controlado
   */
  activeTab?: string;
  
  /**
   * Función que se ejecuta al cambiar de tab
   */
  onTabChange?: (tabId: string) => void;
  
  /**
   * Variante de estilo
   */
  variant?: 'default' | 'pills' | 'underline' | 'bordered' | 'minimal';
  
  /**
   * Tamaño de los tabs
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Orientación de los tabs
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Posición de los tabs
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Alineación de los tabs
   */
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  
  /**
   * Permitir scrolling en tabs
   */
  scrollable?: boolean;
  
  /**
   * Mostrar indicador de contenido activo
   */
  showActiveIndicator?: boolean;
  
  /**
   * Lazy loading del contenido
   */
  lazyLoad?: boolean;
  
  /**
   * Animación entre tabs
   */
  animated?: boolean;
  
  /**
   * Clases CSS adicionales para el contenedor
   */
  className?: string;
  
  /**
   * Clases CSS adicionales para la lista de tabs
   */
  tabListClassName?: string;
  
  /**
   * Clases CSS adicionales para el contenido
   */
  contentClassName?: string;
}

interface TabListProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant: TabsProps['variant'];
  size: TabsProps['size'];
  orientation: TabsProps['orientation'];
  alignment: TabsProps['alignment'];
  scrollable: TabsProps['scrollable'];
  showActiveIndicator: TabsProps['showActiveIndicator'];
  className?: string;
}

interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  onClick: () => void;
  variant: TabsProps['variant'];
  size: TabsProps['size'];
  orientation: TabsProps['orientation'];
}

interface TabContentProps {
  tabs: TabItem[];
  activeTab: string;
  lazyLoad: boolean;
  animated: boolean;
  className?: string;
}

/**
 * Botón individual de tab
 */
const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  onClick,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
}) => {
  const getSizeClasses = () => {
    const isVertical = orientation === 'vertical';
    
    switch (size) {
      case 'sm':
        return isVertical ? 'px-3 py-2 text-xs' : 'px-3 py-2 text-xs';
      case 'md':
        return isVertical ? 'px-4 py-3 text-sm' : 'px-4 py-2 text-sm';
      case 'lg':
        return isVertical ? 'px-6 py-4 text-base' : 'px-6 py-3 text-base';
      default:
        return isVertical ? 'px-4 py-3 text-sm' : 'px-4 py-2 text-sm';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    
    switch (variant) {
      case 'pills':
        return cn(
          baseClasses,
          'rounded-full font-medium',
          isActive
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        );
      case 'underline':
        return cn(
          baseClasses,
          'border-b-2 font-medium relative',
          isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        );
      case 'bordered':
        return cn(
          baseClasses,
          'border border-gray-300 font-medium',
          orientation === 'horizontal' ? 'border-b-0 rounded-t-md' : 'border-r-0 rounded-l-md',
          isActive
            ? 'bg-white text-blue-600 border-blue-600'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        );
      case 'minimal':
        return cn(
          baseClasses,
          'font-medium',
          isActive
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        );
      default:
        return cn(
          baseClasses,
          'rounded-md font-medium',
          isActive
            ? 'bg-blue-50 text-blue-600 border border-blue-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
        );
    }
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${tab.id}`}
      id={`tab-${tab.id}`}
      onClick={onClick}
      disabled={tab.disabled}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        getSizeClasses(),
        getVariantClasses(),
        tab.className
      )}
    >
      {/* Icono */}
      {tab.icon && (
        <span className={cn('flex-shrink-0', tab.label && 'mr-2')}>
          {tab.icon}
        </span>
      )}
      
      {/* Etiqueta */}
      {tab.label && (
        <span className="truncate">
          {tab.label}
        </span>
      )}
      
      {/* Badge */}
      {tab.badge && (
        <span className={cn(
          'ml-2 inline-flex items-center justify-center rounded-full text-xs font-medium',
          size === 'sm' ? 'px-1.5 py-0.5 min-w-[16px] h-4' : 'px-2 py-1 min-w-[20px] h-5',
          isActive ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'
        )}>
          {tab.badge}
        </span>
      )}
    </button>
  );
};

/**
 * Lista de tabs
 */
const TabList: React.FC<TabListProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  alignment = 'start',
  scrollable = false,
  showActiveIndicator = true,
  className,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndicatorStyle, setActiveIndicatorStyle] = useState<React.CSSProperties>({});

  // Actualizar posición del indicador activo
  useEffect(() => {
    if (!showActiveIndicator || variant === 'pills' || variant === 'bordered') return;

    const updateIndicator = () => {
      const activeButton = listRef.current?.querySelector(`#tab-${activeTab}`) as HTMLElement;
      if (activeButton && listRef.current) {
        const listRect = listRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();

        if (orientation === 'horizontal') {
          setActiveIndicatorStyle({
            width: buttonRect.width,
            height: '2px',
            left: buttonRect.left - listRect.left,
            bottom: 0,
          });
        } else {
          setActiveIndicatorStyle({
            width: '2px',
            height: buttonRect.height,
            left: 0,
            top: buttonRect.top - listRect.top,
          });
        }
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab, orientation, showActiveIndicator, variant, tabs]);

  const getListClasses = () => {
    const baseClasses = 'relative';
    
    if (orientation === 'horizontal') {
      const alignmentClasses = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        stretch: 'justify-stretch',
      };
      
      return cn(
        baseClasses,
        'flex',
        alignmentClasses[alignment],
        scrollable ? 'overflow-x-auto scrollbar-hide' : 'flex-wrap',
        variant === 'bordered' && 'border-b border-gray-300'
      );
    } else {
      return cn(
        baseClasses,
        'flex flex-col',
        scrollable ? 'overflow-y-auto' : '',
        variant === 'bordered' && 'border-r border-gray-300'
      );
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={cn(getListClasses(), className)}
    >
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          variant={variant}
          size={size}
          orientation={orientation}
        />
      ))}
      
      {/* Indicador activo */}
      {showActiveIndicator && (variant === 'underline' || variant === 'default') && (
        <div
          className="absolute bg-blue-600 transition-all duration-200 ease-in-out"
          style={activeIndicatorStyle}
        />
      )}
    </div>
  );
};

/**
 * Contenido de los tabs
 */
const TabContent: React.FC<TabContentProps> = ({
  tabs,
  activeTab,
  lazyLoad = false,
  animated = false,
  className,
}) => {
  const [renderedTabs, setRenderedTabs] = useState<Set<string>>(new Set([activeTab]));

  useEffect(() => {
    if (!lazyLoad) {
      setRenderedTabs(new Set(tabs.map(tab => tab.id)));
    } else {
      setRenderedTabs(prev => new Set(Array.from(prev).concat(activeTab)));
    }
  }, [activeTab, lazyLoad, tabs]);

  return (
    <div className={cn('relative', animated && 'overflow-hidden', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const shouldRender = !lazyLoad || renderedTabs.has(tab.id);

        if (!shouldRender) return null;

        return (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={cn(
              animated && 'transition-all duration-300',
              isActive
                ? animated ? 'opacity-100 translate-x-0' : 'block'
                : animated ? 'opacity-0 translate-x-4 absolute inset-0' : 'hidden'
            )}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Componente Tabs - Sistema de pestañas completo y configurable
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  position = 'top',
  alignment = 'start',
  scrollable = false,
  showActiveIndicator = true,
  lazyLoad = false,
  animated = false,
  className,
  tabListClassName,
  contentClassName,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ''
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  const getContainerClasses = () => {
    const isVertical = orientation === 'vertical';
    
    return cn(
      'w-full',
      isVertical ? 'flex' : 'space-y-4',
      className
    );
  };

  const getTabListPosition = () => {
    if (orientation === 'vertical') {
      return position === 'right' ? 'order-2 ml-4' : 'order-1 mr-4';
    } else {
      return position === 'bottom' ? 'order-2 mt-4' : 'order-1 mb-4';
    }
  };

  const getContentPosition = () => {
    if (orientation === 'vertical') {
      return position === 'right' ? 'order-1 flex-1' : 'order-2 flex-1';
    } else {
      return position === 'bottom' ? 'order-1 flex-1' : 'order-2 flex-1';
    }
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={getContainerClasses()}>
      {/* Lista de tabs */}
      <div className={getTabListPosition()}>
        <TabList
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant={variant}
          size={size}
          orientation={orientation}
          alignment={alignment}
          scrollable={scrollable}
          showActiveIndicator={showActiveIndicator}
          className={tabListClassName}
        />
      </div>

      {/* Contenido */}
      <div className={getContentPosition()}>
        <TabContent
          tabs={tabs}
          activeTab={activeTab}
          lazyLoad={lazyLoad}
          animated={animated}
          className={contentClassName}
        />
      </div>
    </div>
  );
};

/**
 * Hook para gestionar tabs
 */
export const useTabs = (tabs: TabItem[], initialTab?: string) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id || '');

  const goToTab = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId && !tab.disabled)) {
      setActiveTab(tabId);
    }
  };

  const goToNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const nextTabs = tabs.slice(currentIndex + 1).filter(tab => !tab.disabled);
    if (nextTabs.length > 0) {
      setActiveTab(nextTabs[0].id);
    }
  };

  const goToPrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const previousTabs = tabs.slice(0, currentIndex).filter(tab => !tab.disabled);
    if (previousTabs.length > 0) {
      setActiveTab(previousTabs[previousTabs.length - 1].id);
    }
  };

  const getCurrentTab = () => tabs.find(tab => tab.id === activeTab);

  return {
    activeTab,
    setActiveTab,
    goToTab,
    goToNext,
    goToPrevious,
    getCurrentTab,
    canGoNext: tabs.slice(tabs.findIndex(tab => tab.id === activeTab) + 1).some(tab => !tab.disabled),
    canGoPrevious: tabs.slice(0, tabs.findIndex(tab => tab.id === activeTab)).some(tab => !tab.disabled),
  };
};

export default Tabs;
