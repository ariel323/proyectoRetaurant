import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Toast, { ToastProps } from './Toast';
import { cn } from '../../utils/cn';

interface ToastState {
  toasts: ToastProps[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: ToastProps }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'CLEAR_TOASTS' }
  | { type: 'UPDATE_TOAST'; payload: { id: string; updates: Partial<ToastProps> } };

interface ToastContextType {
  /**
   * Lista de toasts activos
   */
  toasts: ToastProps[];
  
  /**
   * Agregar un nuevo toast
   */
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  
  /**
   * Remover un toast por ID
   */
  removeToast: (id: string) => void;
  
  /**
   * Limpiar todos los toasts
   */
  clearToasts: () => void;
  
  /**
   * Actualizar un toast existente
   */
  updateToast: (id: string, updates: Partial<ToastProps>) => void;
  
  /**
   * Métodos de conveniencia para diferentes tipos
   */
  success: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => string;
  error: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => string;
  warning: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => string;
  info: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => string;
}

interface ToastContainerProps {
  /**
   * Posición global de los toasts
   */
  position?: ToastProps['position'];
  
  /**
   * Máximo número de toasts visibles
   */
  maxToasts?: number;
  
  /**
   * Duración por defecto (ms)
   */
  defaultDuration?: number;
  
  /**
   * Configuración por defecto para todos los toasts
   */
  defaultToastProps?: Partial<ToastProps>;
  
  /**
   * Espaciado entre toasts
   */
  spacing?: 'sm' | 'md' | 'lg';
  
  /**
   * Z-index del contenedor
   */
  zIndex?: number;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Contenedor personalizado para el portal
   */
  container?: Element;
}

interface ToastProviderProps extends ToastContainerProps {
  children: React.ReactNode;
}

// Reducer para manejar el estado de los toasts
const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };
    
    case 'CLEAR_TOASTS':
      return {
        ...state,
        toasts: [],
      };
    
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === action.payload.id
            ? { ...toast, ...action.payload.updates }
            : toast
        ),
      };
    
    default:
      return state;
  }
};

// Contexto de toasts
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Generador de IDs únicos
const generateId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Componente ToastContainer - Contenedor que renderiza todos los toasts
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  maxToasts = 5,
  spacing = 'md',
  zIndex = 9999,
  className,
  container,
}) => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('ToastContainer debe usarse dentro de ToastProvider');
  }

  const { toasts, removeToast } = context;

  // Limitar el número de toasts visibles
  const visibleToasts = toasts.slice(-maxToasts);

  const getPositionClasses = () => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };

    return positions[position] || positions['top-right'];
  };

  const getSpacingClasses = () => {
    switch (spacing) {
      case 'sm': return 'space-y-2';
      case 'md': return 'space-y-3';
      case 'lg': return 'space-y-4';
      default: return 'space-y-3';
    }
  };

  const getFlexDirection = () => {
    return position.startsWith('bottom') ? 'flex-col-reverse' : 'flex-col';
  };

  const toastContainer = (
    <div
      className={cn(
        'fixed pointer-events-none flex',
        getPositionClasses(),
        getFlexDirection(),
        getSpacingClasses(),
        className
      )}
      style={{ zIndex }}
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            {...toast}
            position={position}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );

  // Usar portal para renderizar fuera del árbol de componentes
  return container
    ? createPortal(toastContainer, container)
    : createPortal(toastContainer, document.body);
};

/**
 * Provider de toasts que proporciona el contexto y funcionalidades
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultDuration = 5000,
  defaultToastProps = {},
  ...containerProps
}) => {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>): string => {
    const id = generateId();
    const newToast: ToastProps = {
      id,
      duration: defaultDuration,
      ...defaultToastProps,
      ...toast,
    };

    dispatch({ type: 'ADD_TOAST', payload: newToast });
    return id;
  }, [defaultDuration, defaultToastProps]);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const clearToasts = useCallback(() => {
    dispatch({ type: 'CLEAR_TOASTS' });
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<ToastProps>) => {
    dispatch({ type: 'UPDATE_TOAST', payload: { id, updates } });
  }, []);

  // Métodos de conveniencia
  const success = useCallback((message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => {
    return addToast({ ...options, type: 'success', message });
  }, [addToast]);

  const error = useCallback((message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => {
    return addToast({ ...options, type: 'error', message });
  }, [addToast]);

  const warning = useCallback((message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => {
    return addToast({ ...options, type: 'warning', message });
  }, [addToast]);

  const info = useCallback((message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => {
    return addToast({ ...options, type: 'info', message });
  }, [addToast]);

  const contextValue: ToastContextType = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearToasts,
    updateToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer {...containerProps} />
    </ToastContext.Provider>
  );
};

/**
 * Hook para usar el sistema de toasts
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  
  return context;
};

/**
 * Hook simplificado para toasts rápidos
 */
export const useQuickToast = () => {
  const { success, error, warning, info } = useToast();

  return {
    /**
     * Mostrar toast de éxito
     */
    showSuccess: (message: string, duration?: number) => 
      success(message, duration ? { duration } : {}),
    
    /**
     * Mostrar toast de error
     */
    showError: (message: string, duration?: number) => 
      error(message, duration ? { duration } : {}),
    
    /**
     * Mostrar toast de advertencia
     */
    showWarning: (message: string, duration?: number) => 
      warning(message, duration ? { duration } : {}),
    
    /**
     * Mostrar toast de información
     */
    showInfo: (message: string, duration?: number) => 
      info(message, duration ? { duration } : {}),
  };
};

/**
 * Función utilitaria para crear toasts fuera de componentes React
 */
let globalToastContext: ToastContextType | null = null;

export const setGlobalToastContext = (context: ToastContextType) => {
  globalToastContext = context;
};

export const toast = {
  success: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => {
    if (globalToastContext) {
      return globalToastContext.success(message, options);
    }
    console.warn('Toast global no está disponible. Asegúrate de usar ToastProvider.');
    return '';
  },
  
  error: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => {
    if (globalToastContext) {
      return globalToastContext.error(message, options);
    }
    console.warn('Toast global no está disponible. Asegúrate de usar ToastProvider.');
    return '';
  },
  
  warning: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => {
    if (globalToastContext) {
      return globalToastContext.warning(message, options);
    }
    console.warn('Toast global no está disponible. Asegúrate de usar ToastProvider.');
    return '';
  },
  
  info: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'message'>>) => {
    if (globalToastContext) {
      return globalToastContext.info(message, options);
    }
    console.warn('Toast global no está disponible. Asegúrate de usar ToastProvider.');
    return '';
  },
};

// Componente para establecer el contexto global
export const ToastGlobalSetup: React.FC = () => {
  const context = useToast();
  
  useEffect(() => {
    setGlobalToastContext(context);
    return () => setGlobalToastContext(null as any);
  }, [context]);
  
  return null;
};

export default ToastContainer;
