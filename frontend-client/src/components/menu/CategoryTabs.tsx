import React from "react";
import { Category } from "../../types";
import { cn } from "../../utils/cn";

export interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoria: string) => void;
  className?: string;
  showAllOption?: boolean;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  className,
  showAllOption = true,
}) => {
  const allCategories = showAllOption
    ? [
        {
          id: "",
          nombre: "Todos",
          descripcion: "Ver todos los productos",
          cantidad_items: 0,
          activa: true,
          icono: "🍽️",
          imagen: "/assets/images/categories/todos.jpg",
        },
        ...categories,
      ]
    : categories;

  return (
    <div className={cn("w-full", className)}>
      {/* Tabs para desktop */}
      <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(String(category.id))}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              activeCategory === String(category.id)
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center justify-center space-x-2">
              {category.icono && (
                <span className="text-lg">{category.icono}</span>
              )}
              <span>{category.nombre}</span>
              {category.cantidad_items > 0 && (
                <span
                  className={cn(
                    "ml-2 px-2 py-0.5 text-xs rounded-full",
                    activeCategory === category.id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {category.cantidad_items}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tabs horizontales para móvil */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 p-1 min-w-max">
          {allCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(String(category.id))}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap",
                "text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                activeCategory === String(category.id)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {category.icono && (
                <span className="text-base">{category.icono}</span>
              )}
              <span>{category.nombre}</span>
              {category.cantidad_items > 0 && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full",
                    activeCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {category.cantidad_items}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Descripción de la categoría activa */}
      {activeCategory && (
        <div className="mt-4 text-center">
          {(() => {
            const currentCategory = allCategories.find(
              (cat) => cat.id === activeCategory
            );
            if (currentCategory?.descripcion) {
              return (
                <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                  {currentCategory.descripcion}
                </p>
              );
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;
