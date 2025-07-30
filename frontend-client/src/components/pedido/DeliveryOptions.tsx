import React, { useState } from 'react';

interface DeliveryOption {
  id: string;
  type: 'pickup' | 'table' | 'delivery';
  label: string;
  description: string;
  estimatedTime: string;
  price: number;
  icon: React.ReactNode;
}

interface DeliveryOptionsProps {
  selectedOption?: string;
  onOptionChange?: (option: DeliveryOption) => void;
  mesaId?: number;
  variant?: 'default' | 'compact' | 'modal';
  showPricing?: boolean;
  className?: string;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  selectedOption,
  onOptionChange,
  mesaId,
  variant = 'default',
  showPricing = true,
  className = ''
}) => {
  const [selected, setSelected] = useState<string>(selectedOption || 'table');

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'table',
      type: 'table',
      label: 'Servir en Mesa',
      description: mesaId ? `Servir en Mesa ${mesaId}` : 'Servir en la mesa seleccionada',
      estimatedTime: '20-25 min',
      price: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'pickup',
      type: 'pickup',
      label: 'Recoger en Mostrador',
      description: 'Recoge tu pedido en el mostrador',
      estimatedTime: '15-20 min',
      price: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: 'delivery',
      type: 'delivery',
      label: 'Entrega a Domicilio',
      description: 'Entrega en la dirección especificada',
      estimatedTime: '35-45 min',
      price: 2.50,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const handleOptionSelect = (option: DeliveryOption) => {
    setSelected(option.id);
    onOptionChange?.(option);
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          Método de Entrega
        </label>
        <select
          value={selected}
          onChange={(e) => {
            const option = deliveryOptions.find(opt => opt.id === e.target.value);
            if (option) handleOptionSelect(option);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {deliveryOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label} {showPricing && option.price > 0 && `(+$${option.price.toFixed(2)})`}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900">
          Elige tu método de entrega
        </h3>
        <div className="grid gap-3">
          {deliveryOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className={`
                p-4 border rounded-lg text-left transition-colors w-full
                ${selected === option.id
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-lg
                    ${selected === option.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                    <div className="text-sm text-gray-500">{option.estimatedTime}</div>
                  </div>
                </div>
                {showPricing && (
                  <div className="text-right">
                    <div className="font-medium">
                      {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Gratis'}
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Método de Entrega
        </h3>
        <p className="text-gray-600 text-sm">
          Selecciona cómo prefieres recibir tu pedido
        </p>
      </div>

      <div className="space-y-3">
        {deliveryOptions.map(option => (
          <div
            key={option.id}
            className={`
              relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors
              ${selected === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            onClick={() => handleOptionSelect(option)}
          >
            <div className="flex items-center flex-1">
              <input
                type="radio"
                id={option.id}
                name="delivery-option"
                value={option.id}
                checked={selected === option.id}
                onChange={() => handleOptionSelect(option)}
                className="sr-only"
              />
              <div className={`
                w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center
                ${selected === option.id
                  ? 'border-blue-500'
                  : 'border-gray-300'
                }
              `}>
                {selected === option.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <div className={`
                p-2 rounded-lg mr-4
                ${selected === option.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {option.estimatedTime}
                      </span>
                    </div>
                  </div>
                  {showPricing && (
                    <div className="text-right">
                      <div className={`
                        font-medium
                        ${option.price > 0 ? 'text-gray-900' : 'text-green-600'}
                      `}>
                        {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Gratis'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Special instructions for selected option */}
      {selected === 'delivery' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Entrega a domicilio</p>
              <p>Asegúrate de proporcionar una dirección completa y precisa en los datos del cliente.</p>
            </div>
          </div>
        </div>
      )}

      {selected === 'pickup' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Recoger en mostrador</p>
              <p>Te notificaremos cuando tu pedido esté listo para recoger. Trae tu comprobante o número de pedido.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryOptions;
