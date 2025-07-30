import React from 'react';
import { useCart } from '../../contexts/CartContext';
import CartSidebar from './CartSidebar';
import CartDrawer from './CartDrawer';
import { cn } from '../../utils/cn';

export interface CartContainerProps {
  type?: 'sidebar' | 'drawer' | 'modal';
  className?: string;
}

const CartContainer: React.FC<CartContainerProps> = ({
  type = 'sidebar',
  className,
}) => {
  const { isOpen } = useCart();

  if (!isOpen) {
    return null;
  }

  if (type === 'drawer') {
    return <CartDrawer className={className} />;
  }

  // Default to sidebar
  return <CartSidebar className={className} />;
};

export default CartContainer;