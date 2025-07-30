import React, { useState } from 'react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';
import CartItemControls from './CartItemControls';
import CartNotes from './CartNotes';
import PriceTag from '../ui/PriceTag';
import ImageWithFallback from '../common/ImageWithFallback';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

export interface CartItemProps {
  item: CartItemType;
  variant?: 'default' | 'compact' | 'detailed';
  showImage?: boolean;
  showNotes?: boolean;
  className?: string;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  variant = 'default',
  showImage = true,
  showNotes = true,
  className,
}) => {
  const { removeItem, updateQuantity, updateNotes } = useCart();
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove();
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const handleNotesUpdate = (newNotes: string) => {
    updateNotes(item.id, newNotes);
    setIsEditingNotes(false);
  };

  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 transition-all duration-200',
      'hover:shadow-md',
      className
    )}>
      <div className={cn(
        'flex gap-3',
        isCompact ? 'p-3' : 'p-4'
      )}>
        {/* Image */}
        {showImage && !isCompact && (
          <div className="flex-shrink-0">
            <ImageWithFallback
              src={item.menuItem.imagen}
              alt={item.menuItem.nombre}
              fallback="🍽️"
              className="w-16 h-16 rounded-md object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and price */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className={cn(
                'font-medium text-gray-900 truncate',
                isCompact ? 'text-sm' : 'text-base'
              )}>
                {item.menuItem.nombre}
              </h3>
              {!isCompact && (
                <p className="text-sm text-gray-500 capitalize">
                  {item.menuItem.categoria}
                </p>
              )}
            </div>
            
            <div className="flex-shrink-0 text-right">
              <PriceTag 
                price={item.subtotal} 
                size={isCompact ? 'sm' : 'md'}
                variant="highlighted"
              />
              {!isCompact && (
                <p className="text-xs text-gray-500">
                  ${item.menuItem.precio.toFixed(2)} c/u
                </p>
              )}
            </div>
          </div>

          {/* Description (only in detailed mode) */}
          {isDetailed && item.menuItem.descripcion && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {item.menuItem.descripcion}
            </p>
          )}

          {/* Notes */}
          {showNotes && item.notas && !isEditingNotes && (
            <div className="mt-2">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Notas:</span> {item.notas}
              </p>
            </div>
          )}

          {/* Notes editor */}
          {isEditingNotes && (
            <div className="mt-2">
              <CartNotes
                value={item.notas || ''}
                onSave={handleNotesUpdate}
                onCancel={() => setIsEditingNotes(false)}
                placeholder="Agregar notas especiales..."
              />
            </div>
          )}

          {/* Controls */}
          <div className={cn(
            'flex items-center justify-between',
            isCompact ? 'mt-2' : 'mt-3'
          )}>
            <CartItemControls
              quantity={item.cantidad}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              size={isCompact ? 'sm' : 'md'}
            />

            {/* Edit notes button */}
            {showNotes && !isCompact && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {item.notas ? 'Editar notas' : 'Agregar notas'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;