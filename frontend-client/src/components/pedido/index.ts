// Export all pedido components
export { default as CheckoutContainer } from './CheckoutContainer';
export { default as CustomerForm } from './CustomerForm';
export { default as DeliveryOptions } from './DeliveryOptions';
export { default as OrderConfirmation } from './OrderConfirmation';
export { default as OrderStatus } from './OrderStatus';
export { default as OrderSteps } from './OrderSteps';
export { default as OrderSummary } from './OrderSummary';
export { default as OrderTimer } from './OrderTimer';
export { default as OrderTracking } from './OrderTracking';
export { default as PaymentInfo } from './PaymentInfo';

// Re-export types
export type { CustomerFormProps } from './CustomerForm';

// Utility functions for pedido management
export const pedidoUtils = {
  /**
   * Get color class for pedido status
   */
  getStatusColor: (estado: 'PENDIENTE' | 'CONFIRMADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO') => {
    const colors = {
      PENDIENTE: 'yellow',
      CONFIRMADO: 'blue',
      PREPARANDO: 'orange',
      LISTO: 'green',
      ENTREGADO: 'green',
      CANCELADO: 'red'
    };
    return colors[estado];
  },

  /**
   * Get status label in Spanish
   */
  getStatusLabel: (estado: 'PENDIENTE' | 'CONFIRMADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO') => {
    const labels = {
      PENDIENTE: 'Pendiente',
      CONFIRMADO: 'Confirmado',
      PREPARANDO: 'En Preparación',
      LISTO: 'Listo',
      ENTREGADO: 'Entregado',
      CANCELADO: 'Cancelado'
    };
    return labels[estado];
  },

  /**
   * Check if status is active (can be updated)
   */
  isStatusActive: (estado: 'PENDIENTE' | 'CONFIRMADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO') => {
    return ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'LISTO'].includes(estado);
  },

  /**
   * Get next possible status transitions
   */
  getNextStatuses: (currentStatus: 'PENDIENTE' | 'CONFIRMADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO') => {
    const transitions = {
      PENDIENTE: ['CONFIRMADO', 'CANCELADO'],
      CONFIRMADO: ['PREPARANDO', 'CANCELADO'],
      PREPARANDO: ['LISTO', 'CANCELADO'],
      LISTO: ['ENTREGADO'],
      ENTREGADO: [],
      CANCELADO: []
    };
    return transitions[currentStatus] || [];
  },

  /**
   * Calculate estimated completion time
   */
  getEstimatedCompletionTime: (createdAt: string, estimatedMinutes: number = 25) => {
    const created = new Date(createdAt);
    const completion = new Date(created.getTime() + estimatedMinutes * 60000);
    return completion;
  },

  /**
   * Format time remaining
   */
  formatTimeRemaining: (targetTime: Date) => {
    const now = new Date();
    const diff = targetTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Tiempo agotado';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  /**
   * Calculate order total with taxes and fees
   */
  calculateOrderTotal: (subtotal: number, tax: number = 0.1, deliveryFee: number = 0) => {
    const taxAmount = subtotal * tax;
    return {
      subtotal,
      tax: taxAmount,
      deliveryFee,
      total: subtotal + taxAmount + deliveryFee
    };
  },

  /**
   * Validate customer form data
   */
  validateCustomer: (customer: { nombre?: string; telefono?: string; email?: string }) => {
    const errors: Record<string, string> = {};
    
    if (!customer.nombre?.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!customer.telefono?.trim()) {
      errors.telefono = 'El teléfono es requerido';
    } else if (!/^[+]?[\d\s\-()]{10,}$/.test(customer.telefono)) {
      errors.telefono = 'Formato de teléfono inválido';
    }
    
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errors.email = 'Formato de email inválido';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Generate order summary text
   */
  generateOrderSummary: (items: Array<{ menuItem: { nombre: string; precio: number }; cantidad: number; notas?: string }>) => {
    const summary = items.map(item => {
      const base = `${item.cantidad}x ${item.menuItem.nombre} - $${(item.menuItem.precio * item.cantidad).toFixed(2)}`;
      return item.notas ? `${base} (${item.notas})` : base;
    }).join('\n');
    
    const total = items.reduce((sum, item) => sum + (item.menuItem.precio * item.cantidad), 0);
    
    return `${summary}\n\nTotal: $${total.toFixed(2)}`;
  },

  /**
   * Format phone number for display
   */
  formatPhoneNumber: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  },

  /**
   * Get payment method icon
   */
  getPaymentMethodIcon: (method: 'efectivo' | 'tarjeta' | 'transferencia') => {
    const icons = {
      efectivo: '💵',
      tarjeta: '💳',
      transferencia: '📱'
    };
    return icons[method];
  },

  /**
   * Check if order can be cancelled
   */
  canCancelOrder: (estado: 'PENDIENTE' | 'CONFIRMADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO') => {
    return ['PENDIENTE', 'CONFIRMADO'].includes(estado);
  },

  /**
   * Get order progress percentage
   */
  getOrderProgress: (estado: 'PENDIENTE' | 'CONFIRMADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO') => {
    const progress = {
      PENDIENTE: 10,
      CONFIRMADO: 25,
      PREPARANDO: 60,
      LISTO: 90,
      ENTREGADO: 100,
      CANCELADO: 0
    };
    return progress[estado];
  }
};

// Constants
export const PEDIDO_CONSTANTS = {
  STATUS: {
    PENDIENTE: 'PENDIENTE',
    CONFIRMADO: 'CONFIRMADO',
    PREPARANDO: 'PREPARANDO',
    LISTO: 'LISTO',
    ENTREGADO: 'ENTREGADO',
    CANCELADO: 'CANCELADO'
  } as const,
  
  PAYMENT_METHODS: {
    EFECTIVO: 'efectivo',
    TARJETA: 'tarjeta',
    TRANSFERENCIA: 'transferencia'
  } as const,
  
  DEFAULT_ESTIMATED_TIME: 25, // minutes
  
  MAX_ITEMS_PER_ORDER: 50,
  
  MIN_ORDER_AMOUNT: 5.00,
  
  PHONE_REGEX: /^[+]?[\d\s\-()]{10,}$/,
  
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;
