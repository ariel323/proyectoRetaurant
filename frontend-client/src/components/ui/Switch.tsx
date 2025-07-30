import React from 'react';
import { cn } from '../../utils/cn';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  name?: string;
  id?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  labelPosition = 'right',
  color = 'primary',
  className,
  name,
  id,
}) => {
  const [isChecked, setIsChecked] = React.useState(checked !== undefined ? checked : defaultChecked);

  React.useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  const sizes = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      text: 'text-sm',
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
      text: 'text-base',
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
      text: 'text-lg',
    },
  };

  const colors = {
    primary: {
      on: 'bg-blue-600',
      off: 'bg-gray-200',
      focus: 'focus:ring-blue-500',
    },
    success: {
      on: 'bg-green-600',
      off: 'bg-gray-200',
      focus: 'focus:ring-green-500',
    },
    warning: {
      on: 'bg-yellow-600',
      off: 'bg-gray-200',
      focus: 'focus:ring-yellow-500',
    },
    danger: {
      on: 'bg-red-600',
      off: 'bg-gray-200',
      focus: 'focus:ring-red-500',
    },
  };

  const switchClasses = cn(
    'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer',
    'transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizes[size].switch,
    isChecked ? colors[color].on : colors[color].off,
    colors[color].focus,
    disabled && 'cursor-not-allowed'
  );

  const thumbClasses = cn(
    'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
    sizes[size].thumb,
    isChecked ? sizes[size].translate : 'translate-x-0'
  );

  const SwitchComponent = (
    <button
      type="button"
      className={switchClasses}
      role="switch"
      aria-checked={isChecked}
      aria-labelledby={label ? id : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      onClick={handleToggle}
      disabled={disabled}
      name={name}
      id={id}
    >
      <span className={thumbClasses} />
    </button>
  );

  if (!label && !description) {
    return <div className={className}>{SwitchComponent}</div>;
  }

  const LabelComponent = (
    <div className="flex-1">
      {label && (
        <span
          className={cn(
            'font-medium text-gray-900',
            sizes[size].text,
            disabled && 'text-gray-500'
          )}
          id={id}
        >
          {label}
        </span>
      )}
      {description && (
        <p
          className={cn(
            'text-gray-600',
            size === 'sm' ? 'text-xs' : 'text-sm',
            disabled && 'text-gray-400'
          )}
          id={`${id}-description`}
        >
          {description}
        </p>
      )}
    </div>
  );

  return (
    <div className={cn('flex items-start gap-3', className)}>
      {labelPosition === 'left' && LabelComponent}
      {SwitchComponent}
      {labelPosition === 'right' && LabelComponent}
    </div>
  );
};

export default Switch;
