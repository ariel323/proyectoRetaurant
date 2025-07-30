import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';

interface ScrollToTopProps {
  /**
   * Threshold en píxeles para mostrar el botón
   */
  threshold?: number;
  
  /**
   * Comportamiento del scroll
   */
  behavior?: 'auto' | 'smooth';
  
  /**
   * Posición del botón
   */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center';
  
  /**
   * Tamaño del botón
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Variante de estilo
   */
  variant?: 'default' | 'filled' | 'outlined' | 'minimal' | 'floating';
  
  /**
   * Color del botón
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gray';
  
  /**
   * Forma del botón
   */
  shape?: 'circle' | 'square' | 'rounded';
  
  /**
   * Icono personalizado
   */
  icon?: React.ReactNode;
  
  /**
   * Texto del botón (solo para variantes con texto)
   */
  text?: string;
  
  /**
   * Mostrar texto junto al icono
   */
  showText?: boolean;
  
  /**
   * Animación de entrada/salida
   */
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
  
  /**
   * Offset desde el borde de la pantalla
   */
  offset?: {
    x?: number;
    y?: number;
  };
  
  /**
   * Z-index del botón
   */
  zIndex?: number;
  
  /**
   * Elemento al que hacer scroll (por defecto window)
   */
  target?: Element | string;
  
  /**
   * Función que se ejecuta al hacer clic
   */
  onClick?: () => void;
  
  /**
   * Función que se ejecuta cuando cambia la visibilidad
   */
  onVisibilityChange?: (isVisible: boolean) => void;
  
  /**
   * Mostrar progreso de scroll
   */
  showProgress?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Título/tooltip del botón
   */
  title?: string;
  
  /**
   * Deshabilitar el botón
   */
  disabled?: boolean;
}

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
}

/**
 * Componente para mostrar progreso circular
 */
const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  color,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className="absolute inset-0 transform -rotate-90"
      width={size}
      height={size}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        className="opacity-20"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300"
      />
    </svg>
  );
};

/**
 * Hook para detectar scroll
 */
const useScrollDetection = (threshold: number, target?: Element | string) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let targetElement: Element | Window = window;
    
    if (target) {
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) targetElement = element;
      } else {
        targetElement = target;
      }
    }

    const updateScrollInfo = () => {
      let currentScrollY = 0;
      let maxScroll = 0;

      if (targetElement === window) {
        currentScrollY = window.pageYOffset;
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      } else {
        const element = targetElement as Element;
        currentScrollY = element.scrollTop;
        maxScroll = element.scrollHeight - element.clientHeight;
      }

      setScrollY(currentScrollY);
      setIsVisible(currentScrollY > threshold);
      setScrollProgress(maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0);
    };

    updateScrollInfo();
    targetElement.addEventListener('scroll', updateScrollInfo, { passive: true });

    return () => {
      targetElement.removeEventListener('scroll', updateScrollInfo);
    };
  }, [threshold, target]);

  return { scrollY, isVisible, scrollProgress };
};

/**
 * Componente ScrollToTop - Botón para volver al inicio de la página
 */
