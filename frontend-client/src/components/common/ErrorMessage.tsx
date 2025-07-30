import React from 'react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'default' | 'inline' | 'banner' | 'card';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  icon?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  variant = 'default',
  size = 'md',
  showIcon = true,
  icon = '❌',
  dismissible = false,
  onDismiss,
  onRetry,
  retryText = 'Intentar nuevamente',
  className,
}) => {
  const baseClasses = 'transition-all duration-200';

  const variantClasses = {
    default: 'bg-red-50 border border-red-200 rounded-lg p-4',
    inline: 'text-red-600 text-sm',
    banner: 'bg-red-600 text-white p-3 rounded-md',
    card: 'bg-white border border-red-200 rounded-lg shadow-sm p-6',
  };

  const sizeClasses = {
    sm: variant === 'inline' ? 'text-xs' : 'text-sm',
    md: variant === 'inline' ? 'text-sm' : 'text-base',
    lg: variant === 'inline' ? 'text-base' : 'text-lg',
  };

  const getTextColor = () => {
    switch (variant) {
      case 'banner': return 'text-white';
      case 'inline': return 'text-red-600';
      default: return 'text-red-800';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'banner': return 'text-red-200';
      default: return 'text-red-500';
    }
  };

  if (variant === 'inline') {
    return (
      <div className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}>
        {showIcon && <span className="mr-1">{icon}</span>}
        {message}
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      <div className="flex items-start">
        {/* Icon */}
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            <span className={cn('text-xl', getIconColor())}>{icon}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {title && (
            <h3 className={cn(
              'font-medium mb-1',
              sizeClasses[size],
              getTextColor()
            )}>
              {title}
            </h3>
          )}

          {/* Message */}
          <div className={cn(
            sizeClasses[size],
            getTextColor(),
            title ? 'opacity-90' : ''
          )}>
            {message}
          </div>

          {/* Actions */}
          {onRetry && (
            <div className="mt-3">
              <Button
                variant={variant === 'banner' ? 'outline' : 'primary'}
                size="sm"
                onClick={onRetry}
                className={
                  variant === 'banner'
                    ? 'border-white text-white hover:bg-white hover:text-red-600'
                    : ''
                }
              >
                {retryText}
              </Button>
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && onDismiss && (
          <div className="flex-shrink-0 ml-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className={cn(
                'p-1',
                variant === 'banner'
                  ? 'text-red-200 hover:text-white hover:bg-red-700'
                  : 'text-red-400 hover:text-red-600'
              )}
              aria-label="Cerrar mensaje de error"
            >
              ✕
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;