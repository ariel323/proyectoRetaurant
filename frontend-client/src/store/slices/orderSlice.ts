// Order management and tracking
export interface OrderItem {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  observaciones?: string;
  modificaciones?: Array<{
    id: number;
    nombre: string;
    precio_adicional: number;
  }>;
  imagen?: string;
  categoria?: string;
}

export interface Pedido {
  id: number;
  numero_pedido: string;
  fecha_pedido: string;
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
  tipo_servicio: 'mesa' | 'delivery' | 'takeaway';
  mesa_id?: number;
  numero_mesa?: number;
  direccion_entrega?: string;
  telefono_contacto: string;
  nombre_cliente: string;
  email_cliente?: string;
  items: OrderItem[];
  subtotal: number;
  descuento: number;
  propina: number;
  total: number;
  tiempo_estimado?: number;
  observaciones?: string;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'wallet';
  created_at: string;
  updated_at: string;
  historial_estados?: Array<{
    estado: string;
    fecha: string;
    observacion?: string;
  }>;
}

export interface OrderFilters {
  estado?: string[];
  tipo_servicio?: string[];
  fecha_desde?: string;
  fecha_hasta?: string;
  numero_pedido?: string;
  cliente?: string;
  mesa?: number;
}

export interface OrderState {
  pedidos: Pedido[];
  currentOrder: Pedido | null;
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  realTimeUpdates: boolean;
  lastUpdate: string | null;
  trackingPolling: boolean;
  estimatedTimes: Record<number, number>; // pedido_id -> tiempo estimado en minutos
}

// Action types
export const ORDER_ACTION_TYPES = {
  FETCH_ORDERS_START: 'orders/fetchOrdersStart',
  FETCH_ORDERS_SUCCESS: 'orders/fetchOrdersSuccess',
  FETCH_ORDERS_ERROR: 'orders/fetchOrdersError',
  FETCH_ORDER_START: 'orders/fetchOrderStart',
  FETCH_ORDER_SUCCESS: 'orders/fetchOrderSuccess',
  FETCH_ORDER_ERROR: 'orders/fetchOrderError',
  CREATE_ORDER_START: 'orders/createOrderStart',
  CREATE_ORDER_SUCCESS: 'orders/createOrderSuccess',
  CREATE_ORDER_ERROR: 'orders/createOrderError',
  UPDATE_ORDER_STATUS_START: 'orders/updateOrderStatusStart',
  UPDATE_ORDER_STATUS_SUCCESS: 'orders/updateOrderStatusSuccess',
  UPDATE_ORDER_STATUS_ERROR: 'orders/updateOrderStatusError',
  CANCEL_ORDER_START: 'orders/cancelOrderStart',
  CANCEL_ORDER_SUCCESS: 'orders/cancelOrderSuccess',
  CANCEL_ORDER_ERROR: 'orders/cancelOrderError',
  SET_CURRENT_ORDER: 'orders/setCurrentOrder',
  CLEAR_CURRENT_ORDER: 'orders/clearCurrentOrder',
  SET_FILTERS: 'orders/setFilters',
  CLEAR_FILTERS: 'orders/clearFilters',
  SET_PAGINATION: 'orders/setPagination',
  UPDATE_REAL_TIME: 'orders/updateRealTime',
  SET_REAL_TIME_UPDATES: 'orders/setRealTimeUpdates',
  START_TRACKING_POLLING: 'orders/startTrackingPolling',
  STOP_TRACKING_POLLING: 'orders/stopTrackingPolling',
  UPDATE_ESTIMATED_TIME: 'orders/updateEstimatedTime',
  RESET_ERROR: 'orders/resetError',
} as const;