export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 300,
  behavior = 'smooth',
  position = 'bottom-right',
  size = 'md',
  variant = 'floating',
  color = 'primary',
  shape = 'circle',
  icon,
  text = 'Ir arriba',
  showText = false,
  animation = 'fade',
  offset = { x: 20, y: 20 },
  zIndex = 1000,
  target,
  onClick,
  onVisibilityChange,
  showProgress = false,
  className,
  title = 'Volver al inicio',
  disabled = false,
}) => {
  const { isVisible, scrollProgress } = useScrollDetection(threshold, target);
  const [shouldRender, setShouldRender] = useState(isVisible);

  // Gestionar renderizado con animación
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else if (animation !== 'fade') {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
    }
  }, [isVisible, animation]);

  // Notificar cambio de visibilidad
  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  const scrollToTop = useCallback(() => {
    if (disabled) return;

    let targetElement: Element | Window = window;
    
    if (target) {
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) targetElement = element;
      } else {
        targetElement = target;
      }
    }

    if (targetElement === window) {
      window.scrollTo({
        top: 0,
        behavior,
      });
    } else {
      (targetElement as Element).scrollTo({
        top: 0,
        behavior,
      });
    }

    onClick?.();
  }, [behavior, target, disabled, onClick]);

  const getSizeClasses = () => {
    const sizes = {
      sm: { button: 'w-10 h-10 text-sm', text: 'text-xs', progress: 40 },
      md: { button: 'w-12 h-12 text-base', text: 'text-sm', progress: 48 },
      lg: { button: 'w-14 h-14 text-lg', text: 'text-base', progress: 56 },
    };
    return sizes[size];
  };

  const getColorClasses = () => {
    const colors = {
      primary: {
        filled: 'bg-blue-600 hover:bg-blue-700 text-white',
        outlined: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        minimal: 'text-blue-600 hover:bg-blue-50',
        floating: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
        progressColor: '#3B82F6',
      },
      secondary: {
        filled: 'bg-gray-600 hover:bg-gray-700 text-white',
        outlined: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50',
        minimal: 'text-gray-600 hover:bg-gray-50',
        floating: 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl',
        progressColor: '#4B5563',
      },
      success: {
        filled: 'bg-green-600 hover:bg-green-700 text-white',
        outlined: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
        minimal: 'text-green-600 hover:bg-green-50',
        floating: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl',
        progressColor: '#059669',
      },
      warning: {
        filled: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        outlined: 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50',
        minimal: 'text-yellow-600 hover:bg-yellow-50',
        floating: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl',
        progressColor: '#D97706',
      },
      error: {
        filled: 'bg-red-600 hover:bg-red-700 text-white',
        outlined: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
        minimal: 'text-red-600 hover:bg-red-50',
        floating: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
        progressColor: '#DC2626',
      },
      info: {
        filled: 'bg-blue-500 hover:bg-blue-600 text-white',
        outlined: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
        minimal: 'text-blue-500 hover:bg-blue-50',
        floating: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl',
        progressColor: '#3B82F6',
      },
      gray: {
        filled: 'bg-gray-500 hover:bg-gray-600 text-white',
        outlined: 'border-2 border-gray-500 text-gray-500 hover:bg-gray-50',
        minimal: 'text-gray-500 hover:bg-gray-50',
        floating: 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl',
        progressColor: '#6B7280',
      },
    };
    return colors[color];
  };

  const getShapeClasses = () => {
    switch (shape) {
      case 'circle': return 'rounded-full';
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-lg';
      default: return 'rounded-full';
    }
  };

  const getVariantClasses = () => {
    const colorConfig = getColorClasses();
    const validVariant = variant === 'default' ? 'floating' : variant;
    return colorConfig[validVariant as keyof typeof colorConfig] || colorConfig.floating;
  };

  const getAnimationClasses = () => {
    const baseTransition = 'transition-all duration-300';
    
    if (!isVisible) {
      switch (animation) {
        case 'slide':
          return `${baseTransition} transform translate-y-full opacity-0`;
        case 'scale':
          return `${baseTransition} transform scale-0 opacity-0`;
        case 'bounce':
          return `${baseTransition} transform scale-0 opacity-0`;
        case 'fade':
        default:
          return `${baseTransition} opacity-0 pointer-events-none`;
      }
    }

    switch (animation) {
      case 'slide':
        return `${baseTransition} transform translate-y-0 opacity-100`;
      case 'scale':
        return `${baseTransition} transform scale-100 opacity-100`;
      case 'bounce':
        return `${baseTransition} transform scale-100 opacity-100 animate-bounce`;
      case 'fade':
      default:
        return `${baseTransition} opacity-100`;
    }
  };

  const getDefaultIcon = () => (
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
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      />
    </svg>
  );

  if (!shouldRender && animation !== 'fade') return null;

  const sizeConfig = getSizeClasses();
  const colorConfig = getColorClasses();
  const variantClasses = getVariantClasses();

  const buttonContent = (
    <>
      {/* Progreso circular */}
      {showProgress && (
        <ProgressRing
          progress={scrollProgress}
          size={parseInt(sizeConfig.button.match(/w-(\d+)/)?.[1] || '12') * 4}
          strokeWidth={2}
          color={colorConfig.progressColor}
        />
      )}
      
      {/* Contenido del botón */}
      <div className="relative z-10 flex items-center justify-center">
        {icon || getDefaultIcon()}
        {showText && text && (
          <span className={cn('ml-2', sizeConfig.text)}>
            {text}
          </span>
        )}
      </div>
    </>
  );

  return (
    <button
      type="button"
      onClick={scrollToTop}
      disabled={disabled}
      title={title}
      className={cn(
        'fixed flex items-center justify-center',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeConfig.button,
        variantClasses,
        getShapeClasses(),
        getAnimationClasses(),
        showText && text ? 'px-4' : '',
        className
      )}
      style={{
        zIndex,
        [position.includes('bottom') ? 'bottom' : 'top']: `${offset.y}px`,
        [position.includes('left') ? 'left' : position.includes('right') ? 'right' : 'left']: 
          position.includes('center') ? '50%' : `${offset.x}px`,
        transform: position.includes('center') ? 'translateX(-50%)' : undefined,
      }}
    >
      {buttonContent}
    </button>
  );
};

/**
 * Hook para usar ScrollToTop programáticamente
 */
export const useScrollToTop = (options?: {
  behavior?: ScrollBehavior;
  target?: Element | string;
}) => {
  const scrollToTop = useCallback(() => {
    const { behavior = 'smooth', target } = options || {};
    
    let targetElement: Element | Window = window;
    
    if (target) {
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) targetElement = element;
      } else {
        targetElement = target;
      }
    }

    if (targetElement === window) {
      window.scrollTo({
        top: 0,
        behavior,
      });
    } else {
      (targetElement as Element).scrollTo({
        top: 0,
        behavior,
      });
    }
  }, [options]);

  return { scrollToTop };
};

export default ScrollToTop;
