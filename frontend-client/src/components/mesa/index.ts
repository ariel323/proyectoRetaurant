import { Mesa } from '../../types';

export { default as MesaCard } from './MesaCard';
export { default as MesaGrid } from './MesaGrid';
export { default as MesaStatus } from './MesaStatus';
export { default as MesaCapacity } from './MesaCapacity';
export { default as MesaLocation } from './MesaLocation';
export { default as MesaInfo } from './MesaInfo';
export { default as MesaAvailability, useMesaAvailability } from './MesaAvailability';
export { default as MesaSelector } from './MesaSelector';
export { default as MesaContainer } from './MesaContainer';

// Component Props Types (these would need to be exported from individual components)
// For now, we'll skip the specific prop exports until the components export them

// Mesa-related types and utilities

export type MesaEstado = Mesa['estado'];
export type MesaWithSelection = Mesa & { 
  isSelected?: boolean; 
  isAvailable?: boolean; 
};

// Mesa utility functions
export const mesaUtils = {
  /**
   * Verifica si una mesa está disponible
   */
  isAvailable: (mesa: Mesa): boolean => {
    return mesa.estado === 'LIBRE';
  },

  /**
   * Verifica si una mesa está ocupada
   */
  isOccupied: (mesa: Mesa): boolean => {
    return mesa.estado === 'OCUPADA';
  },

  /**
   * Verifica si una mesa está reservada
   */
  isReserved: (mesa: Mesa): boolean => {
    return mesa.estado === 'RESERVADA';
  },

  /**
   * Obtiene el estado de una mesa en español
   */
  getEstadoLabel: (estado: Mesa['estado']): string => {
    const labels = {
      LIBRE: 'Libre',
      OCUPADA: 'Ocupada',
      RESERVADA: 'Reservada',
    };
    return labels[estado];
  },

  /**
   * Obtiene la configuración de color para un estado
   */
  getEstadoColor: (estado: Mesa['estado']): { bg: string; text: string; border: string } => {
    const colors = {
      LIBRE: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      OCUPADA: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      RESERVADA: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    };
    return colors[estado];
  },

  /**
   * Filtra mesas por estado
   */
  filterByEstado: (mesas: Mesa[], estado: Mesa['estado']): Mesa[] => {
    return mesas.filter(mesa => mesa.estado === estado);
  },

  /**
   * Filtra mesas por capacidad mínima
   */
  filterByMinCapacity: (mesas: Mesa[], minCapacity: number): Mesa[] => {
    return mesas.filter(mesa => mesa.capacidad >= minCapacity);
  },

  /**
   * Filtra mesas por capacidad máxima
   */
  filterByMaxCapacity: (mesas: Mesa[], maxCapacity: number): Mesa[] => {
    return mesas.filter(mesa => mesa.capacidad <= maxCapacity);
  },

  /**
   * Filtra mesas por ubicación
   */
  filterByLocation: (mesas: Mesa[], ubicacion: string): Mesa[] => {
    return mesas.filter(mesa => mesa.ubicacion === ubicacion);
  },

  /**
   * Obtiene mesas disponibles con capacidad suficiente
   */
  getAvailableWithCapacity: (mesas: Mesa[], requiredCapacity: number): Mesa[] => {
    return mesas.filter(mesa => 
      mesa.estado === 'LIBRE' && mesa.capacidad >= requiredCapacity
    );
  },

  /**
   * Obtiene estadísticas de las mesas
   */
  getStats: (mesas: Mesa[]) => {
    const total = mesas.length;
    const libre = mesas.filter(m => m.estado === 'LIBRE').length;
    const ocupada = mesas.filter(m => m.estado === 'OCUPADA').length;
    const reservada = mesas.filter(m => m.estado === 'RESERVADA').length;
    
    const capacidadTotal = mesas.reduce((acc, mesa) => acc + mesa.capacidad, 0);
    const capacidadPromedio = total > 0 ? Math.round(capacidadTotal / total) : 0;
    
    const ubicaciones = Array.from(new Set(mesas.map(m => m.ubicacion)));
    
    return {
      total,
      libre,
      ocupada,
      reservada,
      capacidadTotal,
      capacidadPromedio,
      ubicacionesTotal: ubicaciones.length,
      availabilityRate: total > 0 ? Math.round((libre / total) * 100) : 0,
      occupancyRate: total > 0 ? Math.round((ocupada / total) * 100) : 0,
      reservationRate: total > 0 ? Math.round((reservada / total) * 100) : 0,
    };
  },

  /**
   * Ordena mesas por diferentes criterios
   */
  sortBy: (mesas: Mesa[], criteria: 'numero' | 'capacidad' | 'estado' | 'ubicacion', order: 'asc' | 'desc' = 'asc'): Mesa[] => {
    const sorted = [...mesas].sort((a, b) => {
      let comparison = 0;

      switch (criteria) {
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

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  },

  /**
   * Busca mesas por término de búsqueda
   */
  search: (mesas: Mesa[], searchTerm: string): Mesa[] => {
    if (!searchTerm.trim()) return mesas;
    
    const term = searchTerm.toLowerCase();
    return mesas.filter(mesa =>
      mesa.numero.toString().includes(term) ||
      mesa.ubicacion.toLowerCase().includes(term) ||
      mesa.estado.toLowerCase().includes(term)
    );
  },

  /**
   * Obtiene ubicaciones únicas
   */
  getUniqueLocations: (mesas: Mesa[]): string[] => {
    return Array.from(new Set(mesas.map(m => m.ubicacion))).sort();
  },

  /**
   * Obtiene capacidades únicas
   */
  getUniqueCapacities: (mesas: Mesa[]): number[] => {
    return Array.from(new Set(mesas.map(m => m.capacidad))).sort((a, b) => a - b);
  },

  /**
   * Encuentra la mesa más cercana disponible
   */
  findNearestAvailable: (mesas: Mesa[], targetCapacity: number, preferredLocation?: string): Mesa | null => {
    let availableMesas = mesas.filter(mesa => 
      mesa.estado === 'LIBRE' && mesa.capacidad >= targetCapacity
    );

    if (availableMesas.length === 0) return null;

    // Priorizar ubicación preferida
    if (preferredLocation) {
      const sameLocation = availableMesas.filter(mesa => mesa.ubicacion === preferredLocation);
      if (sameLocation.length > 0) {
        availableMesas = sameLocation;
      }
    }

    // Encontrar la mesa con capacidad más cercana al objetivo
    return availableMesas.reduce((closest, current) => {
      const closestDiff = Math.abs(closest.capacidad - targetCapacity);
      const currentDiff = Math.abs(current.capacidad - targetCapacity);
      return currentDiff < closestDiff ? current : closest;
    });
  },

  /**
   * Valida si se puede hacer una reserva
   */
  canReserve: (mesa: Mesa): boolean => {
    return mesa.estado === 'LIBRE';
  },

  /**
   * Calcula tiempo estimado de espera (mock)
   */
  getEstimatedWaitTime: (mesas: Mesa[]): number => {
    const ocupadas = mesas.filter(m => m.estado === 'OCUPADA');
    // Tiempo estimado basado en cantidad de mesas ocupadas (mock)
    return ocupadas.length * 15; // 15 minutos por mesa ocupada
  }
};

// Mesa Constants
export const MESA_CONSTANTS = {
  ESTADOS: ['LIBRE', 'OCUPADA', 'RESERVADA'] as const,
  CAPACIDAD_MINIMA: 1,
  CAPACIDAD_MAXIMA: 12,
  UBICACIONES_COMUNES: [
    'Terraza',
    'Interior',
    'Ventana',
    'Barra',
    'Privado',
    'Jardín',
    'Balcón',
    'Salón Principal'
  ],
  COLORES: {
    LIBRE: 'green',
    OCUPADA: 'red',
    RESERVADA: 'yellow'
  }
} as const;

// Mesa Hooks are already exported above
