import React from 'react';
import { cn } from '../../utils/cn';
import Button from './Button';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  disabled = false,
  className,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const inputSizeClasses = {
    sm: 'w-12 text-sm',
    md: 'w-16 text-base',
    lg: 'w-20 text-lg',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        variant="outline"
        size={size}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={cn(sizeClasses[size], 'rounded-full p-0')}
      >
        −
      </Button>
      
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value) || min;
          if (newValue >= min && newValue <= max) {
            onChange(newValue);
          }
        }}
        min={min}
        max={max}
        disabled={disabled}
        className={cn(
          'text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          inputSizeClasses[size],
          disabled && 'bg-gray-100 cursor-not-allowed'
        )}
      />
      
      <Button
        variant="outline"
        size={size}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={cn(sizeClasses[size], 'rounded-full p-0')}
      >
        +
      </Button>
    </div>
  );
};

export default QuantitySelector;