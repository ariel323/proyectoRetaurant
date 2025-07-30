import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Button, Input, Textarea, Select, RadioGroup } from '../../components/ui';
import { createSelectOptions, createRadioOptions } from '../../components/ui';

interface CheckoutFormData {
  // Customer Information
  nombre: string;
  email: string;
  telefono: string;
  
  // Table Information
  mesa_id?: number;
  mesa_numero?: string;
  
  // Delivery Information
  tipo_servicio: 'mesa' | 'delivery' | 'pickup';
  direccion?: string;
  instrucciones_entrega?: string;
  
  // Payment Information
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  
  // Special Instructions
  notas_especiales?: string;
}

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    nombre: '',
    email: '',
    telefono: '',
    tipo_servicio: 'mesa',
    metodo_pago: 'efectivo',
  });

  const serviceOptions = createRadioOptions(
    ['mesa', 'delivery', 'pickup'],
    (value) => {
      switch (value) {
        case 'mesa': return 'Servicio en mesa';
        case 'delivery': return 'Entrega a domicilio';
        case 'pickup': return 'Recoger en restaurante';
        default: return value;
      }
    },
    (value) => {
      switch (value) {
        case 'mesa': return 'Te servimos directamente en tu mesa';
        case 'delivery': return 'Entregamos en tu dirección';
        case 'pickup': return 'Recoges tu pedido en el restaurante';
        default: return '';
      }
    }
  );

  const paymentOptions = createSelectOptions(
    ['efectivo', 'tarjeta', 'transferencia'],
    (value) => {
      switch (value) {
        case 'efectivo': return 'Efectivo';
        case 'tarjeta': return 'Tarjeta de crédito/débito';
        case 'transferencia': return 'Transferencia bancaria';
        default: return value;
      }
    }
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (formData.tipo_servicio === 'delivery' && !formData.direccion?.trim()) {
      newErrors.direccion = 'La dirección es requerida para delivery';
    }

    if (formData.tipo_servicio === 'mesa' && !formData.mesa_numero?.trim()) {
      newErrors.mesa_numero = 'El número de mesa es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          menu_item_id: item.menuItem.id,
          cantidad: item.cantidad,
          precio_unitario: item.menuItem.precio,
          notas: item.notas
        })),
        customer: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
        },
        service: {
          tipo: formData.tipo_servicio,
          mesa_numero: formData.mesa_numero,
          direccion: formData.direccion,
          instrucciones: formData.instrucciones_entrega
        },
        payment: {
          metodo: formData.metodo_pago,
          total: total + total * 0.1 + 2.50 // Include taxes and service fee
        },
        notas_especiales: formData.notas_especiales
      };

      // Here you would make the API call to create the order
      // const response = await orderService.createOrder(orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/tracking/order-123', { 
        state: { 
          orderData,
          message: 'Tu pedido ha sido confirmado exitosamente' 
        }
      });
      
    } catch (error) {
      console.error('Error creating order:', error);
      // Handle error - show notification
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-6">
            Agrega algunos platos antes de proceder al checkout
          </p>
          <Button onClick={() => navigate('/menu')}>
            Ver Menú
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = total;
  const taxes = total * 0.1;
  const serviceFee = 2.50;
  const finalTotal = subtotal + taxes + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Finalizar Pedido
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Información del Cliente
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nombre completo"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={errors.nombre}
                      required
                    />
                    
                    <Input
                      label="Teléfono"
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      error={errors.telefono}
                      required
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      required
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Tipo de Servicio
                  </h2>
                  
                  <RadioGroup
                    name="tipo_servicio"
                    options={serviceOptions}
                    value={formData.tipo_servicio}
                    onChange={(value) => handleInputChange('tipo_servicio', value)}
                    variant="card"
                  />
                  
                  {/* Conditional fields based on service type */}
                  {formData.tipo_servicio === 'mesa' && (
                    <div className="mt-6">
                      <Input
                        label="Número de mesa"
                        value={formData.mesa_numero || ''}
                        onChange={(e) => handleInputChange('mesa_numero', e.target.value)}
                        error={errors.mesa_numero}
                        placeholder="Ej: 15"
                        required
                      />
                    </div>
                  )}
                  
                  {formData.tipo_servicio === 'delivery' && (
                    <div className="mt-6 space-y-4">
                      <Textarea
                        label="Dirección de entrega"
                        value={formData.direccion || ''}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        error={!!errors.direccion}
                        errorMessage={errors.direccion}
                        rows={3}
                        required
                      />
                      
                      <Textarea
                        label="Instrucciones de entrega (opcional)"
                        value={formData.instrucciones_entrega || ''}
                        onChange={(e) => handleInputChange('instrucciones_entrega', e.target.value)}
                        rows={2}
                        placeholder="Ej: Tocar el timbre, edificio color azul..."
                      />
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Método de Pago
                  </h2>
                  
                  <Select
                    label="Selecciona el método de pago"
                    options={paymentOptions}
                    value={formData.metodo_pago}
                    onChange={(e) => handleInputChange('metodo_pago', e.target.value)}
                  />
                </div>

                {/* Special Instructions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Instrucciones Especiales
                  </h2>
                  
                  <Textarea
                    label="Notas especiales para tu pedido (opcional)"
                    value={formData.notas_especiales || ''}
                    onChange={(e) => handleInputChange('notas_especiales', e.target.value)}
                    rows={3}
                    placeholder="Alergias, preferencias de cocción, etc..."
                  />
                </div>

                {/* Submit Button */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Procesando pedido...' : `Confirmar pedido - $${finalTotal.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumen del Pedido
                </h3>
                
                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={`${item.menuItem.id}-${item.notas}`} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {item.menuItem.nombre} × {item.cantidad}
                        </div>
                        {item.notas && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.notas}
                          </div>
                        )}
                      </div>
                      <div className="font-medium text-gray-900 ml-4">
                        ${(item.menuItem.precio * item.cantidad).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-2 mb-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Impuestos (10%)</span>
                    <span className="font-medium">${taxes.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Costo de servicio</span>
                    <span className="font-medium">${serviceFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Security Notice */}
                <div className="text-center">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Transacción segura
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

export default CheckoutPage;
