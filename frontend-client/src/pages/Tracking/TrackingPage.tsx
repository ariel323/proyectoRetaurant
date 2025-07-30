import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useApiClient } from '../../hooks/useApiClient';
import { StatusIndicator, Button, Timer } from '../../components/ui';

interface OrderStatus {
  id: string;
  status: 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
  timestamp: string;
  description: string;
}

interface OrderDetails {
  id: string;
  numero_orden: string;
  customer: {
    nombre: string;
    email: string;
    telefono: string;
  };
  items: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
    notas?: string;
  }>;
  total: number;
  status_actual: string;
  tiempo_estimado?: number; // in minutes
  tipo_servicio: 'mesa' | 'delivery' | 'pickup';
  mesa_numero?: string;
  direccion?: string;
  created_at: string;
  status_history: OrderStatus[];
}

const TrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Check if we have order data from the checkout flow
  const orderDataFromState = location.state?.orderData;
  const successMessage = location.state?.message;

  const { data: orderDetails, loading, error, refetch } = useApiClient<OrderDetails>(
    orderId ? `/pedidos/${orderId}` : ''
  );

  // Auto-refresh when order is active
  useEffect(() => {
    if (orderDetails && ['confirmado', 'preparando'].includes(orderDetails.status_actual)) {
      const interval = setInterval(() => {
        refetch();
      }, 30000); // Refresh every 30 seconds
      
      setRefreshInterval(interval);
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [orderDetails, refetch, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'info';
      case 'preparando':
        return 'warning';
      case 'listo':
        return 'success';
      case 'entregado':
        return 'success';
      case 'cancelado':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Pedido Confirmado';
      case 'preparando':
        return 'Preparando';
      case 'listo':
        return 'Listo para recoger';
      case 'entregado':
        return 'Entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || (!orderDetails && !orderDataFromState)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pedido no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            No pudimos encontrar la información de este pedido. Verifica el número de orden o intenta nuevamente.
          </p>
          <Button onClick={() => window.location.href = '/menu'}>
            Volver al menú
          </Button>
        </div>
      </div>
    );
  }

  const order = orderDetails || {
    id: orderId || '',
    numero_orden: orderId || '',
    status_actual: 'confirmado',
    created_at: new Date().toISOString(),
    ...orderDataFromState
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-900">
                    ¡Pedido confirmado!
                  </h3>
                  <p className="text-green-700 mt-1">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Seguimiento del Pedido
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Orden #{order.numero_orden}</span>
                  <span>•</span>
                  <span>Realizado: {formatTime(order.created_at)}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {getStatusText(order.status_actual)}
                </div>
                
                {order.tiempo_estimado && ['confirmado', 'preparando'].includes(order.status_actual) && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Tiempo estimado:</p>
                    <Timer
                      duration={order.tiempo_estimado * 60}
                      autoStart={true}
                      variant="text"
                      size="sm"
                      color="primary"
                      showControls={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Status Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Estado del Pedido
                </h2>
                
                <div className="space-y-6">
                  {order.status_history ? (
                    order.status_history.map((status: OrderStatus, index: number) => (
                      <div key={status.id} className="relative flex items-start space-x-3">
                        {/* Timeline Line */}
                        {index < order.status_history.length - 1 && (
                          <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
                        )}
                        
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            getStatusColor(status.status) === 'success' ? 'bg-green-100 text-green-600' :
                            getStatusColor(status.status) === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                            getStatusColor(status.status) === 'danger' ? 'bg-red-100 text-red-600' :
                            getStatusColor(status.status) === 'info' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <div className="w-3 h-3 rounded-full bg-current"></div>
                          </div>
                        </div>
                        
                        {/* Status Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {getStatusText(status.status)}
                              </h3>
                              <p className="text-gray-600 mt-1">
                                {status.description}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatTime(status.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Default timeline for new orders
                    <div className="space-y-6">
                      <div className="relative flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <StatusIndicator
                            status="success"
                            variant="dot"
                            size="md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            Pedido Confirmado
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Tu pedido ha sido recibido y confirmado
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <StatusIndicator
                            status="pending"
                            variant="dot"
                            size="md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-600">
                            Preparando
                          </h3>
                          <p className="text-gray-500 mt-1">
                            Nuestros chefs están preparando tu pedido
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <StatusIndicator
                            status="neutral"
                            variant="dot"
                            size="md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-400">
                            {order.tipo_servicio === 'delivery' ? 'En camino' : 'Listo para recoger'}
                          </h3>
                          <p className="text-gray-400 mt-1">
                            {order.tipo_servicio === 'delivery' 
                              ? 'Tu pedido está en camino'
                              : 'Tu pedido estará listo para recoger'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalles del Pedido
                </h3>
                
                {/* Service Type */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Tipo de servicio</h4>
                  <p className="text-gray-600">
                    {order.tipo_servicio === 'mesa' && `Servicio en mesa ${order.mesa_numero}`}
                    {order.tipo_servicio === 'delivery' && 'Entrega a domicilio'}
                    {order.tipo_servicio === 'pickup' && 'Recoger en restaurante'}
                  </p>
                  {order.direccion && (
                    <p className="text-sm text-gray-500 mt-1">{order.direccion}</p>
                  )}
                </div>

                {/* Customer Info */}
                {order.customer && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Cliente</h4>
                    <p className="text-gray-600">{order.customer.nombre}</p>
                    <p className="text-sm text-gray-500">{order.customer.telefono}</p>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Artículos</h4>
                  <div className="space-y-2">
                    {order.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <span className="text-gray-900">{item.nombre} × {item.cantidad}</span>
                          {item.notas && (
                            <p className="text-xs text-gray-500 mt-1">{item.notas}</p>
                          )}
                        </div>
                        <span className="text-gray-600 ml-2">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${order.total?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  Actualizar estado
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/menu'}
                  variant="outline"
                  className="w-full"
                >
                  Hacer otro pedido
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
