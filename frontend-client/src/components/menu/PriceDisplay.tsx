import React from 'react';
import { cn } from '../../utils/cn';

export interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'muted';
  showCurrency?: boolean;
  className?: string;
  discount?: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  currency = '$',
  size = 'md',
  variant = 'default',
  showCurrency = true,
  className,
  discount,
}) => {
  const formatPrice = (amount: number) => {
    return amount.toLocaleString('es-CO', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl md:text-2xl';
      default:
        return 'text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'accent':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'muted':
        return 'text-gray-500';
      default:
        return 'text-gray-900';
    }
  };

  const discountPercentage = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : discount;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Precio principal */}
      <span
        className={cn(
          "font-bold",
          getSizeClasses(),
          getVariantClasses()
        )}
      >
        {showCurrency && currency}
        {formatPrice(price)}
      </span>

      {/* Precio original tachado */}
      {originalPrice && originalPrice > price && (
        <span className="text-gray-400 line-through text-sm">
          {showCurrency && currency}
          {formatPrice(originalPrice)}
        </span>
      )}

      {/* Badge de descuento */}
      {discountPercentage && discountPercentage > 0 && (
        <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          -{discountPercentage}%
        </span>
      )}
    </div>
  );
};

// Componente para mostrar rango de precios
export const PriceRange: React.FC<{
  minPrice: number;
  maxPrice: number;
  currency?: string;
  className?: string;
}> = ({ minPrice, maxPrice, currency = '$', className }) => {
  const formatPrice = (amount: number) => {
    return amount.toLocaleString('es-CO', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  };

  return (
    <span className={cn("text-gray-600", className)}>
      {currency}{formatPrice(minPrice)} - {currency}{formatPrice(maxPrice)}
    </span>
  );
};

// Componente para precio con información adicional
export const PriceWithInfo: React.FC<{
  price: number;
  info?: string;
  currency?: string;
  className?: string;
}> = ({ price, info, currency = '$', className }) => {
  const formatPrice = (amount: number) => {
    return amount.toLocaleString('es-CO', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-lg font-bold text-gray-900">
        {currency}{formatPrice(price)}
      </span>
      {info && (
        <span className="text-xs text-gray-500">
          {info}
        </span>
      )}
    </div>
  );
};

// Componente para comparación de precios
export const PriceComparison: React.FC<{
  currentPrice: number;
  competitorPrice?: number;
  currency?: string;
  className?: string;
}> = ({ currentPrice, competitorPrice, currency = '$', className }) => {
  const formatPrice = (amount: number) => {
    return amount.toLocaleString('es-CO', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  };

  const savings = competitorPrice && competitorPrice > currentPrice 
    ? competitorPrice - currentPrice 
    : 0;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-green-600">
          {currency}{formatPrice(currentPrice)}
        </span>
        <span className="text-sm text-gray-500">Nuestro precio</span>
      </div>
      
      {competitorPrice && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400 line-through">
            {currency}{formatPrice(competitorPrice)}
          </span>
          <span className="text-sm text-gray-500">Competencia</span>
        </div>
      )}
      
      {savings > 0 && (
        <div className="text-xs text-green-600 font-medium">
          ¡Ahorras {currency}{formatPrice(savings)}!
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
