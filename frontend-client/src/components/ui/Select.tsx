import React from 'react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'underlined';
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    label,
    description,
    error,
    size = 'md',
    variant = 'default',
    options,
    placeholder,
    fullWidth = false,
    leftIcon,
    disabled,
    ...props
  }, ref) => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const textSizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const baseClasses = cn(
      'border transition-colors duration-200 focus:outline-none appearance-none bg-white',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
      fullWidth ? 'w-full' : 'w-auto'
    );

    const variants = {
      default: cn(
        'rounded-lg border-gray-300',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20',
        error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
      ),
      filled: cn(
        'rounded-lg border-transparent bg-gray-100',
        'focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20',
        error && 'bg-red-50 focus:border-red-500 focus:ring-red-500'
      ),
      underlined: cn(
        'rounded-none border-0 border-b-2 border-gray-300 bg-transparent px-0',
        'focus:border-blue-500 focus:ring-0',
        error && 'border-red-300 focus:border-red-500'
      ),
    };

    const selectClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      leftIcon && 'pl-10',
      'pr-10', // Space for dropdown arrow
      className
    );

    const iconClasses = cn(
      'absolute top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none',
      size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
    );

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label className={cn(
            'block font-medium text-gray-700',
            textSizes[size],
            disabled && 'text-gray-500'
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={cn(iconClasses, 'left-3')}>
              {leftIcon}
            </div>
          )}
          
          <select
            className={selectClasses}
            disabled={disabled}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Dropdown arrow */}
          <div className={cn(iconClasses, 'right-3')}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {description && !error && (
          <p className={cn(
            'text-gray-600',
            size === 'sm' ? 'text-xs' : 'text-sm',
            disabled && 'text-gray-400'
          )}>
            {description}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
