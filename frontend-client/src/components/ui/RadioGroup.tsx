import React from 'react';
import { cn } from '../../utils/cn';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  options: RadioOption[];
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'button';
  error?: string;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  defaultValue,
  options,
  onChange,
  orientation = 'vertical',
  size = 'md',
  variant = 'default',
  error,
  className,
}) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
  };

  const sizes = {
    sm: {
      radio: 'h-4 w-4',
      text: 'text-sm',
      gap: 'gap-2',
    },
    md: {
      radio: 'h-5 w-5',
      text: 'text-base',
      gap: 'gap-2.5',
    },
    lg: {
      radio: 'h-6 w-6',
      text: 'text-lg',
      gap: 'gap-3',
    },
  };

  const containerClasses = cn(
    'space-y-2',
    orientation === 'horizontal' && 'flex flex-wrap gap-4 space-y-0',
    className
  );

  const renderOption = (option: RadioOption, index: number) => {
    const isSelected = selectedValue === option.value;
    const isDisabled = option.disabled;

    if (variant === 'card') {
      return (
        <label
          key={option.value}
          className={cn(
            'relative flex items-start p-4 border rounded-lg cursor-pointer transition-all',
            'hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20',
            isSelected && 'border-blue-500 bg-blue-50',
            isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
            !isSelected && !isDisabled && 'border-gray-300'
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={isSelected}
            onChange={() => !isDisabled && handleChange(option.value)}
            disabled={isDisabled}
            className="sr-only"
          />
          <div className={cn(
            'flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 flex-shrink-0',
            isSelected ? 'border-blue-600' : 'border-gray-300'
          )}>
            {isSelected && (
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
            )}
          </div>
          <div className="flex-1">
            <div className={cn('font-medium text-gray-900', sizes[size].text)}>
              {option.label}
            </div>
            {option.description && (
              <div className="text-sm text-gray-600 mt-1">
                {option.description}
              </div>
            )}
          </div>
        </label>
      );
    }

    if (variant === 'button') {
      return (
        <label
          key={option.value}
          className={cn(
            'relative flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium',
            'hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20',
            isSelected 
              ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700' 
              : 'border-gray-300 text-gray-700',
            isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
            sizes[size].text
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={isSelected}
            onChange={() => !isDisabled && handleChange(option.value)}
            disabled={isDisabled}
            className="sr-only"
          />
          {option.label}
        </label>
      );
    }

    // Default variant
    return (
      <label
        key={option.value}
        className={cn(
          'relative flex items-start cursor-pointer',
          sizes[size].gap,
          isDisabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={isSelected}
          onChange={() => !isDisabled && handleChange(option.value)}
          disabled={isDisabled}
          className={cn(
            'border-gray-300 text-blue-600 transition-colors',
            'focus:ring-blue-500 focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizes[size].radio
          )}
        />
        <div className="flex-1">
          <div className={cn('font-medium text-gray-900', sizes[size].text)}>
            {option.label}
          </div>
          {option.description && (
            <div className={cn(
              'text-gray-600 mt-1',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}>
              {option.description}
            </div>
          )}
        </div>
      </label>
    );
  };

  return (
    <div className="space-y-2">
      <div className={containerClasses}>
        {options.map(renderOption)}
      </div>
      
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
};

export default RadioGroup;
