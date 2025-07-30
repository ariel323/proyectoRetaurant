import React from 'react';
import { cn } from '../../utils/cn';

export interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'danger' | 'info' | 'pending' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dot' | 'badge' | 'pill' | 'icon';
  label?: string;
  animated?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  variant = 'dot',
  label,
  animated = false,
  className,
}) => {
  const statusConfig = {
    success: {
      color: 'bg-green-500',
      textColor: 'text-green-800',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    warning: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
    danger: {
      color: 'bg-red-500',
      textColor: 'text-red-800',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      color: 'bg-blue-500',
      textColor: 'text-blue-800',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    pending: {
      color: 'bg-gray-500',
      textColor: 'text-gray-800',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    neutral: {
      color: 'bg-gray-400',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      ),
    },
  };

  const config = statusConfig[status];

  const sizes = {
    sm: {
      dot: 'w-2 h-2',
      badge: 'w-4 h-4',
      text: 'text-xs',
      padding: 'px-2 py-0.5',
    },
    md: {
      dot: 'w-3 h-3',
      badge: 'w-5 h-5',
      text: 'text-sm',
      padding: 'px-2.5 py-1',
    },
    lg: {
      dot: 'w-4 h-4',
      badge: 'w-6 h-6',
      text: 'text-base',
      padding: 'px-3 py-1.5',
    },
  };

  if (variant === 'dot') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div
          className={cn(
            'rounded-full flex-shrink-0',
            config.color,
            sizes[size].dot,
            animated && 'animate-pulse'
          )}
          aria-label={`Status: ${status}`}
        />
        {label && (
          <span className={cn('font-medium', sizes[size].text)}>
            {label}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div
          className={cn(
            'rounded-full flex items-center justify-center flex-shrink-0',
            config.color,
            'text-white',
            sizes[size].badge,
            animated && 'animate-pulse'
          )}
          aria-label={`Status: ${status}`}
        >
          <div className={cn(
            size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
          )}>
            {config.icon}
          </div>
        </div>
        {label && (
          <span className={cn('font-medium', sizes[size].text)}>
            {label}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          config.bgColor,
          config.textColor,
          sizes[size].padding,
          sizes[size].text,
          animated && 'animate-pulse',
          className
        )}
      >
        <div
          className={cn(
            'rounded-full flex-shrink-0',
            config.color,
            sizes[size].dot
          )}
        />
        {label || status}
      </span>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div
          className={cn(
            'flex items-center justify-center rounded-full border-2 flex-shrink-0',
            config.textColor,
            config.borderColor,
            config.bgColor,
            sizes[size].badge,
            animated && 'animate-pulse'
          )}
          aria-label={`Status: ${status}`}
        >
          <div className={cn(
            size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
          )}>
            {config.icon}
          </div>
        </div>
        {label && (
          <span className={cn('font-medium', config.textColor, sizes[size].text)}>
            {label}
          </span>
        )}
      </div>
    );
  }

  return null;
};

export default StatusIndicator;
