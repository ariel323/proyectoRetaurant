import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

interface TooltipProps {
  /**
   * Contenido del tooltip
   */
  content: React.ReactNode;
  
  /**
   * Elemento que activará el tooltip
   */
  children: React.ReactElement;
  
  /**
   * Posición del tooltip
   */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  
  /**
   * Evento que activa el tooltip
   */
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  
  /**
   * Delay antes de mostrar (ms)
   */
  showDelay?: number;
  
  /**
   * Delay antes de ocultar (ms)
   */
  hideDelay?: number;
  
  /**
   * Variante de estilo
   */
  variant?: 'default' | 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info';
  
  /**
   * Tamaño del tooltip
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Mostrar flecha
   */
  showArrow?: boolean;
  
  /**
   * Offset desde el elemento trigger
   */
  offset?: number;
  
  /**
   * Estado controlado del tooltip
   */
  open?: boolean;
  
  /**
   * Función para controlar la visibilidad
   */
  onOpenChange?: (open: boolean) => void;
  
  /**
   * Deshabilitar el tooltip
   */
  disabled?: boolean;
  
  /**
   * Z-index personalizado
   */
  zIndex?: number;
  
  /**
   * Contenedor para el portal
   */
  container?: Element;
  
  /**
   * Permitir interacción con el tooltip
   */
  interactive?: boolean;
  
  /**
   * Cerrar al hacer clic fuera
   */
  closeOnClickOutside?: boolean;
  
  /**
   * Ancho máximo del tooltip
   */
  maxWidth?: number | string;
  
  /**
   * Clases CSS adicionales para el tooltip
   */
  className?: string;
  
  /**
   * Clases CSS adicionales para la flecha
   */
  arrowClassName?: string;
}

interface Position {
  top: number;
  left: number;
  placement: TooltipProps['placement'];
}

/**
 * Mapear placement opuesto
 */
const getOppositePlacement = (placement: TooltipProps['placement']): NonNullable<TooltipProps['placement']> => {
  const mapping: Record<string, NonNullable<TooltipProps['placement']>> = {
    'top': 'bottom',
    'top-start': 'bottom-start',
    'top-end': 'bottom-end',
    'bottom': 'top',
    'bottom-start': 'top-start',
    'bottom-end': 'top-end',
    'left': 'right',
    'left-start': 'right-start',
    'left-end': 'right-end',
    'right': 'left',
    'right-start': 'left-start',
    'right-end': 'left-end',
  };
  return mapping[placement || 'top'] || 'top';
};

/**
 * Calcular la posición del tooltip
 */
const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: TooltipProps['placement'] = 'top',
  offset: number = 8
): Position => {
  const scrollX = window.pageXOffset;
  const scrollY = window.pageYOffset;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let top = 0;
  let left = 0;
  let finalPlacement = placement;

  // Calcular posición base
  switch (placement) {
    case 'top':
    case 'top-start':
    case 'top-end':
      top = triggerRect.top + scrollY - tooltipRect.height - offset;
      left = placement === 'top-start' 
        ? triggerRect.left + scrollX
        : placement === 'top-end'
        ? triggerRect.right + scrollX - tooltipRect.width
        : triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
      break;
      
    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
      top = triggerRect.bottom + scrollY + offset;
      left = placement === 'bottom-start'
        ? triggerRect.left + scrollX
        : placement === 'bottom-end'
        ? triggerRect.right + scrollX - tooltipRect.width
        : triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
      break;
      
    case 'left':
    case 'left-start':
    case 'left-end':
      top = placement === 'left-start'
        ? triggerRect.top + scrollY
        : placement === 'left-end'
        ? triggerRect.bottom + scrollY - tooltipRect.height
        : triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.left + scrollX - tooltipRect.width - offset;
      break;
      
    case 'right':
    case 'right-start':
    case 'right-end':
      top = placement === 'right-start'
        ? triggerRect.top + scrollY
        : placement === 'right-end'
        ? triggerRect.bottom + scrollY - tooltipRect.height
        : triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.right + scrollX + offset;
      break;
  }

  // Verificar que el tooltip esté dentro del viewport
  const tooltipRight = left + tooltipRect.width;
  const tooltipBottom = top + tooltipRect.height;

  // Ajustar horizontalmente si se sale del viewport
  if (left < scrollX + 10) {
    left = scrollX + 10;
  } else if (tooltipRight > scrollX + viewportWidth - 10) {
    left = scrollX + viewportWidth - tooltipRect.width - 10;
  }

  // Ajustar verticalmente si se sale del viewport
  if (top < scrollY + 10) {
    top = scrollY + 10;
    if (placement.startsWith('top')) {
      finalPlacement = getOppositePlacement(placement);
    }
  } else if (tooltipBottom > scrollY + viewportHeight - 10) {
    top = scrollY + viewportHeight - tooltipRect.height - 10;
    if (placement.startsWith('bottom')) {
      finalPlacement = getOppositePlacement(placement);
    }
  }

  return { top, left, placement: finalPlacement };
};

