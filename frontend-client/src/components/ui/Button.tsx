import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      fullWidth && 'w-full'
    );

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-md hover:shadow-lg',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
      xl: 'px-8 py-4 text-xl gap-3',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;