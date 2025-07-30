import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { useCart } from '../../contexts/CartContext';
import PriceDisplay from './PriceDisplay';
import IngredientsList from './IngredientsList';
import NutritionalInfo from './NutritionalInfo';
import { cn } from '../../utils/cn';

export interface MenuItemDetailsProps {
  item: MenuItem;
  className?: string;
  showAddToCart?: boolean;
  showFullDescription?: boolean;
  variant?: 'full' | 'modal' | 'sidebar';
  onClose?: () => void;
}

const MenuItemDetails: React.FC<MenuItemDetailsProps> = ({
  item,
  className,
  showAddToCart = true,
  showFullDescription = true,
  variant = 'full',
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'ingredients' | 'nutrition'>('info');
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item, quantity, notes);
    setQuantity(1);
    setNotes('');
    onClose?.();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const nutritionalData = {
    calorias: item.calorias,
    proteinas: 0, // Estos valores vendrían del backend
    carbohidratos: 0,
    grasas: 0,
  };

  const renderHeader = () => (
    <div className="relative">
      {/* Imagen */}
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <img
          src={item.imagen || '/assets/images/default-dish.jpg'}
          alt={item.nombre}
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/assets/images/default-dish.jpg';
          }}
        />
        
        {/* Badges superpuestos */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {item.vegetariano && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              🌱 Vegetariano
            </span>
          )}
          {item.picante && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              🌶️ Picante
            </span>
          )}
          {!item.disponible && (
            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ❌ No disponible
            </span>
          )}
        </div>

        {/* Rating */}
        {item.rating && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
            ⭐ {item.rating.toFixed(1)}
          </div>
        )}

        {/* Botón cerrar para modal */}
        {variant === 'modal' && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-700 p-2 rounded-full hover:bg-opacity-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Información básica */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {item.nombre}
          </h1>
          <p className="text-lg text-gray-600 uppercase tracking-wide">
            {item.categoria}
          </p>
        </div>

        <PriceDisplay 
          price={item.precio} 
          size="xl" 
          variant="success"
          className="mb-4" 
        />
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'info', label: 'Información', icon: 'ℹ️' },
          { id: 'ingredients', label: 'Ingredientes', icon: '🥬' },
          { id: 'nutrition', label: 'Nutrición', icon: '📊' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <span className="flex items-center space-x-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </nav>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ingredients':
        return item.ingredientes && item.ingredientes.length > 0 ? (
          <IngredientsList 
            ingredients={item.ingredientes}
            variant="tags"
            highlightAllergens
          />
        ) : (
          <p className="text-gray-500 italic">No se especifican ingredientes</p>
        );
        
      case 'nutrition':
        return (
          <NutritionalInfo 
            data={nutritionalData}
            variant="detailed"
            showPercentages
          />
        );
        
      default:
        return (
          <div className="space-y-4">
            {showFullDescription && item.descripcion && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{item.descripcion}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {item.tiempo_preparacion && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⏱️</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.tiempo_preparacion} min</p>
                    <p className="text-gray-500">Preparación</p>
                  </div>
                </div>
              )}

              {item.calorias && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🔥</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.calorias} cal</p>
                    <p className="text-gray-500">Calorías</p>
                  </div>
                </div>
              )}

              {item.vegetariano && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🌱</span>
                  <div>
                    <p className="font-medium text-gray-900">Vegetariano</p>
                    <p className="text-gray-500">Opción saludable</p>
                  </div>
                </div>
              )}

              {item.picante && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🌶️</span>
                  <div>
                    <p className="font-medium text-gray-900">Picante</p>
                    <p className="text-gray-500">Nivel medio</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const renderOrderSection = () => (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Realizar pedido</h3>
      
      {/* Selector de cantidad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cantidad
        </label>
        <div className="flex items-center space-x-4">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
          <button
            onClick={incrementQuantity}
            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Notas especiales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas especiales (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Sin cebolla, término medio, extra salsa..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>

      {/* Total y botón */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Total</p>
          <PriceDisplay 
            price={item.precio * quantity}
            size="lg"
            variant="success"
          />
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!item.disponible}
          className={cn(
            "px-6 py-3 rounded-lg font-medium text-white transition-all",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            item.disponible
              ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          )}
        >
          {item.disponible ? 'Agregar al carrito' : 'No disponible'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "w-full",
      variant === 'modal' && "max-h-screen overflow-y-auto",
      className
    )}>
      <div className="space-y-6">
        {renderHeader()}
        {renderTabs()}
        {renderTabContent()}
        {showAddToCart && renderOrderSection()}
      </div>
    </div>
  );
};

export default MenuItemDetails;
