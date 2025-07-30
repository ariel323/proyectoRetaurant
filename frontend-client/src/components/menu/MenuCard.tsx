import React, { useState } from "react";
import { MenuItem } from "../../types";
import { useCart } from "../../contexts/CartContext";
import Button from "../ui/Button";
import PriceTag from "../ui/PriceTag";
import QuantitySelector from "../ui/QuantitySelector";
import ImageWithFallback from "../common/ImageWithFallback";
import Badge from "../ui/Badge";
import Rating from "../ui/Rating";
import { cn } from "../../utils/cn";

interface MenuCardProps {
  item: MenuItem;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  className,
  variant = "default",
}) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notas, setNotas] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addItem(item, quantity, notas.trim() || undefined);
      setQuantity(1);
      setNotas("");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isCompact = variant === "compact";
  const isDetailed = variant === "detailed";

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200",
        "group hover:scale-105",
        className
      )}
    >
      {/* Imagen */}
      <div
        className={cn("relative overflow-hidden", isCompact ? "h-32" : "h-48")}
      >
        <ImageWithFallback
          src={item.imagen}
          alt={item.nombre}
          fallback="🍽️"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {item.vegetariano && (
            <Badge variant="success" size="sm">
              🌱 Vegetariano
            </Badge>
          )}
          {item.picante && (
            <Badge variant="danger" size="sm">
              🌶️ Picante
            </Badge>
          )}
          {!item.disponible && (
            <Badge variant="secondary" size="sm">
              No disponible
            </Badge>
          )}
        </div>

        {/* Rating */}
        {item.rating && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-md px-2 py-1">
            <Rating value={item.rating} size="sm" interactive={false} />
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Título y categoría */}
        <div>
          <h3
            className={cn(
              "font-semibold text-gray-900 group-hover:text-blue-600 transition-colors",
              isCompact ? "text-sm" : "text-lg"
            )}
          >
            {item.nombre}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{item.categoria}</p>
        </div>

        {/* Descripción */}
        {item.descripcion && !isCompact && (
          <p
            className={cn(
              "text-gray-600",
              isDetailed ? "text-sm" : "text-sm line-clamp-2"
            )}
          >
            {item.descripcion}
          </p>
        )}

        {/* Info adicional en modo detallado */}
        {isDetailed && (
          <div className="space-y-2 text-xs text-gray-500">
            {item.tiempo_preparacion && (
              <p>⏱️ Tiempo de preparación: {item.tiempo_preparacion} min</p>
            )}
            {item.calorias && <p>🔥 Calorías: {item.calorias}</p>}
            {item.ingredientes && item.ingredientes.length > 0 && (
              <p>🥘 Ingredientes: {item.ingredientes.join(", ")}</p>
            )}
          </div>
        )}

        {/* Precio */}
        <div className="flex items-center justify-between">
          <PriceTag
            price={item.precio}
            size={isCompact ? "sm" : "md"}
            variant="highlighted"
          />

          {!isCompact && item.tiempo_preparacion && (
            <div className="text-xs text-gray-500 flex items-center">
              ⏱️ {item.tiempo_preparacion} min
            </div>
          )}
        </div>

        {/* Controles */}
        {item.disponible && !isCompact && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            {/* Selector de cantidad */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Cantidad:
              </span>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={10}
                size="sm"
              />
            </div>

            {/* Notas especiales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas especiales:
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej: Sin cebolla, término medio..."
                rows={2}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                maxLength={100}
              />
            </div>

            {/* Botón agregar al carrito */}
            <Button
              onClick={handleAddToCart}
              disabled={!item.disponible}
              isLoading={isAddingToCart}
              variant="primary"
              size="md"
              fullWidth
              leftIcon="🛒"
            >
              Agregar al carrito
            </Button>
          </div>
        )}

        {/* Botón compacto para agregar */}
        {item.disponible && isCompact && (
          <Button
            onClick={handleAddToCart}
            disabled={!item.disponible}
            isLoading={isAddingToCart}
            variant="primary"
            size="sm"
            fullWidth
          >
            +
          </Button>
        )}

        {/* Botón ver detalles */}
        {!isDetailed && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showDetails ? "Ocultar detalles" : "Ver detalles"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
