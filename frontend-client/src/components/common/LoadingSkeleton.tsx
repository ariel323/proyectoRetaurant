import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps {
  /**
   * Variant del skeleton
   */
  variant?: 'default' | 'circular' | 'rectangular' | 'text' | 'card' | 'avatar' | 'button';
  
  /**
   * Tamaño del skeleton
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Ancho personalizado
   */
  width?: string | number;
  
  /**
   * Alto personalizado
   */
  height?: string | number;
  
  /**
   * Número de líneas para skeleton de texto
   */
  lines?: number;
  
  /**
   * Tipo de animación
   */
  animation?: 'pulse' | 'wave' | 'none';
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Mostrar esquinas redondeadas
   */
  rounded?: boolean;
}

interface SkeletonCardProps {
  /**
   * Mostrar imagen en la card
   */
  showImage?: boolean;
  
  /**
   * Mostrar avatar
   */
  showAvatar?: boolean;
  
  /**
   * Número de líneas de texto
   */
  textLines?: number;
  
  /**
   * Mostrar botones
   */
  showActions?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

interface SkeletonTableProps {
  /**
   * Número de filas
   */
  rows?: number;
  
  /**
   * Número de columnas
   */
  columns?: number;
  
  /**
   * Mostrar header
   */
  showHeader?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

interface SkeletonListProps {
  /**
   * Número de items
   */
  items?: number;
  
  /**
   * Mostrar avatar en cada item
   */
  showAvatar?: boolean;
  
  /**
   * Número de líneas por item
   */
  linesPerItem?: number;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente LoadingSkeleton - Muestra un placeholder animado mientras se cargan los datos
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'default',
  size = 'md',
  width,
  height,
  lines = 1,
  animation = 'pulse',
  className,
  rounded = true,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full aspect-square';
      case 'rectangular':
        return rounded ? 'rounded-lg' : '';
      case 'text':
        return 'rounded h-4';
      case 'card':
        return 'rounded-lg';
      case 'avatar':
        return 'rounded-full aspect-square';
      case 'button':
        return 'rounded-md h-10';
      default:
        return rounded ? 'rounded' : '';
    }
  };

  const getSizeClasses = () => {
    if (variant === 'circular' || variant === 'avatar') {
      switch (size) {
        case 'xs': return 'w-6 h-6';
        case 'sm': return 'w-8 h-8';
        case 'md': return 'w-12 h-12';
        case 'lg': return 'w-16 h-16';
        case 'xl': return 'w-20 h-20';
        default: return 'w-12 h-12';
      }
    }

    if (variant === 'text') {
      switch (size) {
        case 'xs': return 'h-3';
        case 'sm': return 'h-4';
        case 'md': return 'h-4';
        case 'lg': return 'h-5';
        case 'xl': return 'h-6';
        default: return 'h-4';
      }
    }

    if (variant === 'button') {
      switch (size) {
        case 'xs': return 'h-8 w-20';
        case 'sm': return 'h-9 w-24';
        case 'md': return 'h-10 w-28';
        case 'lg': return 'h-11 w-32';
        case 'xl': return 'h-12 w-36';
        default: return 'h-10 w-28';
      }
    }

    return '';
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';
      case 'none':
        return '';
      default:
        return 'animate-pulse';
    }
  };

  const skeletonStyle = {
    width: width,
    height: height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-gray-200',
              getVariantClasses(),
              getSizeClasses(),
              getAnimationClasses(),
              index === lines - 1 && 'w-3/4' // Última línea más corta
            )}
            style={index === 0 ? skeletonStyle : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-gray-200',
        getVariantClasses(),
        getSizeClasses(),
        getAnimationClasses(),
        className
      )}
      style={skeletonStyle}
    />
  );
};

/**
 * Skeleton para cards de contenido
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showImage = true,
  showAvatar = false,
  textLines = 3,
  showActions = true,
  className,
}) => {
  return (
    <div className={cn('bg-white rounded-lg border p-4 space-y-4', className)}>
      {showImage && (
        <LoadingSkeleton
          variant="rectangular"
          className="w-full h-48"
          animation="pulse"
        />
      )}
      
      <div className="space-y-3">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <LoadingSkeleton variant="avatar" size="md" />
            <div className="space-y-2 flex-1">
              <LoadingSkeleton variant="text" className="w-1/4" />
              <LoadingSkeleton variant="text" className="w-1/3" />
            </div>
          </div>
        )}
        
        <LoadingSkeleton variant="text" lines={textLines} />
        
        {showActions && (
          <div className="flex space-x-2 pt-2">
            <LoadingSkeleton variant="button" size="sm" />
            <LoadingSkeleton variant="button" size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Skeleton para tablas
 */
export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
}) => {
  return (
    <div className={cn('bg-white rounded-lg border overflow-hidden', className)}>
      {showHeader && (
        <div className="border-b bg-gray-50 p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <LoadingSkeleton key={index} variant="text" className="h-4" />
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <LoadingSkeleton key={colIndex} variant="text" className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton para listas
 */
export const SkeletonList: React.FC<SkeletonListProps> = ({
  items = 5,
  showAvatar = true,
  linesPerItem = 2,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-start space-x-3">
          {showAvatar && <LoadingSkeleton variant="avatar" size="md" />}
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="text" lines={linesPerItem} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;