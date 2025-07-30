import React from 'react';
import { Mesa } from '../../types';
import { cn } from '../../utils/cn';

export interface MesaCapacityProps {
  capacidad: number;
  className?: string;
  variant?: 'icon' | 'text' | 'visual' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  maxCapacity?: number;
}

const MesaCapacity: React.FC<MesaCapacityProps> = ({
  capacidad,
  className,
  variant = 'icon',
  size = 'md',
  showLabel = true,
  maxCapacity = 8,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          text: 'text-sm',
          icon: 'text-sm',
          spacing: 'space-x-1',
        };
      case 'lg':
        return {
          text: 'text-lg',
          icon: 'text-lg',
          spacing: 'space-x-3',
        };
      default:
        return {
          text: 'text-base',
          icon: 'text-base',
          spacing: 'space-x-2',
        };
    }
  };

  const getCapacityLevel = () => {
    if (capacidad <= 2) return { level: 'small', color: 'blue', label: 'Íntima' };
    if (capacidad <= 4) return { level: 'medium', color: 'green', label: 'Familiar' };
    if (capacidad <= 6) return { level: 'large', color: 'orange', label: 'Grupal' };
    return { level: 'xlarge', color: 'purple', label: 'Gran grupo' };
  };

  const sizeClasses = getSizeClasses();
  const capacityLevel = getCapacityLevel();

  const renderIcon = () => (
    <div className={cn('flex items-center', sizeClasses.spacing, className)}>
      <span className={cn('text-gray-600', sizeClasses.icon)}>👥</span>
      <span className={cn('font-medium text-gray-900', sizeClasses.text)}>
        {capacidad}
        {showLabel && (
          <span className="text-gray-500 ml-1">
            {capacidad === 1 ? 'persona' : 'personas'}
          </span>
        )}
      </span>
    </div>
  );

  const renderText = () => (
    <span className={cn('text-gray-700', sizeClasses.text, className)}>
      Capacidad: {capacidad} {capacidad === 1 ? 'persona' : 'personas'}
    </span>
  );

  const renderVisual = () => (
    <div className={cn('flex items-center', sizeClasses.spacing, className)}>
      <div className="flex items-center space-x-1">
        {Array.from({ length: Math.min(capacidad, 8) }, (_, i) => (
          <div
            key={i}
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium',
              `bg-${capacityLevel.color}-500`
            )}
          >
            👤
          </div>
        ))}
        {capacidad > 8 && (
          <span className="text-gray-500 text-sm ml-1">
            +{capacidad - 8}
          </span>
        )}
      </div>
      {showLabel && (
        <span className={cn('text-gray-600', sizeClasses.text)}>
          {capacityLevel.label}
        </span>
      )}
    </div>
  );

  const renderDetailed = () => (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Capacidad</span>
        <span className={cn('font-bold', `text-${capacityLevel.color}-600`)}>
          {capacidad} {capacidad === 1 ? 'persona' : 'personas'}
        </span>
      </div>
      
      {/* Barra visual */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            `bg-${capacityLevel.color}-500`
          )}
          style={{ width: `${Math.min((capacidad / maxCapacity) * 100, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{capacityLevel.label}</span>
        <span>{capacidad}/{maxCapacity}</span>
      </div>
    </div>
  );

  switch (variant) {
    case 'text':
      return renderText();
    case 'visual':
      return renderVisual();
    case 'detailed':
      return renderDetailed();
    default:
      return renderIcon();
  }
};

// Componente para selector de capacidad
export const MesaCapacitySelector: React.FC<{
  selectedCapacity?: number;
  onCapacityChange: (capacity: number) => void;
  maxCapacity?: number;
  className?: string;
}> = ({ selectedCapacity, onCapacityChange, maxCapacity = 8, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700">
        Número de personas
      </label>
      
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: maxCapacity }, (_, i) => {
          const capacity = i + 1;
          return (
            <button
              key={capacity}
              onClick={() => onCapacityChange(capacity)}
              className={cn(
                'p-3 border rounded-lg text-sm font-medium transition-all',
                'hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
                selectedCapacity === capacity
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">👥</span>
                <span>{capacity}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedCapacity && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <MesaCapacity
            capacidad={selectedCapacity}
            variant="detailed"
            maxCapacity={maxCapacity}
          />
        </div>
      )}
    </div>
  );
};

// Componente para filtro por capacidad
export const MesaCapacityFilter: React.FC<{
  mesas: Mesa[];
  selectedRange?: [number, number];
  onRangeChange: (range: [number, number]) => void;
  className?: string;
}> = ({ mesas, selectedRange, onRangeChange, className }) => {
  const capacities = mesas.map(mesa => mesa.capacidad);
  const minCapacity = Math.min(...capacities);
  const maxCapacity = Math.max(...capacities);

  const ranges = [
    { label: 'Todas', range: [minCapacity, maxCapacity] as [number, number] },
    { label: '1-2 personas', range: [1, 2] as [number, number] },
    { label: '3-4 personas', range: [3, 4] as [number, number] },
    { label: '5-6 personas', range: [5, 6] as [number, number] },
    { label: '7+ personas', range: [7, maxCapacity] as [number, number] },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700">
        Filtrar por capacidad
      </label>
      
      <div className="flex flex-wrap gap-2">
        {ranges.map((rangeOption) => {
          const isSelected = selectedRange && 
            selectedRange[0] === rangeOption.range[0] && 
            selectedRange[1] === rangeOption.range[1];
          
          const count = mesas.filter(mesa => 
            mesa.capacidad >= rangeOption.range[0] && 
            mesa.capacidad <= rangeOption.range[1]
          ).length;

          return (
            <button
              key={rangeOption.label}
              onClick={() => onRangeChange(rangeOption.range)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                'border focus:outline-none focus:ring-2 focus:ring-blue-500',
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
            >
              <span>{rangeOption.label}</span>
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MesaCapacity;
