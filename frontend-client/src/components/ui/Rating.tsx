import React from 'react';
import { cn } from '../../utils/cn';

export interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'stars' | 'hearts' | 'thumbs';
  interactive?: boolean;
  showValue?: boolean;
  allowHalf?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  variant = 'stars',
  interactive = false,
  showValue = false,
  allowHalf = false,
  onChange,
  className,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const [currentValue, setCurrentValue] = React.useState(value);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const icons = {
    stars: {
      filled: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      empty: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      half: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    hearts: {
      filled: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
      empty: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      half: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="heart-half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#heart-half-fill)" fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
    },
    thumbs: {
      filled: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      ),
      empty: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-1.5-1.5h-2.25m-10.5 0V9a1.5 1.5 0 113 0v2.5m-3 0h3m-3 0h-.375C4.015 11.5 4 11.515 4 11.625V14a1.5 1.5 0 003 0v-2.375C7 11.515 6.985 11.5 6.875 11.5h-3z" />
        </svg>
      ),
      half: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="thumb-half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#thumb-half-fill)" d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      ),
    },
  };

  const handleClick = (index: number, isHalf?: boolean) => {
    if (!interactive) return;
    
    const newValue = isHalf ? index + 0.5 : index + 1;
    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  const handleMouseEnter = (index: number, isHalf?: boolean) => {
    if (!interactive) return;
    setHoverValue(isHalf ? index + 0.5 : index + 1);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverValue(null);
  };

  const displayValue = hoverValue !== null ? hoverValue : currentValue;

  const renderIcon = (index: number) => {
    const isActive = index < Math.floor(displayValue);
    const isHalf = allowHalf && index === Math.floor(displayValue) && displayValue % 1 !== 0;
    
    let iconKey: 'filled' | 'empty' | 'half' = 'empty';
    if (isActive) iconKey = 'filled';
    else if (isHalf) iconKey = 'half';

    const colorClass = isActive || isHalf
      ? variant === 'stars' ? 'text-yellow-400' 
        : variant === 'hearts' ? 'text-red-500' 
        : 'text-blue-500'
      : 'text-gray-300';

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        disabled={!interactive}
        className={cn(
          'relative transition-colors duration-150',
          sizes[size],
          colorClass,
          interactive && 'hover:scale-110 cursor-pointer',
          !interactive && 'cursor-default'
        )}
        aria-label={`Rate ${index + 1} out of ${max}`}
      >
        {icons[variant][iconKey]}
        
        {/* Half rating overlay for interactive mode */}
        {interactive && allowHalf && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(index, true);
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              handleMouseEnter(index, true);
            }}
            className="absolute inset-0 w-1/2 left-0"
            aria-label={`Rate ${index + 0.5} out of ${max}`}
          />
        )}
      </button>
    );
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }, (_, index) => renderIcon(index))}
      </div>
      
      {showValue && (
        <span className={cn('ml-2 font-medium text-gray-600', textSizes[size])}>
          {displayValue.toFixed(allowHalf ? 1 : 0)} / {max}
        </span>
      )}
    </div>
  );
};

export default Rating;
