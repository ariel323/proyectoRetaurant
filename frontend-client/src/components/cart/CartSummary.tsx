import React from 'react';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';
import PriceTag from '../ui/PriceTag';
import { cn } from '../../utils/cn';

export interface CartSummaryProps {
  showCheckoutButton?: boolean;
  showClearButton?: boolean;
  showTax?: boolean;
  showDiscount?: boolean;
  taxRate?: number;
  discount?: number;
  onCheckout?: () => void;
  onClear?: () => void;
  className?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
  showClearButton = false,
  showTax = false,
  showDiscount = false,
  taxRate = 0.1, // 10% tax by default
  discount = 0,
  onCheckout,
  onClear,
  className,
}) => {
  const { total, cantidad_total, items } = useCart();

  // Calculate additional amounts
  const subtotal = total;
  const discountAmount = discount > 0 ? (subtotal * discount) : 0;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = showTax ? (taxableAmount * taxRate) : 0;
  const finalTotal = taxableAmount + taxAmount;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('p-4 space-y-4', className)}>
      {/* Summary breakdown */}
      <div className="space-y-2">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Subtotal ({cantidad_total} {cantidad_total === 1 ? 'item' : 'items'}):
          </span>
          <PriceTag price={subtotal} size="sm" />
        </div>

        {/* Discount */}
        {showDiscount && discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600">
              Descuento ({(discount * 100).toFixed(0)}%):
            </span>
            <span className="text-green-600">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Tax */}
        {showTax && taxAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Impuestos ({(taxRate * 100).toFixed(0)}%):
            </span>
            <PriceTag price={taxAmount} size="sm" />
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <PriceTag 
            price={showTax || showDiscount ? finalTotal : total} 
            size="lg" 
            variant="highlighted" 
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        {showCheckoutButton && (
          <Button
            onClick={handleCheckout}
            variant="primary"
            size="md"
            fullWidth
            className="font-medium"
            disabled={items.length === 0}
          >
            Proceder al Checkout
          </Button>
        )}

        {showClearButton && (
          <Button
            onClick={handleClear}
            variant="outline"
            size="md"
            fullWidth
            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
            disabled={items.length === 0}
          >
            Vaciar Carrito
          </Button>
        )}
      </div>

      {/* Additional info */}
      {showTax && (
        <div className="text-xs text-gray-500 text-center">
          Los impuestos se calculan al momento del checkout
        </div>
      )}
    </div>
  );
};

export default CartSummary;