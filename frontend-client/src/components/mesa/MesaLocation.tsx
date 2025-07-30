import React from 'react';
import { Mesa } from '../../types';
import { cn } from '../../utils/cn';

export interface MesaLocationProps {
  ubicacion: string;
  className?: string;
  variant?: 'text' | 'badge' | 'icon' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const MesaLocation: React.FC<MesaLocationProps> = ({
  ubicacion,
  className,
  variant = 'text',
  size = 'md',
  showIcon = true,
}) => {
  const getLocationConfig = (location: string) => {
    const normalizedLocation = location.toLowerCase();
    
    const configs: Record<string, {
      icon: string;
      color: string;
      bgColor: string;
      description: string;
    }> = {
      'terraza': {
        icon: '🌿',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        description: 'Área al aire libre con vista panorámica',
      },
      'interior': {
        icon: '🏠',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        description: 'Ambiente interior climatizado',
      },
      'ventana': {
        icon: '🪟',
        color: 'text-cyan-700',
        bgColor: 'bg-cyan-100',
        description: 'Mesa junto a ventana con vista exterior',
      },
      'barra': {
        icon: '🍸',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        description: 'Zona de barra para cenas informales',
      },
      'privado': {
        icon: '🔒',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        description: 'Área reservada para mayor privacidad',
      },
      'jardin': {
        icon: '🌺',
        color: 'text-pink-700',
        bgColor: 'bg-pink-100',
        description: 'Ambiente en el jardín rodeado de naturaleza',
      },
      'esquina': {
        icon: '📐',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        description: 'Mesa en esquina para mayor intimidad',
      },
      'centro': {
        icon: '🎯',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        description: 'Mesa central con ambiente animado',
      },
    };

    // Buscar coincidencia en las claves
    const matchedKey = Object.keys(configs).find(key => 
      normalizedLocation.includes(key)
    );

    return matchedKey ? configs[matchedKey] : {
      icon: '📍',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      description: 'Ubicación en el restaurante',
    };
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          text: 'text-sm',
          icon: 'text-sm',
          padding: 'px-2 py-1',
        };
      case 'lg':
        return {
          text: 'text-lg',
          icon: 'text-lg',
          padding: 'px-4 py-2',
        };
      default:
        return {
          text: 'text-base',
          icon: 'text-base',
          padding: 'px-3 py-1',
        };
    }
  };

  const config = getLocationConfig(ubicacion);
  const sizeClasses = getSizeClasses();

  const renderText = () => (
    <div className={cn('flex items-center space-x-2', className)}>
      {showIcon && (
        <span className={cn(sizeClasses.icon)}>{config.icon}</span>
      )}
      <span className={cn('font-medium', config.color, sizeClasses.text)}>
        {ubicacion}
      </span>
    </div>
  );

  const renderBadge = () => (
    <span
      className={cn(
        'inline-flex items-center space-x-1 font-medium rounded-full border',
        config.bgColor,
        config.color,
        'border-current border-opacity-20',
        sizeClasses.padding,
        sizeClasses.text,
        className
      )}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{ubicacion}</span>
    </span>
  );

  const renderIcon = () => (
    <span
      className={cn(sizeClasses.icon, className)}
      title={`${ubicacion} - ${config.description}`}
    >
      {config.icon}
    </span>
  );

  const renderDetailed = () => (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center space-x-2">
        <span className="text-lg">{config.icon}</span>
        <div>
          <h4 className={cn('font-semibold', config.color, sizeClasses.text)}>
            {ubicacion}
          </h4>
          <p className="text-sm text-gray-600">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );

  switch (variant) {
    case 'badge':
      return renderBadge();
    case 'icon':
      return renderIcon();
    case 'detailed':
      return renderDetailed();
    default:
      return renderText();
  }
};

// Componente para mostrar mapa de ubicaciones
export const MesaLocationMap: React.FC<{
  mesas: Mesa[];
  selectedMesa?: Mesa;
  onMesaSelect?: (mesa: Mesa) => void;
  className?: string;
}> = ({ mesas, selectedMesa, onMesaSelect, className }) => {
  const locationGroups = mesas.reduce((groups, mesa) => {
    const location = mesa.ubicacion;
    if (!groups[location]) {
      groups[location] = [];
    }
    groups[location].push(mesa);
    return groups;
  }, {} as Record<string, Mesa[]>);

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-gray-900">Mapa del Restaurante</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(locationGroups).map(([location, mesasInLocation]) => (
          <div
            key={location}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <MesaLocation
              ubicacion={location}
              variant="detailed"
            />
            
            <div className="grid grid-cols-3 gap-2">
              {mesasInLocation.map((mesa) => (
                <button
                  key={mesa.id}
                  onClick={() => onMesaSelect?.(mesa)}
                  className={cn(
                    'p-2 border rounded text-sm font-medium transition-all',
                    'hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    selectedMesa?.id === mesa.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : mesa.estado === 'LIBRE'
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : mesa.estado === 'OCUPADA'
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-yellow-300 bg-yellow-50 text-yellow-700'
                  )}
                >
                  Mesa {mesa.numero}
                </button>
              ))}
            </div>
            
            <div className="text-xs text-gray-500">
              {mesasInLocation.length} {mesasInLocation.length === 1 ? 'mesa' : 'mesas'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para filtro por ubicación
export const MesaLocationFilter: React.FC<{
  mesas: Mesa[];
  selectedLocation?: string;
  onLocationChange: (location: string) => void;
  className?: string;
}> = ({ mesas, selectedLocation, onLocationChange, className }) => {
  const locations = Array.from(new Set(mesas.map(mesa => mesa.ubicacion)));
  const locationCounts = locations.reduce((counts, location) => {
    counts[location] = mesas.filter(mesa => mesa.ubicacion === location).length;
    return counts;
  }, {} as Record<string, number>);

  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700">
        Filtrar por ubicación
      </label>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onLocationChange('')}
          className={cn(
            'px-3 py-2 rounded-lg text-sm font-medium transition-all',
            'border focus:outline-none focus:ring-2 focus:ring-blue-500',
            !selectedLocation
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          )}
        >
          Todas las ubicaciones
          <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
            {mesas.length}
          </span>
        </button>
        
        {locations.map((location) => (
          <button
            key={location}
            onClick={() => onLocationChange(location)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-all',
              'border focus:outline-none focus:ring-2 focus:ring-blue-500',
              selectedLocation === location
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            )}
          >
            <MesaLocation
              ubicacion={location}
              variant="icon"
              size="sm"
              className="mr-2"
            />
            {location}
            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {locationCounts[location]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MesaLocation;
