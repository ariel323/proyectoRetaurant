import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface FeedbackButtonProps {
  /**
   * Tipo de feedback
   */
  type?: 'like' | 'dislike' | 'star' | 'heart' | 'thumbs' | 'custom';
  
  /**
   * Estado inicial del botón
   */
  initialState?: boolean;
  
  /**
   * Estado controlado
   */
  isActive?: boolean;
  
  /**
   * Función que se ejecuta al hacer clic
   */
  onClick?: (isActive: boolean) => void;
  
  /**
   * Función que se ejecuta al cambiar estado
   */
  onChange?: (isActive: boolean) => void;
  
  /**
   * Tamaño del botón
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Variante de estilo
   */
  variant?: 'default' | 'filled' | 'outlined' | 'minimal' | 'floating';
  
  /**
   * Color del botón
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
  
  /**
   * Animación al activar
   */
  animation?: 'none' | 'bounce' | 'pulse' | 'scale' | 'shake';
  
  /**
   * Icono personalizado
   */
  icon?: React.ReactNode;
  
  /**
   * Icono cuando está activo
   */
  activeIcon?: React.ReactNode;
  
  /**
   * Texto del botón
   */
  text?: string;
  
  /**
   * Mostrar contador
   */
  count?: number;
  
  /**
   * Posición del contador
   */
  countPosition?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Tooltip del botón
   */
  tooltip?: string;
  
  /**
   * Tooltip cuando está activo
   */
  activeTooltip?: string;
  
  /**
   * Deshabilitar el botón
   */
  disabled?: boolean;
  
  /**
   * Solo lectura (mostrar estado sin permitir cambios)
   */
  readOnly?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Datos adicionales
   */
  data?: any;
}

