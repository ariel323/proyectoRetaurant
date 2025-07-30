import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { MenuItem } from '../../types';
import { MenuService } from '../../services/menuService';

interface FeaturedMenuProps {
  /**
   * Título de la sección
   */
  title?: string;
  
  /**
   * Subtítulo de la sección
   */
  subtitle?: string;
  
  /**
   * Número máximo de items a mostrar
   */
  maxItems?: number;
  
  /**
   * Categorías a incluir
   */
  categories?: string[];
  
  /**
   * Mostrar solo items destacados
   */
  featuredOnly?: boolean;
  
  /**
   * Mostrar botón para ver menú completo
   */
  showViewAllButton?: boolean;
  
  /**
   * Layout de la grid
   */
  layout?: 'grid' | 'carousel';
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

/**
 * Componente para mostrar un item del menú
 */
const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagen del plato */}
      <div className="relative h-48 bg-gray-200">
        {!imageError ? (
          <img
            src={item.imagen || '/assets/images/default-dish.jpg'}
            alt={item.nombre}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        
        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {item.categoria}
          </span>
        </div>

        {/* Indicadores especiales */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {item.vegetariano && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              🌱 Veggie
            </span>
          )}
          {item.picante && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              🌶️ Picante
            </span>
          )}
        </div>

        {/* Estado de disponibilidad */}
        {!item.disponible && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">No Disponible</span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        {/* Nombre y rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {item.nombre}
          </h3>
          {item.rating && (
            <div className="flex items-center">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm text-gray-600 ml-1">
                {item.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Descripción */}
        {item.descripcion && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.descripcion}
          </p>
        )}

        {/* Información adicional */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {item.tiempo_preparacion && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {item.tiempo_preparacion} min
              </span>
            )}
            {item.calorias && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
                {item.calorias} cal
              </span>
            )}
          </div>
        </div>

        {/* Precio y botón de agregar */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">
            ${item.precio.toFixed(2)}
          </span>
          
          <button
            onClick={() => onAddToCart?.(item)}
            disabled={!item.disponible}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
              item.disponible
                ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-300'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {item.disponible ? 'Agregar' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente FeaturedMenu - Muestra los platos destacados del menú
 */
export const FeaturedMenu: React.FC<FeaturedMenuProps> = ({
  title = "Nuestros Platos Destacados",
  subtitle = "Descubre los favoritos de nuestros clientes",
  maxItems = 6,
  categories,
  featuredOnly = false,
  showViewAllButton = true,
  layout = 'grid',
  className,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        setLoading(true);
        const menuService = MenuService.getInstance();
        const allItems = await menuService.getMenuItems();
        
        // Filtrar items según criterios
        let filteredItems = allItems;
        
        if (categories && categories.length > 0) {
          filteredItems = filteredItems.filter(item => 
            categories.includes(item.categoria)
          );
        }
        
        if (featuredOnly) {
          // Filtrar por rating alto o items destacados
          filteredItems = filteredItems.filter(item => 
            (item.rating && item.rating >= 4.5) || item.disponible
          );
        }
        
        // Ordenar por rating y tomar los primeros maxItems
        filteredItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        filteredItems = filteredItems.slice(0, maxItems);
        
        setMenuItems(filteredItems);
      } catch (error) {
        console.error('Error loading featured menu:', error);
        setError('No se pudieron cargar los platos destacados');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedItems();
  }, [maxItems, categories, featuredOnly]);

  const handleAddToCart = (item: MenuItem) => {
    // Aquí se integraría con el contexto del carrito
    console.log('Adding to cart:', item);
    // CartContext.addItem(item);
  };

  if (loading) {
    return (
      <section className={cn('py-16 bg-gray-50', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
                    <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn('py-16 bg-gray-50', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error al cargar el menú
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('py-16 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Grid de items del menú */}
        {menuItems.length > 0 ? (
          <>
            <div className={cn(
              layout === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex overflow-x-auto space-x-6 pb-4'
            )}>
              {menuItems.map((item) => (
                <div 
                  key={item.id} 
                  className={layout === 'carousel' ? 'flex-shrink-0 w-80' : ''}
                >
                  <MenuItemCard 
                    item={item} 
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>

            {/* Botón para ver menú completo */}
            {showViewAllButton && (
              <div className="text-center mt-12">
                <Link
                  to="/menu"
                  className={cn(
                    'inline-flex items-center px-8 py-3 text-lg font-semibold rounded-lg',
                    'bg-orange-500 text-white hover:bg-orange-600',
                    'transform hover:scale-105 transition-all duration-200',
                    'shadow-lg hover:shadow-xl',
                    'focus:outline-none focus:ring-4 focus:ring-orange-300'
                  )}
                >
                  <span>Ver Menú Completo</span>
                  <svg 
                    className="ml-2 w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay platos disponibles
            </h3>
            <p className="text-gray-600">
              En este momento no tenemos platos destacados para mostrar.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMenu;