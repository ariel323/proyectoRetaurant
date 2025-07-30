import React, { useState, useCallback, useMemo } from 'react';
import { Mesa } from '../../types';
import MesaCard from './MesaCard';
import MesaGrid from './MesaGrid';
import MesaStatus from './MesaStatus';
import MesaCapacity from './MesaCapacity';
import MesaAvailability from './MesaAvailability';
import MesaSelector from './MesaSelector';
import { cn } from '../../utils/cn';

export interface MesaContainerProps {
  mesas: Mesa[];
  loading?: boolean;
  error?: string | null;
  onMesaSelect?: (mesa: Mesa) => void;
  onMesaUpdate?: (mesa: Mesa) => void;
  onMesaDelete?: (mesaId: number) => void;
  selectedMesa?: Mesa | null;
  className?: string;
  variant?: 'grid' | 'list' | 'cards' | 'selector' | 'availability';
  showFilters?: boolean;
  showSearch?: boolean;
  showStats?: boolean;
  allowSelection?: boolean;
  allowMultiSelection?: boolean;
  enableActions?: boolean;
  filterOptions?: {
    minCapacity?: number;
    maxCapacity?: number;
    allowedStates?: Mesa['estado'][];
    allowedLocations?: string[];
  };
}

interface ViewState {
  searchTerm: string;
  filters: {
    estado: Mesa['estado'] | '';
    capacidad: number | '';
    ubicacion: string;
  };
  sortBy: 'numero' | 'capacidad' | 'estado' | 'ubicacion';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list' | 'cards';
}

