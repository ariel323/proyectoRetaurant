import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  EmptyCart
} from '../../components/cart';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui';

const CartPage: React.FC = () => {
  const { 
    items, 
    total, 
    cantidad_total,
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Carrito de Compras
            </h1>
            <EmptyCart />
            <div className="text-center mt-8">
              <Button onClick={handleContinueShopping}>
                Ver Menú
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Carrito de Compras
            </h1>
            <div className="text-sm text-gray-600">
              {cantidad_total} artículo{cantidad_total !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Artículos en tu carrito
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Limpiar carrito
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={`${item.menuItem.id}-${item.notas}`} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Item Image */}
                        {item.menuItem.imagen && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.menuItem.imagen}
                              alt={item.menuItem.nombre}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.menuItem.nombre}
                          </h3>
                          
                          {item.menuItem.descripcion && (
                            <p className="text-sm text-gray-600 mt-1">
                              {item.menuItem.descripcion}
                            </p>
                          )}
                          
                          {item.notas && (
                            <div className="mt-2">
                              <span className="text-sm font-medium text-gray-700">
                                Notas especiales:
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.notas}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                disabled={item.cantidad <= 1}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                -
                              </button>
                              <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                              >
                                +
                              </button>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ${(item.menuItem.precio * item.cantidad).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-600">
                                ${item.menuItem.precio} c/u
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Eliminar artículo"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/menu"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continuar comprando
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumen del pedido
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cantidad_total} artículos)</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-medium">${(total * 0.1).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Costo de servicio</span>
                    <span className="font-medium">$2.50</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${(total + total * 0.1 + 2.50).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceder al pago
                </Button>
                
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pago seguro
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
