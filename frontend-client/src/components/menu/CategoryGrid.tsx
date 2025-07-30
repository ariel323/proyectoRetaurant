import React from "react";
import { Category } from "../../types";
import { cn } from "../../utils/cn";

export interface CategoryGridProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
  className?: string;
  columns?: number;
  showDescription?: boolean;
  showItemCount?: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategorySelect,
  className,
  columns = 4,
  showDescription = true,
  showItemCount = true,
}) => {
  const getGridColumns = () => {
    switch (columns) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";
      case 6:
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid gap-6", getGridColumns())}>
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategorySelect(String(category.id))}
            className={cn(
              "group cursor-pointer",
              "bg-white rounded-xl shadow-md overflow-hidden",
              "hover:shadow-xl transition-all duration-300",
              "border border-gray-100",
              "transform hover:-translate-y-2",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCategorySelect(String(category.id));
              }
            }}
          >
            {/* Imagen o icono */}
            <div className="relative h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              {category.imagen ? (
                <img
                  src={category.imagen}
                  alt={category.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-4xl text-blue-600">
                          ${category.icono || "🍽️"}
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="text-4xl text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  {category.icono || "🍽️"}
                </div>
              )}

              {/* Overlay hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
            </div>

            {/* Contenido */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.nombre}
                </h3>

                {showItemCount && category.cantidad_items > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {category.cantidad_items}
                  </span>
                )}
              </div>

              {showDescription && category.descripcion && (
                <p className="text-gray-600 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors">
                  {category.descripcion}
                </p>
              )}

              {/* Indicador de acción */}
              <div className="mt-3 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Ver productos</span>
                <svg
                  className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay categorías disponibles
          </h3>
          <p className="text-gray-500">
            Las categorías aparecerán aquí cuando estén disponibles
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