export type OrderAction =
  | { type: typeof ORDER_ACTION_TYPES.FETCH_ORDERS_START }
  | { type: typeof ORDER_ACTION_TYPES.FETCH_ORDERS_SUCCESS; payload: { pedidos: Pedido[]; pagination: any } }
  | { type: typeof ORDER_ACTION_TYPES.FETCH_ORDERS_ERROR; payload: string }
  | { type: typeof ORDER_ACTION_TYPES.FETCH_ORDER_START }
  | { type: typeof ORDER_ACTION_TYPES.FETCH_ORDER_SUCCESS; payload: Pedido }
  | { type: typeof ORDER_ACTION_TYPES.FETCH_ORDER_ERROR; payload: string }
  | { type: typeof ORDER_ACTION_TYPES.CREATE_ORDER_START }
  | { type: typeof ORDER_ACTION_TYPES.CREATE_ORDER_SUCCESS; payload: Pedido }
  | { type: typeof ORDER_ACTION_TYPES.CREATE_ORDER_ERROR; payload: string }
  | { type: typeof ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS_START }
  | { type: typeof ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS_SUCCESS; payload: { id: number; estado: string; historial?: any } }
  | { type: typeof ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS_ERROR; payload: string }
  | { type: typeof ORDER_ACTION_TYPES.CANCEL_ORDER_START }
  | { type: typeof ORDER_ACTION_TYPES.CANCEL_ORDER_SUCCESS; payload: number }
  | { type: typeof ORDER_ACTION_TYPES.CANCEL_ORDER_ERROR; payload: string }
  | { type: typeof ORDER_ACTION_TYPES.SET_CURRENT_ORDER; payload: Pedido | null }
  | { type: typeof ORDER_ACTION_TYPES.CLEAR_CURRENT_ORDER }
  | { type: typeof ORDER_ACTION_TYPES.SET_FILTERS; payload: Partial<OrderFilters> }
  | { type: typeof ORDER_ACTION_TYPES.CLEAR_FILTERS }
  | { type: typeof ORDER_ACTION_TYPES.SET_PAGINATION; payload: Partial<OrderState['pagination']> }
  | { type: typeof ORDER_ACTION_TYPES.UPDATE_REAL_TIME; payload: Pedido }
  | { type: typeof ORDER_ACTION_TYPES.SET_REAL_TIME_UPDATES; payload: boolean }
  | { type: typeof ORDER_ACTION_TYPES.START_TRACKING_POLLING }
  | { type: typeof ORDER_ACTION_TYPES.STOP_TRACKING_POLLING }
  | { type: typeof ORDER_ACTION_TYPES.UPDATE_ESTIMATED_TIME; payload: { pedidoId: number; tiempo: number } }
  | { type: typeof ORDER_ACTION_TYPES.RESET_ERROR };

// Initial state
export const initialOrderState: OrderState = {
  pedidos: [],
  currentOrder: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  realTimeUpdates: false,
  lastUpdate: null,
  trackingPolling: false,
  estimatedTimes: {},
};

// Reducer
export const orderReducer = (state: OrderState = initialOrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case ORDER_ACTION_TYPES.FETCH_ORDERS_START:
    case ORDER_ACTION_TYPES.FETCH_ORDER_START:
    case ORDER_ACTION_TYPES.CREATE_ORDER_START:
    case ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS_START:
    case ORDER_ACTION_TYPES.CANCEL_ORDER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ORDER_ACTION_TYPES.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        pedidos: action.payload.pedidos,
        pagination: { ...state.pagination, ...action.payload.pagination },
        lastUpdate: new Date().toISOString(),
        error: null,
      };

    case ORDER_ACTION_TYPES.FETCH_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentOrder: action.payload,
        error: null,
      };

    case ORDER_ACTION_TYPES.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        pedidos: [action.payload, ...state.pedidos],
        currentOrder: action.payload,
        error: null,
      };

    case ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS_SUCCESS:
      const updatedPedidos = state.pedidos.map(pedido =>
        pedido.id === action.payload.id
          ? {
              ...pedido,
              estado: action.payload.estado as Pedido['estado'],
              historial_estados: action.payload.historial || pedido.historial_estados,
              updated_at: new Date().toISOString(),
            }
          : pedido
      );
      
      return {
        ...state,
        loading: false,
        pedidos: updatedPedidos,
        currentOrder: state.currentOrder?.id === action.payload.id
          ? {
              ...state.currentOrder,
              estado: action.payload.estado as Pedido['estado'],
              historial_estados: action.payload.historial || state.currentOrder.historial_estados,
              updated_at: new Date().toISOString(),
            }
          : state.currentOrder,
        error: null,
      };

    case ORDER_ACTION_TYPES.CANCEL_ORDER_SUCCESS:
      const cancelledPedidos = state.pedidos.map(pedido =>
        pedido.id === action.payload
          ? { ...pedido, estado: 'cancelado' as const, updated_at: new Date().toISOString() }
          : pedido
      );
      
      return {
        ...state,
        loading: false,
        pedidos: cancelledPedidos,
        currentOrder: state.currentOrder?.id === action.payload
          ? { ...state.currentOrder, estado: 'cancelado', updated_at: new Date().toISOString() }
          : state.currentOrder,
        error: null,
      };

    case ORDER_ACTION_TYPES.FETCH_ORDERS_ERROR:
    case ORDER_ACTION_TYPES.FETCH_ORDER_ERROR:
    case ORDER_ACTION_TYPES.CREATE_ORDER_ERROR:
    case ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS_ERROR:
    case ORDER_ACTION_TYPES.CANCEL_ORDER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ORDER_ACTION_TYPES.SET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
      };

    case ORDER_ACTION_TYPES.CLEAR_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: null,
      };

    case ORDER_ACTION_TYPES.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case ORDER_ACTION_TYPES.CLEAR_FILTERS:
      return {
        ...state,
        filters: {},
      };

    case ORDER_ACTION_TYPES.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case ORDER_ACTION_TYPES.UPDATE_REAL_TIME:
      const existingIndex = state.pedidos.findIndex(p => p.id === action.payload.id);
      const updatedPedidosRT = existingIndex >= 0
        ? state.pedidos.map(p => p.id === action.payload.id ? action.payload : p)
        : [action.payload, ...state.pedidos];

      return {
        ...state,
        pedidos: updatedPedidosRT,
        currentOrder: state.currentOrder?.id === action.payload.id ? action.payload : state.currentOrder,
        lastUpdate: new Date().toISOString(),
      };

    case ORDER_ACTION_TYPES.SET_REAL_TIME_UPDATES:
      return {
        ...state,
        realTimeUpdates: action.payload,
      };

    case ORDER_ACTION_TYPES.START_TRACKING_POLLING:
      return {
        ...state,
        trackingPolling: true,
      };

    case ORDER_ACTION_TYPES.STOP_TRACKING_POLLING:
      return {
        ...state,
        trackingPolling: false,
      };

    case ORDER_ACTION_TYPES.UPDATE_ESTIMATED_TIME:
      return {
        ...state,
        estimatedTimes: {
          ...state.estimatedTimes,
          [action.payload.pedidoId]: action.payload.tiempo,
        },
      };

    case ORDER_ACTION_TYPES.RESET_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Action creators
