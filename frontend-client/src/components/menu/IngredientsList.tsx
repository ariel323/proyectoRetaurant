import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface IngredientsListProps {
  ingredients: string[];
  className?: string;
  variant?: 'default' | 'compact' | 'tags' | 'grouped';
  maxVisible?: number;
  showToggle?: boolean;
  searchable?: boolean;
  highlightAllergens?: boolean;
  allergens?: string[];
}

const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  className,
  variant = 'default',
  maxVisible = 5,
  showToggle = true,
  searchable = false,
  highlightAllergens = false,
  allergens = ['gluten', 'lactosa', 'nueces', 'mariscos', 'huevos', 'soja'],
}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar ingredientes por búsqueda
  const filteredIngredients = searchable && searchTerm
    ? ingredients.filter(ingredient => 
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : ingredients;

  // Ingredientes a mostrar
  const visibleIngredients = showAll || !showToggle 
    ? filteredIngredients 
    : filteredIngredients.slice(0, maxVisible);

  const hasMore = filteredIngredients.length > maxVisible;

  // Verificar si un ingrediente es alérgeno
  const isAllergen = (ingredient: string) => {
    if (!highlightAllergens) return false;
    return allergens.some(allergen => 
      ingredient.toLowerCase().includes(allergen.toLowerCase())
    );
  };

  const renderDefaultVariant = () => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</h4>
      <ul className="space-y-1">
        {visibleIngredients.map((ingredient, index) => (
          <li 
            key={index}
            className={cn(
              "text-sm flex items-center space-x-2",
              isAllergen(ingredient) ? "text-red-600 font-medium" : "text-gray-600"
            )}
          >
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
            <span>{ingredient}</span>
            {isAllergen(ingredient) && (
              <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">
                ⚠️
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderCompactVariant = () => (
    <div className="space-y-1">
      <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
        Ingredientes:
      </span>
      <p className="text-sm text-gray-600 leading-relaxed">
        {visibleIngredients.map((ingredient, index) => (
          <span key={index}>
            <span className={cn(
              isAllergen(ingredient) && "text-red-600 font-medium"
            )}>
              {ingredient}
            </span>
            {index < visibleIngredients.length - 1 && ', '}
          </span>
        ))}
        {hasMore && !showAll && (
          <span className="text-gray-400">
            ... y {filteredIngredients.length - maxVisible} más
          </span>
        )}
      </p>
    </div>
  );

  const renderTagsVariant = () => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Ingredientes:</h4>
      <div className="flex flex-wrap gap-2">
        {visibleIngredients.map((ingredient, index) => (
          <span
            key={index}
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              isAllergen(ingredient) 
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-gray-100 text-gray-700 border border-gray-200"
            )}
          >
            {ingredient}
            {isAllergen(ingredient) && (
              <span className="ml-1">⚠️</span>
            )}
          </span>
        ))}
        {hasMore && !showAll && (
          <span className="inline-flex items-center px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded-full border border-gray-200">
            +{filteredIngredients.length - maxVisible} más
          </span>
        )}
      </div>
    </div>
  );

  const renderGroupedVariant = () => {
    const groupedIngredients = {
      main: [] as string[],
      allergens: [] as string[],
      others: [] as string[]
    };

    filteredIngredients.forEach(ingredient => {
      if (isAllergen(ingredient)) {
        groupedIngredients.allergens.push(ingredient);
      } else if (['carne', 'pollo', 'pescado', 'cerdo', 'res'].some(main => 
        ingredient.toLowerCase().includes(main)
      )) {
        groupedIngredients.main.push(ingredient);
      } else {
        groupedIngredients.others.push(ingredient);
      }
    });

    return (
      <div className="space-y-3">
        {groupedIngredients.main.length > 0 && (
          <div>
            <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              🥩 Principales
            </h5>
            <div className="flex flex-wrap gap-1">
              {groupedIngredients.main.map((ingredient, index) => (
                <span key={index} className="text-sm text-gray-600 bg-blue-50 px-2 py-0.5 rounded">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {groupedIngredients.allergens.length > 0 && (
          <div>
            <h5 className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
              ⚠️ Alérgenos
            </h5>
            <div className="flex flex-wrap gap-1">
              {groupedIngredients.allergens.map((ingredient, index) => (
                <span key={index} className="text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {groupedIngredients.others.length > 0 && (
          <div>
            <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              🌿 Otros
            </h5>
            <div className="flex flex-wrap gap-1">
              {groupedIngredients.others.map((ingredient, index) => (
                <span key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVariant = () => {
    switch (variant) {
      case 'compact':
        return renderCompactVariant();
      case 'tags':
        return renderTagsVariant();
      case 'grouped':
        return renderGroupedVariant();
      default:
        return renderDefaultVariant();
    }
  };

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className={cn("text-sm text-gray-500 italic", className)}>
        No se especifican ingredientes
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Búsqueda */}
      {searchable && ingredients.length > 5 && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Buscar ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Lista de ingredientes */}
      {renderVariant()}

      {/* Botón mostrar más/menos */}
      {showToggle && hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none"
        >
          {showAll 
            ? 'Mostrar menos' 
            : `Mostrar ${filteredIngredients.length - maxVisible} ingredientes más`
          }
        </button>
      )}

      {/* Información sobre alérgenos */}
      {highlightAllergens && (
        <div className="mt-3 text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
          <span className="font-medium">⚠️ Atención:</span> Los ingredientes marcados pueden contener alérgenos.
          Consulta con el personal si tienes alguna alergia alimentaria.
        </div>
      )}
    </div>
  );
};

export default IngredientsList;
