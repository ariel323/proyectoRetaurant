import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  variant?: 'default' | 'bordered' | 'shadow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onItemToggle?: (itemId: string, isOpen: boolean) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenItems = [],
  variant = 'default',
  size = 'md',
  className,
  onItemToggle,
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems);

  const toggleItem = (itemId: string) => {
    const isCurrentlyOpen = openItems.includes(itemId);
    let newOpenItems: string[];

    if (isCurrentlyOpen) {
      newOpenItems = openItems.filter(id => id !== itemId);
    } else {
      if (!allowMultiple) {
        newOpenItems = [itemId];
      } else {
        newOpenItems = [...openItems, itemId];
      }
    }

    setOpenItems(newOpenItems);
    onItemToggle?.(itemId, !isCurrentlyOpen);
  };

  const variantClasses = {
    default: 'border border-gray-200 rounded-lg overflow-hidden',
    bordered: 'border border-gray-300 rounded-lg shadow-sm overflow-hidden',
    shadow: 'bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100',
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn(variantClasses[variant], sizeClasses[size], className)}>
      {items.map((item, index) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isOpen={openItems.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
          isLast={index === items.length - 1}
          size={size}
          variant={variant}
        />
      ))}
    </div>
  );
};

interface AccordionItemProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'bordered' | 'shadow';
}

const AccordionItemComponent: React.FC<AccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
  isLast,
  size,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const paddingClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const contentPaddingClasses = {
    sm: 'px-3 pb-2',
    md: 'px-4 pb-3',
    lg: 'px-6 pb-4',
  };

  return (
    <div className={cn(!isLast && 'border-b border-gray-200')}>
      {/* Header */}
      <button
        onClick={onToggle}
        disabled={item.disabled}
        className={cn(
          'w-full flex items-center justify-between',
          'hover:bg-gray-50 focus:outline-none focus:bg-gray-50',
          'transition-colors duration-200',
          paddingClasses[size],
          item.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
        )}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${item.id}`}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <span className="flex-shrink-0">{item.icon}</span>
          )}
          <span className="font-medium text-left text-gray-900">
            {item.title}
          </span>
        </div>
        
        <svg
          className={cn(
            'w-5 h-5 transition-transform duration-200 text-gray-500',
            isOpen && 'transform rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      <div
        id={`accordion-content-${item.id}`}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height }}
      >
        <div ref={contentRef}>
          <div className={cn(contentPaddingClasses[size], 'text-gray-700')}>
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;

