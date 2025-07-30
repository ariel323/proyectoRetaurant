import React from 'react';
import { Mesa } from '../../types';
import MesaStatus from './MesaStatus';
import MesaCapacity from './MesaCapacity';
import MesaLocation from './MesaLocation';
import { cn } from '../../utils/cn';

export interface MesaInfoProps {
  mesa: Mesa;
  className?: string;
  variant?: 'compact' | 'detailed' | 'card' | 'list';
  showActions?: boolean;
  onSelect?: (mesa: Mesa) => void;
  onReserve?: (mesa: Mesa) => void;
  isSelected?: boolean;
}

const MesaInfo: React.FC<MesaInfoProps> = ({
  mesa,
  className,
  variant = 'detailed',
  showActions = false,
  onSelect,
  onReserve,
  isSelected = false,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  };

  const renderCompact = () => (
    <div className={cn(
      'flex items-center justify-between p-3 bg-white border rounded-lg',
      isSelected && 'border-blue-500 bg-blue-50',
      className
    )}>
      <div className="flex items-center space-x-3">
        <div className="text-lg font-bold text-gray-900">
          Mesa {mesa.numero}
        </div>
        <MesaStatus estado={mesa.estado} variant="badge" size="sm" />
      </div>
      
      <div className="flex items-center space-x-2">
        <MesaCapacity capacidad={mesa.capacidad} variant="icon" size="sm" />
        <MesaLocation ubicacion={mesa.ubicacion} variant="icon" size="sm" />
      </div>
    </div>
  );

  const renderList = () => (
    <div className={cn(
      'flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow',
      isSelected && 'border-blue-500 bg-blue-50',
      className
    )}>
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-gray-900">
          {mesa.numero}
        </div>
        <div className="space-y-1">
          <MesaStatus estado={mesa.estado} variant="badge" />
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <MesaCapacity capacidad={mesa.capacidad} variant="icon" size="sm" />
            <MesaLocation ubicacion={mesa.ubicacion} variant="text" size="sm" />
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center space-x-2">
          {onSelect && (
            <button
              onClick={() => onSelect(mesa)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {isSelected ? 'Seleccionada' : 'Seleccionar'}
            </button>
          )}
          {onReserve && mesa.estado === 'LIBRE' && (
            <button
              onClick={() => onReserve(mesa)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Reservar
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderCard = () => (
    <div className={cn(
      'bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300',
      isSelected && 'border-blue-500 shadow-lg',
      mesa.estado === 'LIBRE' && 'hover:border-green-300',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Mesa {mesa.numero}
          </h3>
          <MesaStatus estado={mesa.estado} variant="badge" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <MesaCapacity capacidad={mesa.capacidad} variant="detailed" />
          <MesaLocation ubicacion={mesa.ubicacion} variant="detailed" />
        </div>

        {/* Metadata */}
        {(mesa.fecha_creacion || mesa.fecha_actualizacion) && (
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
            {mesa.fecha_creacion && (
              <p>Creada: {formatDate(mesa.fecha_creacion)}</p>
            )}
            {mesa.fecha_actualizacion && (
              <p>Actualizada: {formatDate(mesa.fecha_actualizacion)}</p>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-3 border-t border-gray-100">
            {onSelect && (
              <button
                onClick={() => onSelect(mesa)}
                className={cn(
                  'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {isSelected ? '✓ Seleccionada' : 'Seleccionar mesa'}
              </button>
            )}
            {onReserve && mesa.estado === 'LIBRE' && (
              <button
                onClick={() => onReserve(mesa)}
                className="flex-1 py-2 px-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                🎯 Reservar ahora
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderDetailed = () => (
    <div className={cn(
      'bg-white border rounded-xl shadow-sm overflow-hidden',
      isSelected && 'border-blue-500 shadow-lg',
      className
    )}>
      {/* Header con imagen de fondo */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mesa #{mesa.numero}</h2>
            <p className="text-blue-100">Información detallada</p>
          </div>
          <div className="text-4xl opacity-20">🍽️</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Estado principal */}
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <MesaStatus estado={mesa.estado} variant="indicator" size="lg" />
        </div>

        {/* Detalles en grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Capacidad</h4>
            <MesaCapacity capacidad={mesa.capacidad} variant="detailed" />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Ubicación</h4>
            <MesaLocation ubicacion={mesa.ubicacion} variant="detailed" />
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900">Información adicional</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">ID:</span>
              <span className="font-mono text-gray-900">#{mesa.id}</span>
            </div>
            
            {mesa.fecha_creacion && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Creada:</span>
                <span className="text-gray-900">{formatDate(mesa.fecha_creacion)}</span>
              </div>
            )}
            
            {mesa.fecha_actualizacion && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Actualizada:</span>
                <span className="text-gray-900">{formatDate(mesa.fecha_actualizacion)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-3">
            {onSelect && (
              <button
                onClick={() => onSelect(mesa)}
                className={cn(
                  'flex-1 py-3 px-6 text-sm font-medium rounded-lg transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {isSelected ? '✓ Mesa seleccionada' : '👆 Seleccionar esta mesa'}
              </button>
            )}
            {onReserve && mesa.estado === 'LIBRE' && (
              <button
                onClick={() => onReserve(mesa)}
                className="flex-1 py-3 px-6 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-xl"
              >
                🎯 Reservar ahora
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  switch (variant) {
    case 'compact':
      return renderCompact();
    case 'list':
      return renderList();
    case 'card':
      return renderCard();
    default:
      return renderDetailed();
  }
};

export default MesaInfo;
