// UI Components
export { default as Badge } from './Badge';
export { default as Button } from './Button';
export { default as Checkbox } from './Checkbox';
export { default as Input } from './Input';
export { default as ProgressBar } from './ProgressBar';
export { default as RadioGroup } from './RadioGroup';
export { default as Rating } from './Rating';
export { default as Select } from './Select';
export { default as StatusIndicator } from './StatusIndicator';
export { default as Switch } from './Switch';
export { default as Tag } from './Tag';
export { default as Textarea } from './Textarea';
export { default as Timer } from './Timer';
export { default as PriceTag } from './PriceTag';

// Types
export type { BadgeProps } from './Badge';
export type { ButtonProps } from './Button';
export type { CheckboxProps } from './Checkbox';
export type { InputProps } from './Input';
export type { ProgressBarProps } from './ProgressBar';
export type { RadioGroupProps } from './RadioGroup';
export type { RatingProps } from './Rating';
export type { SelectProps } from './Select';
export type { StatusIndicatorProps } from './StatusIndicator';
export type { SwitchProps } from './Switch';
export type { TagProps } from './Tag';
export type { TextareaProps } from './Textarea';
export type { TimerProps } from './Timer';

// Utility functions for common UI patterns
export const createSelectOptions = <T extends string | number>(
  items: T[],
  labelFn?: (item: T) => string
): { value: T; label: string }[] => {
  return items.map(item => ({
    value: item,
    label: labelFn ? labelFn(item) : String(item)
  }));
};

export const createRadioOptions = <T extends string | number>(
  items: T[],
  labelFn?: (item: T) => string,
  descriptionFn?: (item: T) => string
): { value: T; label: string; description?: string }[] => {
  return items.map(item => ({
    value: item,
    label: labelFn ? labelFn(item) : String(item),
    description: descriptionFn ? descriptionFn(item) : undefined
  }));
};

// Common size options
export const UI_SIZES = ['sm', 'md', 'lg'] as const;
export type UISize = typeof UI_SIZES[number];

// Common color options
export const UI_COLORS = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const;
export type UIColor = typeof UI_COLORS[number];

// Common variant options
export const UI_VARIANTS = ['default', 'filled', 'outlined', 'subtle'] as const;
export type UIVariant = typeof UI_VARIANTS[number];

// Status types
export const STATUS_TYPES = ['success', 'warning', 'danger', 'info', 'pending', 'neutral'] as const;
export type StatusType = typeof STATUS_TYPES[number];

// Form validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// Accessibility helpers
export const generateId = (prefix: string = 'ui'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getAriaDescribedBy = (
  id: string,
  hasError?: boolean,
  hasHelper?: boolean
): string | undefined => {
  const parts: string[] = [];
  if (hasError) parts.push(`${id}-error`);
  if (hasHelper) parts.push(`${id}-helper`);
  return parts.length > 0 ? parts.join(' ') : undefined;
};
