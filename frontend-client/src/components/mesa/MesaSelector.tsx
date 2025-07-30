import React, { useState, useCallback } from 'react';
import { Mesa } from '../../types';
import MesaStatus from './MesaStatus';
import MesaCapacity from './MesaCapacity';
import MesaAvailability from './MesaAvailability';
import { cn } from '../../utils/cn';

export interface MesaSelectorProps {
  mesas: Mesa[];
  selectedMesa?: Mesa | null;
  onMesaSelect?: (mesa: Mesa | null) => void;
  multiSelect?: boolean;
  selectedMesas?: Mesa[];
  onMultiSelect?: (mesas: Mesa[]) => void;
  disabled?: boolean;
  minCapacity?: number;
  maxCapacity?: number;
  allowedStates?: Mesa['estado'][];
  allowedLocations?: string[];
  className?: string;
  variant?: 'grid' | 'list' | 'compact' | 'interactive';
  showFilters?: boolean;
  showSearch?: boolean;
}

const MesaSelector: React.FC<MesaSelectorProps> = ({
  mesas,
  selectedMesa,
  onMesaSelect,
  multiSelect = false,
  selectedMesas = [],
  onMultiSelect,
  disabled = false,
  minCapacity,
  maxCapacity,
  allowedStates = ['LIBRE'],
  allowedLocations,
  className,
  variant = 'grid',
  showFilters = true,
  showSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    capacidad: '',
    ubicacion: '',
    estado: '',
  });

  // Filtrar mesas disponibles para selección
  const availableMesas = mesas.filter(mesa => {
    // Filtro por estados permitidos
    if (!allowedStates.includes(mesa.estado)) return false;
    
    // Filtro por capacidad mínima
    if (minCapacity && mesa.capacidad < minCapacity) return false;
    
    // Filtro por capacidad máxima
    if (maxCapacity && mesa.capacidad > maxCapacity) return false;
    
    // Filtro por ubicaciones permitidas
    if (allowedLocations && !allowedLocations.includes(mesa.ubicacion)) return false;
    
    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!mesa.numero.toString().includes(searchLower) &&
          !mesa.ubicacion.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    // Filtros adicionales
    if (filters.capacidad && mesa.capacidad.toString() !== filters.capacidad) return false;
    if (filters.ubicacion && mesa.ubicacion !== filters.ubicacion) return false;
    if (filters.estado && mesa.estado !== filters.estado) return false;
    
    return true;
  });

  const handleMesaClick = useCallback((mesa: Mesa) => {
    if (disabled) return;

    if (multiSelect) {
      const isSelected = selectedMesas.some(m => m.id === mesa.id);
      let newSelection: Mesa[];
      
      if (isSelected) {
        newSelection = selectedMesas.filter(m => m.id !== mesa.id);
      } else {
        newSelection = [...selectedMesas, mesa];
      }
      
      onMultiSelect?.(newSelection);
    } else {
      const isSelected = selectedMesa?.id === mesa.id;
      onMesaSelect?.(isSelected ? null : mesa);
    }
  }, [disabled, multiSelect, selectedMesa, selectedMesas, onMesaSelect, onMultiSelect]);

  const isMesaSelected = useCallback((mesa: Mesa) => {
    if (multiSelect) {
      return selectedMesas.some(m => m.id === mesa.id);
    }
    return selectedMesa?.id === mesa.id;
  }, [multiSelect, selectedMesa, selectedMesas]);

  const clearSelection = () => {
    if (multiSelect) {
      onMultiSelect?.([]);
    } else {
      onMesaSelect?.(null);
    }
  };

  const selectAll = () => {
    if (multiSelect) {
      onMultiSelect?.(availableMesas);
    }
  };

  // Obtener opciones únicas para filtros
  const uniqueCapacities = Array.from(new Set(mesas.map(m => m.capacidad))).sort((a, b) => a - b);
  const uniqueLocations = Array.from(new Set(mesas.map(m => m.ubicacion))).sort();
  const uniqueStates = Array.from(new Set(mesas.map(m => m.estado)));

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad
            </label>
            <select
              value={filters.capacidad}
              onChange={(e) => setFilters(prev => ({ ...prev, capacidad: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {uniqueCapacities.map(cap => (
                <option key={cap} value={cap.toString()}>{cap} personas</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <select
              value={filters.ubicacion}
              onChange={(e) => setFilters(prev => ({ ...prev, ubicacion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.estado}
              onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderSearchAndActions = () => {
    const selectionCount = multiSelect ? selectedMesas.length : (selectedMesa ? 1 : 0);

    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Búsqueda */}
        {showSearch && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por número o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {selectionCount > 0 ? (
              <>
                {selectionCount} mesa{selectionCount !== 1 ? 's' : ''} seleccionada{selectionCount !== 1 ? 's' : ''}
              </>
            ) : (
              `${availableMesas.length} mesa${availableMesas.length !== 1 ? 's' : ''} disponible${availableMesas.length !== 1 ? 's' : ''}`
            )}
          </span>

          {multiSelect && (
            <>
              <button
                onClick={selectAll}
                disabled={disabled || availableMesas.length === 0}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
              >
                Seleccionar todas
              </button>
              <button
                onClick={clearSelection}
                disabled={disabled || selectionCount === 0}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Limpiar
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderMesaCard = (mesa: Mesa) => {
    const isSelected = isMesaSelected(mesa);
    const isDisabled = disabled || !allowedStates.includes(mesa.estado);

    return (
      <div
        key={mesa.id}
        onClick={() => !isDisabled && handleMesaClick(mesa)}
        className={cn(
          'border rounded-lg p-4 transition-all cursor-pointer',
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : isDisabled
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm',
          variant === 'compact' && 'p-3'
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className={cn(
            'font-semibold text-gray-900',
            variant === 'compact' ? 'text-base' : 'text-lg'
          )}>
            Mesa {mesa.numero}
          </h4>
          <div className="flex items-center space-x-2">
            {multiSelect && (
              <div className={cn(
                'w-5 h-5 border-2 rounded',
                isSelected
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-300'
              )}>
                {isSelected && (
                  <span className="text-white text-xs flex items-center justify-center h-full">
                    ✓
                  </span>
                )}
              </div>
            )}
            <MesaStatus estado={mesa.estado} variant="badge" size="sm" />
          </div>
        </div>

        <div className="space-y-2">
          <MesaCapacity 
            capacidad={mesa.capacidad} 
            variant="icon" 
            size={variant === 'compact' ? 'sm' : 'md'} 
          />
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>📍</span>
            <span>{mesa.ubicacion}</span>
          </div>
        </div>

        {isSelected && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-sm text-blue-700 font-medium">
              ✓ Mesa seleccionada
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGrid = () => (
    <div className={cn(
      'grid gap-4',
      variant === 'compact'
        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    )}>
      {availableMesas.map(renderMesaCard)}
    </div>
  );

  const renderList = () => (
    <div className="space-y-3">
      {availableMesas.map(mesa => {
        const isSelected = isMesaSelected(mesa);
        const isDisabled = disabled || !allowedStates.includes(mesa.estado);

        return (
          <div
            key={mesa.id}
            onClick={() => !isDisabled && handleMesaClick(mesa)}
            className={cn(
              'flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer',
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : isDisabled
                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                : 'border-gray-300 bg-white hover:border-gray-400'
            )}
          >
            <div className="flex items-center space-x-4">
              {multiSelect && (
                <div className={cn(
                  'w-5 h-5 border-2 rounded',
                  isSelected
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                )}>
                  {isSelected && (
                    <span className="text-white text-xs flex items-center justify-center h-full">
                      ✓
                    </span>
                  )}
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-900">Mesa {mesa.numero}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <MesaCapacity capacidad={mesa.capacidad} variant="text" size="sm" />
                  <span>📍 {mesa.ubicacion}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MesaStatus estado={mesa.estado} variant="badge" size="sm" />
              {isSelected && (
                <span className="text-blue-500 text-sm font-medium">Seleccionada</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderInteractive = () => (
    <div className="space-y-6">
      <MesaAvailability 
        mesas={mesas}
        onAvailabilityChange={(available) => {
          // Actualizar mesas disponibles si es necesario
        }}
        variant="simple"
      />
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seleccionar Mesa
        </h3>
        {renderGrid()}
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {renderFilters()}
      {renderSearchAndActions()}

      {availableMesas.length > 0 ? (
        <>
          {variant === 'list' && renderList()}
          {variant === 'interactive' && renderInteractive()}
          {(variant === 'grid' || variant === 'compact') && renderGrid()}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl text-gray-300 mb-4">🪑</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay mesas disponibles
          </h3>
          <p className="text-gray-500">
            {searchTerm || Object.values(filters).some(f => f)
              ? 'No se encontraron mesas que coincidan con los filtros'
              : 'No hay mesas disponibles en este momento'
            }
          </p>
          {(searchTerm || Object.values(filters).some(f => f)) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ capacidad: '', ubicacion: '', estado: '' });
              }}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MesaSelector;
