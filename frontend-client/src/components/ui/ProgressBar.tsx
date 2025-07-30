import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressStep {
  label: string;
  completed: boolean;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gradient';
  showPercentage?: boolean;
  showValue?: boolean;
  animated?: boolean;
  striped?: boolean;
  steps?: ProgressStep[];
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showPercentage = false,
  showValue = false,
  animated = false,
  striped = false,
  steps,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const variants = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
  };

  const trackClasses = cn(
    'w-full bg-gray-200 rounded-full overflow-hidden',
    sizes[size],
    className
  );

  const fillClasses = cn(
    'h-full transition-all duration-500 ease-out rounded-full',
    variants[variant],
    animated && 'animate-pulse',
    striped && 'bg-striped'
  );

  if (steps && steps.length > 0) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                step.completed
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              )}>
                {step.completed ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={cn(
                'mt-1 text-xs text-center',
                step.completed ? 'text-blue-600 font-medium' : 'text-gray-500'
              )}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className={trackClasses}>
          <div
            className={fillClasses}
            style={{ width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between items-center">
        {(showPercentage || showValue) && (
          <div className="flex gap-2 text-sm text-gray-600">
            {showValue && (
              <span>{value} / {max}</span>
            )}
            {showPercentage && (
              <span>{Math.round(percentage)}%</span>
            )}
          </div>
        )}
      </div>
      
      <div className={trackClasses}>
        <div
          className={fillClasses}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`Progress: ${Math.round(percentage)}%`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
