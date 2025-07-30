import React from 'react';
import { CartItem, Pedido } from '../../types';
import { cn } from '../../utils/cn';

export interface OrderSummaryProps {
  /**
   * Elementos del carrito/pedido
   */
  items: CartItem[];
  
  /**
   * Total del pedido
   */
  total: number;
  
  /**
   * Subtotal antes de impuestos/descuentos
   */
  subtotal?: number;
  
  /**
   * Impuestos aplicados
   */
  impuestos?: number;
  
  /**
   * Descuentos aplicados
   */
  descuento?: number;
  
  /**
   * Costo de entrega
   */
  costoEntrega?: number;
  
  /**
   * Información adicional del pedido
   */
  pedido?: Partial<Pedido>;
  
  /**
   * Mostrar detalles expandidos
   */
  showDetails?: boolean;
  
  /**
   * Editable (permite modificar cantidades)
   */
  editable?: boolean;
  
  /**
   * Variante del estilo
   */
  variant?: 'default' | 'compact' | 'detailed' | 'checkout';
  
  /**
   * Funciones para editar items
   */
  onUpdateQuantity?: (itemId: string, cantidad: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onUpdateNotes?: (itemId: string, notas: string) => void;
  
  /**
   * Función cuando se hace click en un item
   */
  onItemClick?: (item: CartItem) => void;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
  
  /**
   * Mostrar acciones de edición
   */
  showActions?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  total,
  subtotal,
  impuestos = 0,
  descuento = 0,
  costoEntrega = 0,
  pedido,
  showDetails = true,
  editable = false,
  variant = 'default',
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  onItemClick,
  className,
  showActions = true,
}) => {
  const calculatedSubtotal = subtotal || items.reduce((sum, item) => sum + item.subtotal, 0);
  const finalTotal = calculatedSubtotal + impuestos + costoEntrega - descuento;

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem?.(itemId);
    } else {
      onUpdateQuantity?.(itemId, newQuantity);
    }
  };

  const renderItemActions = (item: CartItem) => {
    if (!editable || !showActions) return null;

    return (
      <div className="flex items-center space-x-2 mt-2">
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
            className="px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-l-lg"
            disabled={item.cantidad <= 1}
          >
            −
          </button>
          <span className="px-3 py-1 text-sm font-medium border-x">
            {item.cantidad}
          </span>
          <button
            onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
            className="px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-r-lg"
          >
            +
          </button>
        </div>
        
        <button
          onClick={() => onRemoveItem?.(item.id)}
          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
          title="Eliminar item"
        >
          🗑️
        </button>
      </div>
    );
  };

  const renderNotes = (item: CartItem) => {
    if (!item.notas) return null;

    if (editable) {
      return (
        <textarea
          value={item.notas}
          onChange={(e) => onUpdateNotes?.(item.id, e.target.value)}
          placeholder="Notas especiales..."
          className="w-full mt-2 p-2 text-xs border border-gray-300 rounded resize-none"
          rows={2}
        />
      );
    }

    return (
      <p className="text-xs text-gray-600 mt-1 italic">
        Nota: {item.notas}
      </p>
    );
  };

  const renderItem = (item: CartItem, index: number) => {
    const isCompact = variant === 'compact';
    
    return (
      <div
        key={item.id}
        onClick={() => onItemClick?.(item)}
        className={cn(
          'flex justify-between items-start py-3',
          onItemClick && 'cursor-pointer hover:bg-gray-50',
          index !== items.length - 1 && 'border-b border-gray-100'
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={cn(
                'font-medium text-gray-900 truncate',
                isCompact ? 'text-sm' : 'text-base'
              )}>
                {item.menuItem.nombre}
              </h4>
              
              {!isCompact && item.menuItem.descripcion && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.menuItem.descripcion}
                </p>
              )}
              
              <div className={cn(
                'flex items-center space-x-4 mt-1',
                isCompact ? 'text-xs' : 'text-sm'
              )}>
                <span className="text-gray-600">
                  Cantidad: <span className="font-medium">{item.cantidad}</span>
                </span>
                <span className="text-gray-600">
                  Precio: <span className="font-medium">{formatPrice(item.menuItem.precio)}</span>
                </span>
              </div>
              
              {renderNotes(item)}
              {renderItemActions(item)}
            </div>
            
            <div className="ml-4 text-right">
              <p className={cn(
                'font-semibold text-gray-900',
                isCompact ? 'text-sm' : 'text-lg'
              )}>
                {formatPrice(item.subtotal)}
              </p>
              {item.cantidad > 1 && !isCompact && (
                <p className="text-xs text-gray-500">
                  {item.cantidad} × {formatPrice(item.menuItem.precio)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTotals = () => {
    const showBreakdown = showDetails && (impuestos > 0 || descuento > 0 || costoEntrega > 0);
    
    return (
      <div className={cn(
        'border-t border-gray-200 pt-4',
        variant === 'checkout' && 'bg-gray-50 p-4 rounded-lg'
      )}>
        {showBreakdown && (
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(calculatedSubtotal)}</span>
            </div>
            
            {impuestos > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Impuestos</span>
                <span>{formatPrice(impuestos)}</span>
              </div>
            )}
            
            {costoEntrega > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Costo de entrega</span>
                <span>{formatPrice(costoEntrega)}</span>
              </div>
            )}
            
            {descuento > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento</span>
                <span>-{formatPrice(descuento)}</span>
              </div>
            )}
            
            <hr className="border-gray-200" />
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className={cn(
            'font-semibold text-gray-900',
            variant === 'compact' ? 'text-lg' : 'text-xl'
          )}>
            Total
          </span>
          <span className={cn(
            'font-bold text-gray-900',
            variant === 'compact' ? 'text-lg' : 'text-2xl'
          )}>
            {formatPrice(total || finalTotal)}
          </span>
        </div>
      </div>
    );
  };

  const renderPedidoInfo = () => {
    if (!pedido || variant === 'compact') return null;

    return (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Información del Pedido</h3>
        <div className="space-y-1 text-sm text-blue-800">
          {pedido.id && (
            <div>Número de pedido: <span className="font-medium">#{pedido.id}</span></div>
          )}
          {pedido.mesa_id && (
            <div>Mesa: <span className="font-medium">#{pedido.mesa_id}</span></div>
          )}
          {pedido.estado && (
            <div>Estado: <span className="font-medium">{pedido.estado}</span></div>
          )}
          {pedido.tiempo_estimado && (
            <div>Tiempo estimado: <span className="font-medium">{pedido.tiempo_estimado} min</span></div>
          )}
        </div>
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <div className={cn(
        'text-center py-8',
        variant === 'compact' && 'py-4',
        className
      )}>
        <div className={cn(
          'text-gray-400 mb-2',
          variant === 'compact' ? 'text-4xl' : 'text-6xl'
        )}>
          🛒
        </div>
        <h3 className={cn(
          'font-medium text-gray-900 mb-1',
          variant === 'compact' ? 'text-base' : 'text-lg'
        )}>
          {variant === 'checkout' ? 'No hay items en el pedido' : 'Carrito vacío'}
        </h3>
        <p className={cn(
          'text-gray-500',
          variant === 'compact' ? 'text-xs' : 'text-sm'
        )}>
          {variant === 'checkout' 
            ? 'Agrega algunos items para continuar'
            : 'Agrega items del menú para comenzar'
          }
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-white',
      variant === 'checkout' && 'border border-gray-200 rounded-lg p-4',
      className
    )}>
      {renderPedidoInfo()}
      
      <div className={cn(
        'space-y-0',
        variant !== 'compact' && 'max-h-96 overflow-y-auto'
      )}>
        <div className="mb-4">
          <h3 className={cn(
            'font-semibold text-gray-900 mb-3',
            variant === 'compact' ? 'text-base' : 'text-lg'
          )}>
            {variant === 'checkout' ? 'Resumen del Pedido' : 'Items del Carrito'}
            <span className="text-gray-500 ml-2">({items.length})</span>
          </h3>
        </div>
        
        <div>
          {items.map(renderItem)}
        </div>
      </div>
      
      {renderTotals()}
    </div>
  );
};

export default OrderSummary;
