import React from 'react';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';
import CartBadge from './CartBadge';
import { cn } from '../../utils/cn';

export interface CartButtonProps {
  variant?: 'default' | 'floating' | 'compact';
  showTotal?: boolean;
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({
  variant = 'default',
  showTotal = true,
  showText = true,
  className,
  onClick,
}) => {
  const { toggleCart, cantidad_total, total, isOpen } = useCart();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggleCart();
    }
  };

  if (variant === 'floating') {
    return (
      <div className={cn('fixed bottom-6 right-6 z-40', className)}>
        <Button
          onClick={handleClick}
          variant="primary"
          size="lg"
          className={cn(
            'relative rounded-full shadow-lg hover:shadow-xl transition-all duration-300',
            'w-14 h-14 p-0 flex items-center justify-center',
            isOpen && 'bg-blue-700'
          )}
          aria-label={`Abrir carrito (${cantidad_total} items)`}
        >
          <span className="text-xl">🛒</span>
          <CartBadge count={cantidad_total} />
        </Button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('relative', className)}>
        <Button
          onClick={handleClick}
          variant="outline"
          size="sm"
          className="relative p-2"
          aria-label={`Carrito (${cantidad_total} items)`}
        >
          <span className="text-lg">🛒</span>
          <CartBadge count={cantidad_total} size="sm" />
        </Button>
      </div>
    );
  }

  // Variant default
  return (
    <div className={cn('relative', className)}>
      <Button
        onClick={handleClick}
        variant="outline"
        size="md"
        className="relative flex items-center gap-2"
        aria-label={`Carrito (${cantidad_total} items)`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🛒</span>
          {showText && (
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-xs text-gray-500 leading-tight">Carrito</span>
              {showTotal && (
                <span className="text-sm font-medium leading-tight">
                  ${total.toFixed(2)}
                </span>
              )}
            </div>
          )}
        </div>
        <CartBadge count={cantidad_total} />
      </Button>
    </div>
  );
};

export default CartButton;