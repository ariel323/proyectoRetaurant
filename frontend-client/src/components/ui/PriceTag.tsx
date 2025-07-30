import React from 'react';
import { cn } from '../../utils/cn';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'highlighted' | 'compact';
  className?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  currency = '$',
  size = 'md',
  variant = 'default',
  className,
}) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
  };

  const variantClasses = {
    default: 'text-gray-900',
    highlighted: 'text-green-600 font-bold',
    compact: 'text-gray-700',
  };

  const isOnSale = originalPrice && originalPrice > price;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn(sizeClasses[size], variantClasses[variant])}>
        {currency}{formatPrice(price)}
      </span>
      {isOnSale && (
        <span className="text-sm text-gray-500 line-through">
          {currency}{formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
};

export default PriceTag;