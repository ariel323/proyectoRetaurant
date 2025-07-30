import React from 'react';
import { cn } from '../../utils/cn';

export interface CartBadgeProps {
  count: number;
  max?: number;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showZero?: boolean;
}

const CartBadge: React.FC<CartBadgeProps> = ({
  count,
  max = 99,
  variant = 'danger',
  size = 'md',
  className,
  showZero = false,
}) => {
  // No mostrar badge si count es 0 y showZero es false
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  const baseClasses = 'absolute rounded-full flex items-center justify-center font-bold leading-none';

  const variantClasses = {
    default: 'bg-gray-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    success: 'bg-green-500 text-white',
  };

  const sizeClasses = {
    sm: 'text-xs min-w-[16px] h-4 px-1',
    md: 'text-xs min-w-[20px] h-5 px-1.5',
    lg: 'text-sm min-w-[24px] h-6 px-2',
  };

  const positionClasses = {
    sm: '-top-1 -right-1',
    md: '-top-2 -right-2',
    lg: '-top-2.5 -right-2.5',
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        positionClasses[size],
        className
      )}
      aria-label={`${count} items en el carrito`}
    >
      {displayCount}
    </span>
  );
};

export default CartBadge;