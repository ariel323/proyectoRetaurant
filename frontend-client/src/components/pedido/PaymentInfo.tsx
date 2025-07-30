import React, { useState } from 'react';

interface PaymentInfoProps {
  selectedMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  notas: string;
  onChange?: (method: 'efectivo' | 'tarjeta' | 'transferencia', notas: string) => void;
  onComplete?: (method: 'efectivo' | 'tarjeta' | 'transferencia', notas: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  selectedMethod,
  notas,
  onChange,
  onComplete,
  variant = 'default',
  className = ''
}) => {
  const [paymentMethod, setPaymentMethod] = useState(selectedMethod);
  const [paymentNotes, setPaymentNotes] = useState(notas);

  const paymentOptions = [
    {
      id: 'efectivo' as const,
      label: 'Efectivo',
      description: 'Pago en efectivo al momento de la entrega',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      id: 'tarjeta' as const,
      label: 'Tarjeta',
      description: 'Pago con tarjeta de débito o crédito',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'transferencia' as const,
      label: 'Transferencia',
      description: 'Transferencia bancaria o pago digital',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const handleMethodChange = (method: typeof paymentMethod) => {
    setPaymentMethod(method);
    onChange?.(method, paymentNotes);
  };

  const handleNotesChange = (newNotes: string) => {
    setPaymentNotes(newNotes);
    onChange?.(paymentMethod, newNotes);
  };

  const handleComplete = () => {
    onComplete?.(paymentMethod, paymentNotes);
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <select
          value={paymentMethod}
          onChange={(e) => handleMethodChange(e.target.value as typeof paymentMethod)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {paymentOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Payment Methods */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">
          Selecciona un método de pago
        </h3>
        <div className="space-y-3">
          {paymentOptions.map(option => (
            <div
              key={option.id}
              className={`
                relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                ${paymentMethod === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
              onClick={() => handleMethodChange(option.id)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id={option.id}
                  name="payment-method"
                  value={option.id}
                  checked={paymentMethod === option.id}
                  onChange={() => handleMethodChange(option.id)}
                  className="sr-only"
                />
                <div className={`
                  w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center
                  ${paymentMethod === option.id
                    ? 'border-blue-500'
                    : 'border-gray-300'
                  }
                `}>
                  {paymentMethod === option.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <div className={`
                  p-2 rounded-lg mr-3
                  ${paymentMethod === option.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {option.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {option.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-3">
        <label htmlFor="payment-notes" className="block text-sm font-medium text-gray-700">
          Notas adicionales (opcional)
        </label>
        <textarea
          id="payment-notes"
          rows={3}
          value={paymentNotes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Instrucciones especiales para el pago..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Payment Method Specific Info */}
      {paymentMethod === 'efectivo' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Pago en efectivo</p>
              <p>Prepara el monto exacto o indica si necesitas cambio en las notas.</p>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'transferencia' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Datos para transferencia:</p>
            <div className="space-y-1">
              <p><span className="font-medium">Banco:</span> Banco Nacional</p>
              <p><span className="font-medium">Cuenta:</span> 1234-5678-9012-3456</p>
              <p><span className="font-medium">Titular:</span> Restaurante XYZ</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {onComplete && (
        <div className="pt-4">
          <button
            onClick={handleComplete}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;
