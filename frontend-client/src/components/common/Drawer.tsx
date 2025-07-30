import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showHeader?: boolean;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  overlayClassName?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  showHeader = true,
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
  overlayClassName,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getPositionClasses = () => {
    const base = 'fixed bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50';
    
    switch (position) {
      case 'left':
        return {
          container: `${base} top-0 left-0 h-full`,
          transform: isOpen ? 'translate-x-0' : '-translate-x-full',
        };
      case 'right':
        return {
          container: `${base} top-0 right-0 h-full`,
          transform: isOpen ? 'translate-x-0' : 'translate-x-full',
        };
      case 'top':
        return {
          container: `${base} top-0 left-0 w-full`,
          transform: isOpen ? 'translate-y-0' : '-translate-y-full',
        };
      case 'bottom':
        return {
          container: `${base} bottom-0 left-0 w-full rounded-t-2xl`,
          transform: isOpen ? 'translate-y-0' : 'translate-y-full',
        };
      default:
        return {
          container: `${base} top-0 right-0 h-full`,
          transform: isOpen ? 'translate-x-0' : 'translate-x-full',
        };
    }
  };

  const getSizeClasses = () => {
    if (position === 'top' || position === 'bottom') {
      switch (size) {
        case 'sm': return 'max-h-64';
        case 'md': return 'max-h-96';
        case 'lg': return 'max-h-[32rem]';
        case 'xl': return 'max-h-[40rem]';
        case 'full': return 'h-full';
        default: return 'max-h-96';
      }
    } else {
      switch (size) {
        case 'sm': return 'w-64';
        case 'md': return 'w-80';
        case 'lg': return 'w-96';
        case 'xl': return 'w-[28rem]';
        case 'full': return 'w-full';
        default: return 'w-80';
      }
    }
  };

  const positionClasses = getPositionClasses();
  const sizeClasses = getSizeClasses();

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className={cn(
            'fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300',
            overlayClassName
          )}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          positionClasses.container,
          positionClasses.transform,
          sizeClasses,
          'flex flex-col',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Handle for mobile (bottom drawer) */}
        {position === 'bottom' && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            {title && (
              <h2 id="drawer-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cerrar drawer"
              >
                ✕
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;