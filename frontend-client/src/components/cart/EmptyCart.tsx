import React from 'react';
import Button from '../ui/Button';
import EmptyState from '../common/EmptyState';
import { cn } from '../../utils/cn';

export interface EmptyCartProps {
  title?: string;
  description?: string;
  icon?: string;
  onContinueShopping?: () => void;
  showContinueButton?: boolean;
  className?: string;
}

const EmptyCart: React.FC<EmptyCartProps> = ({
  title = "Tu carrito está vacío",
  description = "Agrega algunos platos deliciosos para comenzar tu pedido",
  icon = "🛒",
  onContinueShopping,
  showContinueButton = true,
  className,
}) => {
  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      // Scroll to menu section or navigate
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={cn('py-8', className)}>
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        action={
          showContinueButton ? (
            <Button
              onClick={handleContinueShopping}
              variant="primary"
              size="md"
              className="mt-4"
            >
              Ver Menú
            </Button>
          ) : undefined
        }
      />
      
      {/* Additional suggestions */}
      <div className="mt-8 text-center">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Sugerencias para empezar:
        </h4>
        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <span>🍽️</span>
            <span>Explora nuestras categorías</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>⭐</span>
            <span>Prueba nuestros platos más populares</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>🔍</span>
            <span>Usa el buscador para encontrar algo específico</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;