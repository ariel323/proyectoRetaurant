import React from 'react';
import { Mesa } from '../../types';
import MesaCard from './MesaCard';
import EmptyState from '../common/EmptyState';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { cn } from '../../utils/cn';

interface MesaGridProps {
  mesas: Mesa[];
  isLoading?: boolean;
  error?: string | null;
  onMesaSelect?: (mesa: Mesa) => void;
  selectedMesaId?: number | null;
  showOnlyAvailable?: boolean;
  className?: string;
}

const MesaGrid: React.FC<MesaGridProps> = ({
  mesas,
  isLoading = false,
  error = null,
  onMesaSelect,
  selectedMesaId,
  showOnlyAvailable = false,
  className,
}) => {
  const filteredMesas = showOnlyAvailable 
    ? mesas.filter(mesa => mesa.estado === 'LIBRE')
    : mesas;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error al cargar las mesas: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4', className)}>
        {Array.from({ length: 12 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-24" />
        ))}
      </div>
    );
  }

  if (filteredMesas.length === 0) {
    return (
      <EmptyState
        icon="🪑"
        title={showOnlyAvailable ? "No hay mesas disponibles" : "No hay mesas"}
        description={
          showOnlyAvailable 
            ? "Todas las mesas están ocupadas en este momento."
            : "No se encontraron mesas en el sistema."
        }
      />
    );
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4', className)}>
      {filteredMesas.map((mesa) => (
        <MesaCard
          key={mesa.id}
          mesa={mesa}
          isSelected={selectedMesaId === mesa.id}
          onSelect={onMesaSelect}
        />
      ))}
    </div>
  );
};

export default MesaGrid;