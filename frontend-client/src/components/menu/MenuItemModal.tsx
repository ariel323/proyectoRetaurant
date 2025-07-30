import React, { useEffect } from 'react';
import { MenuItem } from '../../types';
import MenuItemDetails from './MenuItemDetails';
import { cn } from '../../utils/cn';

export interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  isOpen,
  onClose,
  className,
}) => {
  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // No renderizar si no está abierto o no hay item
  if (!isOpen || !item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl",
            "max-h-[90vh] overflow-y-auto",
            "transform transition-all duration-300 scale-100",
            className
          )}
          onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer click dentro
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className={cn(
              "absolute top-4 right-4 z-10",
              "w-8 h-8 rounded-full bg-white bg-opacity-90 backdrop-blur-sm",
              "flex items-center justify-center text-gray-600",
              "hover:bg-opacity-100 hover:text-gray-900",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              "transition-all duration-200",
              "shadow-md"
            )}
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contenido del modal */}
          <div className="p-6">
            <MenuItemDetails
              item={item}
              variant="modal"
              onClose={onClose}
              showAddToCart={true}
              showFullDescription={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para gestionar el modal
export const useMenuItemModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(null);

  const openModal = (item: MenuItem) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Pequeño delay antes de limpiar el item para la animación
    setTimeout(() => setSelectedItem(null), 300);
  };

  return {
    isOpen,
    selectedItem,
    openModal,
    closeModal,
  };
};

// Componente portátil que incluye el modal
export const MenuItemModalProvider: React.FC<{
  children: (openModal: (item: MenuItem) => void) => React.ReactNode;
}> = ({ children }) => {
  const { isOpen, selectedItem, openModal, closeModal } = useMenuItemModal();

  return (
    <>
      {children(openModal)}
      <MenuItemModal
        item={selectedItem}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default MenuItemModal;