/**
 * Componente Tooltip - Tooltip avanzado con posicionamiento inteligente
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  showDelay = 200,
  hideDelay = 100,
  variant = 'default',
  size = 'md',
  showArrow = true,
  offset = 8,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  zIndex = 9999,
  container,
  interactive = false,
  closeOnClickOutside = true,
  maxWidth = 200,
  className,
  arrowClassName,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, placement });
  const [isReady, setIsReady] = useState(false);
  
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const newPosition = calculatePosition(triggerRect, tooltipRect, placement, offset);
    setPosition(newPosition);
    setIsReady(true);
  }, [isOpen, placement, offset]);

  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para que el tooltip se renderice antes de calcular posición
      const timer = setTimeout(updatePosition, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, updatePosition]);

  const setOpen = useCallback((newOpen: boolean) => {
    if (disabled) return;
    
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
    
    if (!newOpen) {
      setIsReady(false);
    }
  }, [disabled, controlledOpen, onOpenChange]);

  const show = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    showTimeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, showDelay);
  }, [setOpen, showDelay]);

  const hide = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, hideDelay);
  }, [setOpen, hideDelay]);

  const handleTriggerMouseEnter = () => {
    if (trigger === 'hover') show();
  };

  const handleTriggerMouseLeave = () => {
    if (trigger === 'hover') hide();
  };

  const handleTriggerClick = () => {
    if (trigger === 'click') {
      setOpen(!isOpen);
    }
  };

  const handleTriggerFocus = () => {
    if (trigger === 'focus') show();
  };

  const handleTriggerBlur = () => {
    if (trigger === 'focus') hide();
  };

  const handleTooltipMouseEnter = () => {
    if (trigger === 'hover' && interactive) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
  };

  const handleTooltipMouseLeave = () => {
    if (trigger === 'hover' && interactive) {
      hide();
    }
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        tooltipRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnClickOutside, setOpen]);

  // Limpiar timeouts
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs';
      case 'md': return 'px-3 py-2 text-sm';
      case 'lg': return 'px-4 py-3 text-base';
      default: return 'px-3 py-2 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'dark':
        return 'bg-gray-900 text-white border-gray-900';
      case 'light':
        return 'bg-white text-gray-900 border-gray-200 shadow-lg';
      case 'success':
        return 'bg-green-600 text-white border-green-600';
      case 'warning':
        return 'bg-yellow-600 text-white border-yellow-600';
      case 'error':
        return 'bg-red-600 text-white border-red-600';
      case 'info':
        return 'bg-blue-600 text-white border-blue-600';
      default:
        return 'bg-gray-800 text-white border-gray-800';
    }
  };

  const getArrowClasses = () => {
    const baseArrow = 'absolute w-2 h-2 transform rotate-45 border';
    const variantArrow = variant === 'light' 
      ? 'bg-white border-gray-200' 
      : getVariantClasses().includes('bg-gray-900')
      ? 'bg-gray-900 border-gray-900'
      : getVariantClasses().split(' ').find(c => c.startsWith('bg-'))?.replace('bg-', 'bg-') + ' ' +
        getVariantClasses().split(' ').find(c => c.startsWith('border-'))?.replace('border-', 'border-');

    const arrowPosition = (() => {
      switch (position.placement) {
        case 'top':
        case 'top-start':
        case 'top-end':
          return 'bottom-0 transform translate-y-1/2 border-t-0 border-l-0';
        case 'bottom':
        case 'bottom-start':
        case 'bottom-end':
          return 'top-0 transform -translate-y-1/2 border-b-0 border-r-0';
        case 'left':
        case 'left-start':
        case 'left-end':
          return 'right-0 transform translate-x-1/2 border-l-0 border-b-0';
        case 'right':
        case 'right-start':
        case 'right-end':
          return 'left-0 transform -translate-x-1/2 border-r-0 border-t-0';
        default:
          return 'bottom-0 transform translate-y-1/2 border-t-0 border-l-0';
      }
    })();

    return cn(baseArrow, variantArrow, arrowPosition, arrowClassName);
  };

  const getArrowPositioning = () => {
    switch (position.placement) {
      case 'top':
      case 'bottom':
        return { left: '50%', transform: 'translateX(-50%)' };
      case 'top-start':
      case 'bottom-start':
        return { left: '12px' };
      case 'top-end':
      case 'bottom-end':
        return { right: '12px' };
      case 'left':
      case 'right':
        return { top: '50%', transform: 'translateY(-50%)' };
      case 'left-start':
      case 'right-start':
        return { top: '12px' };
      case 'left-end':
      case 'right-end':
        return { bottom: '12px' };
      default:
        return { left: '50%', transform: 'translateX(-50%)' };
    }
  };

  // Crear elemento trigger con event handlers
  const triggerElement = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleTriggerMouseEnter,
    onMouseLeave: handleTriggerMouseLeave,
    onClick: handleTriggerClick,
    onFocus: handleTriggerFocus,
    onBlur: handleTriggerBlur,
    'aria-describedby': isOpen ? 'tooltip' : undefined,
  });

  const tooltipContent = (
    <div
      ref={tooltipRef}
      role="tooltip"
      id="tooltip"
      className={cn(
        'absolute rounded-md border font-medium leading-relaxed transition-opacity duration-200 pointer-events-auto',
        getSizeClasses(),
        getVariantClasses(),
        isOpen && isReady ? 'opacity-100' : 'opacity-0 pointer-events-none',
        interactive && 'cursor-default',
        className
      )}
      style={{
        top: position.top,
        left: position.left,
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        zIndex,
      }}
      onMouseEnter={handleTooltipMouseEnter}
      onMouseLeave={handleTooltipMouseLeave}
    >
      {content}
      
      {/* Flecha */}
      {showArrow && (
        <div
          className={getArrowClasses()}
          style={getArrowPositioning()}
        />
      )}
    </div>
  );

  return (
    <>
      {triggerElement}
      {isOpen && (
        container 
          ? createPortal(tooltipContent, container)
          : createPortal(tooltipContent, document.body)
      )}
    </>
  );
};

/**
 * Hook para controlar tooltip manualmente
 */
export const useTooltip = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const show = useCallback(() => setIsOpen(true), []);
  const hide = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    show,
    hide,
    toggle,
    setIsOpen,
  };
};

export default Tooltip;
