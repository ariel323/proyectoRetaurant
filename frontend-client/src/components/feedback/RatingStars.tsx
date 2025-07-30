import React, { useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

interface RatingStarsProps {
  /**
   * Valor de la calificación (0-maxRating)
   */
  value?: number;
  
  /**
   * Valor por defecto
   */
  defaultValue?: number;
  
  /**
   * Función que se ejecuta al cambiar la calificación
   */
  onChange?: (value: number) => void;
  
  /**
   * Función que se ejecuta al hacer hover
   */
  onHover?: (value: number) => void;
  
  /**
   * Calificación máxima
   */
  maxRating?: number;
  
  /**
   * Permitir medias estrellas
   */
  allowHalf?: boolean;
  
  /**
   * Permitir calificación cero
   */
  allowClear?: boolean;
  
  /**
   * Solo lectura
   */
  readOnly?: boolean;
  
  /**
   * Deshabilitar interacción
   */
  disabled?: boolean;
  
  /**
   * Tamaño de las estrellas
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Color de las estrellas
   */
  color?: 'yellow' | 'orange' | 'red' | 'blue' | 'green' | 'purple' | 'custom';
  
  /**
   * Colores personalizados
   */
  customColors?: {
    filled: string;
    empty: string;
    hover: string;
  };
  
  /**
   * Carácter de la estrella
   */
  character?: 'star' | 'heart' | 'circle' | 'custom';
  
  /**
   * Carácter personalizado
   */
  customCharacter?: React.ReactNode;
  
  /**
   * Mostrar tooltips con valores
   */
  showTooltips?: boolean;
  
  /**
   * Etiquetas personalizadas para tooltips
   */
  tooltipLabels?: string[];
  
  /**
   * Mostrar texto de calificación
   */
  showText?: boolean;
  
  /**
   * Formato del texto
   */
  textFormat?: (value: number, maxRating: number) => string;
  
  /**
   * Precisión de la calificación
   */
  precision?: number;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Clases CSS para las estrellas
   */
  starClassName?: string;
  
  /**
   * Clases CSS para el texto
   */
  textClassName?: string;
  
  /**
   * ID para accesibilidad
   */
  id?: string;
  
  /**
   * Nombre para formularios
   */
  name?: string;
}

interface StarProps {
  filled: boolean;
  halfFilled?: boolean;
  size: string;
  color: string;
  emptyColor: string;
  hoverColor: string;
  character: RatingStarsProps['character'];
  customCharacter?: React.ReactNode;
  className?: string;
}

/**
 * Componente individual de estrella
 */
const Star: React.FC<StarProps> = ({
  filled,
  halfFilled = false,
  size,
  color,
  emptyColor,
  hoverColor,
  character,
  customCharacter,
  className,
}) => {
  const getStarIcon = () => {
    if (customCharacter) return customCharacter;

    const iconClass = cn(size, 'transition-colors duration-150');

    switch (character) {
      case 'heart':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      
      case 'circle':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      
      case 'star':
      default:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
    }
  };

  const getStarColor = () => {
    if (filled) return color;
    if (halfFilled) return color;
    return emptyColor;
  };

  return (
    <span 
      className={cn(
        'relative inline-block cursor-pointer',
        className
      )}
      style={{ color: getStarColor() }}
    >
      {halfFilled ? (
        <span className="relative">
          <span style={{ color: emptyColor }}>{getStarIcon()}</span>
          <span 
            className="absolute inset-0 overflow-hidden" 
            style={{ width: '50%', color }}
          >
            {getStarIcon()}
          </span>
        </span>
      ) : (
        getStarIcon()
      )}
    </span>
  );
};

/**
 * Componente RatingStars - Sistema de calificación con estrellas
 */
export const RatingStars: React.FC<RatingStarsProps> = ({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  onHover,
  maxRating = 5,
  allowHalf = false,
  allowClear = true,
  readOnly = false,
  disabled = false,
  size = 'md',
  color = 'yellow',
  customColors,
  character = 'star',
  customCharacter,
  showTooltips = false,
  tooltipLabels,
  showText = false,
  textFormat,
  precision = allowHalf ? 0.5 : 1,
  className,
  starClassName,
  textClassName,
  id,
  name,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : currentValue;

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'w-3 h-3';
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-10 h-10';
      default: return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    if (customColors) return customColors;

    const colors = {
      yellow: {
        filled: '#FBBF24',
        empty: '#E5E7EB',
        hover: '#F59E0B',
      },
      orange: {
        filled: '#FB923C',
        empty: '#E5E7EB', 
        hover: '#EA580C',
      },
      red: {
        filled: '#F87171',
        empty: '#E5E7EB',
        hover: '#DC2626',
      },
      blue: {
        filled: '#60A5FA',
        empty: '#E5E7EB',
        hover: '#2563EB',
      },
      green: {
        filled: '#34D399',
        empty: '#E5E7EB',
        hover: '#059669',
      },
      purple: {
        filled: '#A78BFA',
        empty: '#E5E7EB',
        hover: '#7C3AED',
      },
      custom: {
        filled: '#FBBF24',
        empty: '#E5E7EB',
        hover: '#F59E0B',
      },
    };

    return colors[color];
  };

  const getDefaultTextFormat = (value: number, maxRating: number) => {
    return `${value.toFixed(precision === 0.5 ? 1 : 0)} de ${maxRating}`;
  };

  const getTooltipLabel = (value: number) => {
    if (tooltipLabels && tooltipLabels[value - 1]) {
      return tooltipLabels[value - 1];
    }
    return `${value} de ${maxRating}`;
  };

  const handleStarClick = useCallback((starValue: number) => {
    if (readOnly || disabled) return;

    let newValue = starValue;
    
    // Si allowClear está habilitado y se hace clic en la misma estrella
    if (allowClear && currentValue === starValue) {
      newValue = 0;
    }

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  }, [readOnly, disabled, allowClear, currentValue, controlledValue, onChange]);

  const handleStarHover = useCallback((starValue: number | null) => {
    if (readOnly || disabled) return;

    setHoverValue(starValue);
    if (starValue !== null) {
      onHover?.(starValue);
    }
  }, [readOnly, disabled, onHover]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
  }, []);

  const colorConfig = getColorClasses();
  const sizeClass = getSizeClasses();

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    const isFilled = displayValue >= starValue;
    const isHalfFilled = allowHalf && displayValue >= starValue - 0.5 && displayValue < starValue;

    return (
      <button
        key={starValue}
        type="button"
        onClick={() => handleStarClick(starValue)}
        onMouseEnter={() => handleStarHover(starValue)}
        disabled={disabled}
        title={showTooltips ? getTooltipLabel(starValue) : undefined}
        className={cn(
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded',
          'disabled:cursor-not-allowed',
          !readOnly && !disabled && 'hover:scale-110 transition-transform duration-150',
          starClassName
        )}
        aria-label={`Calificar ${starValue} de ${maxRating}`}
      >
        <Star
          filled={isFilled}
          halfFilled={isHalfFilled}
          size={sizeClass}
          color={colorConfig.filled}
          emptyColor={colorConfig.empty}
          hoverColor={colorConfig.hover}
          character={character}
          customCharacter={customCharacter}
        />
      </button>
    );
  });

  return (
    <div 
      className={cn('inline-flex items-center', className)}
      onMouseLeave={handleMouseLeave}
      role="radiogroup"
      aria-label="Calificación"
      id={id}
    >
      {/* Input oculto para formularios */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue}
        />
      )}

      {/* Estrellas */}
      <div className="flex items-center space-x-1">
        {stars}
      </div>

      {/* Texto de calificación */}
      {showText && (
        <span className={cn('ml-2 text-sm text-gray-600', textClassName)}>
          {textFormat 
            ? textFormat(displayValue, maxRating)
            : getDefaultTextFormat(displayValue, maxRating)
          }
        </span>
      )}
    </div>
  );
};

/**
 * Hook para gestionar calificaciones
 */
export const useRatingStars = (initialValue = 0, maxRating = 5) => {
  const [value, setValue] = useState(initialValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const reset = useCallback(() => {
    setValue(initialValue);
    setHoverValue(null);
  }, [initialValue]);

  const clear = useCallback(() => {
    setValue(0);
    setHoverValue(null);
  }, []);

  const setRating = useCallback((newValue: number) => {
    const clampedValue = Math.max(0, Math.min(maxRating, newValue));
    setValue(clampedValue);
  }, [maxRating]);

  const getPercentage = useCallback(() => {
    return (value / maxRating) * 100;
  }, [value, maxRating]);

  const getDescription = useCallback(() => {
    const percentage = getPercentage();
    if (percentage === 0) return 'Sin calificación';
    if (percentage <= 20) return 'Muy malo';
    if (percentage <= 40) return 'Malo';
    if (percentage <= 60) return 'Regular';
    if (percentage <= 80) return 'Bueno';
    return 'Excelente';
  }, [getPercentage]);

  return {
    value,
    hoverValue,
    setValue,
    setHoverValue,
    setRating,
    reset,
    clear,
    getPercentage,
    getDescription,
  };
};

export default RatingStars;