const MesaContainer: React.FC<MesaContainerProps> = ({
  mesas,
  loading = false,
  error = null,
  onMesaSelect,
  onMesaUpdate,
  onMesaDelete,
  selectedMesa,
  className,
  variant = 'grid',
  showFilters = true,
  showSearch = true,
  showStats = true,
  allowSelection = true,
  allowMultiSelection = false,
  enableActions = false,
  filterOptions,
}) => {
  const [viewState, setViewState] = useState<ViewState>({
    searchTerm: '',
    filters: {
      estado: '',
      capacidad: '',
      ubicacion: '',
    },
    sortBy: 'numero',
    sortOrder: 'asc',
    viewMode: variant === 'grid' ? 'grid' : variant === 'list' ? 'list' : 'cards',
  });

  const [selectedMesas, setSelectedMesas] = useState<Mesa[]>([]);

  // Aplicar filtros y búsqueda
  const filteredMesas = useMemo(() => {
    let filtered = [...mesas];

    // Filtro por búsqueda
    if (viewState.searchTerm) {
      const searchLower = viewState.searchTerm.toLowerCase();
      filtered = filtered.filter(mesa =>
        mesa.numero.toString().includes(searchLower) ||
        mesa.ubicacion.toLowerCase().includes(searchLower)
      );
    }

    // Filtros básicos
    if (viewState.filters.estado) {
      filtered = filtered.filter(mesa => mesa.estado === viewState.filters.estado);
    }

    if (viewState.filters.capacidad) {
      filtered = filtered.filter(mesa => mesa.capacidad === viewState.filters.capacidad);
    }

    if (viewState.filters.ubicacion) {
      filtered = filtered.filter(mesa => mesa.ubicacion === viewState.filters.ubicacion);
    }

    // Filtros opcionales
    if (filterOptions?.minCapacity) {
      filtered = filtered.filter(mesa => mesa.capacidad >= filterOptions.minCapacity!);
    }

    if (filterOptions?.maxCapacity) {
      filtered = filtered.filter(mesa => mesa.capacidad <= filterOptions.maxCapacity!);
    }

    if (filterOptions?.allowedStates) {
      filtered = filtered.filter(mesa => filterOptions.allowedStates!.includes(mesa.estado));
    }

    if (filterOptions?.allowedLocations) {
      filtered = filtered.filter(mesa => filterOptions.allowedLocations!.includes(mesa.ubicacion));
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (viewState.sortBy) {
        case 'numero':
          comparison = a.numero - b.numero;
          break;
        case 'capacidad':
          comparison = a.capacidad - b.capacidad;
          break;
        case 'estado':
          comparison = a.estado.localeCompare(b.estado);
          break;
        case 'ubicacion':
          comparison = a.ubicacion.localeCompare(b.ubicacion);
          break;
      }

      return viewState.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [mesas, viewState, filterOptions]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = mesas.length;
    const libre = mesas.filter(m => m.estado === 'LIBRE').length;
    const ocupada = mesas.filter(m => m.estado === 'OCUPADA').length;
    const reservada = mesas.filter(m => m.estado === 'RESERVADA').length;
    
    const capacidades = mesas.reduce((acc, mesa) => acc + mesa.capacidad, 0);
    const capacidadPromedio = total > 0 ? Math.round(capacidades / total) : 0;
    
    const ubicaciones = Array.from(new Set(mesas.map(m => m.ubicacion)));
    
    return {
      total,
      libre,
      ocupada,
      reservada,
      capacidadTotal: capacidades,
      capacidadPromedio,
      ubicacionesTotal: ubicaciones.length,
      filtradas: filteredMesas.length,
      availabilityRate: total > 0 ? Math.round((libre / total) * 100) : 0,
    };
  }, [mesas, filteredMesas.length]);

  // Opciones únicas para filtros
  const filterOptions_unique = useMemo(() => {
    const capacidades = Array.from(new Set(mesas.map(m => m.capacidad))).sort((a, b) => a - b);
    const ubicaciones = Array.from(new Set(mesas.map(m => m.ubicacion))).sort();
    const estados: Mesa['estado'][] = ['LIBRE', 'OCUPADA', 'RESERVADA'];

    return { capacidades, ubicaciones, estados };
  }, [mesas]);

  const updateViewState = useCallback((updates: Partial<ViewState>) => {
    setViewState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleMesaClick = useCallback((mesa: Mesa) => {
    if (!allowSelection) return;

    if (allowMultiSelection) {
      setSelectedMesas(prev => {
        const isSelected = prev.some(m => m.id === mesa.id);
        if (isSelected) {
          return prev.filter(m => m.id !== mesa.id);
        } else {
          return [...prev, mesa];
        }
      });
    }

    onMesaSelect?.(mesa);
  }, [allowSelection, allowMultiSelection, onMesaSelect]);

  const clearSelection = () => {
    setSelectedMesas([]);
  };

  const selectAll = () => {
    if (allowMultiSelection) {
      setSelectedMesas(filteredMesas);
    }
  };

  const renderStats = () => {
    if (!showStats) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.libre}</div>
          <div className="text-sm text-gray-500">Libres</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.ocupada}</div>
          <div className="text-sm text-gray-500">Ocupadas</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.reservada}</div>
          <div className="text-sm text-gray-500">Reservadas</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.capacidadTotal}</div>
          <div className="text-sm text-gray-500">Capacidad Total</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.availabilityRate}%</div>
          <div className="text-sm text-gray-500">Disponibilidad</div>
        </div>
      </div>
    );
  };

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Búsqueda */}
          {showSearch && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar mesas..."
                  value={viewState.searchTerm}
                  onChange={(e) => updateViewState({ searchTerm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            <select
              value={viewState.filters.estado}
              onChange={(e) => updateViewState({
                filters: { ...viewState.filters, estado: e.target.value as Mesa['estado'] | '' }
              })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {filterOptions_unique.estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>

            <select
              value={viewState.filters.capacidad}
              onChange={(e) => updateViewState({
                filters: { ...viewState.filters, capacidad: e.target.value ? Number(e.target.value) : '' }
              })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las capacidades</option>
              {filterOptions_unique.capacidades.map(cap => (
                <option key={cap} value={cap}>{cap} personas</option>
              ))}
            </select>

            <select
              value={viewState.filters.ubicacion}
              onChange={(e) => updateViewState({
                filters: { ...viewState.filters, ubicacion: e.target.value }
              })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las ubicaciones</option>
              {filterOptions_unique.ubicaciones.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Ordenamiento */}
            <select
              value={`${viewState.sortBy}-${viewState.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [ViewState['sortBy'], ViewState['sortOrder']];
                updateViewState({ sortBy, sortOrder });
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="numero-asc">Número ↑</option>
              <option value="numero-desc">Número ↓</option>
              <option value="capacidad-asc">Capacidad ↑</option>
              <option value="capacidad-desc">Capacidad ↓</option>
              <option value="estado-asc">Estado ↑</option>
              <option value="estado-desc">Estado ↓</option>
              <option value="ubicacion-asc">Ubicación ↑</option>
              <option value="ubicacion-desc">Ubicación ↓</option>
            </select>
          </div>
        </div>

        {/* Información de resultados y acciones */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Mostrando {filteredMesas.length} de {stats.total} mesas
            {allowMultiSelection && selectedMesas.length > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                ({selectedMesas.length} seleccionadas)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Selección múltiple */}
            {allowMultiSelection && (
              <>
                <button
                  onClick={selectAll}
                  disabled={filteredMesas.length === 0}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                >
                  Seleccionar todas
                </button>
                <button
                  onClick={clearSelection}
                  disabled={selectedMesas.length === 0}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Limpiar selección
                </button>
              </>
            )}

            {/* Cambio de vista */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => updateViewState({ viewMode: 'grid' })}
                className={cn(
                  'px-3 py-1 text-sm',
                  viewState.viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                🔲 Grid
              </button>
              <button
                onClick={() => updateViewState({ viewMode: 'list' })}
                className={cn(
                  'px-3 py-1 text-sm',
                  viewState.viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                📋 Lista
              </button>
              <button
                onClick={() => updateViewState({ viewMode: 'cards' })}
                className={cn(
                  'px-3 py-1 text-sm',
                  viewState.viewMode === 'cards'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                🃏 Cards
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Cargando mesas...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar mesas</h3>
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    if (filteredMesas.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl text-gray-300 mb-4">🪑</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {mesas.length === 0 ? 'No hay mesas registradas' : 'No se encontraron mesas'}
          </h3>
          <p className="text-gray-500">
            {mesas.length === 0
              ? 'Aún no se han registrado mesas en el sistema'
              : 'Intenta ajustar los filtros de búsqueda'
            }
          </p>
        </div>
      );
    }

    // Renderizado según variante específica
    if (variant === 'availability') {
      return <MesaAvailability mesas={filteredMesas} />;
    }

    if (variant === 'selector') {
      return (
        <MesaSelector
          mesas={filteredMesas}
          selectedMesa={selectedMesa}
          onMesaSelect={(mesa) => onMesaSelect?.(mesa!)} // Handle the null case
          multiSelect={allowMultiSelection}
          selectedMesas={selectedMesas}
          onMultiSelect={setSelectedMesas}
          allowedStates={filterOptions?.allowedStates}
          allowedLocations={filterOptions?.allowedLocations}
          minCapacity={filterOptions?.minCapacity}
          maxCapacity={filterOptions?.maxCapacity}
          showFilters={false} // Ya tenemos filtros en el container
          showSearch={false} // Ya tenemos búsqueda en el container
        />
      );
    }

    // Renderizado según modo de vista
    switch (viewState.viewMode) {
      case 'list':
        return (
          <div className="space-y-3">
            {filteredMesas.map(mesa => {
              const isSelected = allowMultiSelection 
                ? selectedMesas.some(m => m.id === mesa.id)
                : selectedMesa?.id === mesa.id;

              return (
                <div
                  key={mesa.id}
                  onClick={() => handleMesaClick(mesa)}
                  className={cn(
                    'flex items-center justify-between p-4 bg-white border rounded-lg transition-all',
                    allowSelection && 'cursor-pointer hover:shadow-md',
                    isSelected && 'border-blue-500 bg-blue-50'
                  )}
                >
                  <div className="flex items-center space-x-4">
                    {allowMultiSelection && (
                      <div className={cn(
                        'w-5 h-5 border-2 rounded',
                        isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      )}>
                        {isSelected && (
                          <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
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
                    {enableActions && (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMesaUpdate?.(mesa);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMesaDelete?.(mesa.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMesas.map(mesa => (
              <MesaCard
                key={mesa.id}
                mesa={mesa}
                onSelect={allowSelection ? () => handleMesaClick(mesa) : undefined}
                isSelected={allowMultiSelection 
                  ? selectedMesas.some(m => m.id === mesa.id)
                  : selectedMesa?.id === mesa.id
                }
              />
            ))}
          </div>
        );

      default: // grid
        return (
          <MesaGrid
            mesas={filteredMesas}
            onMesaSelect={allowSelection ? handleMesaClick : undefined}
            selectedMesaId={selectedMesa?.id || null}
          />
        );
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {renderStats()}
      {renderFilters()}
      {renderContent()}
    </div>
  );
};

export default MesaContainer;
