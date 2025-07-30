import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  /**
   * Tamaño del spinner
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Variante del spinner
   */
  variant?: 'default' | 'dots' | 'bars' | 'pulse' | 'ring' | 'dual-ring';
  
  /**
   * Color del spinner
   */
  color?: 'primary' | 'secondary' | 'white' | 'gray' | 'success' | 'warning' | 'error';
  
  /**
   * Velocidad de la animación
   */
  speed?: 'slow' | 'normal' | 'fast';
  
  /**
   * Texto descriptivo para accesibilidad
   */
  label?: string;
  
  /**
   * Mostrar texto de carga
   */
  showText?: boolean;
  
  /**
   * Texto personalizado
   */
  text?: string;
  
  /**
   * Centrar el spinner
   */
  centered?: boolean;
  
  /**
   * Mostrar como overlay
   */
  overlay?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

interface LoadingOverlayProps {
  /**
   * Mostrar el overlay
   */
  show: boolean;
  
  /**
   * Texto de carga
   */
  text?: string;
  
  /**
   * Tamaño del spinner
   */
  size?: LoadingSpinnerProps['size'];
  
  /**
   * Variante del spinner
   */
  variant?: LoadingSpinnerProps['variant'];
  
  /**
   * Blur del fondo
   */
  blur?: boolean;
  
  /**
   * Z-index personalizado
   */
  zIndex?: number;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente LoadingSpinner - Indicador de carga animado
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  color = 'primary',
  speed = 'normal',
  label = 'Cargando...',
  showText = false,
  text = 'Cargando...',
  centered = false,
  overlay = false,
  className,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'w-3 h-3';
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary': return 'border-blue-600 text-blue-600';
      case 'secondary': return 'border-gray-600 text-gray-600';
      case 'white': return 'border-white text-white';
      case 'gray': return 'border-gray-400 text-gray-400';
      case 'success': return 'border-green-600 text-green-600';
      case 'warning': return 'border-yellow-600 text-yellow-600';
      case 'error': return 'border-red-600 text-red-600';
      default: return 'border-blue-600 text-blue-600';
    }
  };

  const getSpeedClasses = () => {
    switch (speed) {
      case 'slow': return 'animate-spin duration-1000';
      case 'normal': return 'animate-spin';
      case 'fast': return 'animate-spin duration-500';
      default: return 'animate-spin';
    }
  };

  const renderSpinner = () => {
    const baseClasses = cn(getSizeClasses(), getColorClasses());

    switch (variant) {
      case 'dots':
        return (
          <div className={cn('flex space-x-1', baseClasses)}>
            <div className={cn('rounded-full bg-current animate-bounce')} style={{ animationDelay: '0ms' }} />
            <div className={cn('rounded-full bg-current animate-bounce')} style={{ animationDelay: '150ms' }} />
            <div className={cn('rounded-full bg-current animate-bounce')} style={{ animationDelay: '300ms' }} />
          </div>
        );

      case 'bars':
        return (
          <div className={cn('flex space-x-1', baseClasses)}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn('bg-current animate-pulse')}
                style={{
                  width: size === 'xs' ? '2px' : size === 'sm' ? '3px' : '4px',
                  height: getSizeClasses().split(' ')[1],
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={cn('rounded-full bg-current animate-ping', baseClasses)} />
        );

      case 'ring':
        return (
          <div
            className={cn(
              'border-4 border-current border-t-transparent rounded-full',
              baseClasses,
              getSpeedClasses()
            )}
          />
        );

      case 'dual-ring':
        return (
          <div className={cn('relative', baseClasses)}>
            <div
              className={cn(
                'border-2 border-current border-t-transparent rounded-full absolute inset-0',
                getSpeedClasses()
              )}
            />
            <div
              className={cn(
                'border-2 border-current border-b-transparent rounded-full',
                getSpeedClasses()
              )}
              style={{ animationDirection: 'reverse' }}
            />
          </div>
        );

      default:
        return (
          <div
            className={cn(
              'border-2 border-current border-t-transparent rounded-full',
              baseClasses,
              getSpeedClasses()
            )}
          />
        );
    }
  };

  const spinnerContent = (
    <div
      className={cn(
        'flex items-center',
        showText ? 'space-x-3' : '',
        centered && 'justify-center',
        overlay && 'flex-col space-y-2 space-x-0',
        className
      )}
      role="status"
      aria-label={label}
    >
      {renderSpinner()}
      {showText && (
        <span className={cn('text-sm font-medium', getColorClasses().split(' ')[1])}>
          {text}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          {spinnerContent}
        </div>
      </div>
    );
  }

  if (centered) {
    return (
      <div className="flex justify-center items-center w-full h-full min-h-[100px]">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

/**
 * Componente LoadingOverlay - Overlay de carga para cubrir contenido
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  text = 'Cargando...',
  size = 'lg',
  variant = 'default',
  blur = true,
  zIndex = 50,
  className,
}) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center',
        blur ? 'backdrop-blur-sm' : '',
        'bg-black bg-opacity-50',
        className
      )}
      style={{ zIndex }}
    >
      <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full mx-4">
        <LoadingSpinner
          size={size}
          variant={variant}
          showText={true}
          text={text}
          centered={true}
        />
      </div>
    </div>
  );
};

/**
 * Hook para gestionar estados de carga
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);
  const toggleLoading = React.useCallback(() => setIsLoading(prev => !prev), []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading,
  };
};

/**
 * Componente de botón con estado de carga
 */
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  spinnerSize?: LoadingSpinnerProps['size'];
  spinnerVariant?: LoadingSpinnerProps['variant'];
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  spinnerSize = 'sm',
  spinnerVariant = 'default',
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center space-x-2',
        'px-4 py-2 rounded-md font-medium',
        'bg-blue-600 text-white hover:bg-blue-700',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        className
      )}
    >
      {loading && (
        <LoadingSpinner
          size={spinnerSize}
          variant={spinnerVariant}
          color="white"
        />
      )}
      <span>{children}</span>
    </button>
  );
};

export default LoadingSpinner;