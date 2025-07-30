import React, { useMemo } from "react";
import { MenuItem, Category } from "../../types";
import MenuCard from "./MenuCard";
// If CategoryFilter.tsx exists in the same folder, keep this line.
// Otherwise, update the import path to the correct location, for example:
import CategoryFilter from "../menu/CategoryFilter";
// Or, if it should be in 'common':
// import CategoryFilter from "../common/CategoryFilter";
import SearchBox from "../common/SearchBox";
import EmptyState from "../common/EmptyState";
import LoadingSkeleton from "../common/LoadingSkeleton";
import { cn } from "../../utils/cn";

interface MenuGridProps {
  items: MenuItem[];
  isLoading?: boolean;
  error?: string | null;
  searchTerm?: string;
  selectedCategory?: string;
  onSearchChange?: (search: string) => void;
  onCategoryChange?: (category: string | null) => void;
  className?: string;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  isLoading = false,
  error = null,
  searchTerm = "",
  selectedCategory = "",
  onSearchChange,
  onCategoryChange,
  className,
}) => {
  // Extraer categorías únicas
  const categories: Category[] = useMemo(() => {
    const categoryMap = new Map<string, number>();

    items.forEach((item) => {
      if (item.disponible) {
        categoryMap.set(
          item.categoria,
          (categoryMap.get(item.categoria) || 0) + 1
        );
      }
    });

    return Array.from(categoryMap.entries()).map(([nombre, cantidad]) => ({
      id: nombre.toLowerCase(),
      nombre,
      cantidad_items: cantidad,
      activa: true,
      descripcion: `${cantidad} productos disponibles`,
      icono: "🍽️",
      imagen: "/assets/images/categories/default.jpg",
    }));
  }, [items]);

  // Filtrar items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!item.disponible) return false;

      const matchesSearch =
        !searchTerm ||
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory ||
        item.categoria.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error al cargar el menú: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda */}
          {onSearchChange && (
            <div className="flex-1">
              <SearchBox
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Buscar platos, ingredientes..."
                className="w-full"
              />
            </div>
          )}

          {/* Filtro de categorías */}
          {onCategoryChange && categories.length > 0 && (
            <div className="lg:w-80">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-64" />
          ))}
        </div>
      )}

      {/* Menu Items */}
      {!isLoading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 && (
        <EmptyState
          icon="🍽️"
          title="No se encontraron platos"
          description={
            searchTerm || selectedCategory
              ? "Intenta cambiar los filtros para ver más opciones."
              : "Aún no hay platos disponibles en el menú."
          }
          action={
            (searchTerm || selectedCategory) &&
            onSearchChange &&
            onCategoryChange ? (
              <button
                onClick={() => {
                  onSearchChange("");
                  onCategoryChange("");
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  );
};

export default MenuGrid;
