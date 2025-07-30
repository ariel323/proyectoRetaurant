import React, { useState, useEffect, useCallback } from 'react';
import { Mesa } from '../../types';
import MesaStatus from './MesaStatus';
import MesaCapacity from './MesaCapacity';
import { cn } from '../../utils/cn';

export interface MesaAvailabilityProps {
  mesas: Mesa[];
  selectedDate?: Date;
  selectedTime?: string;
  selectedCapacity?: number;
  onAvailabilityChange?: (available: Mesa[]) => void;
  className?: string;
  variant?: 'calendar' | 'timeline' | 'simple';
}

const MesaAvailability: React.FC<MesaAvailabilityProps> = ({
  mesas,
  selectedDate = new Date(),
  selectedTime,
  selectedCapacity,
  onAvailabilityChange,
  className,
  variant = 'simple',
}) => {
  const [availableMesas, setAvailableMesas] = useState<Mesa[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Generar horarios disponibles
  useEffect(() => {
    const slots = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    setTimeSlots(slots);
  }, []);

  // Calcular mesas disponibles basado en filtros
  useEffect(() => {
    let filtered = mesas.filter(mesa => mesa.estado === 'LIBRE');

    if (selectedCapacity) {
      filtered = filtered.filter(mesa => mesa.capacidad >= selectedCapacity);
    }

    setAvailableMesas(filtered);
    onAvailabilityChange?.(filtered);
  }, [mesas, selectedCapacity, selectedDate, selectedTime, onAvailabilityChange]);

  const getAvailabilityStats = () => {
    const total = mesas.length;
    const available = availableMesas.length;
    const occupied = mesas.filter(m => m.estado === 'OCUPADA').length;
    const reserved = mesas.filter(m => m.estado === 'RESERVADA').length;

    return {
      total,
      available,
      occupied,
      reserved,
      availabilityRate: total > 0 ? Math.round((available / total) * 100) : 0,
    };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderSimple = () => {
    const stats = getAvailabilityStats();

    return (
      <div className={cn('space-y-6', className)}>
        {/* Header con estadísticas */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Disponibilidad de Mesas
            </h3>
            <span className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              stats.availabilityRate >= 50 
                ? 'bg-green-100 text-green-800'
                : stats.availabilityRate >= 25
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            )}>
              {stats.availabilityRate}% disponible
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-sm text-gray-500">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
              <div className="text-sm text-gray-500">Ocupadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
              <div className="text-sm text-gray-500">Reservadas</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        {selectedCapacity && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <span className="text-blue-800 font-medium">Filtrado por capacidad:</span>
              <MesaCapacity capacidad={selectedCapacity} variant="icon" />
              <span className="text-blue-600">
                {availableMesas.length} mesas disponibles para {selectedCapacity}+ personas
              </span>
            </div>
          </div>
        )}

        {/* Lista de mesas disponibles */}
        {availableMesas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableMesas.map((mesa) => (
              <div
                key={mesa.id}
                className="bg-white border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Mesa {mesa.numero}
                  </h4>
                  <MesaStatus estado={mesa.estado} variant="badge" size="sm" />
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <MesaCapacity capacidad={mesa.capacidad} variant="icon" size="sm" />
                  <div className="flex items-center space-x-2">
                    <span>📍</span>
                    <span>{mesa.ubicacion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl text-gray-300 mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay mesas disponibles
            </h3>
            <p className="text-gray-500">
              {selectedCapacity 
                ? `No hay mesas disponibles para ${selectedCapacity}+ personas en este momento`
                : 'Todas las mesas están ocupadas o reservadas'
              }
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderTimeline = () => {
    const stats = getAvailabilityStats();

    return (
      <div className={cn('space-y-6', className)}>
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Disponibilidad por Horarios
          </h3>
          
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">
              {formatDate(selectedDate)}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-900 font-medium">
                {stats.available} de {stats.total} mesas disponibles
              </span>
              <span className={cn(
                'px-2 py-1 rounded text-xs font-medium',
                stats.availabilityRate >= 50 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              )}>
                {stats.availabilityRate}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {timeSlots.map((timeSlot) => {
              const availableCount = availableMesas.length; // En una implementación real, esto variaría por horario
              const isSelected = selectedTime === timeSlot;
              
              return (
                <div
                  key={timeSlot}
                  className={cn(
                    'p-3 text-center rounded-lg border transition-all cursor-pointer',
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : availableCount > 0
                      ? 'border-green-300 bg-green-50 hover:bg-green-100'
                      : 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {timeSlot}
                  </div>
                  <div className="text-xs text-gray-500">
                    {availableCount} libres
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    // Vista de calendario simplificada
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });

    return (
      <div className={cn('space-y-6', className)}>
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Disponibilidad Semanal
          </h3>

          <div className="grid grid-cols-7 gap-2">
            {dates.map((date, index) => {
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const availabilityRate = getAvailabilityStats().availabilityRate;

              return (
                <div
                  key={index}
                  className={cn(
                    'p-4 text-center rounded-lg border transition-all cursor-pointer',
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : isToday
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div className="text-xs text-gray-500 uppercase">
                    {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {date.getDate()}
                  </div>
                  <div className={cn(
                    'w-full h-2 rounded-full mt-2',
                    availabilityRate >= 50 ? 'bg-green-200' : 'bg-red-200'
                  )}>
                    <div
                      className={cn(
                        'h-full rounded-full',
                        availabilityRate >= 50 ? 'bg-green-500' : 'bg-red-500'
                      )}
                      style={{ width: `${availabilityRate}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {availabilityRate}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  switch (variant) {
    case 'timeline':
      return renderTimeline();
    case 'calendar':
      return renderCalendar();
    default:
      return renderSimple();
  }
};

// Hook para gestionar disponibilidad
export const useMesaAvailability = (mesas: Mesa[]) => {
  const [filters, setFilters] = useState({
    date: new Date(),
    time: '',
    capacity: 0,
  });
  const [available, setAvailable] = useState<Mesa[]>([]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const checkAvailability = useCallback(() => {
    let filtered = mesas.filter(mesa => mesa.estado === 'LIBRE');
    
    if (filters.capacity > 0) {
      filtered = filtered.filter(mesa => mesa.capacidad >= filters.capacity);
    }
    
    setAvailable(filtered);
    return filtered;
  }, [mesas, filters.capacity]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  return {
    filters,
    available,
    updateFilters,
    checkAvailability,
  };
};

export default MesaAvailability;
