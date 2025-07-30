import React from 'react';
import { Mesa } from '../../types';
import { cn } from '../../utils/cn';

export interface MesaStatusProps {
  estado: Mesa['estado'];
  className?: string;
  variant?: 'badge' | 'indicator' | 'text' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showIcon?: boolean;
}

const MesaStatus: React.FC<MesaStatusProps> = ({
  estado,
  className,
  variant = 'badge',
  size = 'md',
  showText = true,
  showIcon = true,
}) => {
  const getStatusConfig = () => {
    const configs = {
      LIBRE: {
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-300',
        icon: '✅',
        text: 'Disponible',
        description: 'Mesa libre para ocupar',
      },
      OCUPADA: {
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-300',
        icon: '🔴',
        text: 'Ocupada',
        description: 'Mesa ocupada por clientes',
      },
      RESERVADA: {
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-300',
        icon: '⏰',
        text: 'Reservada',
        description: 'Mesa reservada para cliente',
      },
    };
    return configs[estado];
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const config = getStatusConfig();

  const renderBadge = () => (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        getSizeClasses(),
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {showText && config.text}
    </span>
  );

  const renderIndicator = () => (
    <div className={cn('flex items-center space-x-2', className)}>
      <div
        className={cn(
          'w-3 h-3 rounded-full',
          estado === 'LIBRE' && 'bg-green-500',
          estado === 'OCUPADA' && 'bg-red-500',
          estado === 'RESERVADA' && 'bg-yellow-500'
        )}
      />
      {showText && (
        <span className={cn('text-sm font-medium', config.textColor)}>
          {config.text}
        </span>
      )}
    </div>
  );

  const renderText = () => (
    <span className={cn('font-medium', config.textColor, className)}>
      {showIcon && `${config.icon} `}
      {showText && config.text}
    </span>
  );

  const renderIcon = () => (
    <span
      className={cn('text-lg', className)}
      title={config.description}
    >
      {config.icon}
    </span>
  );

  switch (variant) {
    case 'indicator':
      return renderIndicator();
    case 'text':
      return renderText();
    case 'icon':
      return renderIcon();
    default:
      return renderBadge();
  }
};

// Componente para mostrar estadísticas de mesas
export const MesaStatusStats: React.FC<{
  mesas: Mesa[];
  className?: string;
}> = ({ mesas, className }) => {
  const stats = {
    LIBRE: mesas.filter(m => m.estado === 'LIBRE').length,
    OCUPADA: mesas.filter(m => m.estado === 'OCUPADA').length,
    RESERVADA: mesas.filter(m => m.estado === 'RESERVADA').length,
  };

  const total = mesas.length;

  return (
    <div className={cn('grid grid-cols-3 gap-4', className)}>
      {Object.entries(stats).map(([estado, count]) => (
        <div key={estado} className="text-center">
          <MesaStatus
            estado={estado as Mesa['estado']}
            variant="indicator"
            className="justify-center mb-1"
          />
          <div className="text-lg font-bold text-gray-900">{count}</div>
          <div className="text-xs text-gray-500">
            {total > 0 ? Math.round((count / total) * 100) : 0}%
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente para filtro por estado
export const MesaStatusFilter: React.FC<{
  selectedEstado?: Mesa['estado'] | 'ALL';
  onEstadoChange: (estado: Mesa['estado'] | 'ALL') => void;
  counts?: Record<Mesa['estado'], number>;
  className?: string;
}> = ({ selectedEstado = 'ALL', onEstadoChange, counts, className }) => {
  const estados: Array<Mesa['estado'] | 'ALL'> = ['ALL', 'LIBRE', 'OCUPADA', 'RESERVADA'];

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {estados.map((estado) => (
        <button
          key={estado}
          onClick={() => onEstadoChange(estado)}
          className={cn(
            'px-3 py-2 rounded-lg text-sm font-medium transition-all',
            'border focus:outline-none focus:ring-2 focus:ring-blue-500',
            selectedEstado === estado
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          )}
        >
          <div className="flex items-center space-x-2">
            {estado !== 'ALL' && (
              <MesaStatus
                estado={estado}
                variant="icon"
                showText={false}
              />
            )}
            <span>
              {estado === 'ALL' ? 'Todas' : estado === 'LIBRE' ? 'Disponibles' : 
               estado === 'OCUPADA' ? 'Ocupadas' : 'Reservadas'}
            </span>
            {counts && estado !== 'ALL' && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {counts[estado] || 0}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default MesaStatus;
