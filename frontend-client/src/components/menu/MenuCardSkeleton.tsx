import React from 'react';
import { cn } from '../../utils/cn';

export interface MenuCardSkeletonProps {
  className?: string;
  count?: number;
  variant?: 'card' | 'list' | 'compact';
}

const SkeletonLine: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-300 rounded", className)} />
);

const MenuCardSkeleton: React.FC<MenuCardSkeletonProps> = ({
  className,
  count = 1,
  variant = 'card',
}) => {
  const renderCardSkeleton = () => (
    <div className={cn(
      "bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",
      className
    )}>
      {/* Imagen skeleton */}
      <div className="h-48 bg-gray-300 animate-pulse" />
      
      {/* Contenido skeleton */}
      <div className="p-4 space-y-3">
        {/* Título */}
        <SkeletonLine className="h-5 w-3/4" />
        
        {/* Categoría */}
        <SkeletonLine className="h-3 w-1/2" />
        
        {/* Descripción */}
        <div className="space-y-2">
          <SkeletonLine className="h-3 w-full" />
          <SkeletonLine className="h-3 w-2/3" />
        </div>
        
        {/* Información adicional */}
        <div className="flex space-x-4">
          <SkeletonLine className="h-3 w-16" />
          <SkeletonLine className="h-3 w-16" />
        </div>
        
        {/* Precio y botón */}
        <div className="flex items-center justify-between pt-2">
          <SkeletonLine className="h-6 w-20" />
          <SkeletonLine className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className={cn(
      "bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 p-4",
      className
    )}>
      <div className="flex space-x-4">
        {/* Imagen */}
        <div className="w-20 h-20 bg-gray-300 rounded-lg animate-pulse flex-shrink-0" />
        
        {/* Contenido */}
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-4 w-3/4" />
          <SkeletonLine className="h-3 w-1/2" />
          <SkeletonLine className="h-3 w-full" />
          
          <div className="flex items-center justify-between pt-1">
            <SkeletonLine className="h-5 w-16" />
            <SkeletonLine className="h-6 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompactSkeleton = () => (
    <div className={cn(
      "bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 p-3",
      className
    )}>
      <div className="space-y-2">
        <SkeletonLine className="h-4 w-3/4" />
        <SkeletonLine className="h-3 w-1/2" />
        <div className="flex items-center justify-between">
          <SkeletonLine className="h-4 w-16" />
          <SkeletonLine className="h-6 w-12 rounded" />
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'list':
        return renderListSkeleton();
      case 'compact':
        return renderCompactSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className={cn(
      "grid gap-6",
      variant === 'card' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      variant === 'list' && "grid-cols-1 space-y-4",
      variant === 'compact' && "grid-cols-1 md:grid-cols-2 space-y-2"
    )}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Skeleton específico para grillas
export const MenuGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }, (_, index) => (
      <MenuCardSkeleton key={index} variant="card" />
    ))}
  </div>
);

// Skeleton para lista horizontal
export const MenuHorizontalSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="flex space-x-4 overflow-x-auto pb-4">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="flex-shrink-0 w-72">
        <MenuCardSkeleton variant="card" />
      </div>
    ))}
  </div>
);

// Skeleton para categorías
export const CategorySkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="h-24 bg-gray-300 animate-pulse" />
        <div className="p-3 space-y-2">
          <SkeletonLine className="h-4 w-3/4" />
          <SkeletonLine className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default MenuCardSkeleton;
