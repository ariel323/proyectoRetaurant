import React from 'react';
import { Category } from '../../types';
import { cn } from '../../utils/cn';

export interface FilterState {
  categoria: string;
  priceRange: [number, number];
  vegetariano: boolean;
  picante: boolean;
  disponible: boolean;
  search: string;
}

export interface MenuFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  categories: Category[];
  priceRange: [number, number];
  className?: string;
}

const MenuFilters: React.FC<MenuFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  priceRange,
  className,
}) => {
  const handlePriceRangeChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = numValue;
    onFiltersChange({ priceRange: newRange });
  };

  const resetFilters = () => {
    onFiltersChange({
      categoria: '',
      priceRange: [priceRange[0], priceRange[1]],
      vegetariano: false,
      picante: false,
      disponible: true,
      search: '',
    });
  };

  const activeFiltersCount = [
    filters.categoria !== '',
    filters.vegetariano,
    filters.picante,
    !filters.disponible,
    filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1],
  ].filter(Boolean).length;

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Limpiar ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={filters.categoria}
            onChange={(e) => onFiltersChange({ categoria: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icono && `${category.icono} `}{category.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de precios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango de precios
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Mín"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Máx"
              />
            </div>
            <div className="text-xs text-gray-500">
              ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>

        {/* Opciones dietéticas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Opciones dietéticas
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="vegetariano"
                checked={filters.vegetariano}
                onChange={(e) => onFiltersChange({ vegetariano: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="vegetariano" className="flex items-center space-x-2 text-sm text-gray-700">
                <span>🌱</span>
                <span>Vegetariano</span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="picante"
                checked={filters.picante}
                onChange={(e) => onFiltersChange({ picante: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="picante" className="flex items-center space-x-2 text-sm text-gray-700">
                <span>🌶️</span>
                <span>Picante</span>
              </label>
            </div>
          </div>
        </div>

        {/* Disponibilidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Disponibilidad
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="disponible"
              checked={filters.disponible}
              onChange={(e) => onFiltersChange({ disponible: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="disponible" className="flex items-center space-x-2 text-sm text-gray-700">
              <span>✅</span>
              <span>Solo disponibles</span>
            </label>
          </div>
        </div>

        {/* Información adicional */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 Usa los filtros para encontrar exactamente lo que buscas</p>
            <p>🔄 Los resultados se actualizan automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFilters;
