import React from 'react';
import { Mesa } from '../../types';
import Badge from '../ui/Badge';
import { cn } from '../../utils/cn';

interface MesaCardProps {
  mesa: Mesa;
  isSelected?: boolean;
  onSelect?: (mesa: Mesa) => void;
  className?: string;
}

const MesaCard: React.FC<MesaCardProps> = ({
  mesa,
  isSelected = false,
  onSelect,
  className,
}) => {
  const getEstadoConfig = (estado: Mesa['estado']) => {
    const configs = {
      LIBRE: {
        color: 'bg-green-100 border-green-300 text-green-800',
        badge: 'success',
        icon: '✅',
        clickable: true,
      },
      OCUPADA: {
        color: 'bg-red-100 border-red-300 text-red-800',
        badge: 'danger',
        icon: '🔴',
        clickable: false,
      },
      RESERVADA: {
        color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
        badge: 'warning',
        icon: '⏳',
        clickable: false,
      },
    } as const;

    return configs[estado];
  };

  const estadoConfig = getEstadoConfig(mesa.estado);
  const isClickable = estadoConfig.clickable && onSelect;

  const handleClick = () => {
    if (isClickable) {
      onSelect!(mesa);
    }
  };

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border-2 transition-all duration-200',
        estadoConfig.color,
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        isClickable && 'cursor-pointer hover:shadow-md hover:scale-105',
        !isClickable && 'cursor-not-allowed opacity-60',
        className
      )}
      onClick={handleClick}
    >
      {/* Número de mesa */}
      <div className="text-center">
        <div className="text-2xl font-bold mb-1">
          {mesa.numero}
        </div>
        <div className="text-xs font-medium text-gray-600">
          Mesa
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-2 text-center">
        <div className="text-xs text-gray-600 mb-1">
          {mesa.ubicacion}
        </div>
        
        <Badge 
          variant={estadoConfig.badge as any}
          size="sm"
          className="text-xs"
        >
          {estadoConfig.icon} {mesa.estado}
        </Badge>
      </div>

      {/* Indicador de capacidad */}
      {mesa.capacidad && (
        <div className="absolute top-1 right-1 text-xs text-gray-500">
          👥 {mesa.capacidad}
        </div>
      )}

      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          ✓
        </div>
      )}
    </div>
  );
};

export default MesaCard;