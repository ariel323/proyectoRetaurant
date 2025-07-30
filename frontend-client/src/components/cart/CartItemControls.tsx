import React from 'react';
import QuantitySelector from '../ui/QuantitySelector';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

export interface CartItemControlsProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const CartItemControls: React.FC<CartItemControlsProps> = ({
  quantity,
  onQuantityChange,
  onRemove,
  min = 0,
  max = 99,
  size = 'md',
  disabled = false,
  className,
}) => {
  const handleRemoveClick = () => {
    if (window.confirm('¿Seguro que deseas eliminar este item del carrito?')) {
      onRemove();
    }
  };

  return (
    <div className={cn(
      'flex items-center gap-2',
      className
    )}>
      {/* Quantity Selector */}
      <QuantitySelector
        value={quantity}
        onChange={onQuantityChange}
        min={min}
        max={max}
        size={size}
        disabled={disabled}
      />

      {/* Remove Button */}
      <Button
        variant="ghost"
        size={size}
        onClick={handleRemoveClick}
        disabled={disabled}
        className={cn(
          'text-red-600 hover:text-red-800 hover:bg-red-50',
          size === 'sm' ? 'p-1' : 'p-2'
        )}
        aria-label="Eliminar item del carrito"
      >
        🗑️
      </Button>
    </div>
  );
};

export default CartItemControls;