import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface DaySchedule {
  day: string;
  dayShort: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
  specialNote?: string;
}

interface SpecialHours {
  date: string;
  description: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  type: 'holiday' | 'event' | 'maintenance' | 'special';
}

interface OpeningHoursProps {
  /**
   * Título de la sección
   */
  title?: string;
  
  /**
   * Horarios regulares de la semana
   */
  schedule?: DaySchedule[];
  
  /**
   * Horarios especiales y fechas importantes
   */
  specialHours?: SpecialHours[];
  
  /**
   * Mostrar estado actual (abierto/cerrado)
   */
  showCurrentStatus?: boolean;
  
  /**
   * Mostrar próxima apertura/cierre
   */
  showNextEvent?: boolean;
  
  /**
   * Mostrar horarios especiales
   */
  showSpecialHours?: boolean;
  
  /**
   * Zona horaria
   */
  timezone?: string;
  
  /**
   * Formato de hora (12h/24h)
   */
  timeFormat?: '12h' | '24h';
  
  /**
   * Estilo de visualización
   */
  variant?: 'default' | 'compact' | 'detailed';
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente OpeningHours - Muestra los horarios de apertura del restaurante
 */
export const OpeningHours: React.FC<OpeningHoursProps> = ({
  title = "Horarios de Atención",
  schedule = [
    {
      day: 'Lunes',
      dayShort: 'Lu',
      isOpen: true,
      openTime: '09:00',
      closeTime: '22:00',
      breakStart: '15:00',
      breakEnd: '17:00'
    },
    {
      day: 'Martes',
      dayShort: 'Ma',
      isOpen: true,
      openTime: '09:00',
      closeTime: '22:00',
      breakStart: '15:00',
      breakEnd: '17:00'
    },
    {
      day: 'Miércoles',
      dayShort: 'Mi',
      isOpen: true,
      openTime: '09:00',
      closeTime: '22:00',
      breakStart: '15:00',
      breakEnd: '17:00'
    },
    {
      day: 'Jueves',
      dayShort: 'Ju',
      isOpen: true,
      openTime: '09:00',
      closeTime: '22:00',
      breakStart: '15:00',
      breakEnd: '17:00'
    },
    {
      day: 'Viernes',
      dayShort: 'Vi',
      isOpen: true,
      openTime: '09:00',
      closeTime: '23:00'
    },
    {
      day: 'Sábado',
      dayShort: 'Sa',
      isOpen: true,
      openTime: '10:00',
      closeTime: '23:00'
    },
    {
      day: 'Domingo',
      dayShort: 'Do',
      isOpen: true,
      openTime: '10:00',
      closeTime: '21:00'
    }
  ],
  specialHours = [
    {
      date: '2024-12-25',
      description: 'Navidad',
      isOpen: false,
      type: 'holiday'
    },
    {
      date: '2024-12-31',
      description: 'Nochevieja - Cena Especial',
      isOpen: true,
      openTime: '19:00',
      closeTime: '02:00',
      type: 'special'
    },
    {
      date: '2024-01-01',
      description: 'Año Nuevo',
      isOpen: false,
      type: 'holiday'
    }
  ],
  showCurrentStatus = true,
  showNextEvent = true,
  showSpecialHours = true,
  timezone = 'America/Mexico_City',
  timeFormat = '24h',
  variant = 'default',
  className,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentStatus, setCurrentStatus] = useState<{
    isOpen: boolean;
    nextEvent: string;
    nextEventTime: string;
  }>({ isOpen: false, nextEvent: '', nextEventTime: '' });

  // Actualizar hora actual cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Calcular estado actual y próximo evento
  useEffect(() => {
    const findNextOpenDay = () => {
      const today = new Date().getDay();
      for (let i = 1; i <= 7; i++) {
        const dayIndex = (today + i - 1) % 7;
        const scheduleIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        const daySchedule = schedule[scheduleIndex];
        if (daySchedule && daySchedule.isOpen && daySchedule.openTime) {
          return daySchedule;
        }
      }
      return null;
    };

    const formatTimeLocal = (time: string) => {
      if (timeFormat === '12h') {
        const [hours, minutes] = time.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const ampm = hour24 >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
      }
      return time;
    };

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const currentTimeStr = now.toTimeString().slice(0, 5); // HH:MM
    
    // Ajustar índice del día (JavaScript usa 0 para domingo, nosotros usamos 0 para lunes)
    const scheduleIndex = currentDay === 0 ? 6 : currentDay - 1;
    const todaySchedule = schedule[scheduleIndex];

    let isCurrentlyOpen = false;
    let nextEvent = '';
    let nextEventTime = '';

    if (todaySchedule && todaySchedule.isOpen) {
      const { openTime, closeTime, breakStart, breakEnd } = todaySchedule;
      
      if (openTime && closeTime) {
        const isAfterOpen = currentTimeStr >= openTime;
        const isBeforeClose = currentTimeStr < closeTime;
        
        // Verificar si hay descanso
        let isDuringBreak = false;
        if (breakStart && breakEnd) {
          isDuringBreak = currentTimeStr >= breakStart && currentTimeStr < breakEnd;
        }
        
        isCurrentlyOpen = isAfterOpen && isBeforeClose && !isDuringBreak;
        
        // Determinar próximo evento
        if (!isAfterOpen) {
          nextEvent = 'Abre';
          nextEventTime = formatTimeLocal(openTime);
        } else if (isDuringBreak) {
          nextEvent = 'Reabre';
          nextEventTime = formatTimeLocal(breakEnd!);
        } else if (isAfterOpen && isBeforeClose) {
          if (breakStart && currentTimeStr < breakStart) {
            nextEvent = 'Descanso';
            nextEventTime = formatTimeLocal(breakStart);
          } else {
            nextEvent = 'Cierra';
            nextEventTime = formatTimeLocal(closeTime);
          }
        } else {
          // Buscar próximo día abierto
          const nextOpenDay = findNextOpenDay();
          if (nextOpenDay) {
            nextEvent = `Abre ${nextOpenDay.day}`;
            nextEventTime = formatTimeLocal(nextOpenDay.openTime!);
          }
        }
      }
    } else {
      // Buscar próximo día abierto
      const nextOpenDay = findNextOpenDay();
      if (nextOpenDay) {
        nextEvent = `Abre ${nextOpenDay.day}`;
        nextEventTime = formatTimeLocal(nextOpenDay.openTime!);
      }
    }

    setCurrentStatus({ isOpen: isCurrentlyOpen, nextEvent, nextEventTime });
  }, [currentTime, schedule, timeFormat]);

  const formatTime = (time: string) => {
    if (timeFormat === '12h') {
      const [hours, minutes] = time.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    }
    return time;
  };

  const isToday = (dayIndex: number) => {
    const today = new Date().getDay();
    const scheduleIndex = today === 0 ? 6 : today - 1;
    return scheduleIndex === dayIndex;
  };

  const getSpecialHourTypeIcon = (type: string) => {
    const icons = {
      holiday: '🎄',
      event: '🎉',
      maintenance: '🔧',
      special: '⭐'
    };
    return icons[type as keyof typeof icons] || '📅';
  };

  const getSpecialHourTypeColor = (type: string) => {
    const colors = {
      holiday: 'bg-red-100 text-red-800 border-red-200',
      event: 'bg-blue-100 text-blue-800 border-blue-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      special: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (variant === 'compact') {
    return (
      <div className={cn('bg-white rounded-lg p-4 shadow-sm', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={cn(
              'w-3 h-3 rounded-full',
              currentStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
            )}></span>
            <span className="font-medium">
              {currentStatus.isOpen ? 'Abierto' : 'Cerrado'}
            </span>
          </div>
          {showNextEvent && currentStatus.nextEvent && (
            <div className="text-sm text-gray-600">
              {currentStatus.nextEvent} a las {currentStatus.nextEventTime}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className={cn('py-16 bg-white', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          
          {/* Estado actual */}
          {showCurrentStatus && (
            <div className="inline-flex items-center space-x-3 bg-gray-50 rounded-lg px-6 py-3">
              <div className={cn(
                'w-4 h-4 rounded-full animate-pulse',
                currentStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
              )}></div>
              <span className="text-lg font-semibold">
                {currentStatus.isOpen ? '🟢 Abierto Ahora' : '🔴 Cerrado'}
              </span>
              {showNextEvent && currentStatus.nextEvent && (
                <span className="text-gray-600">
                  • {currentStatus.nextEvent} a las {currentStatus.nextEventTime}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Horarios regulares */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Horarios Regulares
            </h3>
            
            <div className="space-y-3">
              {schedule.map((daySchedule, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-colors',
                    isToday(index) 
                      ? 'bg-orange-100 border border-orange-200' 
                      : 'bg-white border border-gray-200'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      'font-medium',
                      isToday(index) ? 'text-orange-900' : 'text-gray-900'
                    )}>
                      {daySchedule.day}
                    </span>
                    {isToday(index) && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                        Hoy
                      </span>
                    )}
                  </div>
                  
                  <div className="text-right">
                    {daySchedule.isOpen ? (
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatTime(daySchedule.openTime!)} - {formatTime(daySchedule.closeTime!)}
                        </div>
                        {daySchedule.breakStart && daySchedule.breakEnd && (
                          <div className="text-sm text-gray-500">
                            Descanso: {formatTime(daySchedule.breakStart)} - {formatTime(daySchedule.breakEnd)}
                          </div>
                        )}
                        {daySchedule.specialNote && (
                          <div className="text-sm text-orange-600">
                            {daySchedule.specialNote}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 font-medium">Cerrado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información adicional y horarios especiales */}
          <div className="space-y-6">
            {/* Horarios especiales */}
            {showSpecialHours && specialHours.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Fechas Especiales
                </h3>
                
                <div className="space-y-3">
                  {specialHours.map((special, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-3 rounded-lg border',
                        getSpecialHourTypeColor(special.type)
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">
                          {getSpecialHourTypeIcon(special.type)}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium">
                            {special.description}
                          </div>
                          <div className="text-sm opacity-75">
                            {new Date(special.date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm font-medium mt-1">
                            {special.isOpen ? (
                              special.openTime && special.closeTime ? (
                                `${formatTime(special.openTime)} - ${formatTime(special.closeTime)}`
                              ) : (
                                'Horario especial'
                              )
                            ) : (
                              'Cerrado'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Información Importante
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>Para reservas: +52 (55) 1234-5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⏰</span>
                  <span>Última orden: 30 min antes del cierre</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🎂</span>
                  <span>Eventos especiales previa reservación</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🚗</span>
                  <span>Servicio de valet parking disponible</span>
                </div>
              </div>
            </div>

            {/* Zona horaria */}
            {timezone && (
              <div className="text-center text-sm text-gray-500">
                <p>Horarios en zona {timezone.replace('_', ' ')}</p>
                <p>Actualizado cada minuto • Hora actual: {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpeningHours;