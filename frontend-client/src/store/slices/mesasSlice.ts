// Table management and reservations
export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  estado: 'disponible' | 'ocupada' | 'reservada' | 'mantenimiento';
  ubicacion: string;
  tipo: 'interior' | 'exterior' | 'privada' | 'barra';
  observaciones?: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Reserva {
  id: number;
  mesa_id: number;
  numero_mesa: number;
  nombre_cliente: string;
  telefono: string;
  email?: string;
  fecha_reserva: string;
  hora_inicio: string;
  hora_fin: string;
  numero_personas: number;
  estado: 'pendiente' | 'confirmada' | 'en_curso' | 'finalizada' | 'cancelada' | 'no_presentado';
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

export interface MesaFilters {
  estado?: string[];
  tipo?: string[];
  ubicacion?: string[];
  capacidad_min?: number;
  capacidad_max?: number;
  disponible_fecha?: string;
  disponible_hora?: string;
}

export interface ReservaFilters {
  estado?: string[];
  fecha_desde?: string;
  fecha_hasta?: string;
  cliente?: string;
  mesa?: number;
}

export interface MesasState {
  mesas: Mesa[];
  reservas: Reserva[];
  selectedMesa: Mesa | null;
  selectedReserva: Reserva | null;
  loading: boolean;
  error: string | null;
  mesaFilters: MesaFilters;
  reservaFilters: ReservaFilters;
  availability: Record<number, boolean>; // mesa_id -> disponible
  currentOccupancy: Record<number, { pedido_id?: number; inicio?: string; personas?: number }>; // mesa ocupación actual
  realTimeUpdates: boolean;
  lastUpdate: string | null;
}

// Action types
export const MESAS_ACTION_TYPES = {
  FETCH_MESAS_START: 'mesas/fetchMesasStart',
  FETCH_MESAS_SUCCESS: 'mesas/fetchMesasSuccess',
  FETCH_MESAS_ERROR: 'mesas/fetchMesasError',
  FETCH_RESERVAS_START: 'mesas/fetchReservasStart',
  FETCH_RESERVAS_SUCCESS: 'mesas/fetchReservasSuccess',
  FETCH_RESERVAS_ERROR: 'mesas/fetchReservasError',
  CREATE_RESERVA_START: 'mesas/createReservaStart',
  CREATE_RESERVA_SUCCESS: 'mesas/createReservaSuccess',
  CREATE_RESERVA_ERROR: 'mesas/createReservaError',
  UPDATE_MESA_STATUS_START: 'mesas/updateMesaStatusStart',
  UPDATE_MESA_STATUS_SUCCESS: 'mesas/updateMesaStatusSuccess',
  UPDATE_MESA_STATUS_ERROR: 'mesas/updateMesaStatusError',
  UPDATE_RESERVA_STATUS_START: 'mesas/updateReservaStatusStart',
  UPDATE_RESERVA_STATUS_SUCCESS: 'mesas/updateReservaStatusSuccess',
  UPDATE_RESERVA_STATUS_ERROR: 'mesas/updateReservaStatusError',
  CANCEL_RESERVA_START: 'mesas/cancelReservaStart',
  CANCEL_RESERVA_SUCCESS: 'mesas/cancelReservaSuccess',
  CANCEL_RESERVA_ERROR: 'mesas/cancelReservaError',
  CHECK_AVAILABILITY_START: 'mesas/checkAvailabilityStart',
  CHECK_AVAILABILITY_SUCCESS: 'mesas/checkAvailabilitySuccess',
  CHECK_AVAILABILITY_ERROR: 'mesas/checkAvailabilityError',
  OCCUPY_MESA: 'mesas/occupyMesa',
  FREE_MESA: 'mesas/freeMesa',
  SET_SELECTED_MESA: 'mesas/setSelectedMesa',
  SET_SELECTED_RESERVA: 'mesas/setSelectedReserva',
  SET_MESA_FILTERS: 'mesas/setMesaFilters',
  SET_RESERVA_FILTERS: 'mesas/setReservaFilters',
  CLEAR_MESA_FILTERS: 'mesas/clearMesaFilters',
  CLEAR_RESERVA_FILTERS: 'mesas/clearReservaFilters',
  UPDATE_REAL_TIME: 'mesas/updateRealTime',
  SET_REAL_TIME_UPDATES: 'mesas/setRealTimeUpdates',
  RESET_ERROR: 'mesas/resetError',
} as const;

export type MesasAction =
  | { type: typeof MESAS_ACTION_TYPES.FETCH_MESAS_START }
  | { type: typeof MESAS_ACTION_TYPES.FETCH_MESAS_SUCCESS; payload: Mesa[] }
  | { type: typeof MESAS_ACTION_TYPES.FETCH_MESAS_ERROR; payload: string }
  | { type: typeof MESAS_ACTION_TYPES.FETCH_RESERVAS_START }
  | { type: typeof MESAS_ACTION_TYPES.FETCH_RESERVAS_SUCCESS; payload: Reserva[] }
  | { type: typeof MESAS_ACTION_TYPES.FETCH_RESERVAS_ERROR; payload: string }
  | { type: typeof MESAS_ACTION_TYPES.CREATE_RESERVA_START }
  | { type: typeof MESAS_ACTION_TYPES.CREATE_RESERVA_SUCCESS; payload: Reserva }
  | { type: typeof MESAS_ACTION_TYPES.CREATE_RESERVA_ERROR; payload: string }
  | { type: typeof MESAS_ACTION_TYPES.UPDATE_MESA_STATUS_START }
  | { type: typeof MESAS_ACTION_TYPES.UPDATE_MESA_STATUS_SUCCESS; payload: { id: number; estado: Mesa['estado'] } }
  | { type: typeof MESAS_ACTION_TYPES.UPDATE_MESA_STATUS_ERROR; payload: string }
  | { type: typeof MESAS_ACTION_TYPES.UPDATE_RESERVA_STATUS_START }
  | { type: typeof MESAS_ACTION_TYPES.UPDATE_RESERVA_STATUS_SUCCESS; payload: { id: number; estado: Reserva['estado'] } }
  | { type: typeof MESAS_ACTION_TYPES.UPDATE_RESERVA_STATUS_ERROR; payload: string }
  | { type: typeof MESAS_ACTION_TYPES.CANCEL_RESERVA_START }
  | { type: typeof MESAS_ACTION_TYPES.CANCEL_RESERVA_SUCCESS; payload: number }
  | { type: typeof MESAS_ACTION_TYPES.CANCEL_RESERVA_ERROR; payload: string }
  | { type: typeof MESAS_ACTION_TYPES.CHECK_AVAILABILITY_START }
  | { type: typeof MESAS_ACTION_TYPES.CHECK_AVAILABILITY_SUCCESS; payload: Record<number, boolean> }
  | { type: typeof MESAS_ACTION_TYPES.CHECK_AVAILABILITY_ERROR; payload: string }
  | { type: typeof MESAS_ACTION_TYPES.OCCUPY_MESA; payload: { mesaId: number; pedidoId?: number; personas?: number } }
  | { type: typeof MESAS_ACTION_TYPES.FREE_MESA; payload: number }
  | { type: typeof MESAS_ACTION_TYPES.SET_SELECTED_MESA; payload: Mesa | null }
  | { type: typeof MESAS_ACTION_TYPES.SET_SELECTED_RESERVA; payload: Reserva | null }
  | { type: typeof MESAS_ACTION_TYPES.SET_MESA_FILTERS; payload: Partial<MesaFilters> }
  | { type: typeof MESAS_ACTION_TYPES.SET_RESERVA_FILTERS; payload: Partial<ReservaFilters> }
  | { type: typeof MESAS_ACTION_TYPES.CLEAR_MESA_FILTERS }
  | { type: typeof MESAS_ACTION_TYPES.CLEAR_RESERVA_FILTERS }
  | { type: typeof MESAS_ACTION_TYPES.UPDATE_REAL_TIME; payload: { mesas?: Mesa[]; reservas?: Reserva[] } }
  | { type: typeof MESAS_ACTION_TYPES.SET_REAL_TIME_UPDATES; payload: boolean }
  | { type: typeof MESAS_ACTION_TYPES.RESET_ERROR };

// Initial state
export const initialMesasState: MesasState = {
  mesas: [],
  reservas: [],
  selectedMesa: null,
  selectedReserva: null,
  loading: false,
  error: null,
  mesaFilters: {},
  reservaFilters: {},
  availability: {},
  currentOccupancy: {},
  realTimeUpdates: false,
  lastUpdate: null,
};

// Reducer
export const mesasReducer = (state: MesasState = initialMesasState, action: MesasAction): MesasState => {
  switch (action.type) {
    case MESAS_ACTION_TYPES.FETCH_MESAS_START:
    case MESAS_ACTION_TYPES.FETCH_RESERVAS_START:
    case MESAS_ACTION_TYPES.CREATE_RESERVA_START:
    case MESAS_ACTION_TYPES.UPDATE_MESA_STATUS_START:
    case MESAS_ACTION_TYPES.UPDATE_RESERVA_STATUS_START:
    case MESAS_ACTION_TYPES.CANCEL_RESERVA_START:
    case MESAS_ACTION_TYPES.CHECK_AVAILABILITY_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case MESAS_ACTION_TYPES.FETCH_MESAS_SUCCESS:
      return {
        ...state,
        loading: false,
        mesas: action.payload,
        lastUpdate: new Date().toISOString(),
        error: null,
      };

    case MESAS_ACTION_TYPES.FETCH_RESERVAS_SUCCESS:
      return {
        ...state,
        loading: false,
        reservas: action.payload,
        lastUpdate: new Date().toISOString(),
        error: null,
      };

    case MESAS_ACTION_TYPES.CREATE_RESERVA_SUCCESS:
      return {
        ...state,
        loading: false,
        reservas: [action.payload, ...state.reservas],
        selectedReserva: action.payload,
        error: null,
      };

    case MESAS_ACTION_TYPES.UPDATE_MESA_STATUS_SUCCESS:
      const updatedMesas = state.mesas.map(mesa =>
        mesa.id === action.payload.id
          ? { ...mesa, estado: action.payload.estado, updated_at: new Date().toISOString() }
          : mesa
      );
      
      return {
        ...state,
        loading: false,
        mesas: updatedMesas,
        selectedMesa: state.selectedMesa?.id === action.payload.id
          ? { ...state.selectedMesa, estado: action.payload.estado, updated_at: new Date().toISOString() }
          : state.selectedMesa,
        error: null,
      };

    case MESAS_ACTION_TYPES.UPDATE_RESERVA_STATUS_SUCCESS:
      const updatedReservas = state.reservas.map(reserva =>
        reserva.id === action.payload.id
          ? { ...reserva, estado: action.payload.estado, updated_at: new Date().toISOString() }
          : reserva
      );
      
      return {
        ...state,
        loading: false,
        reservas: updatedReservas,
        selectedReserva: state.selectedReserva?.id === action.payload.id
          ? { ...state.selectedReserva, estado: action.payload.estado, updated_at: new Date().toISOString() }
          : state.selectedReserva,
        error: null,
      };

    case MESAS_ACTION_TYPES.CANCEL_RESERVA_SUCCESS:
      const cancelledReservas = state.reservas.map(reserva =>
        reserva.id === action.payload
          ? { ...reserva, estado: 'cancelada' as const, updated_at: new Date().toISOString() }
          : reserva
      );
      
      return {
        ...state,
        loading: false,
        reservas: cancelledReservas,
        selectedReserva: state.selectedReserva?.id === action.payload
          ? { ...state.selectedReserva, estado: 'cancelada', updated_at: new Date().toISOString() }
          : state.selectedReserva,
        error: null,
      };

    case MESAS_ACTION_TYPES.CHECK_AVAILABILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        availability: action.payload,
        error: null,
      };

    case MESAS_ACTION_TYPES.OCCUPY_MESA:
      return {
        ...state,
        currentOccupancy: {
          ...state.currentOccupancy,
          [action.payload.mesaId]: {
            pedido_id: action.payload.pedidoId,
            inicio: new Date().toISOString(),
            personas: action.payload.personas,
          },
        },
        mesas: state.mesas.map(mesa =>
          mesa.id === action.payload.mesaId
            ? { ...mesa, estado: 'ocupada' as const }
            : mesa
        ),
      };

    case MESAS_ACTION_TYPES.FREE_MESA:
      const { [action.payload]: removed, ...remainingOccupancy } = state.currentOccupancy;
      
      return {
        ...state,
        currentOccupancy: remainingOccupancy,
        mesas: state.mesas.map(mesa =>
          mesa.id === action.payload
            ? { ...mesa, estado: 'disponible' as const }
            : mesa
        ),
      };

    case MESAS_ACTION_TYPES.FETCH_MESAS_ERROR:
    case MESAS_ACTION_TYPES.FETCH_RESERVAS_ERROR:
    case MESAS_ACTION_TYPES.CREATE_RESERVA_ERROR:
    case MESAS_ACTION_TYPES.UPDATE_MESA_STATUS_ERROR:
    case MESAS_ACTION_TYPES.UPDATE_RESERVA_STATUS_ERROR:
    case MESAS_ACTION_TYPES.CANCEL_RESERVA_ERROR:
    case MESAS_ACTION_TYPES.CHECK_AVAILABILITY_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case MESAS_ACTION_TYPES.SET_SELECTED_MESA:
      return {
        ...state,
        selectedMesa: action.payload,
      };

    case MESAS_ACTION_TYPES.SET_SELECTED_RESERVA:
      return {
        ...state,
        selectedReserva: action.payload,
      };

    case MESAS_ACTION_TYPES.SET_MESA_FILTERS:
      return {
        ...state,
        mesaFilters: { ...state.mesaFilters, ...action.payload },
      };

    case MESAS_ACTION_TYPES.SET_RESERVA_FILTERS:
      return {
        ...state,
        reservaFilters: { ...state.reservaFilters, ...action.payload },
      };

    case MESAS_ACTION_TYPES.CLEAR_MESA_FILTERS:
      return {
        ...state,
        mesaFilters: {},
      };

    case MESAS_ACTION_TYPES.CLEAR_RESERVA_FILTERS:
      return {
        ...state,
        reservaFilters: {},
      };

    case MESAS_ACTION_TYPES.UPDATE_REAL_TIME:
      return {
        ...state,
        ...(action.payload.mesas && { mesas: action.payload.mesas }),
        ...(action.payload.reservas && { reservas: action.payload.reservas }),
        lastUpdate: new Date().toISOString(),
      };

    case MESAS_ACTION_TYPES.SET_REAL_TIME_UPDATES:
      return {
        ...state,
        realTimeUpdates: action.payload,
      };

    case MESAS_ACTION_TYPES.RESET_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Action creators
export const mesasActions = {
  fetchMesasStart: () => ({ type: MESAS_ACTION_TYPES.FETCH_MESAS_START }),
  fetchMesasSuccess: (mesas: Mesa[]) => ({ type: MESAS_ACTION_TYPES.FETCH_MESAS_SUCCESS, payload: mesas }),
  fetchMesasError: (error: string) => ({ type: MESAS_ACTION_TYPES.FETCH_MESAS_ERROR, payload: error }),
  
  fetchReservasStart: () => ({ type: MESAS_ACTION_TYPES.FETCH_RESERVAS_START }),
  fetchReservasSuccess: (reservas: Reserva[]) => ({ type: MESAS_ACTION_TYPES.FETCH_RESERVAS_SUCCESS, payload: reservas }),
  fetchReservasError: (error: string) => ({ type: MESAS_ACTION_TYPES.FETCH_RESERVAS_ERROR, payload: error }),
  
  createReservaStart: () => ({ type: MESAS_ACTION_TYPES.CREATE_RESERVA_START }),
  createReservaSuccess: (reserva: Reserva) => ({ type: MESAS_ACTION_TYPES.CREATE_RESERVA_SUCCESS, payload: reserva }),
  createReservaError: (error: string) => ({ type: MESAS_ACTION_TYPES.CREATE_RESERVA_ERROR, payload: error }),
  
  updateMesaStatusStart: () => ({ type: MESAS_ACTION_TYPES.UPDATE_MESA_STATUS_START }),
  updateMesaStatusSuccess: (id: number, estado: Mesa['estado']) => ({
    type: MESAS_ACTION_TYPES.UPDATE_MESA_STATUS_SUCCESS,
    payload: { id, estado },
  }),
  updateMesaStatusError: (error: string) => ({ type: MESAS_ACTION_TYPES.UPDATE_MESA_STATUS_ERROR, payload: error }),
  
  updateReservaStatusStart: () => ({ type: MESAS_ACTION_TYPES.UPDATE_RESERVA_STATUS_START }),
  updateReservaStatusSuccess: (id: number, estado: Reserva['estado']) => ({
    type: MESAS_ACTION_TYPES.UPDATE_RESERVA_STATUS_SUCCESS,
    payload: { id, estado },
  }),
  updateReservaStatusError: (error: string) => ({ type: MESAS_ACTION_TYPES.UPDATE_RESERVA_STATUS_ERROR, payload: error }),
  
  cancelReservaStart: () => ({ type: MESAS_ACTION_TYPES.CANCEL_RESERVA_START }),
  cancelReservaSuccess: (id: number) => ({ type: MESAS_ACTION_TYPES.CANCEL_RESERVA_SUCCESS, payload: id }),
  cancelReservaError: (error: string) => ({ type: MESAS_ACTION_TYPES.CANCEL_RESERVA_ERROR, payload: error }),
  
  checkAvailabilityStart: () => ({ type: MESAS_ACTION_TYPES.CHECK_AVAILABILITY_START }),
  checkAvailabilitySuccess: (availability: Record<number, boolean>) => ({
    type: MESAS_ACTION_TYPES.CHECK_AVAILABILITY_SUCCESS,
    payload: availability,
  }),
  checkAvailabilityError: (error: string) => ({ type: MESAS_ACTION_TYPES.CHECK_AVAILABILITY_ERROR, payload: error }),
  
  occupyMesa: (mesaId: number, pedidoId?: number, personas?: number) => ({
    type: MESAS_ACTION_TYPES.OCCUPY_MESA,
    payload: { mesaId, pedidoId, personas },
  }),
  freeMesa: (mesaId: number) => ({ type: MESAS_ACTION_TYPES.FREE_MESA, payload: mesaId }),
  
  setSelectedMesa: (mesa: Mesa | null) => ({ type: MESAS_ACTION_TYPES.SET_SELECTED_MESA, payload: mesa }),
  setSelectedReserva: (reserva: Reserva | null) => ({ type: MESAS_ACTION_TYPES.SET_SELECTED_RESERVA, payload: reserva }),
  
  setMesaFilters: (filters: Partial<MesaFilters>) => ({ type: MESAS_ACTION_TYPES.SET_MESA_FILTERS, payload: filters }),
  setReservaFilters: (filters: Partial<ReservaFilters>) => ({ type: MESAS_ACTION_TYPES.SET_RESERVA_FILTERS, payload: filters }),
  clearMesaFilters: () => ({ type: MESAS_ACTION_TYPES.CLEAR_MESA_FILTERS }),
  clearReservaFilters: () => ({ type: MESAS_ACTION_TYPES.CLEAR_RESERVA_FILTERS }),
  
  updateRealTime: (data: { mesas?: Mesa[]; reservas?: Reserva[] }) => ({
    type: MESAS_ACTION_TYPES.UPDATE_REAL_TIME,
    payload: data,
  }),
  setRealTimeUpdates: (enabled: boolean) => ({ type: MESAS_ACTION_TYPES.SET_REAL_TIME_UPDATES, payload: enabled }),
  
  resetError: () => ({ type: MESAS_ACTION_TYPES.RESET_ERROR }),
} as const;

// Selectors
export const mesasSelectors = {
  getAllMesas: (state: MesasState) => state.mesas,
  getAllReservas: (state: MesasState) => state.reservas,
  getSelectedMesa: (state: MesasState) => state.selectedMesa,
  getSelectedReserva: (state: MesasState) => state.selectedReserva,
  getLoading: (state: MesasState) => state.loading,
  getError: (state: MesasState) => state.error,
  getMesaFilters: (state: MesasState) => state.mesaFilters,
  getReservaFilters: (state: MesasState) => state.reservaFilters,
  getAvailability: (state: MesasState) => state.availability,
  getCurrentOccupancy: (state: MesasState) => state.currentOccupancy,
  isRealTimeEnabled: (state: MesasState) => state.realTimeUpdates,
  getLastUpdate: (state: MesasState) => state.lastUpdate,
  
  getMesaById: (state: MesasState, id: number) => 
    state.mesas.find(mesa => mesa.id === id),
  
  getReservaById: (state: MesasState, id: number) => 
    state.reservas.find(reserva => reserva.id === id),
  
  getAvailableMesas: (state: MesasState) =>
    state.mesas.filter(mesa => mesa.estado === 'disponible'),
  
  getOccupiedMesas: (state: MesasState) =>
    state.mesas.filter(mesa => mesa.estado === 'ocupada'),
  
  getReservedMesas: (state: MesasState) =>
    state.mesas.filter(mesa => mesa.estado === 'reservada'),
  
  getMesasByType: (state: MesasState, tipo: Mesa['tipo']) =>
    state.mesas.filter(mesa => mesa.tipo === tipo),
  
  getMesasByCapacity: (state: MesasState, minCapacity: number, maxCapacity?: number) =>
    state.mesas.filter(mesa => 
      mesa.capacidad >= minCapacity && 
      (!maxCapacity || mesa.capacidad <= maxCapacity)
    ),
  
  getTodaysReservas: (state: MesasState) => {
    const today = new Date().toISOString().split('T')[0];
    return state.reservas.filter(reserva => 
      reserva.fecha_reserva === today
    );
  },
  
  getActiveReservas: (state: MesasState) =>
    state.reservas.filter(reserva => 
      ['confirmada', 'en_curso'].includes(reserva.estado)
    ),
  
  getReservasByStatus: (state: MesasState, estado: Reserva['estado']) =>
    state.reservas.filter(reserva => reserva.estado === estado),
  
  getMesaOccupancy: (state: MesasState, mesaId: number) =>
    state.currentOccupancy[mesaId] || null,
  
  isMesaAvailable: (state: MesasState, mesaId: number) =>
    state.availability[mesaId] !== false && 
    state.mesas.find(m => m.id === mesaId)?.estado === 'disponible',
  
  getFilteredMesas: (state: MesasState) => {
    let filtered = state.mesas;
    const filters = state.mesaFilters;
    
    if (filters.estado?.length) {
      filtered = filtered.filter(m => filters.estado!.includes(m.estado));
    }
    
    if (filters.tipo?.length) {
      filtered = filtered.filter(m => filters.tipo!.includes(m.tipo));
    }
    
    if (filters.ubicacion?.length) {
      filtered = filtered.filter(m => filters.ubicacion!.includes(m.ubicacion));
    }
    
    if (filters.capacidad_min) {
      filtered = filtered.filter(m => m.capacidad >= filters.capacidad_min!);
    }
    
    if (filters.capacidad_max) {
      filtered = filtered.filter(m => m.capacidad <= filters.capacidad_max!);
    }
    
    return filtered;
  },
  
  getFilteredReservas: (state: MesasState) => {
    let filtered = state.reservas;
    const filters = state.reservaFilters;
    
    if (filters.estado?.length) {
      filtered = filtered.filter(r => filters.estado!.includes(r.estado));
    }
    
    if (filters.cliente) {
      filtered = filtered.filter(r => 
        r.nombre_cliente.toLowerCase().includes(filters.cliente!.toLowerCase())
      );
    }
    
    if (filters.mesa) {
      filtered = filtered.filter(r => r.numero_mesa === filters.mesa);
    }
    
    if (filters.fecha_desde) {
      filtered = filtered.filter(r => r.fecha_reserva >= filters.fecha_desde!);
    }
    
    if (filters.fecha_hasta) {
      filtered = filtered.filter(r => r.fecha_reserva <= filters.fecha_hasta!);
    }
    
    return filtered;
  },
  
  getMesaStats: (state: MesasState) => {
    const mesas = state.mesas;
    return {
      total: mesas.length,
      disponible: mesas.filter(m => m.estado === 'disponible').length,
      ocupada: mesas.filter(m => m.estado === 'ocupada').length,
      reservada: mesas.filter(m => m.estado === 'reservada').length,
      mantenimiento: mesas.filter(m => m.estado === 'mantenimiento').length,
      capacidadTotal: mesas.reduce((sum, mesa) => sum + mesa.capacidad, 0),
      ocupancyRate: mesas.length > 0 
        ? (mesas.filter(m => m.estado === 'ocupada').length / mesas.length) * 100 
        : 0,
    };
  },
};

export default mesasReducer;
