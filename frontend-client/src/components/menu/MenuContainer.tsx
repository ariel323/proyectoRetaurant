import React, { useState, useEffect } from 'react';
import { MenuItem, Category } from '../../types';
import { MenuService } from '../../services/menuService';
import MenuGrid from './MenuGrid';
import MenuFilters from './MenuFilters';
import MenuSearch from './MenuSearch';
import CategoryTabs from './CategoryTabs';
import FeaturedItems from './FeaturedItems';
import { LoadingSpinner, ErrorMessage } from '../common';
import { cn } from '../../utils/cn';

export interface MenuContainerProps {
  className?: string;
  showFeatured?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  showCategories?: boolean;
  initialCategory?: string;
  maxItems?: number;
}

export interface FilterState {
  categoria: string;
  priceRange: [number, number];
  vegetariano: boolean;
  picante: boolean;
  disponible: boolean;
  search: string;
}

const MenuContainer: React.FC<MenuContainerProps> = ({
  className,
  showFeatured = true,
  showFilters = true,
  showSearch = true,
  showCategories = true,
  initialCategory = '',
  maxItems,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    categoria: initialCategory,
    priceRange: [0, 1000],
    vegetariano: false,
    picante: false,
    disponible: true,
    search: '',
  });

  const menuService = MenuService.getInstance();

  const loadMenuData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [items, cats] = await Promise.all([
        menuService.getMenuItems(),
        menuService.getCategories(),
      ]);
      
      setMenuItems(items);
      setCategories(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredItems = menuItems.filter(item => {
    // Filtro por categoría
    if (filters.categoria && item.categoria !== filters.categoria) {
      return false;
    }

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (
        !item.nombre.toLowerCase().includes(searchTerm) &&
        !item.descripcion?.toLowerCase().includes(searchTerm) &&
        !item.ingredientes?.some(ing => ing.toLowerCase().includes(searchTerm))
      ) {
        return false;
      }
    }

    // Filtro por precio
    if (item.precio < filters.priceRange[0] || item.precio > filters.priceRange[1]) {
      return false;
    }

    // Filtro por vegetariano
    if (filters.vegetariano && !item.vegetariano) {
      return false;
    }

    // Filtro por picante
    if (filters.picante && !item.picante) {
      return false;
    }

    // Filtro por disponibilidad
    if (filters.disponible && !item.disponible) {
      return false;
    }

    return true;
  });

  // Aplicar límite si se especifica
  const displayItems = maxItems ? filteredItems.slice(0, maxItems) : filteredItems;

  // Obtener items destacados (mejor rating)
  const featuredItems = menuItems
    .filter(item => item.disponible && (item.rating || 0) >= 4.5)
    .slice(0, 6);

  if (loading) {
    return (
      <div className={cn("flex justify-center items-center py-12", className)}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("py-8", className)}>
        <ErrorMessage 
          message={error}
          onRetry={loadMenuData}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Items Destacados */}
      {showFeatured && featuredItems.length > 0 && (
        <div className="mb-8">
          <FeaturedItems items={featuredItems} />
        </div>
      )}

      {/* Barra de búsqueda */}
      {showSearch && (
        <div className="mb-6">
          <MenuSearch
            value={filters.search}
            onChange={(search: string) => handleFilterChange({ search })}
            placeholder="Buscar en el menú..."
          />
        </div>
      )}

      {/* Pestañas de categorías */}
      {showCategories && categories.length > 0 && (
        <div className="mb-6">
          <CategoryTabs
            categories={categories}
            activeCategory={filters.categoria}
            onCategoryChange={(categoria: string) => handleFilterChange({ categoria })}
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filtros laterales */}
        {showFilters && (
          <div className="lg:w-80 flex-shrink-0">
            <MenuFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
              categories={categories}
              priceRange={[
                Math.min(...menuItems.map(item => item.precio)),
                Math.max(...menuItems.map(item => item.precio))
              ]}
            />
          </div>
        )}

        {/* Grid de productos */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {displayItems.length} {displayItems.length === 1 ? 'producto' : 'productos'}
              {filters.search && ` para "${filters.search}"`}
            </p>
            
            {maxItems && filteredItems.length > maxItems && (
              <p className="text-sm text-gray-500">
                Mostrando {maxItems} de {filteredItems.length}
              </p>
            )}
          </div>

          <MenuGrid items={displayItems} />

          {displayItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 mb-4">
                Prueba ajustando los filtros o términos de búsqueda
              </p>
              <button
                onClick={() => setFilters({
                  categoria: '',
                  priceRange: [0, 1000],
                  vegetariano: false,
                  picante: false,
                  disponible: true,
                  search: '',
                })}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuContainer;
