import React from 'react';
import { Cliente, CartItem } from '../../types';

interface OrderConfirmationProps {
  customer: Cliente;
  items: CartItem[];
  total: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  notas: string;
  onConfirm?: () => void;
  onEdit?: () => void;
  isProcessing?: boolean;
  className?: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  customer,
  items,
  total,
  paymentMethod,
  notas,
  onConfirm,
  onEdit,
  isProcessing = false,
  className = ''
}) => {
  const paymentMethodLabels = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia'
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Confirma tu pedido
        </h2>
        <p className="text-gray-600">
          Revisa los detalles antes de confirmar
        </p>
      </div>

      {/* Customer Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Datos del Cliente
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Nombre:</span>
            <p className="text-gray-900">{customer.nombre}</p>
          </div>
          {customer.telefono && (
            <div>
              <span className="font-medium text-gray-700">Teléfono:</span>
              <p className="text-gray-900">{customer.telefono}</p>
            </div>
          )}
          {customer.email && (
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900">{customer.email}</p>
            </div>
          )}
          {customer.notas && (
            <div className="sm:col-span-2">
              <span className="font-medium text-gray-700">Notas del cliente:</span>
              <p className="text-gray-900">{customer.notas}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Resumen del Pedido
        </h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start bg-white rounded-lg p-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.menuItem.nombre}</h4>
                {item.notas && (
                  <p className="text-sm text-gray-600 mt-1">Nota: {item.notas}</p>
                )}
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <span>Cantidad: {item.cantidad}</span>
                  <span className="mx-2">•</span>
                  <span>${item.menuItem.precio.toFixed(2)} c/u</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          
          {/* Total */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Método de Pago
        </h3>
        <div className="text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Método seleccionado:</span>
            <span className="text-gray-900 capitalize">{paymentMethodLabels[paymentMethod]}</span>
          </div>
          {notas && (
            <div className="mt-2">
              <span className="font-medium text-gray-700">Notas de pago:</span>
              <p className="text-gray-900 mt-1">{notas}</p>
            </div>
          )}
        </div>
      </div>

      {/* Estimated Time */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium text-blue-900">Tiempo estimado de preparación</p>
            <p className="text-blue-700 text-sm">20-30 minutos aproximadamente</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {onEdit && (
          <button
            onClick={onEdit}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Editar Pedido
          </button>
        )}
        
        {onConfirm && (
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isProcessing && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span>
              {isProcessing ? 'Procesando pedido...' : 'Confirmar Pedido'}
            </span>
          </button>
        )}
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
        <p>
          Al confirmar el pedido, aceptas nuestros términos y condiciones.
          El tiempo de preparación puede variar según la disponibilidad de ingredientes.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