export const orderActions = {
  fetchOrdersStart: () => ({ type: ORDER_ACTION_TYPES.FETCH_ORDERS_START }),
  fetchOrdersSuccess: (pedidos: Pedido[], pagination: any) => ({
    type: ORDER_ACTION_TYPES.FETCH_ORDERS_SUCCESS,
    payload: { pedidos, pagination },
  }),
  fetchOrdersError: (error: string) => ({ type: ORDER_ACTION_TYPES.FETCH_ORDERS_ERROR, payload: error }),
  
  fetchOrderStart: () => ({ type: ORDER_ACTION_TYPES.FETCH_ORDER_START }),
  fetchOrderSuccess: (pedido: Pedido) => ({ type: ORDER_ACTION_TYPES.FETCH_ORDER_SUCCESS, payload: pedido }),
  fetchOrderError: (error: string) => ({ type: ORDER_ACTION_TYPES.FETCH_ORDER_ERROR, payload: error }),
  
  createOrderStart: () => ({ type: ORDER_ACTION_TYPES.CREATE_ORDER_START }),
  createOrderSuccess: (pedido: Pedido) => ({ type: ORDER_ACTION_TYPES.CREATE_ORDER_SUCCESS, payload: pedido }),
  createOrderError: (error: string) => ({ type: ORDER_ACTION_TYPES.CREATE_ORDER_ERROR, payload: error }),
  
  updateOrderStatusStart: () => ({ type: ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS_START }),
  updateOrderStatusSuccess: (id: number, estado: string, historial?: any) => ({
    type: ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS_SUCCESS,
    payload: { id, estado, historial },
  }),
  updateOrderStatusError: (error: string) => ({ type: ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS_ERROR, payload: error }),
  
  cancelOrderStart: () => ({ type: ORDER_ACTION_TYPES.CANCEL_ORDER_START }),
  cancelOrderSuccess: (id: number) => ({ type: ORDER_ACTION_TYPES.CANCEL_ORDER_SUCCESS, payload: id }),
  cancelOrderError: (error: string) => ({ type: ORDER_ACTION_TYPES.CANCEL_ORDER_ERROR, payload: error }),
  
  setCurrentOrder: (pedido: Pedido | null) => ({ type: ORDER_ACTION_TYPES.SET_CURRENT_ORDER, payload: pedido }),
  clearCurrentOrder: () => ({ type: ORDER_ACTION_TYPES.CLEAR_CURRENT_ORDER }),
  
  setFilters: (filters: Partial<OrderFilters>) => ({ type: ORDER_ACTION_TYPES.SET_FILTERS, payload: filters }),
  clearFilters: () => ({ type: ORDER_ACTION_TYPES.CLEAR_FILTERS }),
  
  setPagination: (pagination: Partial<OrderState['pagination']>) => ({ type: ORDER_ACTION_TYPES.SET_PAGINATION, payload: pagination }),
  
  updateRealTime: (pedido: Pedido) => ({ type: ORDER_ACTION_TYPES.UPDATE_REAL_TIME, payload: pedido }),
  setRealTimeUpdates: (enabled: boolean) => ({ type: ORDER_ACTION_TYPES.SET_REAL_TIME_UPDATES, payload: enabled }),
  
  startTrackingPolling: () => ({ type: ORDER_ACTION_TYPES.START_TRACKING_POLLING }),
  stopTrackingPolling: () => ({ type: ORDER_ACTION_TYPES.STOP_TRACKING_POLLING }),
  
  updateEstimatedTime: (pedidoId: number, tiempo: number) => ({
    type: ORDER_ACTION_TYPES.UPDATE_ESTIMATED_TIME,
    payload: { pedidoId, tiempo },
  }),
  
  resetError: () => ({ type: ORDER_ACTION_TYPES.RESET_ERROR }),
} as const;

