import React, { useState, useEffect } from 'react';

interface OrderTimerProps {
  /**
   * Tiempo estimado en minutos
   */
  estimatedTime?: number;
  
  /**
   * Fecha de inicio del timer (ISO string)
   */
  startTime?: string;
  
  /**
   * Estado del pedido para determinar si mostrar el timer
   */
  status?: 'PENDIENTE' | 'CONFIRMADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
  
  /**
   * Variante del componente
   */
  variant?: 'default' | 'compact' | 'large' | 'minimal';
  
  /**
   * Mostrar tiempo restante vs tiempo transcurrido
   */
  mode?: 'remaining' | 'elapsed';
  
  /**
   * Callback cuando el tiempo se agota
   */
  onTimeUp?: () => void;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
}

const OrderTimer: React.FC<OrderTimerProps> = ({
  estimatedTime = 25,
  startTime,
  status = 'PREPARANDO',
  variant = 'default',
  mode = 'remaining',
  onTimeUp,
  className = ''
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Determinar si el timer debe estar activo basado en el estado
    const shouldBeActive = status === 'CONFIRMADO' || status === 'PREPARANDO';
    setIsActive(shouldBeActive);
  }, [status]);

  useEffect(() => {
    // Calcular tiempo transcurrido inicial si se proporciona startTime
    if (startTime) {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      setTimeElapsed(Math.max(0, elapsed));
    }
  }, [startTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          const estimatedSeconds = estimatedTime * 60;
          
          // Llamar onTimeUp cuando se alcance el tiempo estimado
          if (newTime >= estimatedSeconds && onTimeUp) {
            onTimeUp();
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, estimatedTime, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDisplayTime = (): { time: string; label: string; isOvertime: boolean } => {
    const estimatedSeconds = estimatedTime * 60;
    
    if (mode === 'elapsed') {
      return {
        time: formatTime(timeElapsed),
        label: 'Transcurrido',
        isOvertime: timeElapsed > estimatedSeconds
      };
    } else {
      const remaining = Math.max(0, estimatedSeconds - timeElapsed);
      return {
        time: formatTime(remaining),
        label: remaining > 0 ? 'Restante' : 'Tiempo agotado',
        isOvertime: timeElapsed > estimatedSeconds
      };
    }
  };

  const getProgressPercentage = (): number => {
    const estimatedSeconds = estimatedTime * 60;
    return Math.min(100, (timeElapsed / estimatedSeconds) * 100);
  };

  const { time, label, isOvertime } = getDisplayTime();

  // No mostrar timer si el pedido está completado o cancelado
  if (status === 'ENTREGADO' || status === 'CANCELADO' || status === 'PENDIENTE') {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <span className={`text-sm font-mono ${isOvertime ? 'text-red-600' : 'text-gray-600'} ${className}`}>
        {time}
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <span className={`text-sm font-mono ${isOvertime ? 'text-red-600' : 'text-gray-700'}`}>
          {time}
        </span>
        <span className="text-xs text-gray-500">
          {label}
        </span>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={`text-center p-6 bg-white rounded-lg border ${isOvertime ? 'border-red-300' : 'border-gray-300'} ${className}`}>
        <div className="mb-4">
          <div className={`text-4xl font-mono font-bold ${isOvertime ? 'text-red-600' : 'text-gray-900'}`}>
            {time}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {label}
          </div>
        </div>
        
        {/* Progress Circle */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className={isOvertime ? 'text-red-500' : 'text-blue-500'}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${getProgressPercentage()}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-medium ${isOvertime ? 'text-red-600' : 'text-blue-600'}`}>
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Tiempo estimado: {estimatedTime} min
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`p-4 bg-white rounded-lg border ${isOvertime ? 'border-red-300 bg-red-50' : 'border-gray-300'} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <svg className={`w-5 h-5 ${isOvertime ? 'text-red-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Tiempo de Preparación
          </span>
        </div>
        <div className={`flex items-center space-x-1 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-xs">
            {isActive ? 'En curso' : 'Pausado'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <div className={`text-2xl font-mono font-bold ${isOvertime ? 'text-red-600' : 'text-gray-900'}`}>
            {time}
          </div>
          <div className="text-sm text-gray-600">
            {label}
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <div>Estimado: {estimatedTime} min</div>
          <div>Transcurrido: {formatTime(timeElapsed)}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            isOvertime ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(100, getProgressPercentage())}%` }}
        />
      </div>

      {isOvertime && (
        <div className="mt-3 text-xs text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Tiempo estimado superado
        </div>
      )}
    </div>
  );
};

export default OrderTimer;
