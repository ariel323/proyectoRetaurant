import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: 'default' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    variant = 'default',
    size = 'md',
    error = false,
    errorMessage,
    helperText,
    label,
    leftIcon,
    rightIcon,
    resize = 'vertical',
    autoResize = false,
    maxLength,
    showCharCount = false,
    className,
    onChange,
    value,
    rows = 4,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => textareaRef.current!);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string);
      }
    }, [value]);

    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [internalValue, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (maxLength && newValue.length > maxLength) {
        return;
      }
      setInternalValue(newValue);
      onChange?.(e);
    };

    const sizes = {
      sm: {
        text: 'text-sm',
        padding: leftIcon || rightIcon ? 'px-8 py-2' : 'px-3 py-2',
        icon: 'w-4 h-4',
        label: 'text-sm',
        helper: 'text-xs',
      },
      md: {
        text: 'text-base',
        padding: leftIcon || rightIcon ? 'px-10 py-2.5' : 'px-3 py-2.5',
        icon: 'w-5 h-5',
        label: 'text-sm',
        helper: 'text-sm',
      },
      lg: {
        text: 'text-lg',
        padding: leftIcon || rightIcon ? 'px-12 py-3' : 'px-4 py-3',
        icon: 'w-6 h-6',
        label: 'text-base',
        helper: 'text-sm',
      },
    };

    const variants = {
      default: {
        base: 'border border-gray-300 rounded-md bg-white',
        focus: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
      },
      filled: {
        base: 'border-0 rounded-md bg-gray-100',
        focus: 'focus:ring-2 focus:ring-blue-500 focus:bg-white',
        error: 'bg-red-50 focus:ring-red-500',
      },
      underlined: {
        base: 'border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0',
        focus: 'focus:ring-0 focus:border-blue-500',
        error: 'border-red-500 focus:border-red-500',
      },
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const textareaClasses = cn(
      'w-full transition-colors duration-200 focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400',
      sizes[size].text,
      sizes[size].padding,
      variants[variant].base,
      error ? variants[variant].error : variants[variant].focus,
      autoResize ? 'resize-none overflow-hidden' : resizeClasses[resize],
      className
    );

    const iconPositionClasses = {
      left: cn(
        'absolute left-3 top-3 text-gray-400 pointer-events-none',
        sizes[size].icon
      ),
      right: cn(
        'absolute right-3 top-3 text-gray-400 pointer-events-none',
        sizes[size].icon
      ),
    };

    const currentLength = (internalValue as string).length;
    const showCount = showCharCount && (maxLength || currentLength > 0);

    return (
      <div className="w-full">
        {label && (
          <label
            className={cn(
              'block font-medium text-gray-700 mb-1',
              sizes[size].label,
              error && 'text-red-700'
            )}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={iconPositionClasses.left}>
              {leftIcon}
            </div>
          )}
          
          <textarea
            ref={textareaRef}
            className={textareaClasses}
            value={internalValue}
            onChange={handleChange}
            rows={autoResize ? 1 : rows}
            {...props}
          />
          
          {rightIcon && (
            <div className={iconPositionClasses.right}>
              {rightIcon}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-1">
          <div className="flex-1">
            {error && errorMessage && (
              <p className={cn(
                'text-red-600 font-medium',
                sizes[size].helper
              )}>
                {errorMessage}
              </p>
            )}
            {!error && helperText && (
              <p className={cn(
                'text-gray-500',
                sizes[size].helper
              )}>
                {helperText}
              </p>
            )}
          </div>
          
          {showCount && (
            <div className={cn(
              'text-gray-500 ml-2',
              sizes[size].helper,
              maxLength && currentLength > maxLength * 0.9 && 'text-orange-500',
              maxLength && currentLength >= maxLength && 'text-red-500'
            )}>
              {maxLength ? `${currentLength}/${maxLength}` : currentLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
