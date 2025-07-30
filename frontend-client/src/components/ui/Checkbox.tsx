import React from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    className,
    label,
    description,
    error,
    indeterminate = false,
    size = 'md',
    disabled,
    ...props
  }, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      const checkbox = checkboxRef.current || (ref as React.RefObject<HTMLInputElement>)?.current;
      if (checkbox) {
        checkbox.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const textSizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const checkboxClasses = cn(
      'rounded border-gray-300 text-blue-600 transition-colors',
      'focus:ring-blue-500 focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-red-300 focus:ring-red-500',
      sizes[size],
      className
    );

    const Wrapper = label ? 'label' : 'div';

    return (
      <div className="space-y-1">
        <Wrapper className={cn(
          'flex items-start gap-2',
          label && 'cursor-pointer',
          disabled && 'cursor-not-allowed'
        )}>
          <input
            type="checkbox"
            className={checkboxClasses}
            disabled={disabled}
            ref={ref || checkboxRef}
            {...props}
          />
          {label && (
            <div className="flex-1">
              <span className={cn(
                'font-medium text-gray-900',
                disabled && 'text-gray-500',
                textSizes[size]
              )}>
                {label}
              </span>
              {description && (
                <p className={cn(
                  'text-gray-600 mt-1',
                  size === 'sm' ? 'text-xs' : 'text-sm',
                  disabled && 'text-gray-400'
                )}>
                  {description}
                </p>
              )}
            </div>
          )}
        </Wrapper>
        {error && (
          <p className="text-sm text-red-600 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
