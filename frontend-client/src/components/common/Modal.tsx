import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

interface ModalProps {
  /**
   * Controla si el modal está abierto
   */
  isOpen: boolean;
  
  /**
   * Función para cerrar el modal
   */
  onClose: () => void;
  
  /**
   * Título del modal
   */
  title?: string;
  
  /**
   * Descripción del modal
   */
  description?: string;
  
  /**
   * Contenido del modal
   */
  children: React.ReactNode;
  
  /**
   * Tamaño del modal
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Variante del modal
   */
  variant?: 'default' | 'centered' | 'bottom-sheet' | 'drawer-left' | 'drawer-right';
  
  /**
   * Permitir cerrar clickeando fuera
   */
  closeOnOutsideClick?: boolean;
  
  /**
   * Permitir cerrar con ESC
   */
  closeOnEscape?: boolean;
  
  /**
   * Mostrar botón de cerrar
   */
  showCloseButton?: boolean;
  
  /**
   * Desactivar scroll del body
   */
  disableBodyScroll?: boolean;
  
  /**
   * Blur del fondo
   */
  blur?: boolean;
  
  /**
   * Animación de entrada
   */
  animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right';
  
  /**
   * Z-index personalizado
   */
  zIndex?: number;
  
  /**
   * Clases CSS adicionales para el contenedor
   */
  className?: string;
  
  /**
   * Clases CSS adicionales para el contenido
   */
  contentClassName?: string;
  
  /**
   * Clases CSS adicionales para el overlay
   */
  overlayClassName?: string;
  
  /**
   * Función que se ejecuta después de abrir
   */
  onAfterOpen?: () => void;
  
  /**
   * Función que se ejecuta después de cerrar
   */
  onAfterClose?: () => void;
}

interface ModalHeaderProps {
  /**
   * Título del header
   */
  title?: string;
  
  /**
   * Descripción del header
   */
  description?: string;
  
  /**
   * Mostrar botón de cerrar
   */
  showCloseButton?: boolean;
  
  /**
   * Función para cerrar
   */
  onClose?: () => void;
  
  /**
   * Contenido personalizado del header
   */
  children?: React.ReactNode;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

interface ModalBodyProps {
  /**
   * Contenido del body
   */
  children: React.ReactNode;
  
  /**
   * Padding personalizado
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

interface ModalFooterProps {
  /**
   * Contenido del footer
   */
  children: React.ReactNode;
  
  /**
   * Alineación del contenido
   */
  align?: 'left' | 'center' | 'right' | 'between';
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente Modal - Modal reutilizable con múltiples variantes
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  variant = 'default',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  disableBodyScroll = true,
  blur = true,
  animation = 'fade',
  zIndex = 50,
  className,
  contentClassName,
  overlayClassName,
  onAfterOpen,
  onAfterClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Gestión del scroll del body
  useEffect(() => {
    if (isOpen && disableBodyScroll) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      
      // Focus en el modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
      
      onAfterOpen?.();
    } else if (!isOpen) {
      document.body.style.overflow = '';
      
      // Restaurar focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
      
      onAfterClose?.();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, disableBodyScroll, onAfterOpen, onAfterClose]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'max-w-xs';
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case 'full': return 'max-w-full mx-4';
      default: return 'max-w-md';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'centered':
        return 'flex items-center justify-center min-h-screen p-4';
      case 'bottom-sheet':
        return 'flex items-end justify-center min-h-screen';
      case 'drawer-left':
        return 'flex items-stretch justify-start';
      case 'drawer-right':
        return 'flex items-stretch justify-end';
      default:
        return 'flex items-center justify-center min-h-screen p-4';
    }
  };

  const getAnimationClasses = () => {
    if (!isOpen) return 'opacity-0 scale-95 pointer-events-none';
    
    switch (animation) {
      case 'scale':
        return 'opacity-100 scale-100';
      case 'slide-up':
        return 'opacity-100 translate-y-0';
      case 'slide-down':
        return 'opacity-100 -translate-y-0';
      case 'slide-left':
        return 'opacity-100 translate-x-0';
      case 'slide-right':
        return 'opacity-100 -translate-x-0';
      default:
        return 'opacity-100 scale-100';
    }
  };

  const getContentVariantClasses = () => {
    switch (variant) {
      case 'bottom-sheet':
        return 'w-full rounded-t-xl';
      case 'drawer-left':
        return 'h-full min-h-screen w-80 rounded-r-xl';
      case 'drawer-right':
        return 'h-full min-h-screen w-80 rounded-l-xl';
      default:
        return 'rounded-xl';
    }
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOutsideClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-all duration-300',
        blur ? 'backdrop-blur-sm' : '',
        'bg-black bg-opacity-50',
        getVariantClasses(),
        overlayClassName
      )}
      style={{ zIndex }}
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className={cn(
          'bg-white shadow-2xl transition-all duration-300 transform',
          getSizeClasses(),
          getContentVariantClasses(),
          getAnimationClasses(),
          variant === 'bottom-sheet' && 'max-h-[90vh] overflow-hidden',
          (variant === 'drawer-left' || variant === 'drawer-right') && 'overflow-hidden',
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description || showCloseButton) && (
          <ModalHeader
            title={title}
            description={description}
            showCloseButton={showCloseButton}
            onClose={onClose}
          />
        )}
        
        <div className={cn('overflow-y-auto', className)}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

/**
 * Componente ModalHeader - Header del modal
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  showCloseButton = true,
  onClose,
  children,
  className,
}) => {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          )}
          {description && (
            <p id="modal-description" className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
          {children}
        </div>
        
        {showCloseButton && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Componente ModalBody - Cuerpo del modal
 */
export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  padding = 'md',
  className,
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none': return '';
      case 'sm': return 'p-4';
      case 'md': return 'p-6';
      case 'lg': return 'p-8';
      default: return 'p-6';
    }
  };

  return (
    <div className={cn(getPaddingClasses(), className)}>
      {children}
    </div>
  );
};

/**
 * Componente ModalFooter - Footer del modal
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  align = 'right',
  className,
}) => {
  const getAlignClasses = () => {
    switch (align) {
      case 'left': return 'justify-start';
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      case 'between': return 'justify-between';
      default: return 'justify-end';
    }
  };

  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 flex items-center space-x-3', getAlignClasses(), className)}>
      {children}
    </div>
  );
};

/**
 * Hook para gestionar estado del modal
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const toggleModal = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen,
  };
};

export default Modal;