interface FeedbackIconProps {
  type: FeedbackButtonProps['type'];
  isActive: boolean;
  size: string;
  customIcon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

/**
 * Componente para renderizar iconos de feedback
 */
const FeedbackIcon: React.FC<FeedbackIconProps> = ({
  type,
  isActive,
  size,
  customIcon,
  activeIcon,
}) => {
  if (customIcon) {
    return <>{isActive && activeIcon ? activeIcon : customIcon}</>;
  }

  const iconClass = size;

  switch (type) {
    case 'like':
      return (
        <svg className={iconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      );
    
    case 'dislike':
      return (
        <svg className={iconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      );
    
    case 'heart':
      return (
        <svg className={iconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    
    case 'star':
      return (
        <svg className={iconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    
    case 'thumbs':
    default:
      return (
        <svg className={iconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      );
  }
};

/**
 * Componente FeedbackButton - Botón interactivo para feedback de usuarios
 */
export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  type = 'thumbs',
  initialState = false,
  isActive: controlledIsActive,
  onClick,
  onChange,
  size = 'md',
  variant = 'default',
  color = 'primary',
  animation = 'scale',
  icon,
  activeIcon,
  text,
  count,
  countPosition = 'right',
  tooltip,
  activeTooltip,
  disabled = false,
  readOnly = false,
  className,
  data,
}) => {
  const [internalActive, setInternalActive] = useState(initialState);
  const [isAnimating, setIsAnimating] = useState(false);

  const isActive = controlledIsActive !== undefined ? controlledIsActive : internalActive;

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return {
        button: 'p-1 text-xs',
        icon: 'w-3 h-3',
        text: 'text-xs',
        count: 'text-xs px-1',
      };
      case 'sm': return {
        button: 'p-2 text-sm',
        icon: 'w-4 h-4',
        text: 'text-sm',
        count: 'text-xs px-1.5',
      };
      case 'md': return {
        button: 'p-3 text-base',
        icon: 'w-5 h-5',
        text: 'text-sm',
        count: 'text-sm px-2',
      };
      case 'lg': return {
        button: 'p-4 text-lg',
        icon: 'w-6 h-6',
        text: 'text-base',
        count: 'text-base px-2',
      };
      case 'xl': return {
        button: 'p-5 text-xl',
        icon: 'w-8 h-8',
        text: 'text-lg',
        count: 'text-lg px-3',
      };
      default: return {
        button: 'p-3 text-base',
        icon: 'w-5 h-5',
        text: 'text-sm',
        count: 'text-sm px-2',
      };
    }
  };

  const getColorClasses = () => {
    const colors = {
      primary: {
        inactive: 'text-gray-400 hover:text-blue-500',
        active: 'text-blue-600',
        background: 'hover:bg-blue-50',
        activeBackground: 'bg-blue-50',
      },
      secondary: {
        inactive: 'text-gray-400 hover:text-gray-600',
        active: 'text-gray-700',
        background: 'hover:bg-gray-50',
        activeBackground: 'bg-gray-100',
      },
      success: {
        inactive: 'text-gray-400 hover:text-green-500',
        active: 'text-green-600',
        background: 'hover:bg-green-50',
        activeBackground: 'bg-green-50',
      },
      warning: {
        inactive: 'text-gray-400 hover:text-yellow-500',
        active: 'text-yellow-600',
        background: 'hover:bg-yellow-50',
        activeBackground: 'bg-yellow-50',
      },
      error: {
        inactive: 'text-gray-400 hover:text-red-500',
        active: 'text-red-600',
        background: 'hover:bg-red-50',
        activeBackground: 'bg-red-50',
      },
      gray: {
        inactive: 'text-gray-400 hover:text-gray-600',
        active: 'text-gray-600',
        background: 'hover:bg-gray-50',
        activeBackground: 'bg-gray-100',
      },
    };
    return colors[color];
  };

  const getVariantClasses = () => {
    const colorConfig = getColorClasses();
    
    switch (variant) {
      case 'filled':
        return isActive
          ? 'bg-current text-white'
          : `${colorConfig.inactive} ${colorConfig.background}`;
      case 'outlined':
        return cn(
          'border-2 transition-colors',
          isActive
            ? `border-current ${colorConfig.active}`
            : `border-gray-300 ${colorConfig.inactive} hover:border-current`
        );
      case 'minimal':
        return isActive ? colorConfig.active : colorConfig.inactive;
      case 'floating':
        return cn(
          'shadow-lg hover:shadow-xl transition-shadow',
          isActive
            ? `${colorConfig.active} ${colorConfig.activeBackground}`
            : `${colorConfig.inactive} ${colorConfig.background}`
        );
      default:
        return cn(
          'transition-colors',
          isActive
            ? `${colorConfig.active} ${colorConfig.activeBackground}`
            : `${colorConfig.inactive} ${colorConfig.background}`
        );
    }
  };

  const getAnimationClasses = () => {
    if (!isAnimating) return '';
    
    switch (animation) {
      case 'bounce': return 'animate-bounce';
      case 'pulse': return 'animate-pulse';
      case 'scale': return 'animate-ping';
      case 'shake': return 'animate-pulse'; // Placeholder for shake animation
      default: return '';
    }
  };

  const handleClick = () => {
    if (disabled || readOnly) return;

    const newState = !isActive;
    
    if (controlledIsActive === undefined) {
      setInternalActive(newState);
    }
    
    // Trigger animation
    if (animation !== 'none' && newState) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    
    onClick?.(newState);
    onChange?.(newState);
  };

  const sizeConfig = getSizeClasses();
  const currentTooltip = isActive ? (activeTooltip || tooltip) : tooltip;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={currentTooltip}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeConfig.button,
        getVariantClasses(),
        getAnimationClasses(),
        text && 'space-x-2',
        className
      )}
      data-feedback-type={type}
      data-feedback-active={isActive}
      {...(data && { ...data })}
    >
      {/* Icono */}
      <span className={cn('relative', isAnimating && animation === 'scale' && 'animate-ping')}>
        <FeedbackIcon
          type={type}
          isActive={isActive}
          size={sizeConfig.icon}
          customIcon={icon}
          activeIcon={activeIcon}
        />
      </span>

      {/* Texto */}
      {text && (
        <span className={cn('font-medium', sizeConfig.text)}>
          {text}
        </span>
      )}

      {/* Contador */}
      {count !== undefined && (
        <span
          className={cn(
            'absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] h-5',
            'flex items-center justify-center font-medium',
            sizeConfig.count,
            {
              'top': '-top-2 left-1/2 transform -translate-x-1/2',
              'bottom': '-bottom-2 left-1/2 transform -translate-x-1/2',
              'left': '-left-2 top-1/2 transform -translate-y-1/2',
              'right': '-right-2 top-1/2 transform -translate-y-1/2',
            }[countPosition]
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

/**
 * Hook para gestionar estado de feedback
 */
export const useFeedbackButton = (initialState = false) => {
  const [isActive, setIsActive] = useState(initialState);
  const [count, setCount] = useState(0);

  const toggle = () => {
    setIsActive(prev => {
      const newState = !prev;
      if (newState) {
        setCount(prev => prev + 1);
      } else {
        setCount(prev => Math.max(0, prev - 1));
      }
      return newState;
    });
  };

  const activate = () => {
    if (!isActive) {
      setIsActive(true);
      setCount(prev => prev + 1);
    }
  };

  const deactivate = () => {
    if (isActive) {
      setIsActive(false);
      setCount(prev => Math.max(0, prev - 1));
    }
  };

  const reset = () => {
    setIsActive(initialState);
    setCount(0);
  };

  return {
    isActive,
    count,
    toggle,
    activate,
    deactivate,
    reset,
    setIsActive,
    setCount,
  };
};

export default FeedbackButton;