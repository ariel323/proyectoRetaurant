import React, { useState, useEffect } from 'react';
import { Cliente, Pedido } from '../../types';
import { useCart } from '../../contexts/CartContext';
import OrderSummary from './OrderSummary';
import CustomerForm from './CustomerForm';
import PaymentInfo from './PaymentInfo';
import OrderConfirmation from './OrderConfirmation';
import OrderSteps from './OrderSteps';

interface CheckoutContainerProps {
  onComplete?: (pedido: Pedido) => void;
  onCancel?: () => void;
  initialMesaId?: number;
  className?: string;
}

type CheckoutStep = 'customer' | 'payment' | 'confirmation' | 'completed';

interface CheckoutState {
  step: CheckoutStep;
  customer: Cliente | null;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  notas: string;
  isProcessing: boolean;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({
  onComplete,
  onCancel,
  initialMesaId,
  className = ''
}) => {
  const { items, total, clearCart } = useCart();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'customer',
    customer: null,
    paymentMethod: 'efectivo',
    notas: '',
    isProcessing: false
  });

  const steps: Array<{ id: CheckoutStep; label: string; description: string }> = [
    { id: 'customer', label: 'Datos del Cliente', description: 'Información de contacto' },
    { id: 'payment', label: 'Método de Pago', description: 'Selecciona cómo pagar' },
    { id: 'confirmation', label: 'Confirmación', description: 'Revisa tu pedido' },
    { id: 'completed', label: 'Completado', description: 'Pedido realizado' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === checkoutState.step);

  useEffect(() => {
    // Si no hay items en el carrito, redirigir o cancelar
    if (items.length === 0 && checkoutState.step !== 'completed') {
      onCancel?.();
    }
  }, [items.length, checkoutState.step, onCancel]);

  const handleCustomerComplete = (customer: Cliente) => {
    setCheckoutState(prev => ({
      ...prev,
      customer,
      step: 'payment'
    }));
  };

  const handlePaymentComplete = (paymentMethod: typeof checkoutState.paymentMethod, notas: string) => {
    setCheckoutState(prev => ({
      ...prev,
      paymentMethod,
      notas,
      step: 'confirmation'
    }));
  };

  const handleConfirmOrder = async () => {
    if (!checkoutState.customer || items.length === 0) return;

    setCheckoutState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Crear el pedido
      const nuevoPedido: Omit<Pedido, 'id'> = {
        mesa_id: initialMesaId || 1,
        cliente: checkoutState.customer,
        items: items,
        total,
        estado: 'PENDIENTE',
        fecha_creacion: new Date().toISOString(),
        notas: checkoutState.notas
      };

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const pedidoCompleto: Pedido = {
        ...nuevoPedido,
        id: Date.now()
      };

      setCheckoutState(prev => ({
        ...prev,
        step: 'completed',
        isProcessing: false
      }));

      // Limpiar carrito después de un delay
      setTimeout(() => {
        clearCart();
        onComplete?.(pedidoCompleto);
      }, 2000);

    } catch (error) {
      console.error('Error al procesar pedido:', error);
      setCheckoutState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleBackStep = () => {
    const stepMap: Record<CheckoutStep, CheckoutStep> = {
      customer: 'customer',
      payment: 'customer',
      confirmation: 'payment',
      completed: 'completed'
    };

    setCheckoutState(prev => ({
      ...prev,
      step: stepMap[prev.step]
    }));
  };

  const canGoBack = checkoutState.step !== 'customer' && checkoutState.step !== 'completed';
  const isLastStep = checkoutState.step === 'confirmation';

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Finalizar Pedido
        </h1>
        <p className="text-gray-600">
          Completa los siguientes pasos para confirmar tu pedido
        </p>
      </div>

      {/* Steps Progress */}
      <OrderSteps
        steps={steps}
        currentStep={currentStepIndex}
        className="mb-8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {checkoutState.step === 'customer' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Datos del Cliente</h2>
              <CustomerForm
                initialData={checkoutState.customer || undefined}
                onChange={(customer) => {
                  setCheckoutState(prev => ({ ...prev, customer }));
                }}
                requiredFields={['nombre', 'telefono']}
                variant="default"
                className="mb-4"
              />
              <button
                onClick={() => {
                  if (checkoutState.customer) {
                    handleCustomerComplete(checkoutState.customer);
                  }
                }}
                disabled={!checkoutState.customer}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Continuar
              </button>
            </div>
          )}

          {checkoutState.step === 'payment' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
              <PaymentInfo
                selectedMethod={checkoutState.paymentMethod}
                notas={checkoutState.notas}
                onChange={(method, notas) => {
                  setCheckoutState(prev => ({
                    ...prev,
                    paymentMethod: method,
                    notas
                  }));
                }}
                onComplete={handlePaymentComplete}
                variant="default"
              />
            </div>
          )}

          {checkoutState.step === 'confirmation' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Confirmación del Pedido</h2>
              <OrderConfirmation
                customer={checkoutState.customer!}
                items={items}
                total={total}
                paymentMethod={checkoutState.paymentMethod}
                notas={checkoutState.notas}
                onConfirm={handleConfirmOrder}
                onEdit={handleBackStep}
                isProcessing={checkoutState.isProcessing}
              />
            </div>
          )}

          {checkoutState.step === 'completed' && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Pedido Confirmado!
                </h2>
                <p className="text-gray-600">
                  Tu pedido ha sido enviado a la cocina y será preparado en breve.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Tiempo estimado de preparación:
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  20-30 minutos
                </p>
              </div>

              <button
                onClick={() => onComplete?.({} as Pedido)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          )}
        </div>

        {/* Sidebar - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
            <OrderSummary
              items={items}
              total={total}
              variant="compact"
              showActions={false}
              className="border-0 shadow-none p-0"
            />

            {checkoutState.customer && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{checkoutState.customer.nombre}</p>
                  <p>{checkoutState.customer.telefono}</p>
                  {checkoutState.customer.email && (
                    <p>{checkoutState.customer.email}</p>
                  )}
                </div>
              </div>
            )}

            {checkoutState.paymentMethod && checkoutState.step !== 'customer' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Método de Pago</h4>
                <p className="text-sm text-gray-600 capitalize">
                  {checkoutState.paymentMethod}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {checkoutState.step !== 'completed' && (
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={canGoBack ? handleBackStep : onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={checkoutState.isProcessing}
          >
            {canGoBack ? 'Atrás' : 'Cancelar'}
          </button>

          {isLastStep && (
            <button
              onClick={handleConfirmOrder}
              disabled={!checkoutState.customer || checkoutState.isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {checkoutState.isProcessing && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>
                {checkoutState.isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutContainer;
