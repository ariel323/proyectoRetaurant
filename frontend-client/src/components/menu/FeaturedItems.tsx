import React from 'react';
import { MenuItem } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { cn } from '../../utils/cn';

export interface FeaturedItemsProps {
  items: MenuItem[];
  className?: string;
  title?: string;
  subtitle?: string;
}

const FeaturedItems: React.FC<FeaturedItemsProps> = ({
  items,
  className,
  title = "Recomendaciones del Chef",
  subtitle = "Los platos más populares y mejor valorados de nuestra carta"
}) => {
  const { addItem } = useCart();

  if (items.length === 0) {
    return null;
  }

  const handleAddToCart = (item: MenuItem) => {
    addItem(item, 1);
  };

  return (
    <section className={cn("w-full", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "bg-white rounded-xl shadow-lg overflow-hidden",
              "hover:shadow-xl transition-all duration-300",
              "border border-gray-100",
              "transform hover:-translate-y-1"
            )}
          >
            {/* Imagen */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={item.imagen || '/assets/images/default-dish.jpg'}
                alt={item.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/images/default-dish.jpg';
                }}
              />
              
              {/* Badge destacado */}
              <div className="absolute top-3 left-3">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ⭐ Destacado
                </span>
              </div>

              {/* Rating */}
              {item.rating && (
                <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                  ⭐ {item.rating.toFixed(1)}
                </div>
              )}

              {/* Badges nutricionales */}
              <div className="absolute bottom-3 left-3 flex space-x-1">
                {item.vegetariano && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    🌱
                  </span>
                )}
                {item.picante && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    🌶️
                  </span>
                )}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {item.nombre}
                </h3>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {item.categoria}
                </p>
              </div>

              {item.descripcion && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.descripcion}
                </p>
              )}

              {/* Información adicional */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                {item.tiempo_preparacion && (
                  <span className="flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>{item.tiempo_preparacion} min</span>
                  </span>
                )}
                {item.calorias && (
                  <span className="flex items-center space-x-1">
                    <span>🔥</span>
                    <span>{item.calorias} cal</span>
                  </span>
                )}
              </div>

              {/* Precio y botón */}
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">
                  ${item.precio.toLocaleString()}
                </div>
                
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.disponible}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    item.disponible
                      ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                >
                  {item.disponible ? 'Agregar' : 'No disponible'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ver más */}
      <div className="text-center mt-8">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
          Ver todo el menú
        </button>
      </div>
    </section>
  );
};

export default FeaturedItems;