// Selectors
export const orderSelectors = {
  getAllOrders: (state: OrderState) => state.pedidos,
  getCurrentOrder: (state: OrderState) => state.currentOrder,
  getLoading: (state: OrderState) => state.loading,
  getError: (state: OrderState) => state.error,
  getFilters: (state: OrderState) => state.filters,
  getPagination: (state: OrderState) => state.pagination,
  getLastUpdate: (state: OrderState) => state.lastUpdate,
  isRealTimeEnabled: (state: OrderState) => state.realTimeUpdates,
  isTrackingPolling: (state: OrderState) => state.trackingPolling,
  
  getOrderById: (state: OrderState, id: number) => 
    state.pedidos.find(pedido => pedido.id === id),
  
  getOrdersByStatus: (state: OrderState, status: Pedido['estado']) =>
    state.pedidos.filter(pedido => pedido.estado === status),
  
  getActiveOrders: (state: OrderState) =>
    state.pedidos.filter(pedido => 
      !['entregado', 'cancelado'].includes(pedido.estado)
    ),
  
  getOrdersByServiceType: (state: OrderState, tipo: Pedido['tipo_servicio']) =>
    state.pedidos.filter(pedido => pedido.tipo_servicio === tipo),
  
  getTodaysOrders: (state: OrderState) => {
    const today = new Date().toISOString().split('T')[0];
    return state.pedidos.filter(pedido => 
      pedido.fecha_pedido.startsWith(today)
    );
  },
  
  getEstimatedTime: (state: OrderState, pedidoId: number) =>
    state.estimatedTimes[pedidoId] || null,
  
  getFilteredOrders: (state: OrderState) => {
    let filtered = state.pedidos;
    
    if (state.filters.estado?.length) {
      filtered = filtered.filter(p => state.filters.estado!.includes(p.estado));
    }
    
    if (state.filters.tipo_servicio?.length) {
      filtered = filtered.filter(p => state.filters.tipo_servicio!.includes(p.tipo_servicio));
    }
    
    if (state.filters.numero_pedido) {
      filtered = filtered.filter(p => 
        p.numero_pedido.toLowerCase().includes(state.filters.numero_pedido!.toLowerCase())
      );
    }
    
    if (state.filters.cliente) {
      filtered = filtered.filter(p => 
        p.nombre_cliente.toLowerCase().includes(state.filters.cliente!.toLowerCase())
      );
    }
    
    if (state.filters.mesa) {
      filtered = filtered.filter(p => p.numero_mesa === state.filters.mesa);
    }
    
    if (state.filters.fecha_desde) {
      filtered = filtered.filter(p => p.fecha_pedido >= state.filters.fecha_desde!);
    }
    
    if (state.filters.fecha_hasta) {
      filtered = filtered.filter(p => p.fecha_pedido <= state.filters.fecha_hasta!);
    }
    
    return filtered;
  },
  
  getOrderStats: (state: OrderState) => {
    const orders = state.pedidos;
    return {
      total: orders.length,
      pending: orders.filter(p => p.estado === 'pendiente').length,
      confirmed: orders.filter(p => p.estado === 'confirmado').length,
      preparing: orders.filter(p => p.estado === 'preparando').length,
      ready: orders.filter(p => p.estado === 'listo').length,
      delivered: orders.filter(p => p.estado === 'entregado').length,
      cancelled: orders.filter(p => p.estado === 'cancelado').length,
      totalValue: orders.reduce((sum, order) => sum + order.total, 0),
    };
  },
};

export default orderReducer;
