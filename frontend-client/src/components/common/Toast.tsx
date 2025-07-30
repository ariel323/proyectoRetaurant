import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

export interface ToastProps {
  /**
   * Identificador único del toast
   */
  id: string;
  
  /**
   * Tipo de toast
   */
  type?: 'success' | 'error' | 'warning' | 'info';
  
  /**
   * Título del toast
   */
  title?: string;
  
  /**
   * Mensaje del toast
   */
  message: string;
  
  /**
   * Duración en milisegundos (0 para no cerrar automáticamente)
   */
  duration?: number;
  
  /**
   * Posición del toast
   */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  
  /**
   * Variante de estilo
   */
  variant?: 'default' | 'filled' | 'minimal' | 'bordered';
  
  /**
   * Tamaño del toast
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Icono personalizado
   */
  icon?: React.ReactNode;
  
  /**
   * Mostrar icono por defecto según el tipo
   */
  showDefaultIcon?: boolean;
  
  /**
   * Mostrar botón de cerrar
   */
  showCloseButton?: boolean;
  
  /**
   * Mostrar barra de progreso
   */
  showProgressBar?: boolean;
  
  /**
   * Función que se ejecuta al cerrar
   */
  onClose?: (id: string) => void;
  
  /**
   * Función que se ejecuta al hacer clic
   */
  onClick?: (id: string) => void;
  
  /**
   * Permitir cerrar al hacer clic
   */
  dismissible?: boolean;
  
  /**
   * Pausar el timer al hacer hover
   */
  pauseOnHover?: boolean;
  
  /**
   * Pausar el timer cuando no está visible
   */
  pauseOnFocusLoss?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Datos adicionales
   */
  data?: any;
}

interface ToastProgressBarProps {
  duration: number;
  paused: boolean;
  onComplete: () => void;
  variant: ToastProps['variant'];
  type: ToastProps['type'];
}

/**
 * Barra de progreso del toast
 */
const ToastProgressBar: React.FC<ToastProgressBarProps> = ({
  duration,
  paused,
  onComplete,
  variant = 'default',
  type = 'info',
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (paused || duration === 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      
      setProgress(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration, paused, onComplete]);

  const getProgressColor = () => {
    if (variant === 'filled') return 'bg-white bg-opacity-30';
    
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10">
      <div
        className={cn('h-full transition-all duration-75 ease-linear', getProgressColor())}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

/**
 * Componente Toast - Notificación temporal
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  variant = 'default',
  size = 'md',
  icon,
  showDefaultIcon = true,
  showCloseButton = true,
  showProgressBar = true,
  onClose,
  onClick,
  dismissible = true,
  pauseOnHover = true,
  pauseOnFocusLoss = true,
  className,
  data,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Pausar en pérdida de foco
  useEffect(() => {
    if (!pauseOnFocusLoss) return;

    const handleFocus = () => setIsPaused(false);
    const handleBlur = () => setIsPaused(true);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [pauseOnFocusLoss]);

  const handleClose = () => {
    if (!isRemoving) {
      setIsRemoving(true);
      setTimeout(() => {
        onClose?.(id);
      }, 300); // Tiempo de la animación de salida
    }
  };

  const handleClick = () => {
    if (dismissible && onClick) {
      onClick(id);
    } else if (dismissible) {
      handleClose();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'p-3 text-sm max-w-xs';
      case 'md': return 'p-4 text-sm max-w-sm';
      case 'lg': return 'p-5 text-base max-w-md';
      default: return 'p-4 text-sm max-w-sm';
    }
  };

  const getVariantClasses = () => {
    const typeColors = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600',
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200', 
        text: 'text-red-800',
        icon: 'text-red-600',
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: 'text-yellow-600',
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
      },
    };

    const filledColors = {
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      warning: 'bg-yellow-600 text-white',
      info: 'bg-blue-600 text-white',
    };

    switch (variant) {
      case 'filled':
        return cn('border-0', filledColors[type]);
      case 'minimal':
        return cn('bg-white border-0 shadow-sm', typeColors[type].text);
      case 'bordered':
        return cn('bg-white border-2', typeColors[type].border, typeColors[type].text);
      default:
        return cn(
          'border',
          typeColors[type].bg,
          typeColors[type].border,
          typeColors[type].text
        );
    }
  };

  const getIconClasses = () => {
    const typeColors = {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
    };

    return variant === 'filled' ? 'text-white' : typeColors[type];
  };

  const getDefaultIcon = () => {
    const iconClass = 'w-5 h-5';
    
    switch (type) {
      case 'success':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.736 0L3.868 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out',
        'transform',
        isVisible && !isRemoving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95',
        getSizeClasses(),
        getVariantClasses(),
        (dismissible || onClick) && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className="flex items-start space-x-3">
        {/* Icono */}
        {(icon || showDefaultIcon) && (
          <div className={cn('flex-shrink-0 mt-0.5', getIconClasses())}>
            {icon || getDefaultIcon()}
          </div>
        )}

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-medium mb-1 truncate">
              {title}
            </h4>
          )}
          <p className={cn('leading-relaxed', title ? 'text-sm opacity-90' : '')}>
            {message}
          </p>
        </div>

        {/* Botón de cerrar */}
        {showCloseButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className={cn(
              'flex-shrink-0 ml-2 p-1 rounded-full transition-colors duration-200',
              'hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2',
              variant === 'filled' 
                ? 'text-white focus:ring-white' 
                : `focus:ring-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500`
            )}
            aria-label="Cerrar notificación"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Barra de progreso */}
      {showProgressBar && duration > 0 && (
        <ToastProgressBar
          duration={duration}
          paused={isPaused}
          onComplete={handleClose}
          variant={variant}
          type={type}
        />
      )}
    </div>
  );
};

export default Toast;
