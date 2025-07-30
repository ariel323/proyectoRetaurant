import React from 'react';
import { useCart } from '../../contexts/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

export interface CartDrawerProps {
  className?: string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ className }) => {
  const { isOpen, closeCart, items, cantidad_total } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer - slides from bottom on mobile, right on desktop */}
      <div
        className={cn(
          'fixed z-50 bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          'md:top-0 md:right-0 md:h-full md:w-96',
          'bottom-0 left-0 right-0 h-3/4 rounded-t-2xl md:rounded-none',
          isOpen 
            ? 'translate-y-0 md:translate-x-0' 
            : 'translate-y-full md:translate-x-full',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Handle for mobile */}
        <div className="md:hidden flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 id="cart-title" className="text-lg font-semibold text-gray-900">
            🛒 Carrito {cantidad_total > 0 && `(${cantidad_total})`}
          </h2>
          <Button
            onClick={closeCart}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar carrito"
          >
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <EmptyCart onContinueShopping={closeCart} />
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item}
                    variant="compact"
                  />
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 bg-gray-50">
                <CartSummary showCheckoutButton />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;