import React from 'react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string | React.ReactNode;
  action?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'minimal' | 'illustrated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No hay datos',
  description = 'No se encontraron elementos para mostrar',
  icon = '📭',
  action,
  actionText = 'Comenzar',
  onAction,
  variant = 'default',
  size = 'md',
  className,
  children,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'py-8 px-4',
          icon: 'text-4xl mb-3',
          title: 'text-lg',
          description: 'text-sm',
          spacing: 'space-y-2',
        };
      case 'lg':
        return {
          container: 'py-16 px-6',
          icon: 'text-8xl mb-6',
          title: 'text-2xl',
          description: 'text-lg',
          spacing: 'space-y-4',
        };
      default: // md
        return {
          container: 'py-12 px-4',
          icon: 'text-6xl mb-4',
          title: 'text-xl',
          description: 'text-base',
          spacing: 'space-y-3',
        };
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return {
          container: 'text-center',
          title: 'text-gray-600',
          description: 'text-gray-500',
        };
      case 'illustrated':
        return {
          container: 'text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200',
          title: 'text-gray-800',
          description: 'text-gray-600',
        };
      default:
        return {
          container: 'text-center',
          title: 'text-gray-900',
          description: 'text-gray-600',
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  return (
    <div
      className={cn(
        sizeClasses.container,
        variantClasses.container,
        sizeClasses.spacing,
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className={cn('flex justify-center', sizeClasses.icon)}>
          {typeof icon === 'string' ? (
            <span role="img" aria-hidden="true">
              {icon}
            </span>
          ) : (
            icon
          )}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3
          className={cn(
            'font-semibold',
            sizeClasses.title,
            variantClasses.title
          )}
        >
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p
          className={cn(
            'max-w-md mx-auto',
            sizeClasses.description,
            variantClasses.description
          )}
        >
          {description}
        </p>
      )}

      {/* Custom children content */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}

      {/* Action button */}
      {(action || onAction) && (
        <div className="mt-6">
          {action || (
            <Button
              variant="primary"
              size={size}
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
