import React from 'react';
import { cn } from '../../utils/cn';

export interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined' | 'subtle';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  color = 'default',
  size = 'md',
  rounded = 'md',
  closable = false,
  onClose,
  icon,
  clickable = false,
  onClick,
  className,
}) => {
  const sizes = {
    sm: {
      base: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      close: 'w-3 h-3 ml-1',
    },
    md: {
      base: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      close: 'w-4 h-4 ml-1.5',
    },
    lg: {
      base: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      close: 'w-5 h-5 ml-2',
    },
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const colorVariants = {
    default: {
      default: 'bg-gray-100 text-gray-800 border-gray-200',
      filled: 'bg-gray-500 text-white border-gray-500',
      outlined: 'bg-transparent text-gray-600 border-gray-300',
      subtle: 'bg-gray-50 text-gray-700 border-transparent',
    },
    primary: {
      default: 'bg-blue-100 text-blue-800 border-blue-200',
      filled: 'bg-blue-500 text-white border-blue-500',
      outlined: 'bg-transparent text-blue-600 border-blue-300',
      subtle: 'bg-blue-50 text-blue-700 border-transparent',
    },
    success: {
      default: 'bg-green-100 text-green-800 border-green-200',
      filled: 'bg-green-500 text-white border-green-500',
      outlined: 'bg-transparent text-green-600 border-green-300',
      subtle: 'bg-green-50 text-green-700 border-transparent',
    },
    warning: {
      default: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      filled: 'bg-yellow-500 text-white border-yellow-500',
      outlined: 'bg-transparent text-yellow-600 border-yellow-300',
      subtle: 'bg-yellow-50 text-yellow-700 border-transparent',
    },
    danger: {
      default: 'bg-red-100 text-red-800 border-red-200',
      filled: 'bg-red-500 text-white border-red-500',
      outlined: 'bg-transparent text-red-600 border-red-300',
      subtle: 'bg-red-50 text-red-700 border-transparent',
    },
    info: {
      default: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      filled: 'bg-cyan-500 text-white border-cyan-500',
      outlined: 'bg-transparent text-cyan-600 border-cyan-300',
      subtle: 'bg-cyan-50 text-cyan-700 border-transparent',
    },
  };

  const hoverStyles = clickable ? {
    default: {
      default: 'hover:bg-gray-200',
      filled: 'hover:bg-gray-600',
      outlined: 'hover:bg-gray-50',
      subtle: 'hover:bg-gray-100',
    },
    primary: {
      default: 'hover:bg-blue-200',
      filled: 'hover:bg-blue-600',
      outlined: 'hover:bg-blue-50',
      subtle: 'hover:bg-blue-100',
    },
    success: {
      default: 'hover:bg-green-200',
      filled: 'hover:bg-green-600',
      outlined: 'hover:bg-green-50',
      subtle: 'hover:bg-green-100',
    },
    warning: {
      default: 'hover:bg-yellow-200',
      filled: 'hover:bg-yellow-600',
      outlined: 'hover:bg-yellow-50',
      subtle: 'hover:bg-yellow-100',
    },
    danger: {
      default: 'hover:bg-red-200',
      filled: 'hover:bg-red-600',
      outlined: 'hover:bg-red-50',
      subtle: 'hover:bg-red-100',
    },
    info: {
      default: 'hover:bg-cyan-200',
      filled: 'hover:bg-cyan-600',
      outlined: 'hover:bg-cyan-50',
      subtle: 'hover:bg-cyan-100',
    },
  } : {};

  const baseClasses = cn(
    'inline-flex items-center font-medium border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizes[size].base,
    roundedStyles[rounded],
    colorVariants[color][variant],
    clickable && 'cursor-pointer',
    clickable && hoverStyles[color]?.[variant],
    clickable && 'focus:ring-blue-500',
    className
  );

  const CloseButton = () => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClose?.();
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'hover:bg-black hover:bg-opacity-10 transition-colors duration-150',
        'focus:outline-none focus:ring-1 focus:ring-inset focus:ring-current',
        sizes[size].close
      )}
      aria-label="Remove tag"
    >
      <svg
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );

  const Component = clickable ? 'button' : 'span';
  const componentProps = clickable
    ? {
        type: 'button' as const,
        onClick,
      }
    : {};

  return (
    <Component
      className={baseClasses}
      {...componentProps}
    >
      {icon && (
        <span className={cn(sizes[size].icon, children && 'mr-1.5')}>
          {icon}
        </span>
      )}
      {children}
      {closable && <CloseButton />}
    </Component>
  );
};

export default Tag;
