import React from "react";
import { Category } from "../../types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  showAll?: boolean;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  showAll = true,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showAll && (
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === null
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todas las categorías
        </button>
      )}

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(String(category.id))}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            selectedCategory === String(category.id)
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {category.icono && <span className="text-lg">{category.icono}</span>}
          <span>{category.nombre}</span>
          <span className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded-full">
            {category.cantidad_items}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
