import React from 'react';
import { cn } from '../../utils/cn';

export interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

const MenuSearch: React.FC<MenuSearchProps> = ({
  value,
  onChange,
  placeholder = "Buscar en el menú...",
  className,
  onClear,
}) => {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={cn("relative w-full max-w-md mx-auto", className)}>
      <div className="relative">
        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input de búsqueda */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "placeholder-gray-400 text-gray-900",
            "transition-colors duration-200",
            "bg-white shadow-sm"
          )}
        />

        {/* Botón de limpiar */}
        {value && (
          <button
            onClick={handleClear}
            className={cn(
              "absolute inset-y-0 right-0 pr-3 flex items-center",
              "text-gray-400 hover:text-gray-600",
              "transition-colors duration-200"
            )}
            aria-label="Limpiar búsqueda"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Indicador de resultados */}
      {value && (
        <div className="mt-2 text-sm text-gray-500 text-center">
          Buscando "{value}"...
        </div>
      )}
    </div>
  );
};

export default MenuSearch;
