import React from 'react';
import { useCart } from '../../contexts/CartContext';
import PriceTag from '../ui/PriceTag';
import { cn } from '../../utils/cn';

export interface CartTotalProps {
  showItemCount?: boolean;
  showCurrency?: boolean;
  variant?: 'default' | 'compact' | 'large';
  className?: string;
}

const CartTotal: React.FC<CartTotalProps> = ({
  showItemCount = true,
  showCurrency = true,
  variant = 'default',
  className,
}) => {
  const { total, cantidad_total } = useCart();

  const sizeMap = {
    compact: 'sm',
    default: 'md',
    large: 'lg',
  } as const;

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {showItemCount && cantidad_total > 0 && (
          <span className="text-xs text-gray-500">
            ({cantidad_total})
          </span>
        )}
        <PriceTag 
          price={total} 
          size={sizeMap[variant]}
          variant="highlighted"
        />
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={cn('text-center space-y-1', className)}>
        {showItemCount && (
          <div className="text-sm text-gray-600">
            {cantidad_total} {cantidad_total === 1 ? 'item' : 'items'} en el carrito
          </div>
        )}
        <div className="flex items-center justify-center">
          <PriceTag 
            price={total} 
            size={sizeMap[variant]}
            variant="highlighted"
          />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {showItemCount && (
        <span className="text-sm text-gray-600">
          {cantidad_total} {cantidad_total === 1 ? 'item' : 'items'}
        </span>
      )}
      <PriceTag 
        price={total} 
        size={sizeMap[variant]}
        variant="highlighted"
      />
    </div>
  );
};

export default CartTotal;